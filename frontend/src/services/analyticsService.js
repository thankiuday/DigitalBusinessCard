import api from './api';
import { v4 as uuidv4 } from 'uuid';

const getVisitorId = () => {
  let id = localStorage.getItem('phygital-visitor-id');
  if (!id) {
    id = uuidv4();
    localStorage.setItem('phygital-visitor-id', id);
  }
  return id;
};

const analyticsService = {
  async track(cardId, eventType, metadata = {}) {
    try {
      await api.post('/analytics/event', {
        cardId,
        eventType,
        visitorId: getVisitorId(),
        metadata,
      });
    } catch {
      // non-fatal
    }
  },

  async getCardAnalytics(cardId) {
    const { data } = await api.get(`/analytics/cards/${cardId}`);
    return data.data;
  },
};

export default analyticsService;
