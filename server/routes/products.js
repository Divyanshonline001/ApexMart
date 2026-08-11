const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  updateProductReview,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

router.route('/:id/reviews')
  .post(protect, createProductReview)
  .put(protect, updateProductReview);

module.exports = router;
