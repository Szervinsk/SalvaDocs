import express from "express";
import { updateUser, deleteUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js"; // Reutilizamos o mesmo middleware

const router = express.Router();

// Todas as rotas aqui exigem autenticação

// Atualiza o usuário logado
router.put("/:id", authMiddleware, updateUser);

// Deleta o usuário logado
router.delete("/", authMiddleware, deleteUser);

export default router;