import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { uploadFileAndAnalyze , getAllDocuments, DeleteDoc} from "../controllers/fileController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Realizar upload para análise dos documentos
router.post("/upload", upload.single("file"), uploadFileAndAnalyze);
// Listar documentos
router.get("/documentos", getAllDocuments);

router.post("/delete/:id", DeleteDoc);

export default router;
