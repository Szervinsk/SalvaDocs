import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import models, { sequelize } from "../models/index.js";
import { JWT_SECRET, JWT_REFRESH_SECRET } from "../config/jwt.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, empresa } = req.body;

    const existing = await models.User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email já registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await models.User.create({
      username,
      email,
      password: hashedPassword,
      empresa: empresa || null, // Agora a variável 'empresa' existe e será usada corretamente
    });

    const userResponse = user.toJSON();
    delete userResponse.password;

    res
      .status(201)
      .json({ message: "Usuário registrado com sucesso", user: userResponse });
  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await models.User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ error: "Credenciais inválidas" }); // não possui usuário com esse email

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Credenciais inválidas" });

    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
      expiresIn: rememberMe ? "7d" : "1h",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
    });

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({ accessToken, user: userResponse });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const refreshToken = (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token)
    return res.status(401).json({ error: "Refresh token não encontrado" });

  jwt.verify(token, JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Refresh token inválido" });
    const newAccessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, {
      expiresIn: "15m",
    });
    res.json({ accessToken: newAccessToken });
  });
};

export const logout = (req, res) => {
  res.clearCookie("refresh-Token", { path: "/api/auth" });
  res.status(200).json({ message: "Logout realizado com sucesso" });
};

// Função 'me' corrigida para usar o 'sequelize' importado
export const me = async (req, res) => {
  try {
    const user = await models.User.findByPk(req.user.id, {
      attributes: [
        "id", "username", "email", "createdAt", "empresa", "welcomeDismissed",
        [sequelize.literal("apiKey IS NOT NULL"), "hasApiKey"],
      ],
    });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
    
    // 1. Busca os modelos favoritos deste usuário
    const favoritos = await user.getFavoriteModels({ attributes: ['id'] });
    // 2. Transforma o array de objetos em um array de IDs
    const favoriteModelIds = favoritos.map(f => f.id);

    // 3. Envia o usuário E a lista de favoritos
    res.json({ ...user.toJSON(), favoriteModelIds });

  } catch (err) {
    console.error("Erro ao buscar dados do usuário:", err);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
}
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await models.User.findOne({ where: { email }});
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Senha redefinida com sucesso!" })
  } catch (err) {
      res.status(500).json({ error: "Erro ao definir senha."})
  }
}