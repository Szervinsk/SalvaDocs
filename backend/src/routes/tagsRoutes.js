// routes/tagsRoutes.js
import express from "express";
import {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
} from "../controllers/tagsController.js";

const router = express.Router();

// Rota para LER todas as tags
// MÉTODO: GET, URL: /api/tags
router.get("/", getAllTags);

// Rota para CRIAR uma nova tag
// MÉTODO: POST, URL: /api/tags
router.post("/create", createTag); // Mantive seu endpoint por consistência

// Rota para ATUALIZAR uma tag específica pelo ID
// MÉTODO: PUT, URL: /api/tags/1 (onde 1 é o ID)
router.put("/:id", updateTag);

// Rota para EXCLUIR uma tag específica pelo ID
// MÉTODO: DELETE, URL: /api/tags/1 (onde 1 é o ID)
router.delete("/:id", deleteTag);

export default router;