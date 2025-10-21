import fs from "fs";
import models from "../models/index.js";
import { extractDataFromFile } from "../services/extractService.js";
import { extractDataWithGemini } from "../services/geminiService.js";

// ==========================================================================
// FUNÇÕES AUXILIARES
// ==========================================================================

/**
 * Substitui placeholders como {tag_name} em uma string de template com os valores extraídos.
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

// ==========================================================================
// CONTROLLERS EXPORTADOS
// ==========================================================================

/**
 * ROTA: POST /api/documents/upload
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
    const ownerId = req.user?.id; // O ID do usuário vem do authMiddleware

    if (!folderId) {
      return res
        .status(400)
        .json({ error: "A pasta de destino é obrigatória." });
    }

    // --- 2. Buscar Usuário e Chave API ---
    const user = await models.User.findByPk(ownerId, {
      attributes: ["apiKey"],
    });
    const userApiKey = user?.apiKey || null; // Pega a chave do usuário, se existir

    // --- 3. Processar IDs das Tags e Buscar Tags Base ---
    const parsedTagIds = req.body.tags ? JSON.parse(req.body.tags) : [];
    const selectedTags = await models.TagBase.findAll({
      where: { id: parsedTagIds },
    });

    // --- 4. Criar o Documento no Banco de Dados ---
    const document = await models.Document.create({
      name: req.file.originalname,
      path: `uploads/${req.file.filename}`,
      size: req.file.size,
      model: model || "Desconhecido",
      templateName: templateName || null,
      ownerId: ownerId,
      folderId: folderId,
    });

    // --- 5. Extrair Dados e Processar Tags (IA e Regex) ---
    const extractedData =
      (await extractDataFromFile(req.file.path, selectedTags)) || {};
    const iaTags = selectedTags.filter((t) => t.type === "IA");
    const regexTags = selectedTags.filter((t) => t.type === "Regex");
    const allTagInstances = [];

    // Processamento de IA
    if (iaTags.length > 0) {
      try {
        const geminiResults = await extractDataWithGemini(
          iaTags,
          extractedData.text || "",
          userApiKey // Passa a chave do usuário para o serviço
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
            displayCategory: tag.displayCategory, // Salva o displayCategory
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
            displayCategory: tag.displayCategory, // Salva o displayCategory mesmo em erro
            documentId: document.id,
          })
        );
      }
    }

    // Processamento de Regex
    for (const tag of regexTags) {
      const extracted = (extractedData.tags || []).find(
        (t) => t.name === tag.name
      );
      allTagInstances.push({
        name: tag.name,
        value: extracted?.value || null,
        type: "Regex",
        icon: tag.icon,
        displayCategory: tag.displayCategory, // Salva o displayCategory
        documentId: document.id,
      });
    }

    // --- 6. Salvar Todas as Instâncias de Tags ---
    if (allTagInstances.length > 0) {
      await models.TagInstance.bulkCreate(allTagInstances);
    }

    // --- 7. Buscar e Retornar o Documento Completo ---
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
 * ROTA: GET /api/documents
 * DESCRIÇÃO: Retorna todos os documentos com suas tags e pastas associadas.
 */
export const getAllDocuments = async (req, res) => {
  try {
    const documentos = await models.Document.findAll({
      include: [
        {
          model: models.TagInstance,
          as: "tags",
          attributes: [
            "id",
            "name",
            "value",
            "type",
            "icon",
            "displayCategory",
          ],
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
 * ROTA: DELETE /api/documents/:id
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

    // A exclusão em cascata (onDelete: 'CASCADE') no model TagInstance cuida disso,
    // mas uma chamada explícita é uma garantia extra.
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
