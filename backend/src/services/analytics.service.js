import analyticsRepository from '../repositories/analytics.repository.js';
import cardRepository from '../repositories/card.repository.js';
import { AppError } from '../middleware/errorHandler.js';

class AnalyticsService {
  async trackEvent({ cardId, eventType, visitorId, metadata, ip, userAgent }) {
    await analyticsRepository.create({ cardId, eventType, visitorId, metadata, ip, userAgent });

    if (eventType === 'view') {
      await cardRepository.incrementViews(cardId);
    }
  }

  async getAnalytics(cardId, userId) {
    const card = await cardRepository.findById(cardId);
    if (!card) throw new AppError('Card not found', 404);
    if (card.userId.toString() !== userId) throw new AppError('Unauthorized', 403);

    const [summary, timeSeries, uniqueVisitors] = await Promise.all([
      analyticsRepository.getSummary(cardId),
      analyticsRepository.getTimeSeries(cardId, 30),
      analyticsRepository.getUniqueVisitors(cardId),
    ]);

    return {
      cardId,
      summary,
      totalViews: card.views,
      uniqueVisitors: uniqueVisitors.length,
      timeSeries,
    };
  }
}

export default new AnalyticsService();
