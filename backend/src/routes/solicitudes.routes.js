import { Router } from 'express';
import {
  createSolicitud,
  getSolicitudesCliente,
  getSolicitudesTrabajador,
  updateSolicitud,
  calificarSolicitud,
  enviarMensajeChat,
  getMensajesChat,
  completarSolicitud,
  subirEvidencia,
  getSolicitudById,
  uploadMiddleware
} from '../controllers/solicitudes.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, createSolicitud);
router.get('/cliente', authMiddleware, getSolicitudesCliente);
router.get('/trabajador', authMiddleware, getSolicitudesTrabajador);
router.get('/:id', authMiddleware, getSolicitudById);
router.put('/:id', authMiddleware, updateSolicitud);
router.post('/:id/chat', authMiddleware, enviarMensajeChat);
router.get('/:id/chat', authMiddleware, getMensajesChat);
router.post('/:id/completar', authMiddleware, completarSolicitud);
router.post('/:id/evidencia', authMiddleware, uploadMiddleware, subirEvidencia);
router.post('/:id/calificar', authMiddleware, calificarSolicitud);

export default router;
