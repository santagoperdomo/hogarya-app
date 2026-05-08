import { Router } from 'express';
import { updatePerfil } from '../controllers/perfil.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.put('/', authMiddleware, updatePerfil);

export default router;
