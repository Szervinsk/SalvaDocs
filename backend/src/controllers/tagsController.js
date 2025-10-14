// controllers/tagsController.js
import models from "../models/index.js";

// ROTA: GET /api/tags
// DESCRIÇÃO: Busca todas as tags base.
export const getAllTags = async (req, res) => {
  try {
    const tags = await models.TagBase.findAll({
      attributes: ["id", "name", "type", "icon", "regex", "prompt", "category"],
    });
    res.json(tags);
  } catch (err) {
    console.error("Erro ao buscar tags:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// ROTA: POST /api/tags
// DESCRIÇÃO: Cria uma nova tag base.
export const createTag = async (req, res) => {
  try {
    const newTag = await models.TagBase.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    console.error("Erro ao criar tag:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// ROTA: PUT /api/tags/:id
// DESCRIÇÃO: ATUALIZA uma tag existente.
export const updateTag = async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID da tag pela URL
    const tagToUpdate = await models.TagBase.findByPk(id);

    // Verifica se a tag existe
    if (!tagToUpdate) {
      return res.status(404).json({ error: "Tag não encontrada." });
    }

    // Atualiza a tag com os dados do corpo da requisição
    const updatedTag = await tagToUpdate.update(req.body);

    res.json(updatedTag);
  } catch (err) {
    console.error("Erro ao atualizar tag:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// ROTA: DELETE /api/tags/:id
// DESCRIÇÃO: EXCLUI uma tag existente.
export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID da tag pela URL
    const tagToDelete = await models.TagBase.findByPk(id);

    // Verifica se a tag existe
    if (!tagToDelete) {
      return res.status(404).json({ error: "Tag não encontrada." });
    }

    // Exclui a tag do banco de dados
    await tagToDelete.destroy();

    res.status(200).json({ message: "Tag excluída com sucesso." });
  } catch (err) {
    console.error("Erro ao excluir tag:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};