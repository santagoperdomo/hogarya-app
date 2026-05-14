import { Router } from 'express';
import { marcarCompletado, agregarEvidencias, agregarResena } from '../controllers/trabajo.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.put('/:solicitud_id/completar', authMiddleware, marcarCompletado);
router.post('/:solicitud_id/evidencias', authMiddleware, agregarEvidencias);
router.post('/:solicitud_id/resena', authMiddleware, agregarResena);

export default router;
