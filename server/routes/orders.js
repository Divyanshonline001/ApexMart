const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, getMyOrders);

// Admin route to get all orders (placed before /:id to prevent route clash)
router.route('/all')
  .get(protect, adminOnly, getAllOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(protect, adminOnly, updateOrderStatus);

module.exports = router;
