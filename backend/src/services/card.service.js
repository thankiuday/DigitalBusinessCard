import cardRepository from '../repositories/card.repository.js';
import { AppError } from '../middleware/errorHandler.js';
import { generateUniqueSlug } from '../utils/slugify.utils.js';
import { generateQRCode } from '../utils/qrcode.utils.js';
import { config } from '../config/env.js';
import { cacheDel, cacheGet, cacheSet } from '../config/redis.js';

class CardService {
  async getMyCards(userId, query) {
    return cardRepository.findByUserId(userId, query);
  }

  async getCardById(id, userId) {
    const card = await cardRepository.findById(id);
    if (!card) throw new AppError('Card not found', 404);
    if (card.userId.toString() !== userId) throw new AppError('Unauthorized', 403);
    return card;
  }

  async createCard(userId, data) {
    let slug = data.slug;
    if (!slug) {
      slug = generateUniqueSlug(data.profile?.name || 'card');
    } else {
      slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    }

    const slugTaken = await cardRepository.slugExists(slug);
    if (slugTaken) throw new AppError('This URL slug is already taken', 409);

    const card = await cardRepository.create({ ...data, userId, slug });
    return card;
  }

  async updateCard(id, userId, data) {
    const card = await cardRepository.findById(id);
    if (!card) throw new AppError('Card not found', 404);
    if (card.userId.toString() !== userId) throw new AppError('Unauthorized', 403);

    // If slug is being changed, validate uniqueness
    if (data.slug && data.slug !== card.slug) {
      const taken = await cardRepository.slugExists(data.slug, id);
      if (taken) throw new AppError('This URL slug is already taken', 409);
    }

    // Invalidate cache
    await cacheDel(`card:${card.slug}`);
    if (data.slug) await cacheDel(`card:${data.slug}`);

    return cardRepository.updateById(id, data);
  }

  async deleteCard(id, userId) {
    const card = await cardRepository.findById(id);
    if (!card) throw new AppError('Card not found', 404);
    if (card.userId.toString() !== userId) throw new AppError('Unauthorized', 403);
    await cacheDel(`card:${card.slug}`);
    return cardRepository.deleteById(id);
  }

  async checkSlug(slug, excludeId) {
    const cleaned = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    const taken = await cardRepository.slugExists(cleaned, excludeId);
    return { available: !taken, slug: cleaned };
  }

  async generateQR(id, userId) {
    const card = await cardRepository.findById(id);
    if (!card) throw new AppError('Card not found', 404);
    if (card.userId.toString() !== userId) throw new AppError('Unauthorized', 403);

    const cardUrl = `${config.clientUrl}/card/${card.slug}`;
    const qrCodeUrl = await generateQRCode(cardUrl, id);

    await cardRepository.updateById(id, { qrCodeUrl });
    await cacheDel(`card:${card.slug}`);

    return { qrCodeUrl };
  }

  async getPublicCard(slug) {
    const cacheKey = `card:${slug}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return cached;

    const card = await cardRepository.findBySlug(slug);
    if (!card) throw new AppError('Card not found', 404);
    if (!card.isPublic) throw new AppError('This card is private', 403);

    await cacheSet(cacheKey, card, 300);
    return card;
  }

  async duplicateCard(id, userId) {
    const card = await this.getCardById(id, userId);
    const newSlug = generateUniqueSlug(card.profile?.name || 'card');
    const { _id, createdAt, updatedAt, views, qrCodeUrl, ...cardData } = card.toObject();
    return cardRepository.create({ ...cardData, userId, slug: newSlug, title: `${card.title} (Copy)`, views: 0, qrCodeUrl: null });
  }
}

export default new CardService();
