import { Router } from 'express';
import { updatePerfil } from '../controllers/perfil.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.put('/', authMiddleware, updatePerfil);

export default router;
