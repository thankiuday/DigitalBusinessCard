import api from './api';

const cardService = {
  async getMyCards(params = {}) {
    const { data } = await api.get('/cards', { params });
    return data.data;
  },

  async getCard(id) {
    const { data } = await api.get(`/cards/${id}`);
    return data.data.card;
  },

  async createCard(cardData) {
    const { data } = await api.post('/cards', cardData);
    return data.data.card;
  },

  async updateCard(id, cardData) {
    const { data } = await api.put(`/cards/${id}`, cardData);
    return data.data.card;
  },

  async deleteCard(id) {
    await api.delete(`/cards/${id}`);
  },

  async checkSlug(slug, excludeId) {
    const params = excludeId ? { excludeId } : {};
    const { data } = await api.get(`/cards/slug/check/${slug}`, { params });
    return data.data;
  },

  async generateQR(id) {
    const { data } = await api.post(`/cards/${id}/qr`);
    return data.data;
  },

  async duplicateCard(id) {
    const { data } = await api.post(`/cards/${id}/duplicate`);
    return data.data.card;
  },

  async getPublicCard(slug) {
    const { data } = await api.get(`/public/${slug}`);
    return data.data.card;
  },

  /**
   * @param {File} file
   * @param {string} type - profile | banner | gallery | misc
   * @param {string | { cardId?: string, draftKey?: string }} [cardIdOrOptions] - legacy: string cardId only
   */
  async uploadImage(file, type, cardIdOrOptions) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    let cardId;
    let draftKey;
    if (typeof cardIdOrOptions === 'string') {
      cardId = cardIdOrOptions;
    } else if (cardIdOrOptions && typeof cardIdOrOptions === 'object') {
      cardId = cardIdOrOptions.cardId;
      draftKey = cardIdOrOptions.draftKey;
    }
    if (cardId) formData.append('cardId', cardId);
    if (draftKey) formData.append('draftKey', draftKey);

    const { data } = await api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  /**
   * @param {File} file
   * @param {{ cardId?: string, draftKey?: string }} [options]
   */
  async uploadVideo(file, options = {}) {
    const formData = new FormData();
    formData.append('video', file);
    const { cardId, draftKey } = options;
    if (cardId) formData.append('cardId', cardId);
    if (draftKey) formData.append('draftKey', draftKey);

    const { data } = await api.post('/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    });
    return data.data;
  },
};

export default cardService;
