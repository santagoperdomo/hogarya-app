import { Router } from 'express';
import { createReseña, getReseñasByTrabajador } from '../controllers/reseñas.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createReseña);
router.get('/:trabajador_id', getReseñasByTrabajador);

export default router;
