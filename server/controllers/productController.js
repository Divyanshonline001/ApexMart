const Product = require('../models/Product');

// @desc    Get all products with filtering, sorting, search, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 9 } = req.query;

    const query = {};

    // Search query
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Sorting
    let sortQuery = { createdAt: -1 }; // default newest
    if (sort) {
      if (sort === 'priceAsc') {
        sortQuery = { price: 1 };
      } else if (sort === 'priceDesc') {
        sortQuery = { price: -1 };
      } else if (sort === 'rating') {
        sortQuery = { rating: -1 };
      }
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute queries
    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum);

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(totalProducts / limitNum),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, discount, category, images, stock, specifications } = req.body;

    if (!name || !description || price === undefined || !category || !images || stock === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const product = new Product({
      name,
      description,
      price,
      discount: discount || 0,
      category,
      images,
      stock,
      specifications: specifications || [],
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, discount, category, images, stock, specifications } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name !== undefined ? name : product.name;
      product.description = description !== undefined ? description : product.description;
      product.price = price !== undefined ? price : product.price;
      product.discount = discount !== undefined ? discount : product.discount;
      product.category = category !== undefined ? category : product.category;
      product.images = images !== undefined ? images : product.images;
      product.stock = stock !== undefined ? stock : product.stock;
      product.specifications = specifications !== undefined ? specifications : product.specifications;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Please provide rating and comment' });
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an existing review
// @route   PUT /api/products/:id/reviews
// @access  Private
const updateProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Please provide rating and comment' });
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      const review = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      review.rating = Number(rating);
      review.comment = comment;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.json({ message: 'Review updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  updateProductReview,
};
