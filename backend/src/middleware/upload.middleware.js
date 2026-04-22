import multer from 'multer';
import { AppError } from './errorHandler.js';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only JPEG, PNG, WebP, and GIF images are allowed', 400), false);
  }
};

const videoFileFilter = (req, file, cb) => {
  if (VIDEO_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only MP4, WebM, or MOV videos are allowed', 400), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter,
});

export const uploadVideoMw = multer({
  storage,
  limits: { fileSize: MAX_VIDEO_SIZE },
  fileFilter: videoFileFilter,
});
