// controllers/tagsController.js
import models from "../models/index.js";

export const getAllTags = async (req, res) => {
  try {
    const tags = await models.TagBase.findAll({
      attributes: ["id", "name", "type", "icon", "regex","prompt", "category"],
    });

    res.json(tags);
  } catch (err) {
    console.error("Erro ao buscar tags:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
