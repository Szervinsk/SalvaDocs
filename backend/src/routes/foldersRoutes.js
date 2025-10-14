import express from "express";
import { getAllFolders, createFolder } from "../controllers/folderController.js";

const router = express.Router();

router.get("/", getAllFolders);
router.post("/", createFolder);

export default router;