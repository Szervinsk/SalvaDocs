// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileRoutes from "./routes/fileRoutes.js";
import { sequelize } from "./models/index.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/api/files", fileRoutes);

// sincroniza models
sequelize.sync({ alter: true }).then(() => {
  console.log("Banco sincronizado com sucesso 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
