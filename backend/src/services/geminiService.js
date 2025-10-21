// backend/src/services/geminiService.js
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. CHAVE PADRÃO DO SERVIDOR (Fallback)
const defaultApiKey = process.env.GEMINI_API_KEY;
if (!defaultApiKey) {
  console.warn(
    "AVISO: A variável GEMINI_API_KEY não foi definida no arquivo .env. A extração por IA só funcionará se os usuários fornecerem suas próprias chaves."
  );
}

// Cria uma instância padrão que será usada se o usuário não tiver uma chave
const defaultGenAI = defaultApiKey
  ? new GoogleGenerativeAI(defaultApiKey)
  : null;

/**
 * Gera o prompt para extrair múltiplas tags com IA.
 * @param {Array} iaTags - As tags do tipo 'ia' a serem extraídas.
 * @param {string} text - O texto do documento.
 * @returns {string} - O prompt formatado.
 */
function generatePromptForMultipleTags(iaTags, text) {
  const promptsList = iaTags
    .map((t) => `"${t.name}": "${t.prompt}"`)
    .join(",\n");

  return `
    Você é um assistente de extração de dados JSON. Analise o TEXTO abaixo.
    Extraia as informações solicitadas no objeto ESTRUTURA e retorne APENAS o objeto JSON preenchido.
    Não adicione explicações, comentários ou formatação markdown.

    TEXTO:
    """
    ${text}
    """

    ESTRUTURA:
    {
      ${promptsList}
    }
  `;
}

/**
 * Função centralizada para chamar a API do Gemini e extrair dados.
 * @param {Array} iaTags - As tags a serem processadas.
 * @param {string} text - O texto do documento.
 * @param {string|null} userApiKey - A chave de API específica do usuário (opcional).
 * @returns {Object} - O objeto JSON com os resultados.
 */
export async function extractDataWithGemini(iaTags, text, userApiKey = null) {
  if (!iaTags || iaTags.length === 0 || !text) return {};

  let activeGenAI;

  // ✨ AJUSTE PRINCIPAL: ESCOLHE QUAL CHAVE USAR ✨
  if (userApiKey) {
    // Se o usuário forneceu uma chave, cria uma instância específica para ele.
    activeGenAI = new GoogleGenerativeAI(userApiKey);
    console.log("[Gemini Service] Usando a chave de API do usuário.");
  } else if (defaultGenAI) {
    // Se não, usa a instância padrão do servidor.
    activeGenAI = defaultGenAI;
    console.log("[Gemini Service] Usando a chave de API padrão do servidor.");
  } else {
    // Se nenhuma chave estiver disponível, lança um erro.
    throw new Error(
      "Nenhuma chave de API do Gemini está configurada para esta requisição."
    );
  }

  // Usa o modelo mais recente e otimizado
  const model = activeGenAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const prompt = generatePromptForMultipleTags(iaTags, text);

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResponse = response.text();

    const cleanedText = textResponse.replace(/```json|```/g, "").trim();

    // Tratamento de erro mais robusto para o JSON
    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error(
        "Erro ao fazer o parse da resposta JSON do Gemini:",
        parseError
      );
      console.error("Texto recebido da API:", cleanedText);
      throw new Error("A API de IA retornou um formato de texto inválido.");
    }
  } catch (err) {
    console.error("Erro no serviço de extração Gemini:", err);
    // Propaga o erro para o controller, que decidirá o que fazer
    throw new Error("Falha ao processar dados com o serviço de IA.");
  }
}
