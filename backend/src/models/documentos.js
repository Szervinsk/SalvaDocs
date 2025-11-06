// models/documentos.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Document = sequelize.define("Document", {
    name: { type: DataTypes.STRING, allowNull: false },
    path: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.INTEGER },
    model: { type: DataTypes.STRING },
    templateName: { type: DataTypes.STRING },

    // endereçamento 
    ownerId: { type: DataTypes.INTEGER },
    folderId: { type: DataTypes.INTEGER },
    
    // campos para análise
    status: {
      type: DataTypes.ENUM("Completo", "Parcial", "Erro"),
      defaultValue: "Parcial",
    },
    tagsTotal: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    tagsFound: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  Document.associate = (models) => {
    Document.hasMany(models.TagInstance, {
      foreignKey: "documentId",
      as: "tags",
      onDelete: "CASCADE",
    });
    Document.belongsTo(models.Folder, {
      foreignKey: "folderId",
      as: "folder",
    });
    // ... (outras associações, como a de 'ownerId' com 'User')
  };

  return Document;
};
