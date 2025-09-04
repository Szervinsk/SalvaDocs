import express from "express";
import * as ctrl from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.post("/refresh", ctrl.refreshToken);
router.post("/logout", ctrl.logout);
router.get("/me", authMiddleware, ctrl.me);

export default router;
