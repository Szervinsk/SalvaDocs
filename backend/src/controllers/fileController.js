import fs from "fs";
import path from "path";
import models from "../models/index.js";
import { extractDataFromFile } from "../services/extractService.js";
import { askGemini } from "../services/geminiService.js";

// Função auxiliar para substituir {tags} no template
function replaceTemplateTags(templateName, tags = []) {
  if (!templateName) return null;

  return templateName.replace(/{(.*?)}/g, (_, tagName) => {
    const tag = tags.find(
      (t) => t.name.toLowerCase() === tagName.toLowerCase() && t.value
    );
    return tag ? tag.value : `{${tagName}}`;
  });
}

// Função para gerar um único prompt para todas as tags de IA
function generatePromptForMultipleTags(tags, text) {
  // Filtra apenas as tags de IA para processamento
  const iaTags = tags.filter((t) => t.type === "ia");

  // Cria a lista de instruções de prompt para cada tag de IA
  const promptsList = iaTags
    .map((t) => `"${t.name}": ${t.prompt}`)
    .join("\n");

  return `
Você é um assistente de extração de dados. Extraia as seguintes informações do texto e formate-as em um único objeto JSON.

O texto é:
"${text}"

As informações a serem extraídas são:
${promptsList}

Responda EXCLUSIVAMENTE com o objeto JSON. Não adicione qualquer outro texto, explicações ou formatação extra, como blocos de código markdown.
`;
}

// Controller principal para upload e análise de arquivos
export const uploadFileAndAnalyze = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "Nenhum arquivo enviado" });

    const { tags: rawTags, model, templateName } = req.body;

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

    // Extrai o texto do arquivo e os dados das tags regex
    const extractedData =
      (await extractDataFromFile(filePath, parsedTags)) || {};
    const textContent = extractedData.text || "";

    const document = await models.Document.create({
      name: req.file.originalname,
      path: filePath,
      model: model || "Desconhecido",
      templateName: templateName || null,
    });

    const allTags = [];
    const existingNames = new Set();
    const iaTags = (extractedData.tags || []).filter((t) => t.type === "ia");
    const regexTags = (extractedData.tags || []).filter(
      (t) => t.type === "regex"
    );

    let geminiResults = {};

    // Processa todas as tags de IA com uma única chamada ao Gemini
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
        // Em caso de erro, define um valor padrão para todas as tags de IA
        iaTags.forEach((tag) => (geminiResults[tag.name] = "Erro IA")); // 
      }
    }

    // Constrói a lista final de tags
    // Adiciona as tags de IA com os resultados obtidos
    for (const tag of iaTags) {
      const tagName = tag.name || "Desconhecido"; // Alterado de tag.content para tag.name
      if (!existingNames.has(tagName)) {
        allTags.push({
          name: tagName,
          value: geminiResults[tagName] || "Não encontrado",
          type: "ia",
          icon: tag.icon,
          documentId: document.id,
        });
        existingNames.add(tagName);
      }
    }

    // Adiciona as tags de regex com os resultados obtidos anteriormente
    for (const tag of regexTags) {
      const tagName = tag.name || "Desconhecido"; // Alterado de tag.content para tag.name
      if (!existingNames.has(tagName)) {
        allTags.push({
          name: tagName,
          value: tag.value || null,
          type: "regex",
          icon: tag.icon || "default",
          documentId: document.id,
        });
        existingNames.add(tagName);
      }
    }

    // Salva tags no banco
    if (allTags.length > 0) {
      await models.Tag.bulkCreate(allTags);
    }

    // Busca documento com tags já incluídas
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
    const resolvedTemplate = replaceTemplateTags(
      docJson.templateName,
      docJson.tags
    );
    docJson.resolvedTemplate = resolvedTemplate;

    res.json({
      message: "Arquivo salvo e analisado",
      document: docJson,
    });
  } catch (err) {
    console.error("Erro na API:", err);
    res.status(500).json({ error: "Erro ao processar arquivo" });
  }
};

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

    // ✅ Resolve template em cada documento antes de retornar
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

export const DeleteDoc = async (req, res) => {
  try {
    const documentId = req.params.id;

    const document = await models.Document.findByPk(documentId);
    if (!document) {
      return res.status(404).json({ error: "Documento não encontrado" });
    }

    // 🔎 Remove arquivo físico (se existir)
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

    // 🔎 Remove tags e documento
    await models.Tag.destroy({ where: { documentId } });
    await document.destroy();

    res.json({ message: "Documento e arquivo apagados com sucesso" });
  } catch (err) {
    console.error("Erro ao apagar documento:", err);
    res.status(500).json({ error: "Erro ao apagar documento" });
  }
};
