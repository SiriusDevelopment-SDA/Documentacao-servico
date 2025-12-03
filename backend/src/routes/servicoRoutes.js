import { Router } from "express";
import servicoController from "../controllers/servicoController.js";

const router = Router();

router.post("/servico", servicoController.create);
router.get("/servico", servicoController.showAll);
router.get("/servico/:id", servicoController.showById);
router.put("/servico/:id", servicoController.update);
router.delete("/servico/delete/:id", servicoController.destroy);

export default router;
