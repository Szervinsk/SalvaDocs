import fs from "fs/promises";
import path from "path";
import models from "../models/index.js";
import "dotenv/config";
import { extractDataFromFile } from "../services/extractService.js";
import { extractDataWithGemini } from "../services/geminiService.js";

// ==========================================================================
// FUNÇÕES AUXILIARES
// ==========================================================================

function replaceTemplateTags(templateName, tags = []) {
  if (!templateName) return null;

  return templateName.replace(/{(.*?)}/g, (_, tagName) => {
    const tag = tags.find(
      (t) =>
        t.name.toLowerCase() === tagName.toLowerCase() &&
        t.value &&
        t.value !== "Não encontrado"
    );
    return tag?.value ? tag.value : `{${tagName}}`;
  });
}

// ==========================================================================
// CONTROLLERS EXPORTADOS
// ==========================================================================

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

    // --- 2. Buscar Tags, Usuário e Extrair Dados PRIMEIRO ---
    const parsedTagIds = req.body.tags ? JSON.parse(req.body.tags) : [];
    const selectedTags = await models.TagBase.findAll({
      where: { id: parsedTagIds },
    });

    const user = await models.User.findByPk(ownerId, {
      attributes: ["apiKey"],
    });
    const userApiKey = user?.apiKey || null;

    const extractedData =
      (await extractDataFromFile(req.file.path, selectedTags)) || {};
    const iaTags = selectedTags.filter((t) => t.type === "IA");
    const regexTags = selectedTags.filter((t) => t.type === "Regex");

    const allTagInstancesData = [];
    let tagsFoundCount = 0;
    let hasError = false;

    // Processamento de IA
    if (iaTags.length > 0) {
      try {
        const geminiResults = await extractDataWithGemini(
          iaTags,
          extractedData.text || "",
          userApiKey
        );

        for (const tag of iaTags) {
          let value = geminiResults[tag.name] ?? null;
          if (value && typeof value === "object")
            value = JSON.stringify(value, null, 2);
          if (value) tagsFoundCount++; // Conta como encontrada
          allTagInstancesData.push({
            name: tag.name,
            value,
            type: "IA",
            icon: tag.icon,
            displayCategory: tag.displayCategory,
          });
        }
      } catch (err) {
        console.error("Erro no processamento Gemini:", err.message);
        hasError = true;
        iaTags.forEach((tag) =>
          allTagInstancesData.push({
            name: tag.name,
            value: "Erro na extração IA",
            type: "IA",
            icon: tag.icon,
            displayCategory: tag.displayCategory,
          })
        );
      }
    }

    // Processamento de Regex
    for (const tag of regexTags) {
      const extracted = (extractedData.tags || []).find(
        (t) => t.name === tag.name
      );
      const value = extracted?.value || null; // Valor é null se não for encontrado

      if (value) tagsFoundCount++; // Conta como encontrada

      allTagInstancesData.push({
        name: tag.name,
        value: value || "Não encontrado",
        type: "Regex",
        icon: tag.icon,
        displayCategory: tag.displayCategory,
      });
    }

    // --- 3. Resolver o Nome do Arquivo e Status ---
    const resolvedName =
      replaceTemplateTags(templateName, allTagInstancesData) ||
      req.file.originalname;

    const tagsTotal = selectedTags.length;
    let documentStatus = "Parcial";
    if (hasError) {
      documentStatus = "Erro";
    } else if (tagsTotal > 0 && tagsFoundCount === tagsTotal) {
      documentStatus = "Completo";
    }

    // --- 4. Criar o Documento no Banco ---
    const document = await models.Document.create({
      name: resolvedName,
      path: `uploads/${req.file.filename}`,
      size: req.file.size,
      model: model || "Desconhecido",
      templateName: templateName || null,
      ownerId: ownerId,
      folderId: folderId,
      status: documentStatus,
      tagsTotal: tagsTotal,
      tagsFound: tagsFoundCount,
    });

    // --- 5. Salvar as Instâncias de Tags ---
    const tagsToCreate = allTagInstancesData.map((tag) => ({
      ...tag,
      documentId: document.id,
    }));
    if (tagsToCreate.length > 0) {
      await models.TagInstance.bulkCreate(tagsToCreate);
    }

    // --- 6. Buscar e Retornar o Documento Completo ---
    const documentoCompleto = await models.Document.findByPk(document.id, {
      include: [
        { model: models.TagInstance, as: "tags" },
        { model: models.Folder, as: "folder" },
      ],
    });
    const docJson = documentoCompleto.toJSON();
    docJson.resolvedTemplate = resolvedName;

    return res.status(201).json({
      message: "Arquivo salvo e analisado com sucesso!",
      document: docJson,
    });
  } catch (err) {
    console.error("Erro geral no upload e análise:", err);
    // ✨ AJUSTE 3: Usa fs.unlink assíncrono ✨
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkErr) {
        console.error("Erro ao apagar arquivo órfão:", unlinkErr.message);
      }
    }
    return res.status(500).json({ error: "Erro ao processar o arquivo." });
  }
};

/**
 * ROTA: GET /api/documents
 */
export const getAllDocuments = async (req, res) => {
  try {
    const documentos = await models.Document.findAll({
      attributes: [
        "id",
        "name",
        "path",
        "size",
        "model",
        "templateName",
        "ownerId",
        "folderId",
        "createdAt",
        "status",
        "tagsTotal",
        "tagsFound",
      ],
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
      docJson.resolvedTemplate = docJson.name;
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
 * ROTA: GET /api/documents/download/:id
 */
export const downloadDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    const document = await models.Document.findByPk(documentId);

    if (!document) {
      return res.status(404).json({ error: "Documento não encontrado" });
    }

    const filePath = path.resolve(document.path);
    const downloadName = document.name;

    try {
      await fs.access(filePath); // Verifica se o arquivo existe
      res.download(filePath, downloadName, (err) => {
        if (err) {
          console.error("Erro ao enviar o arquivo:", err);
        }
      });
    } catch (fileErr) {
      res
        .status(404)
        .json({ error: "Arquivo físico não encontrado no servidor." });
    }
  } catch (err) {
    console.error("Erro ao processar download:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

/**
 * ROTA: DELETE /api/documents/:id
 */
export const deleteDoc = async (req, res) => {
  try {
    const documentId = req.params.id;
    const document = await models.Document.findByPk(documentId);

    if (!document) {
      return res.status(404).json({ error: "Documento não encontrado" });
    }

    if (document.path) {
      try {
        const filePath = path.resolve(document.path);
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log(`Arquivo físico ${filePath} deletado com sucesso.`);
      } catch (fileErr) {
        console.warn(
          `Aviso: Não foi possível deletar o arquivo ${document.path}. Erro: ${fileErr.message}`
        );
      }
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

// ROTA: PUT 
/**
 * ROTA: PUT /api/documents/:id/tags
 * Atualiza os valores das tags de um documento existente.
 */
export const updateDocumentTags = async (req, res) => {
  try {
    const { id } = req.params;
    const { tags } = req.body; // Espera um array de objetos: [{ id: 1, value: "Novo Valor" }, ...]

    // 1. Validações Básicas
    if (!tags || !Array.isArray(tags)) {
      return res.status(400).json({ error: "O corpo da requisição deve conter uma lista de tags." });
    }

    const document = await models.Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ error: "Documento não encontrado." });
    }

    // 2. Atualizar as Tags no Banco de Dados
    // Itera sobre as tags enviadas e atualiza apenas o valor
    const updatePromises = tags.map((tag) => {
      // Segurança: garante que estamos atualizando uma tag que pertence a este documento
      return models.TagInstance.update(
        { value: tag.value },
        { where: { id: tag.id, documentId: id } }
      );
    });

    await Promise.all(updatePromises);

    // 3. Recalcular Status e Contadores do Documento (Opcional, mas recomendado)
    // Busca todas as tags do documento atualizadas para verificar o novo status
    const allTags = await models.TagInstance.findAll({ where: { documentId: id } });
    
    const tagsTotal = allTags.length;
    // Conta tags que têm valor válido (não nulo, não vazio, não erro e não "não encontrado")
    const validTagsCount = allTags.filter((t) => {
      const val = t.value;
      return (
        val &&
        val !== "" &&
        val !== "Não encontrado" &&
        val !== "Erro na extração IA" &&
        val !== "Erro no regex"
      );
    }).length;

    let newStatus = "Parcial";
    // Se não tiver erros explícitos e todas as tags tiverem valor
    const hasError = allTags.some(t => t.value && t.value.includes("Erro"));
    
    if (hasError) {
        newStatus = "Erro";
    } else if (tagsTotal > 0 && validTagsCount === tagsTotal) {
        newStatus = "Completo";
    }

    // Atualiza o documento pai com as novas estatísticas
    await document.update({
      status: newStatus,
      tagsFound: validTagsCount,
    });

    return res.status(200).json({ 
      message: "Tags atualizadas com sucesso!",
      status: newStatus 
    });

  } catch (err) {
    console.error("Erro ao atualizar tags:", err);
    return res.status(500).json({ error: "Erro interno ao atualizar as tags." });
  }
};
