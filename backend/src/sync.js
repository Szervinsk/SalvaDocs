import { sequelize } from "./models/index.js";

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Banco sincronizado e tabelas criadas!");
    process.exit();
  } catch (err) {
    console.error(err);
  }
})();
