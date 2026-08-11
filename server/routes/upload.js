const express = require('express');
const multer = require('multer');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Use memory storage — no files written to disk
const storage = multer.memoryStorage();

// File validation filter (images only)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|avif|gif|svg/;
  const extname = filetypes.test(require('path').extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! Allowed formats: JPG, PNG, WEBP, AVIF, GIF, SVG'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Helper: stream buffer to Cloudinary
function uploadToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary
// @access  Private/Admin
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  try {
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'ecommerce/products',
      resource_type: 'image',
    });

    res.json({
      message: 'Image uploaded successfully',
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

module.exports = router;
