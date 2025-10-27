import express from "express";
import cors from "cors";
import prisma from "./prismaClient.js";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/teste", (req, res) => {
  res.send("Servidor rodando com sucesso!");
});


const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});