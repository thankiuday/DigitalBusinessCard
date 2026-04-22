import QRCode from 'qrcode';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

export const generateQRCode = async (url, cardId) => {
  const qrDataUrl = await QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    quality: 0.92,
    margin: 1,
    color: { dark: '#000000', light: '#ffffff' },
    width: 400,
  });

  // Convert data URL to buffer
  const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  // Upload to Cloudinary
  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `phygital/qr`,
        public_id: `qr_${cardId}`,
        format: 'png',
        overwrite: true,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

  return uploadResult.secure_url;
};
