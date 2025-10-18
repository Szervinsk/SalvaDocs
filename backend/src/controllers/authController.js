// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import models from "../models/index.js";

import { JWT_SECRET, JWT_REFRESH_SECRET } from "../config/jwt.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body; // Alterado de 'name' para 'username'

    const existing = await models.User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email já registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await models.User.create({
      username,
      email,
      password: hashedPassword,
    });

    const userResponse = user.toJSON();
    delete userResponse.password; // Nunca retorne o hash da senha

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
    const { email, password } = req.body;
    const user = await models.User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ error: "Credenciais inválidas" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Credenciais inválidas" });

    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true em produção (HTTPS)
      sameSite: "strict",
      path: "/api/auth", // Escopo do cookie para as rotas de autenticação
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
  res.clearCookie("refreshToken", { path: "/api/auth" });
  res.status(200).json({ message: "Logout realizado com sucesso" });
};''

export const me = async (req, res) => {
  try {
    // req.user é fornecido pelo authMiddleware
    const user = await models.User.findByPk(req.user.id, {
      attributes: ["id", "username", "email", "createdAt"], // Nunca inclua a senha
    });
    if (!user)
      return res.status(404).json({ error: "Usuário não encontrado." });

    res.json(user);
  } catch (err) {
    console.error("Erro ao buscar dados do usuário:", err);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};