import { Router } from 'express';
import {
  createSolicitud,
  getSolicitudesCliente,
  getSolicitudesTrabajador,
  updateSolicitud,
  calificarSolicitud
} from '../controllers/solicitudes.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createSolicitud);
router.get('/cliente', authMiddleware, getSolicitudesCliente);
router.get('/trabajador', authMiddleware, getSolicitudesTrabajador);
router.put('/:id', authMiddleware, updateSolicitud);
router.post('/:id/calificar', authMiddleware, calificarSolicitud);

export default router;
