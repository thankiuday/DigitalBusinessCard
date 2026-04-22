import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import { AppError } from '../middleware/errorHandler.js';
import { config } from '../config/env.js';

class UploadService {
  assertCloudinaryConfigured() {
    const { cloudName, apiKey, apiSecret } = config.cloudinary;
    if (!cloudName || !apiKey || !apiSecret) {
      throw new AppError(
        'File uploads are not configured (set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET on the server).',
        503
      );
    }
  }

  async uploadImage(buffer, options = {}) {
    if (!buffer || !buffer.length) {
      throw new AppError('Empty file upload', 400);
    }

    this.assertCloudinaryConfigured();

    const {
      folder = 'phygital/misc',
      publicId,
      transformation = [],
    } = options;

    return new Promise((resolve, reject) => {
      let settled = false;
      const finish = (fn) => {
        if (settled) return;
        settled = true;
        fn();
      };

      const uploadOptions = {
        folder,
        resource_type: 'image',
        unique_filename: true,
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          ...transformation,
        ],
        ...(publicId && { public_id: publicId, overwrite: true }),
      };

      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          return finish(() =>
            reject(new AppError(error.message || 'Cloudinary upload failed', 502)));
        }
        if (!result?.secure_url) {
          return finish(() => reject(new AppError('Cloudinary returned no image URL', 502)));
        }
        finish(() => resolve({ url: result.secure_url, publicId: result.public_id }));
      });

      uploadStream.on('error', (err) => {
        finish(() =>
          reject(new AppError(err.message || 'Upload stream error', 502)));
      });

      const readStream = streamifier.createReadStream(buffer);
      readStream.on('error', (err) => {
        finish(() =>
          reject(new AppError(err.message || 'Could not read upload buffer', 500)));
      });

      readStream.pipe(uploadStream);
    });
  }

  async uploadVideo(buffer, options = {}) {
    if (!buffer || !buffer.length) {
      throw new AppError('Empty file upload', 400);
    }

    this.assertCloudinaryConfigured();

    const { folder = 'phygital/misc', publicId } = options;

    return new Promise((resolve, reject) => {
      let settled = false;
      const finish = (fn) => {
        if (settled) return;
        settled = true;
        fn();
      };

      const uploadOptions = {
        folder,
        resource_type: 'video',
        unique_filename: true,
        ...(publicId && { public_id: publicId, overwrite: true }),
      };

      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          return finish(() =>
            reject(new AppError(error.message || 'Cloudinary video upload failed', 502)));
        }
        if (!result?.secure_url) {
          return finish(() => reject(new AppError('Cloudinary returned no video URL', 502)));
        }
        finish(() => resolve({ url: result.secure_url, publicId: result.public_id }));
      });

      uploadStream.on('error', (err) => {
        finish(() =>
          reject(new AppError(err.message || 'Upload stream error', 502)));
      });

      const readStream = streamifier.createReadStream(buffer);
      readStream.on('error', (err) => {
        finish(() =>
          reject(new AppError(err.message || 'Could not read upload buffer', 500)));
      });

      readStream.pipe(uploadStream);
    });
  }

  async deleteImage(publicId) {
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch {
      // non-fatal
    }
  }
}

export default new UploadService();
