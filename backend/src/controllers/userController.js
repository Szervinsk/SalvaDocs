import models from "../models/index.js";

// ROTA: PUT /api/users/:id
// DESCRIÇÃO: Atualiza os dados de um usuário (username, email).
export const updateUser = async (req, res) => {
  try {
    // O ID do usuário vem do token JWT, garantindo que ele só possa editar a si mesmo.
    const userId = req.user.id; 
    const { username, email } = req.body;

    const user = await models.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Atualiza os campos
    user.username = username || user.username;
    user.email = email || user.email;
    
    await user.save();

    // Retorna o usuário atualizado (sem a senha)
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json(userResponse);
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    res.status(500).json({ error: "Erro interno ao atualizar usuário." });
  }
};


// ROTA: DELETE /api/users/:id
// DESCRIÇÃO: Deleta a conta de um usuário.
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await models.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    await user.destroy();

    // Limpa o cookie de refresh token ao deletar a conta
    res.clearCookie("refreshToken", { path: '/api/auth' });
    res.status(200).json({ message: "Usuário deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar usuário:", err);
    res.status(500).json({ error: "Erro interno ao deletar usuário." });
  }
};