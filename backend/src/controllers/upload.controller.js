import mongoose from 'mongoose';
import uploadService from '../services/upload.service.js';
import { AppError } from '../middleware/errorHandler.js';
import cardRepository from '../repositories/card.repository.js';

const CARD_ASSET_TYPES = ['profile', 'banner', 'gallery'];

function sanitizeDraftKey(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const s = raw.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 64);
  return s.length >= 8 ? s : null;
}

/** One folder tree per card: .../cards/{cardId}/profile|banner|gallery — fast to browse and CDN-cached URLs */
/** Card-scoped or draft-scoped video (business promo, etc.) → Cloudinary `resource_type: video` */
export const uploadCardVideo = async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('No file provided', 400);

    const { cardId, draftKey: rawDraftKey } = req.body;
    const userId = String(req.user.id);
    const draftKey = sanitizeDraftKey(rawDraftKey);

    let folder;

    if (cardId) {
      if (!mongoose.Types.ObjectId.isValid(cardId)) {
        throw new AppError('Invalid card id', 400);
      }
      const card = await cardRepository.findById(cardId);
      if (!card) throw new AppError('Card not found', 404);
      if (card.userId.toString() !== userId) throw new AppError('Unauthorized', 403);

      folder = `phygital/users/${userId}/cards/${cardId}/video`;
    } else {
      const key = draftKey || 'unscoped';
      folder = `phygital/users/${userId}/drafts/${key}/video`;
    }

    const result = await uploadService.uploadVideo(req.file.buffer, { folder });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('No file provided', 400);

    const { type = 'misc', cardId, draftKey: rawDraftKey } = req.body;
    const userId = String(req.user.id);
    const draftKey = sanitizeDraftKey(rawDraftKey);

    let folder;

    if (cardId) {
      if (!mongoose.Types.ObjectId.isValid(cardId)) {
        throw new AppError('Invalid card id', 400);
      }
      const card = await cardRepository.findById(cardId);
      if (!card) throw new AppError('Card not found', 404);
      if (card.userId.toString() !== userId) throw new AppError('Unauthorized', 403);

      const base = `phygital/users/${userId}/cards/${cardId}`;
      if (type === 'profile') folder = `${base}/profile`;
      else if (type === 'banner') folder = `${base}/banner`;
      else if (type === 'gallery') folder = `${base}/gallery`;
      else folder = `${base}/misc`;
    } else if (CARD_ASSET_TYPES.includes(type)) {
      const key = draftKey || 'unscoped';
      folder = `phygital/users/${userId}/drafts/${key}/${type}`;
    } else {
      folder = `phygital/users/${userId}/misc`;
    }

    const result = await uploadService.uploadImage(req.file.buffer, { folder });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
