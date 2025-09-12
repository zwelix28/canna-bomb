const express = require('express');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const { upload, optionalUpload, processImages } = require('../middleware/upload');

const router = express.Router();

// Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = { isActive: true };

    // Apply filters
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .limit(8)
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    
    const products = await Product.find({ 
      category: req.params.category, 
      isActive: true 
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({ 
      category: req.params.category, 
      isActive: true 
    });

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search products
router.get('/search/:query', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    
    const products = await Product.find({
      $text: { $search: req.params.query },
      isActive: true
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ score: { $meta: 'textScore' } });

    const total = await Product.countDocuments({
      $text: { $search: req.params.query },
      isActive: true
    });

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin routes
// Get all products for admin (including inactive)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {}; // No isActive filter for admin

    // Apply filters
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new product
router.post('/', adminAuth, upload, processImages, async (req, res) => {
  try {
    // Merge uploaded images with existing images from form
    const images = req.body.processedImages || [];
    
    // Handle existing images from FormData
    if (req.body.images) {
      let existingImages = [];
      if (typeof req.body.images === 'string') {
        // Handle comma-separated string from FormData
        existingImages = req.body.images.split(',').map(img => img.trim()).filter(img => img);
      } else if (Array.isArray(req.body.images)) {
        // Handle array from JSON
        existingImages = req.body.images.filter(img => img && img.trim());
      }
      images.push(...existingImages);
    }
    
    // Ensure we have at least one image
    if (images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }
    
    const productData = {
      ...req.body,
      images: images,
      // Ensure numeric fields are properly converted
      price: req.body.price ? parseFloat(req.body.price) : undefined,
      salePrice: req.body.salePrice ? parseFloat(req.body.salePrice) : undefined,
      stockQuantity: req.body.stockQuantity ? parseInt(req.body.stockQuantity) : undefined,
      thcContent: req.body.thcContent ? parseFloat(req.body.thcContent) : undefined,
      cbdContent: req.body.cbdContent ? parseFloat(req.body.cbdContent) : undefined,
      weight: req.body.weight ? parseFloat(req.body.weight) : undefined,
      // Handle boolean fields
      isActive: req.body.isActive !== undefined ? (req.body.isActive === 'true' || req.body.isActive === true || req.body.isActive === '1') : true,
      isFeatured: req.body.isFeatured !== undefined ? (req.body.isFeatured === 'true' || req.body.isFeatured === true || req.body.isFeatured === '1') : false
    };
    
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update product
router.put('/:id', adminAuth, optionalUpload, processImages, async (req, res) => {
  try {
    // Get existing product to preserve images if none are provided
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Merge uploaded images with existing images from form
    let images = req.body.processedImages || [];
    
    // Handle existing images from the separate field
    if (req.body.existingImages) {
      const existingImages = req.body.existingImages.split(',').map(img => img.trim()).filter(img => img);
      images = [...images, ...existingImages];
    } else if (images.length === 0) {
      // If no new images uploaded and no existing images provided, keep current images
      images = existingProduct.images;
    }
    
    // Ensure we have at least one image
    if (images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }
    
    const updateData = {
      ...req.body,
      images: images,
      // Ensure numeric fields are properly converted
      price: req.body.price ? parseFloat(req.body.price) : undefined,
      salePrice: req.body.salePrice ? parseFloat(req.body.salePrice) : undefined,
      stockQuantity: req.body.stockQuantity ? parseInt(req.body.stockQuantity) : undefined,
      thcContent: req.body.thcContent ? parseFloat(req.body.thcContent) : undefined,
      cbdContent: req.body.cbdContent ? parseFloat(req.body.cbdContent) : undefined,
      weight: req.body.weight ? parseFloat(req.body.weight) : undefined
    };
    
    // Only update boolean fields if they are explicitly provided
    if (req.body.isActive !== undefined) {
      updateData.isActive = req.body.isActive === 'true' || req.body.isActive === true || req.body.isActive === '1';
    }
    if (req.body.isFeatured !== undefined) {
      updateData.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true || req.body.isFeatured === '1';
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json(product);
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete product
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
