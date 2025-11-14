import documentacaoController from "../controllers/documentacaoController.js";
import { Router } from "express";

const router = Router();    

router.get("/documentacao", documentacaoController.showAll);
router.post("/documentacao", documentacaoController.create);
router.get("/documentacao/:id", documentacaoController.showById);
router.delete("/documentacao/:id", documentacaoController.destroy);

export default router;