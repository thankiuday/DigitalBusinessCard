import { Router } from 'express';
import {
  getMyCards,
  getCard,
  createCard,
  updateCard,
  deleteCard,
  checkSlug,
  generateQR,
  duplicateCard,
} from '../controllers/card.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyToken);

router.get('/', getMyCards);
router.post('/', createCard);
router.get('/slug/check/:slug', checkSlug);
router.get('/:id', getCard);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);
router.post('/:id/qr', generateQR);
router.post('/:id/duplicate', duplicateCard);

export default router;
