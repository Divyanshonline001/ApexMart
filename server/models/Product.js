const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      min: [0, 'Price must be positive'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount must be positive'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    category: {
      type: String,
      required: [true, 'Please add a product category'],
      trim: true,
    },
    images: {
      type: [String],
      required: [true, 'Please add at least one product image URL'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    stock: {
      type: Number,
      required: [true, 'Please add product stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    specifications: [specificationSchema],
    reviews: [reviewSchema],
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
