import { Router } from "express";
import servicoDesejadoController from "../controllers/servicoDesejadoController.js";

const router = Router();

router.post("/servicos-desejados", servicoDesejadoController.create);
router.get("/servicos-desejados/:documentacaoId", servicoDesejadoController.list);

export default router;
