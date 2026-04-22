import Card from '../models/Card.model.js';

export class CardRepository {
  async findBySlug(slug) {
    return Card.findOne({ slug: slug.toLowerCase() });
  }

  async findById(id) {
    return Card.findById(id);
  }

  async findByUserId(userId, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    const [cards, total] = await Promise.all([
      Card.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-sections'),
      Card.countDocuments({ userId }),
    ]);
    return { cards, total, page, pages: Math.ceil(total / limit) };
  }

  async create(data) {
    const card = new Card(data);
    return card.save();
  }

  async updateById(id, updates) {
    return Card.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  }

  async deleteById(id) {
    return Card.findByIdAndDelete(id);
  }

  async slugExists(slug, excludeId = null) {
    const query = { slug: slug.toLowerCase() };
    if (excludeId) query._id = { $ne: excludeId };
    return !!(await Card.findOne(query).select('_id'));
  }

  async incrementViews(id) {
    return Card.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }
}

export default new CardRepository();
