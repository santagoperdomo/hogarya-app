import { Router } from 'express';
import {
  getAllTrabajadores,
  getTrabajadorById,
  updateTrabajador,
  searchTrabajadores,
  getMisDatos
} from '../controllers/trabajadores.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllTrabajadores);
router.get('/buscar/:query', searchTrabajadores);
router.get('/mis-datos', authMiddleware, getMisDatos);
router.get('/:id', getTrabajadorById);
router.put('/:id', authMiddleware, updateTrabajador);

export default router;
