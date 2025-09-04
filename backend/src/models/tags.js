import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Tag = sequelize.define("Tag", {
    name: { type: DataTypes.STRING, allowNull: false },
    icon: { type: DataTypes.STRING, allowNull: true },
    type: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.TEXT, allowNull: true },
    documentId: {                        // 🔹 adicionar campo aqui
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Documents",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });

  Tag.associate = (models) => {
    Tag.belongsTo(models.Document, { foreignKey: "documentId", as: "document" });
  };

  return Tag;
};
