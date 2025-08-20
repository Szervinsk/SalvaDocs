import express from "express";
import dotenv from "dotenv";
import fileRoutes from "./routes/fileRoutes";

dotenv.config();
const app = express();

app.use(express.json());

// Rotas de upload/análise
app.use("/api/files", fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
