import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { updateUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

// Todas as rotas aqui exigem autenticação
router.use(authMiddleware);

// Atualiza o usuário logado
router.put("/", updateUser);

// Deleta o usuário logado
router.delete("/", deleteUser);

export default router;
