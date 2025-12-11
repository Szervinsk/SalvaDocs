import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { authMiddleware } from "../middleware/auth.js";
import {
  uploadFileAndAnalyze,
  getAllDocuments,
  downloadDocument,
  deleteDoc,
  updateDocumentTags,
} from "../controllers/fileController.js";

const router = express.Router();
router.use(authMiddleware);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// POST /api/documents/upload -> Faz upload e analisa um novo arquivo
router.post("/upload", upload.single("file"), uploadFileAndAnalyze);
// GET /api/documents -> Busca todos os documentos
router.get("/", getAllDocuments);
// DELETE /api/documents/:id -> Deleta um documento
router.delete("/:id", deleteDoc);
// GET /api/documents/download/:id -> Baixa o arquivo
router.get("/download/:id", downloadDocument);
// PUT /api/documents/:id/tags -> Atualiza as tags do documento
router.put("/:id/tags", updateDocumentTags);

export default router;
