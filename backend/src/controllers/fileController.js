// Importações necessárias
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
  try {
    if (!req.file)
      return res.status(400).json({ error: "Nenhum arquivo enviado" });

    const { tags: rawTags, model, templateName } = req.body;

    // 🔎 Converte tags enviadas pelo front
    let parsedTags = [];
    if (rawTags) {
      try {
        parsedTags =
          typeof rawTags === "string" ? JSON.parse(rawTags) : rawTags;
      } catch (e) {
        return res.status(400).json({ error: "Formato inválido para tags" });
      }
    }

    const filePath = path.resolve(req.file.path);

    // 🔎 Extrai texto + regex
    const extractedData =
      (await extractDataFromFile(filePath, parsedTags)) || {};
    const textContent = extractedData.text || "";

    // 🔎 Cria documento
    const document = await models.Document.create({
      name: req.file.originalname,
      path: filePath,
      model: model || "Desconhecido",
      templateName: templateName || null,
    });

    const allTags = [];
    const existingNames = new Set();

    // 🔎 IA e Regex definidos pelo front
    const iaTags = parsedTags.filter((t) => t.type === "ia");
    const regexTags = parsedTags.filter((t) => t.type === "regex");

    let geminiResults = {};

    // 🔎 Chamada única ao Gemini para todas as tags IA
    if (iaTags.length > 0) {
      try {
        const prompt = generatePromptForMultipleTags(parsedTags, textContent);
        console.log("Prompt enviado ao Gemini:", prompt);

        const geminiResultText = await askGemini(prompt);
        console.log("Resposta do Gemini:", geminiResultText);

        const cleanJsonString = geminiResultText
          .replace(/```json|```/g, "")
          .trim();
        geminiResults = JSON.parse(cleanJsonString);
      } catch (err) {
        console.error("Erro Gemini:", err);
        iaTags.forEach((tag) => (geminiResults[tag.name] = "Erro IA"));
      }
    }

    // 🔹 Adiciona tags IA
    for (const tag of iaTags) {
      const tagName = tag.name || "Desconhecido";

      if (!existingNames.has(tagName)) {
        let tagValue = geminiResults[tagName] ?? null;

        // Se for objeto ou array → converte em string JSON
        if (tagValue && typeof tagValue === "object") {
          tagValue = JSON.stringify(tagValue, null, 2);
        }

        allTags.push({
          name: tagName,
          value: tagValue,
          type: "ia",
          icon: tag.icon || "default",
          documentId: document.id, // agora sempre vai vincular ao documento
        });

        existingNames.add(tagName);
      }
    }

    // 🔹 Adiciona tags Regex
    for (const tag of regexTags) {
      const extracted = (extractedData.tags || []).find(
        (t) => t.name === tag.name
      );
      const tagName = tag.name || "Desconhecido";
      if (!existingNames.has(tagName)) {
        allTags.push({
          name: tagName,
          value: extracted?.value || null,
          type: "regex",
          icon: tag.icon || "default",
          documentId: document.id,
        });
        existingNames.add(tagName);
      }
    }

    // 🔎 Salva tags no banco
    if (allTags.length > 0) {
      await models.Tag.bulkCreate(allTags);
    }

    // 🔎 Busca documento já com tags
    const documentoComTags = await models.Document.findByPk(document.id, {
      include: [
        {
          model: models.Tag,
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

    res.json({
      message: "Arquivo salvo e analisado",
      document: docJson,
    });
  } catch (err) {
    console.error("Erro na API:", err);
    res.status(500).json({ error: "Erro ao processar arquivo" });
  }
};

// 🔹 Retorna todos os documentos
export const getAllDocuments = async (req, res) => {
  try {
    const documentos = await models.Document.findAll({
      include: [
        {
          model: models.Tag,
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

    res.json(documentosComTemplate);
  } catch (err) {
    console.error("Erro ao buscar documentos:", err);
    res.status(500).json({ error: "Erro ao buscar documentos" });
  }
};

// 🔹 Deleta documento + arquivo físico
export const DeleteDoc = async (req, res) => {
  try {
    const documentId = req.params.id;

    const document = await models.Document.findByPk(documentId);
    if (!document) {
      return res.status(404).json({ error: "Documento não encontrado" });
    }

    // 🔎 Remove arquivo físico
    if (document.path) {
      try {
        const filePath = path.resolve(document.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Arquivo deletado: ${filePath}`);
        }
      } catch (fileErr) {
        console.error("Erro ao remover arquivo:", fileErr);
      }
    }

    // 🔎 Remove tags + documento
    await models.Tag.destroy({ where: { documentId } });
    await document.destroy();

    res.json({ message: "Documento e arquivo apagados com sucesso" });
  } catch (err) {
    console.error("Erro ao apagar documento:", err);
    res.status(500).json({ error: "Erro ao apagar documento" });
  }
};
