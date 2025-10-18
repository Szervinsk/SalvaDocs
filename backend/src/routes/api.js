import express from "express";
import fileRoutes from "./fileRoutes.js";
import authRoutes from "./authRoutes.js";
import modelsRoutes from "./modelsRoutes.js";
import tagsRoutes from "./tagsRoutes.js";
import foldersRoutes from "./foldersRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

router.use("/tags", tagsRoutes);
router.use("/folders", foldersRoutes);
router.use("/documents", fileRoutes);
router.use("/modelos", modelsRoutes);
router.use("/auth", authRoutes); // Rota pública
router.use("/users", userRoutes);

export default router;