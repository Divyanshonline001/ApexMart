import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { FiArrowRight, FiStar, FiShoppingBag, FiTruck, FiShield, FiRotateCcw } from 'react-icons/fi';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await productAPI.getProducts({ limit: 4 });
        setFeaturedProducts(data.products || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load featured products.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddToCart = async (product) => {
    const res = await addToCart(product, 1);
    if (res.success) {
      triggerToast(`Added ${product.name} to cart!`);
    } else {
      triggerToast(res.error || 'Failed to add item');
    }
  };

  const categoriesList = [
    {
      name: 'Electronics',
      count: 'Premium Gadgets',
      img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=60',
    },
    {
      name: 'Fashion',
      count: 'Modern Apparel',
      img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=60',
    },
    {
      name: 'Accessories',
      count: 'Elegant Accents',
      img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
    },
    {
      name: 'Home',
      count: 'Cozy Living',
      img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&auto=format&fit=crop&q=60',
    },
  ];

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
    <div className="home-page-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast success">{toastMessage}</div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section container">
        <div className="hero-grid">
          <div className="hero-content">
            <span className="hero-badge">Summer Collection 2026</span>
            <h1>Exclusive Premium Products Just For <span>You</span></h1>
            <p>
              Experience handpicked tech, modern clothing apparel, accessories, and home items at unmatched price discounts.
            </p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Shop Now <FiArrowRight />
            </Link>
          </div>
          <div className="hero-image-col">
            <div className="hero-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
                alt="Premium store products shelf display"
              />
            </div>
            <div className="hero-circle-accent"></div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-badges-section container section-padding" style={{ paddingBottom: '40px' }}>
        <div className="admin-stats-grid" style={{ marginBottom: 0 }}>
          <div className="stat-card">
            <div className="stat-icon flex-center" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
              <FiTruck />
            </div>
            <div className="stat-info">
              <h3>Free Shipping</h3>
              <p>On orders above ₹1500</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon flex-center" style={{ backgroundColor: '#d1fae5', color: '#059669' }}>
              <FiShield />
            </div>
            <div className="stat-info">
              <h3>Secure Payments</h3>
              <p>COD and SSL secured system</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon flex-center" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
              <FiRotateCcw />
            </div>
            <div className="stat-info">
              <h3>Easy Returns</h3>
              <p>30-day moneyback guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section container section-padding">
        <div className="section-header">
          <h2>Popular Categories</h2>
          <p className="section-subtitle">Browse through our wide range of products organized by category</p>
        </div>
        <div className="category-grid">
          {categoriesList.map((cat) => (
            <Link to={`/products?category=${cat.name}`} key={cat.name} className="category-card">
              <img src={cat.img} alt={`${cat.name} Category`} />
              <div className="category-info">
                <h3>{cat.name}</h3>
                <p>{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section container section-padding" style={{ paddingTop: '0px' }}>
        <div className="section-header-flex">
          <div>
            <h2>Featured Products</h2>
            <p className="section-subtitle">Explore some of our best-selling high-quality products</p>
          </div>
          <Link to="/products" className="btn btn-outline" style={{ border: 'none', color: 'var(--primary)', fontWeight: '600' }}>
            View All Products <FiArrowRight />
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="product-grid">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        ) : (
          <div className="product-grid">
            {featuredProducts.map((prod) => {
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
        )}
      </section>

      {/* Special Offer Promotional Section */}
      <section className="promotional-section container section-padding" style={{ paddingTop: '0px' }}>
        <div className="promo-banner">
          <div className="promo-grid">
            <div className="promo-content">
              <h2>Join the Smart Living Revolution</h2>
              <p>Get up to 20% discount on all smart electronics items. Limitless connectivity, ergonomic styles, and zero hassle.</p>
              <Link to="/products?category=Electronics" className="btn btn-secondary btn-lg">
                Explore Tech
              </Link>
            </div>
            <div className="promo-image">
              <img
                src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80"
                alt="Promo banner high resolution electronics screen"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
