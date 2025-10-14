import express from "express";
import {
  getAllModelos,
  getModelos,
  createModelo,
  updateModelo,
  deleteModelo,
} from "../controllers/modelosController.js";

const router = express.Router();

// MÉTODO: GET
// ROTA: /api/modelos
// DESCRIÇÃO: Retorna a lista de todos os modelos com suas tags associadas.
router.get("/", getAllModelos);

// MÉTODO: GET
// ROTA: /api/modelos/:id
// DESCRIÇÃO: Retorna um modelo específico pelo seu ID.
router.get("/:id", getModelos);

// MÉTODO: POST
// ROTA: /api/modelos
// DESCRIÇÃO: Cria um novo modelo.
// (Removido o "/create" para seguir o padrão REST)
router.post("/", createModelo);

// MÉTODO: PUT
// ROTA: /api/modelos/:id
// DESCRIÇÃO: Atualiza um modelo existente (nome, descrição e tags).
router.put("/:id", updateModelo);

// MÉTODO: DELETE
// ROTA: /api/modelos/:id
// DESCRIÇÃO: Exclui um modelo existente.
router.delete("/:id", deleteModelo);

export default router;
