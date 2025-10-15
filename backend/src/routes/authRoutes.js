// src/routes/authRoutes.js
import express from "express";
import * as ctrl from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.post("/refresh-token", ctrl.refreshToken); // Nome da rota mais explícito
router.post("/logout", ctrl.logout);
router.get("/me", authMiddleware, ctrl.me);

export default router;
