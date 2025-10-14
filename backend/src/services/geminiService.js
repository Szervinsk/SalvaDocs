// backend/src/services/geminiService.js
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("A variável GEMINI_API_KEY não foi definida no arquivo .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export async function extractDataWithGemini(tags, text) {
  if (!tags || tags.length === 0 || !text) return {};

  const promptsList = tags.map((t) => `"${t.name}": ${t.prompt}`).join("\n");

  const prompt = `
    Você é um assistente de extração de dados. Extraia as seguintes informações do texto e formate-as em um único objeto JSON.
    O texto é: "${text}"
    As informações a serem extraídas são:
    ${promptsList}
    Responda EXCLUSIVAMENTE com o objeto JSON. Não adicione qualquer outro texto ou formatação extra.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResponse = response.text();

    const cleanedText = textResponse.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (err) {
    console.error("Erro no serviço de extração Gemini:", err);
    throw new Error("Falha ao processar dados com o serviço de IA.");
  }
}
