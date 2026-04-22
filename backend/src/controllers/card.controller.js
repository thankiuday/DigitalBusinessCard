import cardService from '../services/card.service.js';

export const getMyCards = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await cardService.getMyCards(req.user.id, {
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const getCard = async (req, res, next) => {
  try {
    const card = await cardService.getCardById(req.params.id, req.user.id);
    res.json({ success: true, data: { card } });
  } catch (err) {
    next(err);
  }
};

export const createCard = async (req, res, next) => {
  try {
    const card = await cardService.createCard(req.user.id, req.body);
    res.status(201).json({ success: true, data: { card } });
  } catch (err) {
    next(err);
  }
};

export const updateCard = async (req, res, next) => {
  try {
    const card = await cardService.updateCard(req.params.id, req.user.id, req.body);
    res.json({ success: true, data: { card } });
  } catch (err) {
    next(err);
  }
};

export const deleteCard = async (req, res, next) => {
  try {
    await cardService.deleteCard(req.params.id, req.user.id);
    res.json({ success: true, message: 'Card deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const checkSlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { excludeId } = req.query;
    const result = await cardService.checkSlug(slug, excludeId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const generateQR = async (req, res, next) => {
  try {
    const result = await cardService.generateQR(req.params.id, req.user.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const duplicateCard = async (req, res, next) => {
  try {
    const card = await cardService.duplicateCard(req.params.id, req.user.id);
    res.status(201).json({ success: true, data: { card } });
  } catch (err) {
    next(err);
  }
};
