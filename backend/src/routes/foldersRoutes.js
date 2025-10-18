import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getAllFolders, createFolder, updateFolder, deleteFolder } from "../controllers/folderController.js";

const router = express.Router();

// Middleware de segurança -> garante que todas as seguintes rotas sejam privadas
router.use(authMiddleware);

// MÉTODO: GET
// ROTA: /api/folders
// DESCRIÇÃO: Retorna todas as pastas
router.get("/", getAllFolders);

// MÉTODO: PUT
// ROTA: /api/folders
// DESCRIÇÃO: Atualiza algum dado da pasta
router.put("/:id", updateFolder)

// MÉTODO: POST
// ROTA: /api/folders
// DESCRIÇÃO: Cria uma nova pasta
router.post("/", createFolder);

// MÉTODO: DELETE
// ROTA: /api/folders/:id
// DESCRIÇÃO: Deleta uma pasta pelo ID
router.delete("/:id", deleteFolder);

export default router;
