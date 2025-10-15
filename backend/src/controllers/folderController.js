import folder from "../models/folder.js";
import models from "../models/index.js";

export const getAllFolders = async (req, res) => {
  try {
    const folders = await models.Folder.findAll({ attributes: ["id", "name"] });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar pastas." });
  }
};

export const createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ error: "O nome da pasta é obrigatório." });
    const newFolder = await models.Folder.create({ name });
    res.status(201).json(newFolder);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar pasta." });
  }
};

export const updateFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const pastaToUpdate = await folder.Folder.findByPk(id);
    if (!pastaToUpdate)
      return res.status(400).json({ error: "Não foi encontrado a pasta." });
    else
      await pastaToUpdate.update({ name });
      
      res.status(201).json("Pasta editada com sucesso!");
  } catch (err) {
    res.status(500).json({ error: "Erro ao editar a pasta" });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ error: "O ID da pasta é obrigatório." });

    const folder = await models.Folder.findByPk(id);
    if (!folder) {
      return res.status(404).json({ error: "Pasta não encontrada." });
    }
    await folder.destroy();
    res.json({ message: "Pasta excluída com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir pasta." });
  }
};
