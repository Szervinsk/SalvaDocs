import { sequelize } from "../models/index.js";

(async () => {
  try {
    await sequelize.query("PRAGMA foreign_keys = OFF;");
    await sequelize.sync({ force: true });
    await sequelize.query("PRAGMA foreign_keys = ON;");

    console.log("Banco sincronizado e tabelas criadas!");
    process.exit();
  } catch (err) {
    console.error(err);
  }
})();
