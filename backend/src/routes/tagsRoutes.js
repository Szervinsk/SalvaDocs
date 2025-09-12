// routes/tagsRoutes.js
import express from "express";
import { getAllTags } from "../controllers/tagsController.js";

const router = express.Router();

router.get("/", getAllTags);

export default router;
