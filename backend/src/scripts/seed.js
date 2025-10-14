import { sequelize } from "../models/index.js";
import models from "../models/index.js";
import fs from "fs";
import path from "path";

(async () => {
  try {
    // -------------------------------------------------------------------
    // PASSO 1: APAGA E RECRIA TODAS AS TABELAS
    // O `{ force: true }` é o que limpa o banco de dados.
    // -------------------------------------------------------------------
    console.log("🔄 Sincronizando e recriando o banco de dados...");
    await sequelize.sync({ force: true });
    console.log("✅ Banco de dados limpo e sincronizado!");

    // -------------------------------------------------------------------
    // PASSO 2: CRIA AS PASTAS (FOLDERS) PADRÃO
    // Usamos 'findOrCreate' para evitar duplicatas se o script rodar de novo.
    // -------------------------------------------------------------------
    console.log("\n📁 Criando pastas padrão...");
    const pastasData = [
      { name: "Despachos" },
      { name: "Relatórios Gerais" },
      { name: "Documentos Internos" },
    ];
    for (const pasta of pastasData) {
      await models.Folder.findOrCreate({ where: { name: pasta.name } });
    }
    console.log("✅ Pastas criadas!");

    // -------------------------------------------------------------------
    // PASSO 3: CRIA OS MODELOS (MODELO) PADRÃO
    // 'upsert' funciona bem aqui para criar ou atualizar.
    // -------------------------------------------------------------------
    console.log("\n🤖 Criando modelos padrão...");
    const [despacho] = await models.Modelo.upsert({ name: "Despacho" });
    const [parecer] = await models.Modelo.upsert({ name: "Parecer" });
    const [programa] = await models.Modelo.upsert({ name: "Programa" });
    console.log("✅ Modelos criados!");

    // -------------------------------------------------------------------
    // PASSO 4: CRIA AS TAGS E ASSOCIA AOS MODELOS
    // Lê o JSON e popula a tabela TagBase, associando cada tag ao seu modelo.
    // -------------------------------------------------------------------
    console.log("\n🏷️ Criando e associando tags...");
    const tagsJSON = JSON.parse(
      fs.readFileSync(path.resolve("src/constants/tags.json"), "utf8")
    );

    for (const t of tagsJSON) {
      const [tag] = await models.TagBase.findOrCreate({
        where: { name: t.name },
        defaults: t,
      });

      // Lógica de associação
      if (t.category?.toLowerCase() === "despacho") {
        await despacho.addTagsBase(tag);
      }
      if (t.category?.toLowerCase() === "parecer") {
        await parecer.addTagsBase(tag);
      }
      if (t.category?.toLowerCase() === "programa") {
        await programa.addTagsBase(tag);
      }
    }
    console.log("✅ Tags criadas e associadas!");

    // -------------------------------------------------------------------
    // CONCLUSÃO
    // -------------------------------------------------------------------
    console.log("\n🏁 Processo de seed concluído com sucesso!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Erro durante o processo de seed:", err);
    process.exit(1);
  }
})();