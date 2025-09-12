const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['flower', 'edibles', 'concentrates', 'topicals', 'accessories', 'vapes']
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  salePrice: {
    type: Number,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  thcContent: {
    type: Number,
    min: 0,
    max: 100
  },
  cbdContent: {
    type: Number,
    min: 0
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  weightUnit: {
    type: String,
    enum: ['g', 'mg', 'oz', 'lb', 'ml'],
    default: 'g'
  },
  strain: {
    type: String,
    trim: true
  },
  effects: [{
    type: String,
    trim: true
  }],
  flavors: [{
    type: String,
    trim: true
  }],
  stockQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ name: 'text', description: 'text', brand: 'text', strain: 'text' });

module.exports = mongoose.model('Product', productSchema);
