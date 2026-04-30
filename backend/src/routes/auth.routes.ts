import { Router } from 'express';
import { signup, login, getSession } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/session', authMiddleware, getSession);

export default router;
