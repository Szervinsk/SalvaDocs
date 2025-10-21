import models from "../models/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Helper para obter o __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Esta é a lógica centralizada de população do banco de dados.
 * Ela assume que as tabelas JÁ EXISTEM (criadas pelo sequelize.sync()).
 */
export async function populateDatabase() {
  try {
    console.log("\n[Seed Logic] Iniciando população dos dados padrão...");

    // 1. Cria as Pastas Padrão
    console.log("📁 Criando pastas padrão...");
    const pastasData = [
      { name: "Despachos" },
      { name: "Relatórios Gerais" },
      { name: "Documentos" },
    ];
    await models.Folder.bulkCreate(pastasData);
    console.log("✅ Pastas criadas!");

    // 2. Cria os Modelos Padrão
    console.log("\n🤖 Criando modelos padrão...");
    const [despacho] = await models.Modelo.upsert({ name: "Despacho" });
    const [parecer] = await models.Modelo.upsert({ name: "Parecer" });
    const [programa] = await models.Modelo.upsert({ name: "Programa" });
    console.log("✅ Modelos criados!");

    // 3. Cria as Tags e Associa aos Modelos
    console.log("\n🏷️ Criando e associando tags...");
    // Ajuste o caminho aqui se a pasta 'constants' estiver em outro lugar
    const tagsPath = path.resolve(__dirname, '../constants/tags.json'); 
    
    if (fs.existsSync(tagsPath)) {
      const tagsJSON = JSON.parse(fs.readFileSync(tagsPath, "utf8"));
      for (const t of tagsJSON) {
        const [tag] = await models.TagBase.findOrCreate({
          where: { name: t.name },
          defaults: t,
        });

        // Lógica de associação
        if (t.category?.toLowerCase() === "despacho") {
          await despacho.addTagsBase(tag);
        }
        if (t.category?.toLowerCase() === "parecer" || t.category?.toLowerCase() === "norma") {
          await parecer.addTagsBase(tag);
        }
        if (t.category?.toLowerCase() === "programa") {
          await programa.addTagsBase(tag);
        }
      }
      console.log("✅ Tags criadas e associadas!");
    } else {
      console.warn(`[Seed Logic] Aviso: 'tags.json' não encontrado em ${tagsPath}. As tags não foram populadas.`);
    }

    console.log("\n🏁 [Seed Logic] População concluída!");

  } catch (err) {
    console.error("❌ Erro durante a lógica de população:", err);
    throw err; // Lança o erro para o chamador (server.js ou seed.js) tratar
  }
}