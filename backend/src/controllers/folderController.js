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
    if (!name) return res.status(400).json({ error: "O nome da pasta é obrigatório." });
    const newFolder = await models.Folder.create({ name });
    res.status(201).json(newFolder);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar pasta." });
  }
};
// ... (você pode adicionar update e delete aqui, seguindo o padrão do tagsController)

