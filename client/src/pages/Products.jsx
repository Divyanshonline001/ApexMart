import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { FiSearch, FiStar, FiShoppingBag, FiInbox } from 'react-icons/fi';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState('');

  // Read current parameters
  const searchVal = searchParams.get('search') || '';
  const categoryVal = searchParams.get('category') || 'All';
  const minPriceVal = searchParams.get('minPrice') || '';
  const maxPriceVal = searchParams.get('maxPrice') || '';
  const sortVal = searchParams.get('sort') || 'newest';
  const pageVal = searchParams.get('page') || '1';

  // Input states for filters
  const [maxPriceInput, setMaxPriceInput] = useState(maxPriceVal || '100000');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const queryParams = {
          page: pageVal,
          limit: 6,
          sort: sortVal,
        };

        if (searchVal) queryParams.search = searchVal;
        if (categoryVal && categoryVal !== 'All') queryParams.category = categoryVal;
        if (minPriceVal) queryParams.minPrice = minPriceVal;
        if (maxPriceVal) queryParams.maxPrice = maxPriceVal;

        const data = await productAPI.getProducts(queryParams);
        setProducts(data.products || []);
        setPages(data.pages || 1);
        setTotalProducts(data.totalProducts || 0);
      } catch (err) {
        console.error(err);
        setError('Failed to retrieve products. Please verify your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchVal, categoryVal, minPriceVal, maxPriceVal, sortVal, pageVal]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // reset page on filter change
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setMaxPriceInput('100000');
  };

  const handlePriceFilterApply = () => {
    updateParam('maxPrice', maxPriceInput);
  };

  const handleAddToCart = async (product) => {
    const res = await addToCart(product, 1);
    if (res.success) {
      setToastMessage(`Added ${product.name} to cart!`);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const categories = ['All', 'Electronics', 'Fashion', 'Accessories', 'Home'];

  const renderStars = (rating) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(<FiStar key={i} fill="currentColor" />);
      } else {
        stars.push(<FiStar key={i} />);
      }
    }
    return stars;
  };

  return (
    <div className="container section-padding" style={{ paddingTop: '40px' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast success">{toastMessage}</div>
        </div>
      )}

      <div className="products-list-header">
        <div>
          <h1 style={{ fontSize: '2rem' }}>Our Collection</h1>
          <p className="results-count">
            {loading ? 'Searching...' : `Showing ${products.length} of ${totalProducts} products`}
          </p>
        </div>
        
        {/* Sort selector */}
        <div className="sorting-controls">
          <span>Sort By:</span>
          <select
            className="sort-select"
            style={{ width: '180px' }}
            value={sortVal}
            onChange={(e) => updateParam('sort', e.target.value)}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="rating">Average Rating</option>
          </select>
        </div>
      </div>

      <div className="products-layout">
        {/* Sidebar Filters */}
        <aside className="filter-sidebar">
          <div className="filter-section">
            <h3>Categories</h3>
            <ul className="filter-category-list">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className={`filter-category-item ${categoryVal === cat ? 'active' : ''}`}
                  onClick={() => updateParam('category', cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h3>Max Price (₹{maxPriceInput})</h3>
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              className="price-range-slider"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
            />
            <div className="price-range-labels">
              <span>₹0</span>
              <span>₹1,00,000</span>
            </div>
            <button
              onClick={handlePriceFilterApply}
              className="btn btn-primary btn-sm btn-full"
              style={{ marginTop: '14px' }}
            >
              Apply Filter
            </button>
          </div>

          <button
            onClick={handleClearFilters}
            className="btn btn-outline btn-sm btn-full"
          >
            Clear All Filters
          </button>
        </aside>

        {/* Products Grid */}
        <main>
          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="product-grid">
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <FiInbox />
              <h3>No Products Found</h3>
              <p>We couldn't find any products matching your selection. Try adjusting your filters or search terms.</p>
              <button onClick={handleClearFilters} className="btn btn-primary">
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map((prod) => {
                  const discountedPrice = prod.price * (1 - (prod.discount || 0) / 100);
                  const finalPrice = Math.round(discountedPrice * 100) / 100;
                  return (
                    <div key={prod._id} className="card product-card">
                      {prod.discount > 0 && (
                        <div className="product-card-discount">-{prod.discount}%</div>
                      )}
                      {prod.stock === 0 && (
                        <div className="product-card-badge">SOLD OUT</div>
                      )}
                      <Link to={`/products/${prod._id}`} className="product-card-image">
                        <img src={prod.images[0]} alt={prod.name} />
                      </Link>
                      <div className="product-card-content">
                        <span className="product-card-category">{prod.category}</span>
                        <Link to={`/products/${prod._id}`} className="product-card-title">
                          {prod.name}
                        </Link>
                        <div className="rating-stars" style={{ marginBottom: '10px' }}>
                          {renderStars(prod.rating)}
                          <span className="rating-count">({prod.rating})</span>
                        </div>
                        <div className="product-card-price-row">
                          <span className="price-actual">₹{finalPrice}</span>
                          {prod.discount > 0 && (
                            <span className="price-original">₹{prod.price}</span>
                          )}
                        </div>
                        <div className="product-card-actions">
                          <Link to={`/products/${prod._id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                            Details
                          </Link>
                          <button
                            onClick={() => handleAddToCart(prod)}
                            disabled={prod.stock === 0}
                            className="btn btn-primary btn-sm"
                            style={{ flex: 1.2 }}
                          >
                            <FiShoppingBag /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="pagination">
                  <button
                    disabled={pageVal === '1'}
                    onClick={() => updateParam('page', String(Number(pageVal) - 1))}
                    className="page-btn"
                  >
                    &laquo;
                  </button>
                  {[...Array(pages).keys()].map((num) => (
                    <button
                      key={num + 1}
                      onClick={() => updateParam('page', String(num + 1))}
                      className={`page-btn ${pageVal === String(num + 1) ? 'active' : ''}`}
                    >
                      {num + 1}
                    </button>
                  ))}
                  <button
                    disabled={pageVal === String(pages)}
                    onClick={() => updateParam('page', String(Number(pageVal) + 1))}
                    className="page-btn"
                  >
                    &raquo;
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
