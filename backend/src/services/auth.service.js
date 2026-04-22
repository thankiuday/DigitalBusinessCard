import userRepository from '../repositories/user.repository.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils.js';
import { AppError } from '../middleware/errorHandler.js';

class AuthService {
  async register(name, email, password) {
    const existing = await userRepository.findByEmailPublic(email);
    if (existing) throw new AppError('Email already registered', 409);

    const user = await userRepository.create({ name, email, password });

    const accessToken = generateAccessToken({ id: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user._id });

    await userRepository.addRefreshToken(user._id, refreshToken);

    return { user: user.toPublicJSON(), accessToken, refreshToken };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.password) throw new AppError('Invalid credentials', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError('Invalid credentials', 401);

    if (!user.isActive) throw new AppError('Account is deactivated', 403);

    const accessToken = generateAccessToken({ id: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user._id });

    await userRepository.addRefreshToken(user._id, refreshToken);

    return { user: user.toPublicJSON(), accessToken, refreshToken };
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw new AppError('Refresh token required', 401);

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const user = await userRepository.findByRefreshToken(refreshToken);
    if (!user) throw new AppError('Refresh token reuse detected', 401);

    // Rotate refresh token
    await userRepository.removeRefreshToken(user._id, refreshToken);
    const newAccessToken = generateAccessToken({ id: user._id, email: user.email });
    const newRefreshToken = generateRefreshToken({ id: user._id });
    await userRepository.addRefreshToken(user._id, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken, userId) {
    if (refreshToken && userId) {
      await userRepository.removeRefreshToken(userId, refreshToken);
    }
  }

  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return user.toPublicJSON();
  }
}

export default new AuthService();
