import models from "../models/index.js";

// GET /api/modelos -> Retorna TODOS os modelos com suas tags
export const getAllModelos = async (req, res) => {
  try {
    const modelos = await models.Modelo.findAll({
      attributes: ["id", "name", "description"],
      include: [{
        model: models.TagBase,
        as: "tagsBase",
        attributes: ["id", "name"],
        through: { attributes: [] }
      }],
      order: [['name', 'ASC']],
    });
    res.json(modelos);
  } catch (err) {
    console.error("Erro ao buscar os modelos:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// GET /api/modelos/:id -> Retorna UM modelo específico com suas tags
export const getModelos = async (req, res) => {
  try {
    const { id } = req.params;
    const modelo = await models.Modelo.findByPk(id, {
      include: [{
        model: models.TagBase,
        as: "tagsBase",
        attributes: ["id", "name", "type", "icon", "regex", "prompt", "category", "displayCategory"],
        through: { attributes: [] },
      }],
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

// POST /api/modelos/create -> Cria um novo modelo
export const createModelo = async (req, res) => {
  try {
    const { name, description, tagIds } = req.body;
    const newModelo = await models.Modelo.create({ name, description });

    if (tagIds && tagIds.length > 0) {
      await newModelo.setTagsBase(tagIds);
    }

    // Retorna o modelo recém-criado com suas associações
    const result = await models.Modelo.findByPk(newModelo.id, {
        include: [{ model: models.TagBase, as: 'tagsBase', through: { attributes: [] } }]
    });

    res.status(201).json(result);
  } catch (err) {
    console.error("Erro ao criar modelo:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// PUT /api/modelos/:id -> Atualiza um modelo existente
export const updateModelo = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, tagIds } = req.body;

    const modelo = await models.Modelo.findByPk(id);
    if (!modelo) {
      return res.status(404).json({ error: "Modelo não encontrado" });
    }

    await modelo.update({ name, description });

    if (Array.isArray(tagIds)) {
      await modelo.setTagsBase(tagIds);
    }
    
    const updatedModelo = await models.Modelo.findByPk(id, {
        include: [{ model: models.TagBase, as: 'tagsBase', through: { attributes: [] } }]
    });

    res.json(updatedModelo);
  } catch (err) {
    console.error("Erro ao atualizar modelo:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// DELETE /api/modelos/:id -> Exclui um modelo
export const deleteModelo = async (req, res) => {
    try {
        const { id } = req.params;
        const modelo = await models.Modelo.findByPk(id);
        if (!modelo) {
            return res.status(404).json({ error: "Modelo não encontrado" });
        }
        await modelo.destroy();
        res.status(200).json({ message: "Modelo excluído com sucesso." });
    } catch (err) {
        console.error("Erro ao excluir modelo:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};