import { sequelize } from "../models/index.js";
import { populateDatabase } from "./seedLogic.js"; // Importa a lógica central

(async () => {
  try {
    // -------------------------------------------------------------------
    // PASSO 1: APAGA E RECRIA TODAS AS TABELAS
    // -------------------------------------------------------------------
    console.log(
      "🔄 Sincronizando e recriando o banco de dados... (force: true)"
    );
    await sequelize.sync({ force: true });
    console.log("✅ Banco de dados limpo e sincronizado!");

    // -------------------------------------------------------------------
    // PASSO 2: CHAMA A LÓGICA DE POPULAÇÃO
    // -------------------------------------------------------------------
    await populateDatabase();

    console.log("\n🏁 Processo de seed (reset) concluído com sucesso!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro no script de seed (reset):", err);
    process.exit(1);
  }
})();
