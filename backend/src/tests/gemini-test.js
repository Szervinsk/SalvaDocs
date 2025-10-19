// Local: backend/teste_final.js

import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Esta função de teste auto-executável faz o seguinte:
 * 1. Valida sua chave de API do arquivo .env.
 * 2. Inicializa o cliente do Gemini com a correção da 'apiVersion'.
 * 3. Envia um prompt de teste simples.
 * 4. Imprime o resultado ou um erro detalhado.
 */
async function runTest() {
  console.log("--- Iniciando Teste de Conexão com a API Gemini ---");

  // --- 1. CONFIGURAÇÃO E VALIDAÇÃO ---
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error(
      "❌ FALHA: A variável GEMINI_API_KEY não foi definida no arquivo .env"
    );
    return; // Encerra a execução
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // --- 2. INICIALIZAÇÃO DO MODELO (COM A CORREÇÃO) ---
    // Usamos 'gemini-pro' com a 'apiVersion: "v1"' para garantir estabilidade.
    // Esta é a correção para o erro 404 que você estava recebendo.
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    // --- 3. EXECUÇÃO DO TESTE ---
    const promptDeTeste = "Qual é a capital do Brasil?";
    console.log(`Enviando prompt: "${promptDeTeste}"`);

    const result = await model.generateContent(promptDeTeste);
    const response = result.response;
    const textResponse = response.text();

    // --- 4. RESULTADO ---
    console.log("\n--- ✅ SUCESSO! ---");
    console.log("Resposta da API:", textResponse);
    console.log("--------------------");
  } catch (err) {
    console.log("\n--- ❌ FALHA! ---");
    console.error("Ocorreu um erro detalhado durante o teste:", err);
    console.log("-----------------");
  }
}

// Executa a função de teste
runTest();
