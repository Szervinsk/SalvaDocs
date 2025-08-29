import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Document = sequelize.define("Document", {
    name: { type: DataTypes.STRING, allowNull: false },
    path: { type: DataTypes.STRING, allowNull: false },
    model: { type: DataTypes.STRING, allowNull: true },
    templateName: { type: DataTypes.STRING, allowNull: true },
    uploadedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });

  Document.associate = (models) => {
    Document.hasMany(models.Tag, { foreignKey: "documentId", as: "tags" });
  };

  return Document;
};
