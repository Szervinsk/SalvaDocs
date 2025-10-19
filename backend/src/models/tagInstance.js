// models/tagInstance.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const TagInstance = sequelize.define("TagInstance", {
    name: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.TEXT },
    type: { type: DataTypes.STRING },
    icon: { type: DataTypes.STRING },
    documentId: { type: DataTypes.INTEGER },
    displayCategory: { type: DataTypes.STRING },
  });

  TagInstance.associate = (models) => {
    TagInstance.belongsTo(models.Document, {
      foreignKey: "documentId",
      onDelete: "CASCADE",
    });
  };

  return TagInstance;
};
