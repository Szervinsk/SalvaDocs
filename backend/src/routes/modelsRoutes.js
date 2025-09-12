import express from "express";
import { getModelos, createModelo, updateModeloTags, getAllModelos } from "../controllers/modelosController.js";

const router = express.Router();

router.get("/", getAllModelos)
router.get("/:id", getModelos);
router.post("/create", createModelo);
router.put("/:id/tags", updateModeloTags);

export default router;
