import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Tag = sequelize.define("Tags", {
    name: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.STRING, allowNull: true },
  });

  Tag.associate = (models) => {
    Tag.belongsTo(models.Document, { foreignKey: "documentId", as: "document" });
  };

  return Tag;
};
