import erpController from "../controllers/erpController.js"
import { Router } from "express";

const router = Router();    

router.get("/erp", erpController.showAll);
router.post("/erp", erpController.create);
router.get("/erp/:id", erpController.showById);
router.delete("/erp/:id", erpController.destroy);
router.get("/erps/:erpId/contratantes", erpController.getEmpresasByErp);


export default router;