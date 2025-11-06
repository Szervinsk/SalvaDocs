import express from "express";
import { runBotFlow } from "../controllers/botController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Rota protegida para iniciar o bot
router.post("/run-selenium", authMiddleware, runBotFlow);

export default router;