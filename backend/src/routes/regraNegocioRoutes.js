import { Router } from "express";
import regraNegocioController from "../controllers/regraNegocioController.js";

const router = Router();

router.post("/regras", regraNegocioController.create);
router.get("/regras", regraNegocioController.showAll);
router.get("/regras/:id", regraNegocioController.showById);
router.put("/regras/update/:id", regraNegocioController.update);
router.delete("/regras/delete/:id", regraNegocioController.destroy);

// Vincular regra a empresas
router.post(
  "/regras/:regraId/empresas",
  regraNegocioController.vincularEmpresas
);

// Desvincular regra de uma empresa
router.delete(
  "/regras/:regraId/empresas/:empresaId",
  regraNegocioController.desvincularEmpresa
);

// Listar regras por empresa e setor
router.get(
  "/empresas/:empresaId/regras",
  regraNegocioController.listarPorEmpresa
);

export default router;
