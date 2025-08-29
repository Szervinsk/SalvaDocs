import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Tag = sequelize.define("Tag", {
    name: { type: DataTypes.STRING, allowNull: false },   // Ex: "SEI"
    icon: { type: DataTypes.STRING, allowNull: true },    // Ícone opcional
    type: { type: DataTypes.STRING, allowNull: false },   // regex | ia | manual
    value: { type: DataTypes.TEXT, allowNull: true },     // Valor capturado
  });

  Tag.associate = (models) => {
    Tag.belongsTo(models.Document, { foreignKey: "documentId", as: "document" });
  };

  return Tag;
};
