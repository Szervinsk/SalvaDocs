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
    password: { type: DataTypes.STRING, allowNull: false },
    empresa: { type: DataTypes.STRING, allowNull: true },
    welcomeDismissed: { type: DataTypes.BOOLEAN, defaultValue: false },
    apiKey: { type: DataTypes.STRING, allowNull: true },
  });

  User.associate = (models) => {
    User.hasMany(models.Document, { foreignKey: "ownerId", as: "documents" });

    User.belongsToMany(models.Modelo, {
      through: "UserFavoriteModels", // Nome da tabela de junção
      as: "favoriteModels", // Alias para acessar os modelos favoritos
      foreignKey: "userId",
    });
  };

  return User;
};