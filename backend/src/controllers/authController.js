import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import models from "../models/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh123";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await models.User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email já registrado" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await models.User.create({
      username: name,
      email,
      password: hashed,
    });

    res.json({ message: "Usuário registrado com sucesso", user });
  } catch (err) {
    console.error("Erro register:", err);
    res.status(500).json({ error: "Erro no registro" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await models.User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Senha incorreta" });

    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // coloque true em produção com HTTPS
      sameSite: "strict",
    });

    res.json({ accessToken, user });
  } catch (err) {
    console.error("Erro login:", err);
    res.status(500).json({ error: "Erro no login" });
  }
};

export const refreshToken = (req, res) => {
  const token = req.cookies?.refreshToken; // importante colocar '?'

  if (!token) return res.status(401).json({ error: "Sem token de refresh" });

  jwt.verify(token, JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token inválido" });

    const newAccess = jwt.sign({ id: decoded.id }, JWT_SECRET, {
      expiresIn: "15m",
    });
    res.json({ accessToken: newAccess });
  });
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logout feito com sucesso" });
};

export const me = async (req, res) => {
  try {
    const user = await models.User.findByPk(req.user.id, {
      attributes: ["id", "username", "email"],
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};
