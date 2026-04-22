import { Router } from 'express';
import { trackEvent, getAnalytics } from '../controllers/analytics.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { analyticsLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/event', analyticsLimiter, trackEvent);
router.get('/cards/:id', verifyToken, getAnalytics);

export default router;
