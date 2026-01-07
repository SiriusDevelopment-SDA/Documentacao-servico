import { Router } from 'express';
import parametrosPadronizadoscontroller from '../controllers/parametrosPadronizadoscontroller.js';

const router = Router();

router.post('/parametro', parametrosPadronizadoscontroller.create);
router.get('/parametros', parametrosPadronizadoscontroller.showAll);
router.get('/parametro/:id', parametrosPadronizadoscontroller.showById);
router.put('/parametro/update/:id', parametrosPadronizadoscontroller.update);
router.delete('/parametro/delete/:id', parametrosPadronizadoscontroller.destroy);

export default router;