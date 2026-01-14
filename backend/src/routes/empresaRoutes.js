import { Router } from 'express';
import empresaController from '../controllers/empresaController.js';

const router = Router();

router.post('/empresa', empresaController.create);
router.get('/empresa', empresaController.showAll);
router.get('/empresa/:id', empresaController.showById);
router.put('/empresa/update/:id', empresaController.update);
router.delete('/empresa/delete/:id', empresaController.destroy);
router.get("/empresas/last", empresaController.getLast);

export default router;
