import fs from "fs";
import path from "path";
import models from "../models/index.js";
import { extractDataFromFile } from "../services/extractService.js";

// ✅ Função auxiliar para substituir {tags} no template
function replaceTemplateTags(templateName, tags = []) {
  if (!templateName) return null;

  return templateName.replace(/{(.*?)}/g, (_, tagName) => {
    const tag = tags.find(
      (t) => t.name.toLowerCase() === tagName.toLowerCase() && t.value
    );
    return tag ? tag.value : `${tagName}`; // mantém placeholder se não achar valor
  });
}

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

    // 🔎 Extrai dados do arquivo
    const extractedData =
      (await extractDataFromFile(filePath, parsedTags)) || {};

    // ✅ Substitui tags no template usando valores extraídos
    const finalTemplateName = replaceTemplateTags(
      templateName,
      extractedData.tags || []
    );

    // Cria documento
    const document = await models.Document.create({
      name: req.file.originalname,
      path: filePath,
      model: model || "Desconhecido",
      templateName: finalTemplateName || templateName || null,
    });

    // Filtra tags únicas (evita duplicação)
    const allTags = [];

    const existingNames = new Set();

    // Tags extraídas
    (extractedData.tags || []).forEach((tag) => {
      if (!existingNames.has(tag.name)) {
        allTags.push({
          name: tag.name,
          value: tag.value,
          documentId: document.id,
        });
        existingNames.add(tag.name);
      }
    });

    // Tags manuais do FE
    (parsedTags || []).forEach((tag) => {
      const name = tag.name || tag.content;
      if (!existingNames.has(name)) {
        allTags.push({
          name,
          value: null,
          documentId: document.id,
        });
        existingNames.add(name);
      }
    });

    if (allTags.length > 0) {
      await models.Tag.bulkCreate(allTags);
    }

    const documentoComTags = await models.Document.findByPk(document.id, {
      include: [
        { model: models.Tag, as: "tags", attributes: ["id", "name", "value"] },
      ],
    });

    res.json({
      message: "Arquivo salvo e analisado",
      document: documentoComTags,
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
        { model: models.Tag, as: "tags", attributes: ["id", "name", "value"] },
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

    if (document.path) {
      try {
        const filePath = path.resolve(document.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Arquivo deletado: ${filePath}`);
        } else {
          console.warn(`Arquivo não encontrado: ${filePath}`);
        }
      } catch (fileErr) {
        console.error("Erro ao remover arquivo:", fileErr);
      }
    }

    await models.Tag.destroy({ where: { documentId } });
    await document.destroy();

    res.json({ message: "Documento e arquivo apagados com sucesso" });
  } catch (err) {
    console.error("Erro ao apagar documento:", err);
    res.status(500).json({ error: "Erro ao apagar documento" });
  }
};
