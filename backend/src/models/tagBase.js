// models/tagBase.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const TagBase = sequelize.define("TagBase", {
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    icon: { type: DataTypes.STRING },
    regex: { type: DataTypes.STRING },
    prompt: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    displayCategory: { type: DataTypes.STRING },
  });
  TagBase.associate = (models) => {
    TagBase.belongsToMany(models.Modelo, {
      through: "ModeloTags",
      as: "modelos",
      onDelete: "CASCADE",
      hooks: true,
    });
  };

  return TagBase;
};
