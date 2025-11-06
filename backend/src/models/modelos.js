import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Modelo = sequelize.define("Modelo", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  });

  Modelo.associate = (models) => {
    Modelo.belongsToMany(models.TagBase, {
      through: "ModeloTags",
      as: "tagsBase",
      onDelete: "CASCADE",
      hooks: true,
    });

    Modelo.belongsToMany(models.User, {
      through: "UserFavoriteModels", // Mesma tabela de junção
      as: "favoritedBy", // Alias para ver quem favoritou
      foreignKey: "modeloId",
    });
  };

  return Modelo;
};