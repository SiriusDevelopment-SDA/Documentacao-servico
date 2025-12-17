import nomeServicoController from "../controllers/nomeServicoController.js";
import { Router } from "express";

const router = Router();

router.post("/nome", nomeServicoController.create);
router.get("/nome", nomeServicoController.showAll);
router.get("/nome/:id", nomeServicoController.showById);
router.delete("/nome/delete/:id", nomeServicoController.destroy);
router.put("/nome/update/:id", nomeServicoController.update);

export default router;