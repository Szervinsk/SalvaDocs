import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { authMiddleware } from "../middleware/auth.js";
import { uploadFileAndAnalyze, getAllDocuments, deleteDoc } from "../controllers/fileController.js";

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

router.post("/upload", upload.single("file"), uploadFileAndAnalyze);
router.get("/", getAllDocuments);
router.delete("/:id", deleteDoc);

export default router;
