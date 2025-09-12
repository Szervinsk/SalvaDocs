// controllers/fileController.js
import fs from "fs";
import path from "path";
import models from "../models/index.js";
import { extractDataFromFile } from "../services/extractService.js";
import { askGemini } from "../services/geminiService.js";

// 🔹 Substitui {tags} em um template
function replaceTemplateTags(templateName, tags = []) {
  if (!templateName) return null;

  return templateName.replace(/{(.*?)}/g, (_, tagName) => {
    const tag = tags.find(
      (t) => t.name.toLowerCase() === tagName.toLowerCase() && t.value
    );
    return tag ? tag.value : `{${tagName}}`;
  });
}

// 🔹 Gera um único prompt para todas as tags IA
function generatePromptForMultipleTags(tags, text) {
  const iaTags = tags.filter((t) => t.type === "ia");
  const promptsList = iaTags.map((t) => `"${t.name}": ${t.prompt}`).join("\n");

  return `
Você é um assistente de extração de dados. Extraia as seguintes informações do texto e formate-as em um único objeto JSON.

O texto é:
"${text}"

As informações a serem extraídas são:
${promptsList}

Responda EXCLUSIVAMENTE com o objeto JSON. Não adicione qualquer outro texto, explicações ou formatação extra, como blocos de código markdown.
`;
}

// 🔹 Controller principal: upload + análise
export const uploadFileAndAnalyze = async (req, res) => {
  console.log("🚀 Controller chamado!");
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  try {
    if (!req.file)
      return res.status(400).json({ error: "Nenhum arquivo enviado" });

    // 🔹 Converte tags enviadas pelo front (apenas IDs)
    let parsedTagIds = [];
    if (req.body.tags) {
      parsedTagIds =
        typeof req.body.tags === "string"
          ? JSON.parse(req.body.tags)
          : req.body.tags;
    }

    // 🔹 Busca as tags completas no banco
    const selectedTags = await models.TagBase.findAll({
      where: { id: parsedTagIds },
    });

    // 🔹 Extrai dados do arquivo
    const extractedData =
      (await extractDataFromFile(req.file.path, selectedTags)) || {};

    // 🔹 Cria o documento
    const document = await models.Document.create({
      name: req.file.originalname,
      path: req.file.path,
      model: req.body.model || "Desconhecido",
      templateName: req.body.templateName || null,
      ownerId: req.user?.id || null,
    });

    const allTags = [];
    const existingNames = new Set();

    // 🔹 Separa IA e Regex
    const iaTags = selectedTags.filter((t) => t.type === "ia");
    const regexTags = selectedTags.filter((t) => t.type === "regex");

    let geminiResults = {};

    // 🔹 Processa IA
    if (iaTags.length > 0) {
      try {
        const prompt = generatePromptForMultipleTags(
          iaTags,
          extractedData.text || ""
        );
        console.log("Prompt enviado ao Gemini:", prompt);

        const geminiResultText = await askGemini(prompt);
        geminiResults = JSON.parse(
          geminiResultText.replace(/```json|```/g, "").trim()
        );
      } catch (err) {
        console.error("Erro Gemini:", err);
        iaTags.forEach((tag) => (geminiResults[tag.name] = "Erro IA"));
      }

      for (const tag of iaTags) {
        if (!existingNames.has(tag.name)) {
          let value = geminiResults[tag.name] ?? null;
          if (value && typeof value === "object")
            value = JSON.stringify(value, null, 2);

          allTags.push({
            name: tag.name,
            value,
            type: "ia",
            icon: tag.icon || "default",
            documentId: document.id,
          });
          existingNames.add(tag.name);
        }
      }
    }

    // 🔹 Processa Regex
    for (const tag of regexTags) {
      const extracted = (extractedData.tags || []).find(
        (t) => t.name === tag.name
      );
      if (!existingNames.has(tag.name)) {
        allTags.push({
          name: tag.name,
          value: extracted?.value || null,
          type: "regex",
          icon: tag.icon || "default",
          documentId: document.id,
        });
        existingNames.add(tag.name);
      }
    }

    // 🔹 Salva todas as instâncias
    if (allTags.length > 0) {
      await models.TagInstance.bulkCreate(allTags, { ignoreDuplicates: true });
    }

    // 🔹 Busca documento com tags para retorno
    const documentoComTags = await models.Document.findByPk(document.id, {
      include: [
        {
          model: models.TagInstance,
          as: "tags",
          attributes: ["id", "name", "value", "type", "icon"],
        },
      ],
    });

    const docJson = documentoComTags.toJSON();
    docJson.resolvedTemplate = replaceTemplateTags(
      docJson.templateName,
      docJson.tags
    );

    return res.json({
      message: "Arquivo salvo e analisado",
      document: docJson,
    });
  } catch (err) {
    console.error("Erro na API:", err);
    return res.status(500).json({ error: "Erro ao processar arquivo" });
  }
};

// 🔹 Retorna todos os documentos
export const getAllDocuments = async (req, res) => {
  try {
    const documentos = await models.Document.findAll({
      include: [
        {
          model: models.TagInstance,
          as: "tags",
          attributes: ["id", "name", "value", "type", "icon"],
        },
      ],
    });

    const documentosComTemplate = documentos.map((doc) => {
      const docJson = doc.toJSON();
      return {
        ...docJson,
        resolvedTemplate: replaceTemplateTags(
          docJson.templateName,
          docJson.tags
        ),
      };
    });

    return res.json(documentosComTemplate);
  } catch (err) {
    console.error("Erro ao buscar documentos:", err);
    return res
      .status(500)
      .json({ error: err.message || "Erro ao buscar documentos" });
  }
};

// 🔹 Deleta documento + tags
export const DeleteDoc = async (req, res) => {
  try {
    const documentId = req.params.id;

    const document = await models.Document.findByPk(documentId);
    if (!document)
      return res.status(404).json({ error: "Documento não encontrado" });

    // Remove arquivo físico
    if (document.path) {
      try {
        const filePath = path.resolve(document.path);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (fileErr) {
        console.log("oxes")
      }
    }

    // Remove tags + documento
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
