import models from "../models/index.js";
import bcrypt from "bcryptjs";

// ROTA: PUT /api/users/:id
// DESCRIÇÃO: Atualiza os dados de um usuário (username, email).
export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, empresa, apiKey } = req.body;

    const user = await models.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Atualiza apenas os campos fornecidos
    if (username) user.username = username;
    if (empresa !== undefined) user.empresa = empresa;
    if (apiKey) user.apiKey = apiKey; // Salva a nova chave API

    await user.save();

    const userResponse = user.toJSON();

    userResponse.hasApiKey = !!user.apiKey;

    delete userResponse.password;
    delete userResponse.apiKey; // Nunca retorne a chave API completa

    res.json(userResponse);
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    res.status(500).json({ error: "Erro interno ao atualizar usuário." });
  }
};

// ROTA: PUT /api/users/welcome
// DESCRIÇÃO: Marca a tela de boas-vindas como vista.
export const dismissWelcome = async (req, res) => {
  try {
    const userId = req.user.id;
    await models.User.update(
      { welcomeDismissed: true },
      { where: { id: userId } }
    );
    res.status(200).json({ message: "Boas-vindas dispensado com sucesso." });
  } catch (err) {
    console.error("Erro ao dispensar boas-vindas:", err);
    res.status(500).json({ error: "Erro interno." });
  }
};

// ROTA: PUT /api/users/welcome/reset
// DESCRIÇÃO: Reseta o status, fazendo a tela de boas-vindas aparecer novamente.
export const resetWelcome = async (req, res) => {
  try {
    const userId = req.user.id;
    await models.User.update(
      { welcomeDismissed: false }, // Define o valor como 'false'
      { where: { id: userId } }
    );
    res
      .status(200)
      .json({ message: "Status de boas-vindas resetado com sucesso." });
  } catch (err) {
    console.error("Erro ao resetar boas-vindas:", err);
    res.status(500).json({ error: "Erro interno." });
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
    res.clearCookie("refreshToken", { path: "/api/auth" });
    res.status(200).json({ message: "Usuário deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar usuário:", err);
    res.status(500).json({ error: "Erro interno ao deletar usuário." });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Pega o ID do token JWT
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // 1. Validação básica dos campos
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "As senhas atual e nova são obrigatórias." });
    }

    if (newPassword !== confirmNewPassword) {
       return res.status(400).json({ error: "A confirmação da nova senha não confere." });
    }

    // 2. Busca o usuário no banco (incluindo a senha hashada)
    const user = await models.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // 3. Segurança: Verifica se a senha ATUAL informada está correta
    // O método compare verifica se 'currentPassword' bate com o hash no banco
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "A senha atual está incorreta." });
    }

    // 4. Criptografa a NOVA senha
    // OBS: Se o seu Model do Sequelize já tiver um 'hook' (beforeSave) que faz o hash automático,
    // você pode pular essa linha do bcrypt.hash e apenas atribuir user.password = newPassword.
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 5. Salva a nova senha
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Senha alterada com sucesso." });

  } catch (err) {
    console.error("Erro ao alterar senha:", err);
    res.status(500).json({ error: "Erro interno ao alterar senha." });
  }
};