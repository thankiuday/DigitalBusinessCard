import Analytics from '../models/Analytics.model.js';

export class AnalyticsRepository {
  async create(data) {
    return Analytics.create(data);
  }

  async getByCardId(cardId, limit = 100) {
    return Analytics.find({ cardId }).sort({ timestamp: -1 }).limit(limit);
  }

  async getSummary(cardId) {
    const pipeline = [
      { $match: { cardId } },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
        },
      },
    ];
    const results = await Analytics.aggregate(pipeline);
    const summary = {};
    results.forEach((r) => (summary[r._id] = r.count));
    return summary;
  }

  async getTimeSeries(cardId, days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return Analytics.aggregate([
      { $match: { cardId, timestamp: { $gte: since }, eventType: 'view' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async getUniqueVisitors(cardId) {
    return Analytics.distinct('visitorId', { cardId, visitorId: { $ne: null } });
  }
}

export default new AnalyticsRepository();
