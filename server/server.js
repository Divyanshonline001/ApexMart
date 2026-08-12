const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = async () => {
  const conn = require('./config/db');
  await conn();
};

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/upload');

// Connect to Database
connectDB();

const app = express();

// Passport Middleware
const passport = require('passport');
app.use(passport.initialize());
require('./config/passport')(passport);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // Any non-API route should serve the React SPA index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'client', 'dist', 'index.html'));
  });
} else {
  // Basic route in development
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the E-commerce API' });
  });
}

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
