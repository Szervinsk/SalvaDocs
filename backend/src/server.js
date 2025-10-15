// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from 'url';
import path from 'path';


import { sequelize } from "./models/index.js";
import apiRoutes from "./routes/api.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
}));

app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

app.use("/api", apiRoutes);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate(); 
    console.log("Conexão com banco estabelecida!");
    app.listen(PORT, () => console.log(`Server rodando em ${PORT}`));
  } catch (err) {
    console.error("Erro ao iniciar servidor:", err);
  }
}

start();

