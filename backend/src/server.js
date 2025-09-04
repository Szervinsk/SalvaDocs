// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { sequelize } from "./models/index.js";
import apiRoutes from "./routes/api.js";

dotenv.config();
const app = express();

// Middlewares globais
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000"], // frontend origin
  credentials: true,
}));

// Rate limit global (100 req/min)
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

// Rotas
app.use("/api", apiRoutes);

// Sincroniza models
sequelize.sync({ alter: true }).then(() => {
  console.log("Banco sincronizado com sucesso 🚀");
});

const PORT = process.env.PORT || 4000;

// Start server
async function start() {
  try {
    await sequelize.authenticate();
    console.log("Conexão com banco estabelecida!");
    await sequelize.sync(); // cuidado: em produção, usar migrations
    app.listen(PORT, () => console.log(`Server rodando em ${PORT}`));
  } catch (err) {
    console.error("Erro ao iniciar servidor:", err);
  }
}

start();
