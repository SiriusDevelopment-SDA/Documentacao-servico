import documentacaoController from "../controllers/documentacaoController.js";
import { Router } from "express";

const router = Router();

// Rota para criar documentação
router.post("/documentacao", documentacaoController.create);

// Rota para associar ERP à documentação
router.patch("/documentacao/associar-erp", documentacaoController.associateErp);  // PATCH para associar ERP

// Outras rotas de visualização
router.get("/documentacao", documentacaoController.showAll);
router.get("/documentacao/:id", documentacaoController.showById);
router.delete("/documentacao/:id", documentacaoController.destroy);

export default router;
