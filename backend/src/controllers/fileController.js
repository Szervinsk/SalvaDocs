import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse"); // já vem como função

// inicializa cliente Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const uploadFileAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const { tags } = req.body;
    if (!tags) {
      return res.status(400).json({ error: "Nenhuma tag recebida" });
    }

    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    // lê PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(dataBuffer);
    const text = pdfData.text;
    console.log(`Texto extraído:\n${text}\n`);

    let resultados = {};

    // --- regex ---
    for (const tag of parsedTags) {
      if (tag.type === "regex") {
        if (tag.regex) {
          try {
            const regex = new RegExp(tag.regex, "i");
            const match = text.match(regex);

            // se houver grupos de captura, pega o primeiro grupo, senão pega match[0]
            if (match) {
              resultados[tag.content] = match[1] ? match[1] : match[0];
            } else {
              resultados[tag.content] = "Não encontrado";
            }
          } catch (err) {
            resultados[tag.content] = "Erro no regex";
          }
        } else {
          resultados[tag.content] = "Regex não fornecido";
        }
      }
    }

    // imprime JSON legível no console
    console.log("Resultados extraídos:", JSON.stringify(resultados, null, 2));

    // envia JSON para o frontend
    res.json({
      message: "Análise concluída",
      resultados,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao processar o arquivo" });
  }
};

// função refinadora (opcional)
const refinador = (resultados) => {
  // aqui você pode processar ou padronizar os dados antes de enviar
  return resultados;
};

    //     // --- IA ---
    //     const iaTags = parsedTags.filter((t) => t.type === "ia");
    //     if (iaTags.length > 0) {
    //       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    //       const prompt = `
    // Você é um extrator de informações de documentos.
    // Texto extraído do PDF:
    // "${text}"

    // Encontre e retorne em JSON SOMENTE as seguintes tags:
    // ${iaTags.map((t) => t.content).join(", ")}.
    // Se algum dado não for encontrado, indique "Não encontrado".
    // `;

    //       const result = await model.generateContent(prompt);
    //       const output = result.response.text();

    //       try {
    //         const parsed = JSON.parse(output);
    //         resultados = { ...resultados, ...parsed };
    //       } catch (e) {
    //         resultados = { ...resultados, erroIA: output };
    //       }
    //     }

    //     res.json({
    //       message: "Análise concluída",
    //       resultados,
    //     });