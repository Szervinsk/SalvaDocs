import { Sequelize } from "sequelize";
import DocumentModel from "./documentos.js";
import TagModel from "./tags.js";
import path from "path";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(process.cwd(), "database.sqlite"), // criado automaticamente
  logging: console.log,
});

const models = {
  Document: DocumentModel(sequelize),
  Tag: TagModel(sequelize),
};

// Associações
Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

export { sequelize };
export default models;
