require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin12345',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'user@example.com',
    password: 'user12345',
    role: 'user',
  },
];

const products = [
  {
    name: 'UltraView 4K Smart Monitor',
    description: 'A premium 32-inch 4K UHD smart monitor featuring IPS panel, 144Hz refresh rate, HDR400, and integrated streaming apps. Perfect for gaming, entertainment, and professional design work.',
    price: 54999,
    discount: 15,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80'],
    rating: 4.8,
    stock: 25,
    specifications: [
      { name: 'Size', value: '32 inch' },
      { name: 'Resolution', value: '3840 x 2160 (4K)' },
      { name: 'Refresh Rate', value: '144Hz' },
      { name: 'Display Tech', value: 'IPS' },
    ],
  },
  {
    name: 'AcousticMax Noise Cancelling Headphones',
    description: 'Experience studio-grade audio with industry-leading hybrid active noise cancelling, up to 45 hours of battery life, fast charging, and plush memory foam earcups for all-day comfort.',
    price: 24999,
    discount: 10,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
    rating: 4.7,
    stock: 40,
    specifications: [
      { name: 'Type', value: 'Over-Ear' },
      { name: 'Connectivity', value: 'Bluetooth 5.2 / Aux' },
      { name: 'Battery Life', value: '45 Hours' },
      { name: 'Charging', value: 'USB-C Quick Charge' },
    ],
  },
  {
    name: 'Chronos Sport Smartwatch',
    description: 'A modern smartwatch designed for fitness and daily productivity. Features heart rate tracking, sleep monitoring, blood oxygen analysis, built-in GPS, and 5 ATM water resistance.',
    price: 15999,
    discount: 20,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
    rating: 4.5,
    stock: 15,
    specifications: [
      { name: 'Water Resistance', value: '50m (5 ATM)' },
      { name: 'Battery Life', value: 'Up to 7 Days' },
      { name: 'Compatibility', value: 'iOS & Android' },
      { name: 'Sensors', value: 'Heart Rate, SpO2, GPS' },
    ],
  },
  {
    name: 'Urban Explorer Waterproof Backpack',
    description: 'A sleek, weather-resistant backpack engineered for the modern commuter. Includes a padded 16-inch laptop compartment, ergonomic shoulder straps, and hidden anti-theft pockets.',
    price: 4999,
    discount: 5,
    category: 'Fashion',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'],
    rating: 4.6,
    stock: 50,
    specifications: [
      { name: 'Laptop Sleeve', value: 'Up to 16 inches' },
      { name: 'Material', value: '1680D Waterproof Nylon' },
      { name: 'Capacity', value: '25 Liters' },
      { name: 'Weight', value: '0.8 kg' },
    ],
  },
  {
    name: 'Classic Knit Wool Sweater',
    description: 'Wrap yourself in warmth with this premium merino wool blend sweater. Features a classic crewneck cut, ribbed cuffs, and a regular fit suitable for casual or semi-formal wear.',
    price: 3499,
    discount: 25,
    category: 'Fashion',
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80'],
    rating: 4.4,
    stock: 30,
    specifications: [
      { name: 'Material', value: '80% Merino Wool, 20% Nylon' },
      { name: 'Fit Type', value: 'Regular Fit' },
      { name: 'Care Instructions', value: 'Hand wash cold, dry flat' },
    ],
  },
  {
    name: 'Vanguard Leather Chelsea Boots',
    description: 'Handcrafted from genuine full-grain leather, these Chelsea boots combine heritage craftsmanship with modern styling. Features elastic side gores and a durable rubber outsole.',
    price: 8999,
    discount: 0,
    category: 'Fashion',
    images: ['https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80'],
    rating: 4.7,
    stock: 12,
    specifications: [
      { name: 'Material', value: 'Full-Grain Cowhide Leather' },
      { name: 'Sole', value: 'Anti-slip Rubber' },
      { name: 'Closure Type', value: 'Pull-on' },
      { name: 'Style', value: 'Chelsea Boot' },
    ],
  },
  {
    name: 'Polarized Premium Aviator Sunglasses',
    description: 'Iconic aviator design featuring lightweight titanium frames and high-performance polarized lenses. Provides 100% UVA/UVB protection and blocks glare for ultimate clarity.',
    price: 6999,
    discount: 15,
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80'],
    rating: 4.8,
    stock: 35,
    specifications: [
      { name: 'Lens Type', value: 'Polarized UV400' },
      { name: 'Frame Material', value: 'Titanium' },
      { name: 'Lens Color', value: 'Dark Green' },
      { name: 'Frame Color', value: 'Gold' },
    ],
  },
  {
    name: 'Minimalist Slim Leather Wallet',
    description: 'Carry only what you need with this RFID-blocking slim wallet. Handcrafted from top-grain leather, it holds up to 8 cards and has a convenient magnetic cash clip.',
    price: 1999,
    discount: 10,
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1627124118303-192c8d32b242?w=800&auto=format&fit=crop&q=80'],
    rating: 4.5,
    stock: 100,
    specifications: [
      { name: 'Material', value: 'Top-Grain Leather' },
      { name: 'Security', value: 'RFID-Blocking Technology' },
      { name: 'Capacity', value: '8 Cards & Cash' },
      { name: 'Dimensions', value: '4.1 x 2.9 x 0.3 inches' },
    ],
  },
  {
    name: 'AromaMist Ceramic Ultrasonic Diffuser',
    description: 'Enhance your indoor environment with this ceramic essential oil diffuser. Operates silently with ultrasonic technology, offering continuous mist modes and 7 soft LED color lights.',
    price: 2499,
    discount: 20,
    category: 'Home',
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80'],
    rating: 4.6,
    stock: 60,
    specifications: [
      { name: 'Water Tank', value: '200 ml' },
      { name: 'Run Time', value: 'Up to 8 hours' },
      { name: 'Material', value: 'Handcrafted Ceramic' },
      { name: 'Auto Diffuse Shut Off', value: 'Yes (when empty)' },
    ],
  },
  {
    name: 'Ergonomic Memory Foam Office Chair',
    description: 'Reclaim your back comfort with this ergonomic high-back office chair. Features adjustable lumbar support, 3D armrests, breathable mesh back, and synchro-tilt mechanism.',
    price: 19999,
    discount: 12,
    category: 'Home',
    images: ['https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=800&auto=format&fit=crop&q=80'],
    rating: 4.6,
    stock: 18,
    specifications: [
      { name: 'Back Style', value: 'Mesh High-Back' },
      { name: 'Adjustability', value: '3D Armrests, Lumbar & Headrest' },
      { name: 'Base Material', value: 'Polished Aluminum' },
      { name: 'Max Weight', value: '300 lbs' },
    ],
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    console.log('Cleared existing data.');

    // Seed users
    const seededUsers = await User.create(users);
    console.log(`Seeded ${seededUsers.length} users.`);

    // Seed products
    const seededProducts = await Product.create(products);
    console.log(`Seeded ${seededProducts.length} products.`);

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
