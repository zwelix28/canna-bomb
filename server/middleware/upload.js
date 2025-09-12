const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Optional upload middleware that doesn't require files
const optionalUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Image processing middleware
const processImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const processedImages = [];
    
    for (const file of req.files) {
      // Generate unique filename
      const filename = `product_${Date.now()}_${Math.random().toString(36).substring(2)}.webp`;
      const filepath = path.join(uploadDir, filename);
      
      // Process image with sharp
      await sharp(file.buffer)
        .resize(400, 300, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 85 })
        .toFile(filepath);
      
      // Add processed image path to request
      processedImages.push(`/uploads/products/${filename}`);
    }
    
    // Add processed images to request body
    req.body.processedImages = processedImages;
    next();
  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({ message: 'Image processing failed', error: error.message });
  }
};

module.exports = {
  upload: upload.array('images', 5), // Allow up to 5 images
  optionalUpload: optionalUpload.array('images', 5), // Optional upload for updates
  processImages
};
