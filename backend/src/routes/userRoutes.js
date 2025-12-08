import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { updateUser, deleteUser, dismissWelcome, resetWelcome, changePassword } from "../controllers/userController.js";

const router = express.Router();

// Todas as rotas aqui exigem autenticação
router.use(authMiddleware);

// Atualiza o usuário logado
router.put("/", updateUser);

// Rota para dispensar a tela de boas-vindas
router.put("/welcome", dismissWelcome);

// Rota para resetar o status do welcome
router.put("/welcome/reset", resetWelcome);

// Rota para trocar a senha quando estiver logado
router.put("/changepassword", changePassword) 

// Deleta o usuário logado
router.delete("/", deleteUser);

export default router;
