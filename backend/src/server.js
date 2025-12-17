import express from "express";
import cors from "cors";
import prismaClient from "./prismaClient.js";
import "dotenv/config";
import documentacaoRoutes from "./routes/documentacaoRoutes.js";
import erpRoutes from "./routes/erpRoutes.js"
import servicoRoutes from "./routes/servicoRoutes.js"
import servicoDesejadoRoutes from "./routes/servicoDesejadoRoutes.js";
import sistemaRoutes from "./routes/sistemaRoutes.js"
import nomeServicoRoutes from "./routes/nomeServicoRoutes.js";
import path from "path";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api", documentacaoRoutes);
app.use("/api", erpRoutes);
app.use("/api", servicoRoutes);
app.use("/api", servicoDesejadoRoutes);
app.use("/api", sistemaRoutes);
app.use("/api", nomeServicoRoutes);


const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});