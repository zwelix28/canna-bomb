const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: "Blue Dream Premium Flower",
    description: "A balanced hybrid strain with sweet berry aroma and smooth cerebral effects. Perfect for daytime use.",
    category: "flower",
    brand: "Premium Cannabis Co",
    price: 45.00,
    salePrice: 38.00,
    images: ["https://images.unsplash.com/photo-1603909227351-9f7e6d4c8b1c?w=400"],
    thcContent: 18.5,
    cbdContent: 0.8,
    weight: 3.5,
    weightUnit: "g",
    strain: "Blue Dream",
    effects: ["Euphoric", "Creative", "Relaxed"],
    flavors: ["Berry", "Vanilla", "Sweet"],
    stockQuantity: 50,
    isActive: true,
    isFeatured: true,
    tags: ["hybrid", "premium", "daytime"]
  },
  {
    name: "CBD Relief Gummies",
    description: "Delicious gummy bears infused with high-quality CBD for pain relief and relaxation.",
    category: "edibles",
    brand: "Wellness Edibles",
    price: 35.00,
    images: ["https://images.unsplash.com/photo-1603909227351-9f7e6d4c8b1c?w=400"],
    thcContent: 0.3,
    cbdContent: 25.0,
    weight: 10,
    weightUnit: "g",
    effects: ["Relaxed", "Pain Relief", "Calm"],
    flavors: ["Mixed Berry", "Citrus", "Tropical"],
    stockQuantity: 100,
    isActive: true,
    isFeatured: true,
    tags: ["cbd", "pain-relief", "gummies"]
  },
  {
    name: "OG Kush Live Resin",
    description: "Premium live resin concentrate with intense flavor and potent effects. Perfect for experienced users.",
    category: "concentrates",
    brand: "Extract Masters",
    price: 65.00,
    images: ["https://images.unsplash.com/photo-1603909227351-9f7e6d4c8b1c?w=400"],
    thcContent: 85.0,
    cbdContent: 1.2,
    weight: 1,
    weightUnit: "g",
    strain: "OG Kush",
    effects: ["Euphoric", "Relaxed", "Happy"],
    flavors: ["Pine", "Lemon", "Earthy"],
    stockQuantity: 25,
    isActive: true,
    isFeatured: false,
    tags: ["concentrate", "live-resin", "potent"]
  },
  {
    name: "Lavender CBD Lotion",
    description: "Soothing topical lotion with CBD and lavender for muscle relief and relaxation.",
    category: "topicals",
    brand: "Healing Touch",
    price: 28.00,
    images: ["https://images.unsplash.com/photo-1603909227351-9f7e6d4c8b1c?w=400"],
    thcContent: 0.0,
    cbdContent: 500.0,
    weight: 100,
    weightUnit: "ml",
    effects: ["Pain Relief", "Relaxed", "Soothing"],
    flavors: ["Lavender", "Natural"],
    stockQuantity: 75,
    isActive: true,
    isFeatured: false,
    tags: ["topical", "cbd", "pain-relief"]
  },
  {
    name: "Disposable Vape Pen - Sour Diesel",
    description: "Convenient disposable vape pen with Sour Diesel strain. Perfect for on-the-go use.",
    category: "vapes",
    brand: "VapeTech",
    price: 25.00,
    images: ["https://images.unsplash.com/photo-1603909227351-9f7e6d4c8b1c?w=400"],
    thcContent: 75.0,
    cbdContent: 0.5,
    weight: 0.5,
    weightUnit: "g",
    strain: "Sour Diesel",
    effects: ["Energetic", "Creative", "Uplifted"],
    flavors: ["Diesel", "Citrus", "Pungent"],
    stockQuantity: 60,
    isActive: true,
    isFeatured: true,
    tags: ["vape", "disposable", "sativa"]
  },
  {
    name: "Premium Grinder - 4 Piece",
    description: "High-quality 4-piece grinder with kief catcher for the perfect grind every time.",
    category: "accessories",
    brand: "GrindMaster",
    price: 45.00,
    images: ["https://images.unsplash.com/photo-1603909227351-9f7e6d4c8b1c?w=400"],
    weight: 200,
    weightUnit: "g",
    effects: [],
    flavors: [],
    stockQuantity: 30,
    isActive: true,
    isFeatured: false,
    tags: ["grinder", "accessory", "kief-catcher"]
  },
  {
    name: "Purple Haze Flower",
    description: "Classic sativa strain with purple hues and uplifting cerebral effects. Great for creative activities.",
    category: "flower",
    brand: "Classic Strains",
    price: 42.00,
    images: ["https://images.unsplash.com/photo-1603909227351-9f7e6d4c8b1c?w=400"],
    thcContent: 20.0,
    cbdContent: 0.6,
    weight: 3.5,
    weightUnit: "g",
    strain: "Purple Haze",
    effects: ["Creative", "Energetic", "Happy"],
    flavors: ["Sweet", "Spicy", "Earthy"],
    stockQuantity: 40,
    isActive: true,
    isFeatured: false,
    tags: ["sativa", "classic", "creative"]
  },
  {
    name: "Chocolate Chip Cookies",
    description: "Delicious chocolate chip cookies with balanced THC/CBD for a gentle, enjoyable experience.",
    category: "edibles",
    brand: "Sweet Treats",
    price: 30.00,
    images: ["https://images.unsplash.com/photo-1603909227351-9f7e6d4c8b1c?w=400"],
    thcContent: 10.0,
    cbdContent: 5.0,
    weight: 50,
    weightUnit: "g",
    effects: ["Relaxed", "Happy", "Mellow"],
    flavors: ["Chocolate", "Vanilla", "Sweet"],
    stockQuantity: 80,
    isActive: true,
    isFeatured: false,
    tags: ["edibles", "cookies", "balanced"]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/canna-bomb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${insertedProducts.length} products`);
    
    // Display inserted products
    insertedProducts.forEach(product => {
      console.log(`- ${product.name} (${product.category}) - $${product.price}`);
    });
    
    console.log('\nDatabase seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeding function
seedDatabase();
