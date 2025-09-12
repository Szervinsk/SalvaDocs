import { sequelize } from "../models/index.js";
import models from "../models/index.js";
import fs from "fs";
import path from "path";

(async () => {
  try {
    await sequelize.sync(); // garante tabelas, não apaga nada

    // 1️⃣ Cria ou atualiza modelos
    const despacho = await models.Modelo.upsert({ name: "Despacho" });
    const parecer = await models.Modelo.upsert({ name: "Parecer" });
    const programa = await models.Modelo.upsert({ name: "Programa" });

    // 2️⃣ Lê JSON de tags
    const tagsJSON = JSON.parse(
      fs.readFileSync(path.resolve("src/constants/tags.json"), "utf8")
    );

    // 3️⃣ Cria/atualiza TagBase e associa
    for (const t of tagsJSON) {
      const [tag] = await models.TagBase.findOrCreate({
        where: { name: t.name },
        defaults: t,
      });

      if (t.category.toLowerCase() === "despacho") {
        await despacho[0].addTagsBase(tag);
        console.log(`Associação: ${t.name} -> Despacho`);
      }
      if (t.category.toLowerCase() === "parecer") {
        await parecer[0].addTagsBase(tag);
        console.log(`Associação: ${t.name} -> Parecer`);
      }
      if (t.category.toLowerCase() === "programa") {
        await programa[0].addTagsBase(tag);
        console.log(`Associação: ${t.name} -> Programa`);
      }
    }

    console.log("✅ Seed concluído!");
    process.exit();
  } catch (err) {
    console.error("❌ Erro no seed:", err);
    process.exit(1);
  }
})();
