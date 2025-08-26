// src/services/extractService.js
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export const extractDataFromFile = async (filePath, tags = []) => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(dataBuffer);
  const text = pdfData.text;

  const extractedTags = [];

  for (const tag of tags) {
    if (tag.type === "regex" && tag.regex) {
      try {
        const regex = new RegExp(tag.regex, "i");
        const match = text.match(regex);
        const value = match ? match[1] || match[0] : "Não encontrado";
        extractedTags.push({ name: tag.content, value });
      } catch (err) {
        extractedTags.push({ name: tag.content, value: "Erro no regex" });
      }
    }
  }

  return { tags: extractedTags };
};
