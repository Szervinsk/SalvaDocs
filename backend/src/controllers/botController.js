import { runPythonBotFlow } from '../services/pythonService.js';
import { authMiddleware } from "../middleware/auth.js"; // Para proteger a rota

const TARGET_URL = "linkprotejido"; // URL fixa para o bot

export const runBotFlow = async (req, res) => {
    try {
        const result = await runPythonBotFlow(req.body.username, req.body.password, TARGET_URL);

        // O resultado será o log completo da execução
        res.json({ success: true, message: "Fluxo do bot concluído", logs: result });
        
    } catch (err) {
        console.error("Erro ao executar bot:", err);
        res.status(500).json({ error: "Falha na execução da automação. Motivo: " + err.message });
    }
};