import { Router } from 'express';
import { register, login, refreshToken, logout, getMe } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refreshToken);
router.post('/logout', verifyToken, logout);
router.get('/me', verifyToken, getMe);

export default router;
