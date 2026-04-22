import { Router } from 'express';
import { uploadCardVideo, uploadImage } from '../controllers/upload.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { upload, uploadVideoMw } from '../middleware/upload.middleware.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/image', verifyToken, uploadLimiter, upload.single('image'), uploadImage);
router.post('/video', verifyToken, uploadLimiter, uploadVideoMw.single('video'), uploadCardVideo);

export default router;
