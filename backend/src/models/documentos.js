// models/documentos.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Document = sequelize.define("Document", {
    name: { type: DataTypes.STRING, allowNull: false },
    path: { type: DataTypes.STRING, allowNull: false },
    model: { type: DataTypes.STRING },
    templateName: { type: DataTypes.STRING },
    ownerId: { type: DataTypes.INTEGER },
  });

  Document.associate = (models) => {
    // associação com TagInstance (instâncias por documento)
    Document.hasMany(models.TagInstance, {
      as: "tags",
      foreignKey: "documentId",
      onDelete: "CASCADE",
      hooks: true,
    });

    // se quiser, associar outro relacionamento aqui
  };

  return Document;
};
