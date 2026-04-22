import User from '../models/User.model.js';

export class UserRepository {
  async findById(id) {
    return User.findById(id);
  }

  async findByEmail(email) {
    return User.findOne({ email: email.toLowerCase() }).select('+password +refreshTokens');
  }

  async findByEmailPublic(email) {
    return User.findOne({ email: email.toLowerCase() });
  }

  async create(data) {
    const user = new User(data);
    return user.save();
  }

  async updateById(id, updates) {
    return User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  }

  async addRefreshToken(id, token) {
    return User.findByIdAndUpdate(id, { $push: { refreshTokens: token } });
  }

  async removeRefreshToken(id, token) {
    return User.findByIdAndUpdate(id, { $pull: { refreshTokens: token } });
  }

  async clearRefreshTokens(id) {
    return User.findByIdAndUpdate(id, { $set: { refreshTokens: [] } });
  }

  async findByRefreshToken(token) {
    return User.findOne({ refreshTokens: token }).select('+refreshTokens');
  }
}

export default new UserRepository();
