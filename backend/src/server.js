import express from "express";
import cors from "cors";
import prismaClient from "./prismaClient.js";
import "dotenv/config";
import documentacaoRoutes from "./routes/documentacaoRoutes.js";
import erpRoutes from "./routes/erpRoutes.js"

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", documentacaoRoutes);
app.use("/api", erpRoutes);

app.get("/teste", (req, res) => {
  res.send("Servidor rodando com sucesso!");
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});