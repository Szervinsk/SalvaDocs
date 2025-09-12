import express from "express";
import fileRoutes from "./fileRoutes.js";
import authRoutes from "./authRoutes.js";
import modelsRoutes from "./modelsRoutes.js";
import tagsRoutes from "./tagsRoutes.js";

const router = express.Router();

router.use("/tags", tagsRoutes);
router.use("/files", fileRoutes);
router.use("/models", modelsRoutes);
router.use("/auth", authRoutes);

export default router;
