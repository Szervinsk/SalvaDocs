// src/models/user.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING, allowNull: false }, // Senha do usuário
    empresa: {
      type: DataTypes.STRING,
      allowNull: true, // Empresa é opcional
    },
    welcomeDismissed: {
      type: DataTypes.BOOLEAN, defaultValue: false, // Começa como 'false', indicando que o welcome não foi dispensado
    },
    apiKey: {
      type: DataTypes.STRING, // Armazenará a chave de API do Gemini do usuário
      allowNull: true, // A chave pode ser adicionada depois'
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Document, { foreignKey: "ownerId", as: "documents" });
  };

  return User;
};
