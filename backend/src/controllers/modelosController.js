// controllers/modelosController.js
import models from "../models/index.js";

export const getAllModelos = async (req, res) => {
  try {
    const modelo = await models.Modelo.findAll({
      attributes: ["id","name","description"],
    });

    res.json(modelo)
  } catch (err) {
    console.error("Erro ao buscar os modelos", err)
    res.status(500 ).json({error: "Erro interno do servidor"})
  }
}

// GET /api/models/:id -> retorna o modelo e suas tags associadas
export const getModelos = async (req, res) => {
  try {
    const { id } = req.params; // <-- aqui está o id da URL

    const modelo = await models.Modelo.findByPk(id, {
      include: [
        {
          model: models.TagBase,
          as: "tagsBase", // ✅ tem que bater com o alias do Modelo
        },
      ],
    });

    if (!modelo) {
      return res.status(404).json({ error: "Modelo não encontrado" });
    }

    res.json(modelo);
  } catch (err) {
    console.error("Erro ao buscar modelo:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// POST /api/models -> cria novo modelo
export const createModelo = async (req, res) => {
  try {
    const modelo = await models.Modelo.create(req.body);
    res.status(201).json(modelo);
  } catch (err) {
    console.error("Erro ao criar modelo:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// PUT /api/models/:id/tags -> atualiza as tags do modelo
export const updateModeloTags = async (req, res) => {
  try {
    const { id } = req.params;
    const { tagIds } = req.body; // array de ids de tags

    const modelo = await models.Modelo.findByPk(id);
    if (!modelo)
      return res.status(404).json({ error: "Modelo não encontrado" });

    await modelo.setTags(tagIds); // Sequelize cria/atualiza as relações
    const modeloComTags = await models.Modelo.findByPk(id, {
      include: [{ model: models.Tag, through: { attributes: [] } }],
    });

    res.json(modeloComTags);
  } catch (err) {
    console.error("Erro ao atualizar tags do modelo:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
