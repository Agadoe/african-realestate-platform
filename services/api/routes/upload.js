const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { authenticateToken } = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/security');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer: store files in memory (stream directly to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Upload single image: POST /api/upload/image
router.post('/image', authenticateToken, uploadLimiter, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Stream to Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'african-realestate/properties',
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
      ],
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Image upload failed', details: error.message });
  }
});

// Upload multiple images: POST /api/upload/images
router.post('/images', authenticateToken, uploadLimiter, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    if (req.files.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 images allowed' });
    }

    const uploadPromises = req.files.map((file) => {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataUri = `data:${file.mimetype};base64,${b64}`;

      return cloudinary.uploader.upload(dataUri, {
        folder: 'african-realestate/properties',
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
        ],
      });
    });

    const results = await Promise.all(uploadPromises);

    const images = results.map((r) => ({
      url: r.secure_url,
      public_id: r.public_id,
      width: r.width,
      height: r.height,
      format: r.format,
    }));

    res.json({ images, count: images.length });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Image upload failed', details: error.message });
  }
});

// Delete image: DELETE /api/upload/:publicId
// Note: Cloudinary public IDs contain slashes, so we use a body param
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ error: 'public_id is required' });
    }

    const result = await cloudinary.uploader.destroy(public_id);
    res.json({ result });
  } catch (error) {
    console.error('Image delete error:', error);
    res.status(500).json({ error: 'Image deletion failed', details: error.message });
  }
});

module.exports = router;