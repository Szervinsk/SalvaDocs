import { Sequelize } from "sequelize";
import DocumentModel from "./documentos.js";
import TagModel from "./tags.js";
import UserModel from "./user.js";
import path from "path";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(process.cwd(), "database.sqlite"),
  logging: console.log,
});

const models = {
  Document: DocumentModel(sequelize),
  Tag: TagModel(sequelize),
  User: UserModel(sequelize),
};

// associações
Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

export { sequelize };
export default models;
