import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileRoutes from "./routes/fileRoutes.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/api/files", fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
