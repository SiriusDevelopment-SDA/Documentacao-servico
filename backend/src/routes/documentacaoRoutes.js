import documentacaoController from "../controllers/documentacaoController.js";
import { Router } from "express";

const router = Router();

// CRUD
router.post("/documentacoes", documentacaoController.create);
router.get("/documentacoes", documentacaoController.showAll);
router.get("/documentacoes/:id", documentacaoController.showById);
router.delete("/documentacoes/:id", documentacaoController.destroy);

// ✅ Associar ERP à documentação (depois de criar)
router.patch("/documentacoes/:id/associar-erp", documentacaoController.associateErp);

export default router;
