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

// ✨ FUNÇÃO DE SEED (LÓGICA DO SEU seed.js, MAS SEGURA) ✨
async function runInitialSeed() {
  try {
    console.log(
      "\n[Seed] Verificando se o banco de dados precisa ser populado..."
    );

    // Verifica se já existem dados para não popular novamente
    const folderCount = await models.Folder.count();
    if (folderCount > 0) {
      console.log(
        "[Seed] O banco de dados já está populado. Nenhuma ação necessária."
      );
      return;
    }

    console.log("[Seed] Banco de dados vazio. Iniciando a população...");

    // 1. Cria as Pastas Padrão
    const pastasData = [
      { name: "Despachos" },
      { name: "Relatórios Gerais" },
      { name: "Documentos Internos" },
    ];
    await models.Folder.bulkCreate(pastasData);
    console.log("✅ Pastas criadas!");

    // 2. Cria os Modelos Padrão
    const [despacho] = await models.Modelo.upsert({ name: "Despacho" });
    const [parecer] = await models.Modelo.upsert({ name: "Parecer" });
    const [programa] = await models.Modelo.upsert({ name: "Programa" });
    console.log("✅ Modelos criados!");

    // 3. Cria as Tags e Associa aos Modelos
    // O caminho precisa ser relativo ao local onde o script está rodando
    const tagsPath = path.resolve(__dirname, "constants/tags.json");
    if (fs.existsSync(tagsPath)) {
      const tagsJSON = JSON.parse(fs.readFileSync(tagsPath, "utf8"));
      for (const t of tagsJSON) {
        const [tag] = await models.TagBase.findOrCreate({
          where: { name: t.name },
          defaults: t,
        });
        if (t.category?.toLowerCase() === "despacho")
          await despacho.addTagsBase(tag);
        if (t.category?.toLowerCase() === "parecer")
          await parecer.addTagsBase(tag);
        if (t.category?.toLowerCase() === "programa")
          await programa.addTagsBase(tag);
      }
      console.log("✅ Tags criadas e associadas!");
    } else {
      console.warn(
        "[Seed] Aviso: arquivo 'tags.json' não encontrado. As tags não foram populadas."
      );
    }

    console.log("\n🏁 Processo de seed inicial concluído com sucesso!");
  } catch (err) {
    console.error("❌ Erro durante o processo de seed inicial:", err);
  }
}

async function start() {
  try {
    console.log("Verificando e sincronizando o banco de dados...");

    // sequelize.sync() cria as tabelas SE ELAS NÃO EXISTIREM (seguro)
    await sequelize.sync();
    console.log("Banco de dados sincronizado com sucesso!");

    // ✨ CHAMA A FUNÇÃO DE SEED APÓS SINCRONIZAR ✨
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
