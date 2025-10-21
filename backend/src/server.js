import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs"; // Importe o 'fs' para ler o arquivo de tags

import { sequelize } from "./models/index.js";
import models from "./models/index.js";
import apiRoutes from "./routes/api.js";
import { populateDatabase } from "./scripts/seedLogic.js"; // Importa a lógica central

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "frame-src": ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

// Rotas da API
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 5000;

// FUNÇÃO DE SEED (AGORA MUITO MAIS LIMPA E SEGURA)
async function runInitialSeed() {
  try {
    console.log(
      "\n[Seed] Verificando se o banco de dados precisa ser populado..."
    );

    // Verifica se já existem dados (ex: Pastas) para não popular novamente
    const folderCount = await models.Folder.count();
    if (folderCount > 0) {
      console.log(
        "[Seed] O banco de dados já está populado. Nenhuma ação necessária."
      );
      return;
    }

    console.log("[Seed] Banco de dados vazio. Iniciando a população...");

    // Chama a lógica de população centralizada
    await populateDatabase();
  } catch (err) {
    console.error("❌ Erro durante o processo de seed inicial:", err);
  }
}

async function start() {
  try {
    console.log("Verificando e sincronizando o banco de dados...");

    // sequelize.sync() cria as tabelas SE ELAS NÃO EXISTIREM (seguro, não destrutivo)
    await sequelize.sync();
    console.log("Banco de dados sincronizado com sucesso!");

    // Chama a função de seed APÓS sincronizar
    await runInitialSeed();

    app.listen(PORT, () =>
      console.log(`Servidor backend rodando na porta ${PORT}`)
    );
  } catch (err) {
    console.error("ERRO FATAL AO INICIAR SERVIDOR:", err);
    process.exit(1);
  }
}

start();
