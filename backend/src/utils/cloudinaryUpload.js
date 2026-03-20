'use strict';

const cloudinary = require('../config/cloudinary');
const { AppError } = require('./errors');

const uploadToCloudinary = (fileBuffer, folder = 'exotic-fruits') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          if (error.message) {
            console.error('Cloudinary error message:', error.message);
          }
          if (error.http_code) {
            console.error('Cloudinary HTTP code:', error.http_code);
          }
          reject(new AppError('Image upload failed: ' + error.message, 500, 'UPLOAD_ERROR'));
        } else {
          resolve({ url: result.secure_url, public_id: result.public_id });
        }
      }
    );
    uploadStream.on('error', (streamError) => {
      console.error('Cloudinary upload stream error:', streamError);
    });
    uploadStream.end(fileBuffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error.message);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
