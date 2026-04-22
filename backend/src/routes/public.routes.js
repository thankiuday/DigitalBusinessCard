import { Router } from 'express';
import { getPublicCard, downloadVCard } from '../controllers/public.controller.js';

const router = Router();

router.get('/:slug', getPublicCard);
router.get('/:slug/vcard', downloadVCard);

export default router;
