import "dotenv/config";
import fetch from "node-fetch";

export async function askGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(
    endpoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 500,
        }
      }),
    }
  );

  const data = await response.json();
  if (data.error) {
    throw new Error(`Erro da API: ${data.error.message}`);
  }

  // A resposta da API é um pouco diferente, você precisa navegar por 'candidates'
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error("Gemini API não retornou resultado válido");
  }

  // Retorna o texto da resposta
  return data.candidates[0].content.parts[0].text;
}