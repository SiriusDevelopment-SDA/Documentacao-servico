import express from "express";
import cors from "cors";
import prismaClient from "./prismaClient.js";
import "dotenv/config";

import documentacaoRoutes from "./routes/documentacaoRoutes.js";
import erpRoutes from "./routes/erpRoutes.js";
import servicoRoutes from "./routes/servicoRoutes.js";
import servicoDesejadoRoutes from "./routes/servicoDesejadoRoutes.js";
import sistemaRoutes from "./routes/sistemaRoutes.js";
import nomeServicoRoutes from "./routes/nomeServicoRoutes.js";
import empresaRoutes from "./routes/empresaRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());

// uploads funcionando em ES Module
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "..", "uploads"))
);

app.use("/api", documentacaoRoutes);
app.use("/api", erpRoutes);
app.use("/api", servicoRoutes);
app.use("/api", servicoDesejadoRoutes);
app.use("/api", sistemaRoutes);
app.use("/api", nomeServicoRoutes);
app.use("/api", empresaRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
