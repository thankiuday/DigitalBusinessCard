import cardService from '../services/card.service.js';
import analyticsService from '../services/analytics.service.js';
import { generateVCard } from '../utils/vcard.utils.js';

export const getPublicCard = async (req, res, next) => {
  try {
    const card = await cardService.getPublicCard(req.params.slug);
    res.json({ success: true, data: { card } });
  } catch (err) {
    next(err);
  }
};

export const downloadVCard = async (req, res, next) => {
  try {
    const card = await cardService.getPublicCard(req.params.slug);
    const vcf = generateVCard(card);
    const filename = `${card.profile?.name || card.slug}.vcf`;
    res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(vcf);
  } catch (err) {
    next(err);
  }
};
