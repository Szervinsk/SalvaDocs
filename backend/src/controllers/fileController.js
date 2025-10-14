// Local: ../controllers/fileController.js

import fs from "fs";
import models from "../models/index.js";
import { extractDataFromFile } from "../services/extractService.js";
// Importa a nova função centralizada do serviço Gemini
import { extractDataWithGemini } from "../services/geminiService.js";

// ==========================================================================
// FUNÇÕES AUXILIARES
// ==========================================================================

/**
 * Substitui placeholders como {tag_name} em uma string de template com os valores extraídos.
 * @param {string} templateName - A string do template.
 * @param {Array} tags - Um array de objetos de TagInstance.
 * @returns {string|null} - A string com os valores substituídos.
 */
function replaceTemplateTags(templateName, tags = []) {
  if (!templateName) return null;

  return templateName.replace(/{(.*?)}/g, (_, tagName) => {
    const tag = tags.find(
      (t) => t.name.toLowerCase() === tagName.toLowerCase() && t.value
    );
    return tag ? tag.value : `{${tagName}}`;
  });
}

// A função generatePromptForMultipleTags foi MOVIDA para o geminiService.js

// ==========================================================================
// CONTROLLERS EXPORTADOS
// ==========================================================================

/**
 * ROTA: POST /api/files/upload
 * DESCRIÇÃO: Função principal que recebe um arquivo, associa a uma pasta,
 * cria o documento, analisa as tags (Regex e IA) e retorna o documento completo.
 */
export const uploadFileAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    // --- 1. Receber e Validar Dados do Frontend ---
    const { model, templateName, folderId } = req.body;
    const ownerId = req.user?.id || null;

    if (!folderId) {
      return res
        .status(400)
        .json({ error: "A pasta de destino é obrigatória." });
    }

    // --- 2. Processar IDs das Tags ---
    const parsedTagIds = req.body.tags ? JSON.parse(req.body.tags) : [];

    const selectedTags = await models.TagBase.findAll({
      where: { id: parsedTagIds },
    });

    // --- 3. Criar o Documento no Banco de Dados ---
    const document = await models.Document.create({
      name: req.file.originalname,
      path: req.file.path,
      model: model || "Desconhecido",
      templateName: templateName || null,
      ownerId: ownerId,
      folderId: folderId,
    });

    // --- 4. Extrair Dados e Processar Tags (IA e Regex) ---
    const extractedData =
      (await extractDataFromFile(req.file.path, selectedTags)) || {};
    const iaTags = selectedTags.filter((t) => t.type === "ia");
    const regexTags = selectedTags.filter((t) => t.type === "regex");
    const allTagInstances = [];

    // Processamento de IA - AGORA MUITO MAIS LIMPO
    if (iaTags.length > 0) {
      try {
        // Apenas uma chamada para o serviço, que lida com toda a complexidade.
        const geminiResults = await extractDataWithGemini(
          iaTags,
          extractedData.text || ""
        );

        for (const tag of iaTags) {
          let value = geminiResults[tag.name] ?? null;
          if (value && typeof value === "object")
            value = JSON.stringify(value, null, 2);

          allTagInstances.push({
            name: tag.name,
            value,
            type: "ia",
            icon: tag.icon,
            documentId: document.id,
          });
        }
      } catch (err) {
        console.error("Erro no processamento Gemini:", err.message);
        iaTags.forEach((tag) =>
          allTagInstances.push({
            name: tag.name,
            value: "Erro na extração IA",
            type: "ia",
            icon: tag.icon,
            documentId: document.id,
          })
        );
      }
    }

    // Processamento de Regex (sem alterações)
    for (const tag of regexTags) {
      const extracted = (extractedData.tags || []).find(
        (t) => t.name === tag.name
      );
      allTagInstances.push({
        name: tag.name,
        value: extracted?.value || null,
        type: "regex",
        icon: tag.icon,
        documentId: document.id,
      });
    }

    // --- 5. Salvar Todas as Instâncias de Tags ---
    if (allTagInstances.length > 0) {
      await models.TagInstance.bulkCreate(allTagInstances);
    }

    // --- 6. Buscar e Retornar o Documento Completo ---
    const documentoCompleto = await models.Document.findByPk(document.id, {
      include: [
        { model: models.TagInstance, as: "tags" },
        { model: models.Folder, as: "folder" },
      ],
    });

    const docJson = documentoCompleto.toJSON();
    docJson.resolvedTemplate = replaceTemplateTags(
      docJson.templateName,
      docJson.tags
    );

    return res.status(201).json({
      message: "Arquivo salvo e analisado com sucesso!",
      document: docJson,
    });
  } catch (err) {
    console.error("Erro geral no upload e análise:", err.message);
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ error: "Erro ao processar o arquivo." });
  }
};

/**
 * ROTA: GET /api/files
 * DESCRIÇÃO: Retorna todos os documentos com suas tags e pastas associadas.
 */
export const getAllDocuments = async (req, res) => {
  try {
    const documentos = await models.Document.findAll({
      include: [
        {
          model: models.TagInstance,
          as: "tags",
          attributes: ["id", "name", "value", "type", "icon"],
        },
        {
          model: models.Folder,
          as: "folder",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const documentosComTemplate = documentos.map((doc) => {
      const docJson = doc.toJSON();
      docJson.resolvedTemplate = replaceTemplateTags(
        docJson.templateName,
        docJson.tags
      );
      return docJson;
    });

    return res.json(documentosComTemplate);
  } catch (err) {
    console.error("Erro ao buscar documentos:", err);
    return res
      .status(500)
      .json({ error: err.message || "Erro ao buscar documentos" });
  }
};

/**
 * ROTA: DELETE /api/files/:id
 * DESCRIÇÃO: Deleta um documento, suas tags e o arquivo físico do servidor.
 */
export const deleteDoc = async (req, res) => {
  try {
    const documentId = req.params.id;
    const document = await models.Document.findByPk(documentId);

    if (!document) {
      return res.status(404).json({ error: "Documento não encontrado" });
    }

    if (document.path && fs.existsSync(document.path)) {
      fs.unlinkSync(document.path);
    }

    await models.TagInstance.destroy({ where: { documentId } });
    await document.destroy();

    return res
      .status(200)
      .json({ message: "Documento e arquivo apagados com sucesso" });
  } catch (err) {
    console.error("Erro ao apagar documento:", err);
    return res.status(500).json({ error: "Erro ao apagar documento" });
  }
};
