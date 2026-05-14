import { Router } from 'express';
import { enviarMensaje, obtenerChat } from '../controllers/chat.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/:solicitud_id/mensaje', authMiddleware, enviarMensaje);
router.get('/:solicitud_id', authMiddleware, obtenerChat);

export default router;
