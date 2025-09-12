// models/index.js
import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

import DocumentModel from "./documentos.js";
import ModeloDef from "./modelos.js";
import TagInstanceDef from "./tagInstance.js";
import TagBaseDef from "./tagBase.js";
import UserModel from "./user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(process.cwd(), "database.sqlite"),
  logging: false,
});

// models/index.js
const models = {
  Document: DocumentModel(sequelize),
  Modelo: ModeloDef(sequelize),
  TagInstance: TagInstanceDef(sequelize),
  TagBase: TagBaseDef(sequelize),
  User: UserModel(sequelize),
};

// chama associate de todos os models
Object.values(models).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

export { sequelize };
export default models;
