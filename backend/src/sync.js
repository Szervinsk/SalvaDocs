import { sequelize } from "./models/index.js";

(async () => {
  try {
    await sequelize.sync({ force: true }); // força recriar todas as tabelas
    console.log("Banco sincronizado e tabelas criadas!");
    process.exit();
  } catch (err) {
    console.error(err);
  }
})();
