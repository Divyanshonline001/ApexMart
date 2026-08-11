const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Create a new order (Checkout)
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode || !shippingAddress.country) {
      return res.status(400).json({ message: 'Please provide full shipping details' });
    }

    // Retrieve user cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your shopping cart is empty' });
    }

    const orderItems = [];
    let subtotal = 0;

    // Validate stock and calculate prices
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product.name} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }

      // Calculate unit price after discount
      const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
      const finalUnitPrice = Math.round(discountedPrice * 100) / 100;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: finalUnitPrice,
      });

      subtotal += finalUnitPrice * item.quantity;
    }

    // Calculate shipping cost (e.g. Free shipping above 1500, else 150)
    const shippingCost = subtotal > 1500 ? 0 : 150;
    const total = subtotal + shippingCost;

    // Create the order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingCost,
      total,
      paymentMethod: 'COD', // Default payment method
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
    });

    const createdOrder = await order.save();

    // Reduce product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear user's cart
    cart.items = [];
    await cart.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Allow user to view their own order, or admin to view any order
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin Only)
// @route   GET /api/orders/all (routed via /api/orders internally or handled as query/route)
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const oldStatus = order.orderStatus;

    if (oldStatus === 'Cancelled') {
      return res.status(400).json({ message: 'Cancelled orders cannot be modified' });
    }

    order.orderStatus = orderStatus;

    // Handle Paid condition for COD on delivery
    if (orderStatus === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    // Handle stock restoration if order is cancelled
    if (orderStatus === 'Cancelled' && oldStatus !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
      order.paymentStatus = 'Failed';
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
