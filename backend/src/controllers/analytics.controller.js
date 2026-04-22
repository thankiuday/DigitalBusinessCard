import analyticsService from '../services/analytics.service.js';
import mongoose from 'mongoose';

export const trackEvent = async (req, res, next) => {
  try {
    const { cardId, eventType, visitorId, metadata } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ success: false, message: 'Invalid cardId' });
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
    const userAgent = req.headers['user-agent'];

    // Fire and forget — don't block the response
    analyticsService.trackEvent({ cardId, eventType, visitorId, metadata, ip, userAgent }).catch(console.error);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getAnalytics(req.params.id, req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
