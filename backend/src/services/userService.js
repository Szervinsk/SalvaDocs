const bcrypt = require("bcrypt");
const { User } = require("../models");

async function createUser({ email, password, name, forWork }) {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  return User.create({ email, passwordHash, name, forWork });
}

async function findByEmail(email) {
  return User.findOne({ where: { email } });
}

async function setRefreshHash(userId, refreshTokenHash) {
  const u = await User.findByPk(userId);
  u.refreshTokenHash = refreshTokenHash;
  await u.save();
}

async function clearRefreshHash(userId) {
  const u = await User.findByPk(userId);
  if (!u) return;
  u.refreshTokenHash = null;
  await u.save();
}

module.exports = { createUser, findByEmail, setRefreshHash, clearRefreshHash };
