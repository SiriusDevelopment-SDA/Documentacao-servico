import sistemaController from "../controllers/sistemaController.js";

import { Router } from "express";

const router = Router();

router.get("/sistema", sistemaController.showAll);
router.post("/sistema", sistemaController.create);
router.get("/sistema/:id", sistemaController.showById);
router.get("/sistema/:id/erps", sistemaController.getErpsBySistemaId);

export default router
