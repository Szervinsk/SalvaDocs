// src/services/extractService.js
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

/**
 * Remove trechos do texto entre start e end.
 * @param {string} text 
 * @param {string} start 
 * @param {string} end 
 */
function removeTextBetween(text, start, end) {
  const regex = new RegExp(`${start}[\\s\\S]*?${end}`, "gi");
  return text.replace(regex, "");
}

export const extractDataFromFile = async (filePath, tags = []) => {
  const dataBuffer = fs.readFileSync(filePath);
  let pdfData = await pdf(dataBuffer);
  let text = pdfData.text;

  // Remove trechos indesejados
  text = removeTextBetween(text, "Identificador do item", "de fecho do documento.");
  text = removeTextBetween(text, "Página de assinatura", "Lista de Signatário(s):");
  text = removeTextBetween(text, "Produzido por", "Águas Claras-DF");

  const extractedTags = [];

  for (const tag of tags) {
    let value = null; // valor padrão

    if (tag.type === "regex" && tag.regex) {
      try {
        const regex = new RegExp(tag.regex, "i");
        const match = text.match(regex);
        value = match ? match[1] || match[0] : "Não encontrado";
      } catch (err) {
        value = "Erro no regex";
      }
    }

    // Adiciona a tag (regex ou ia) na lista
    extractedTags.push({
      name: tag.name || tag.content || "Sem nome",
      value,
      type: tag.type || "regex",
      icon: tag.icon || "default",
    });
  }

  return { tags: extractedTags, text }; // retorna também o texto filtrado para IA
};
