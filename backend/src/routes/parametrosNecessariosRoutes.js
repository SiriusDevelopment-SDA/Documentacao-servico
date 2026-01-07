import { Router } from "express";
import parametrosNecessariosController from '../controllers/parametrosNecessariosController.js';

const router = Router();

router.post('/parametronecessario', parametrosNecessariosController.create);
router.get('/parametrosnecessarios', parametrosNecessariosController.showAll);
router.get('/parametronecessario/:id', parametrosNecessariosController.showById);
router.put('/parametronecessario/update/:id', parametrosNecessariosController.update);
router.delete('/parametronecessario/delete/:id', parametrosNecessariosController.destroy);

export default router;