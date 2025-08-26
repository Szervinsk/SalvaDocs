import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Document = sequelize.define("Documents", {
  name: { type: DataTypes.STRING, allowNull: false },
  path: { type: DataTypes.STRING, allowNull: false },
  model: { type: DataTypes.STRING, allowNull: true },
  templateName: { type: DataTypes.STRING, allowNull: true }, // <--- novo
  uploadedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

  Document.associate = (models) => {
    Document.hasMany(models.Tag, { foreignKey: "documentId", as: "tags" });
  };

  return Document;
};
