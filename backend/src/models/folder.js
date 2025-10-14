import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Folder = sequelize.define("Folder", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Garante que não hajam pastas com nomes duplicados
    },
    // Você pode adicionar outros campos no futuro, como 'description', 'icon', etc.
  });

  Folder.associate = (models) => {
    // Uma Pasta (Folder) pode ter muitos Documentos (hasMany)
    Folder.hasMany(models.Document, {
      foreignKey: "folderId", // Esta será a chave estrangeira na tabela de Documentos
      as: "documents",
    });
  };

  return Folder;
};