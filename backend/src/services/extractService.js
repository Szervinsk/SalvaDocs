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
  // ✨ AJUSTE AQUI: Trocado 'readFileSync' por 'fs.promises.readFile' ✨
  // Isso torna a leitura do arquivo assíncrona e não-bloqueante.
  const dataBuffer = await fs.promises.readFile(filePath);

  let pdfData = await pdf(dataBuffer);
  let text = pdfData.text;

  // Remove trechos indesejados
  text = removeTextBetween(
    text,
    "Identificador do item",
    "de fecho do documento."
  );
  text = removeTextBetween(
    text,
    "Página de assinatura",
    "Lista de Signatário(s):"
  );
  text = removeTextBetween(text, "Produzido por", "Águas Claras-DF");

  const extractedTags = [];

  for (const tag of tags) {
    let value = null; // valor padrão

    if (tag.type === "Regex" && tag.regex) {
      try {
        const regex = new RegExp(tag.regex, "i");
        const match = text.match(regex);

        // Prioriza o grupo de captura (match[1]), se não houver, usa o match completo (match[0])
        value = match ? match[1] || match[0] : "Não encontrado";
      } catch (err) {
        console.error(
          `Erro ao executar Regex para a tag "${tag.name}":`,
          err.message
        );
        value = "Erro no regex";
      }
    }

    // Adiciona a tag (mesmo que seja de IA, com valor null)
    // Isso está correto, pois o fileController usa essa lista para saber o que processar.
    extractedTags.push({
      name: tag.name,
      value, // value será 'null' para tags de IA, o que é esperado
      type: tag.type,
      icon: tag.icon || "default",
    });
  }

  return { tags: extractedTags, text }; // retorna também o texto filtrado para IA
};
