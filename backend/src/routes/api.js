import express from "express";
import fileRoutes from "./fileRoutes.js";
import authRoutes from "./authRoutes.js";

const router = express.Router();

router.use("/files", fileRoutes);
router.use("/auth", authRoutes);

export default router;
