// src/routes/authRoutes.js
import express from "express";
import * as ctrl from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Rotas Públicas (Não precisam de token de acesso)
router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.post("/refresh-token", ctrl.refreshToken);
router.post("/reset-password", ctrl.resetPassword)

// Aplica-se o middleware de segurança
// Todas as rotas abaixo desta linha são protegidas e exigem um accessToken válido.
router.use(authMiddleware);

// Rotas Protegidas
router.post("/logout", ctrl.logout);
router.get("/me", ctrl.me);

export default router;