import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiStar, FiShoppingBag, FiCreditCard, FiArrowLeft, FiLoader, FiMessageSquare, FiEdit, FiCheck } from 'react-icons/fi';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [toastMessage, setToastMessage] = useState('');

  // Review states
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const prodData = await productAPI.getProduct(id);
        setProduct(prodData);
        
        // Fetch related products in the same category
        const relatedData = await productAPI.getProducts({ category: prodData.category, limit: 5 });
        const filtered = (relatedData.products || []).filter(item => item._id !== id).slice(0, 4);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    setQty(1); // Reset qty on product change
    setCommentInput('');
    setRatingInput(5);
    setIsEditing(false);
    setReviewError('');
  }, [id]);

  const handleQtyChange = (type) => {
    if (type === 'inc') {
      if (qty < product.stock) setQty(qty + 1);
    } else {
      if (qty > 1) setQty(qty - 1);
    }
  };

  const handleAddToCart = async () => {
    const res = await addToCart(product, qty);
    if (res.success) {
      setToastMessage(`Added ${qty} ${qty > 1 ? 'items' : 'item'} to cart!`);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleBuyNow = async () => {
    const res = await addToCart(product, qty);
    if (res.success) {
      navigate('/checkout');
    }
  };

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

  // Find if user already reviewed
  const existingUserReview = product?.reviews?.find(
    (r) => r.user === user?._id || r.user?._id === user?._id
  );

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!ratingInput || !commentInput.trim()) {
      setReviewError('Please provide both a star rating and comment.');
      return;
    }

    setReviewSubmitting(true);
    setReviewError('');

    try {
      if (isEditing || existingUserReview) {
        await productAPI.updateProductReview(id, {
          rating: ratingInput,
          comment: commentInput,
        });
        setToastMessage('Review updated successfully!');
      } else {
        await productAPI.addProductReview(id, {
          rating: ratingInput,
          comment: commentInput,
        });
        setToastMessage('Review submitted successfully!');
      }

      setCommentInput('');
      setIsEditing(false);

      // Refresh product details
      const prodData = await productAPI.getProduct(id);
      setProduct(prodData);

      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const startEditReview = () => {
    if (existingUserReview) {
      setRatingInput(existingUserReview.rating);
      setCommentInput(existingUserReview.comment);
      setIsEditing(true);
    }
  };

  const cancelEditReview = () => {
    setIsEditing(false);
    setCommentInput('');
    setRatingInput(5);
  };

  if (loading) {
    return (
      <div className="loader-container">
        <FiLoader className="spinner" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container section-padding text-center">
        <div className="alert alert-danger" style={{ display: 'inline-block' }}>{error || 'Product not found.'}</div>
        <div style={{ marginTop: '20px' }}>
          <Link to="/products" className="btn btn-primary">
            <FiArrowLeft /> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
  const finalPrice = Math.round(discountedPrice * 100) / 100;

  return (
    <div className="container section-padding" style={{ paddingTop: '40px' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast success">{toastMessage}</div>
        </div>
      )}

      <div style={{ marginBottom: '24px' }}>
        <Link to="/products" className="btn btn-outline btn-sm">
          <FiArrowLeft /> Back to Shop
        </Link>
      </div>

      <div className="details-layout">
        {/* Images Grid */}
        <div className="details-image-gallery">
          <div className="details-main-image card">
            <img src={product.images[0]} alt={product.name} />
          </div>
        </div>

        {/* Info Grid */}
        <div className="details-info-panel">
          <span className="details-category">{product.category}</span>
          <h1 className="details-title">{product.name}</h1>

          {/* Rating stars & stock level */}
          <div className="details-rating-row">
            <div className="rating-stars">
              {renderStars(product.rating)}
              <span className="rating-count">({product.rating.toFixed(1)} / 5.0)</span>
            </div>
            <div>
              {product.stock > 0 ? (
                <span className="stock-tag in-stock">In Stock ({product.stock} left)</span>
              ) : (
                <span className="stock-tag out-stock">Sold Out</span>
              )}
            </div>
          </div>

          {/* Price details */}
          <div className="details-price-card">
            <span className="price-actual">₹{finalPrice}</span>
            {product.discount > 0 && (
              <>
                <span className="price-original">₹{product.price}</span>
                <span className="badge badge-danger">Save {product.discount}%</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="details-desc">{product.description}</p>

          {/* Qty & Actions */}
          {product.stock > 0 && (
            <>
              <div className="details-qty-row">
                <span className="qty-label">Quantity:</span>
                <div className="qty-selector">
                  <button onClick={() => handleQtyChange('dec')} disabled={qty <= 1}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => handleQtyChange('inc')} disabled={qty >= product.stock}>+</button>
                </div>
              </div>

              <div className="details-actions-grid">
                <button onClick={handleAddToCart} className="btn btn-outline btn-lg">
                  <FiShoppingBag /> Add to Cart
                </button>
                <button onClick={handleBuyNow} className="btn btn-primary btn-lg">
                  <FiCreditCard /> Buy Now
                </button>
              </div>
            </>
          )}

          {/* Technical Specs */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="details-specs">
              <h3>Specifications</h3>
              <div className="specs-grid">
                {product.specifications.map((spec, index) => (
                  <React.Fragment key={index}>
                    <div className="spec-name">{spec.name}</div>
                    <div className="spec-value">{spec.value}</div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="section-padding" style={{ paddingBottom: '45px' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          Customer Reviews ({product.numReviews || 0})
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.2fr)', gap: '40px', alignItems: 'start' }}>
          {/* Reviews list */}
          <div>
            {!product.reviews || product.reviews.length === 0 ? (
              <div className="empty-state" style={{ padding: '30px', border: '1px dashed var(--border-color)' }}>
                <FiMessageSquare style={{ fontSize: '2rem', color: 'var(--text-light)', marginBottom: '10px' }} />
                <h4>No Reviews Yet</h4>
                <p>Be the first to share your thoughts and review this product!</p>
              </div>
            ) : (
              <div className="testimonial-grid" style={{ gridTemplateColumns: '1fr', gap: '20px' }}>
                {product.reviews.map((rev, index) => {
                  const isOwnReview = user && (rev.user === user._id || rev.user?._id === user._id);
                  return (
                    <div key={index} className="testimonial-card" style={{ minHeight: 'auto', border: isOwnReview ? '1px solid var(--primary)' : '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="rating-stars">{renderStars(rev.rating)}</div>
                          {isOwnReview && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Your Review</span>}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                          {new Date(rev.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                      </div>
                      <p className="testimonial-text" style={{ marginBottom: '14px', fontStyle: 'italic' }}>"{rev.comment}"</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="testimonial-user">
                          <span className="testimonial-avatar" style={{ width: '30px', height: '30px', fontSize: '0.75rem' }}>
                            {rev.name.charAt(0)}
                          </span>
                          <span className="testimonial-name" style={{ fontSize: '0.85rem' }}>{rev.name}</span>
                        </div>
                        {isOwnReview && !isEditing && (
                          <button onClick={startEditReview} className="btn btn-outline btn-sm" style={{ padding: '4px 8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiEdit style={{ width: '12px' }} /> Edit
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Form to Add/Edit review */}
          <div className="card" style={{ padding: '24px', backgroundColor: '#f8fafc', border: '1px solid var(--border-color)' }}>
            {isAuthenticated ? (
              existingUserReview && !isEditing ? (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <FiCheck style={{ fontSize: '2.5rem', color: 'var(--success)', marginBottom: '12px' }} />
                  <h4 style={{ marginBottom: '8px' }}>Thank you for reviewing!</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    You have already written a review for this item. Feel free to update it anytime.
                  </p>
                  <button onClick={startEditReview} className="btn btn-primary btn-full">
                    Edit Your Review
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '4px' }}>
                    {isEditing ? 'Edit Your Review' : 'Write a Customer Review'}
                  </h4>

                  {reviewError && <div className="alert alert-danger" style={{ fontSize: '0.85rem', padding: '8px 12px' }}>{reviewError}</div>}

                  {/* Stars select */}
                  <div className="form-group">
                    <label style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Rating</label>
                    <div style={{ display: 'flex', gap: '6px', color: '#fbbf24', fontSize: '1.5rem', cursor: 'pointer' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} onClick={() => setRatingInput(star)} style={{ transition: 'transform 0.15s ease' }}>
                          {star <= ratingInput ? <FiStar fill="#fbbf24" /> : <FiStar />}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Comment box */}
                  <div className="form-group">
                    <label style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Comment</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      placeholder="Share your experience with this product..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      required
                      style={{ resize: 'none', backgroundColor: '#fff' }}
                    ></textarea>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                    <button type="submit" disabled={reviewSubmitting} className="btn btn-primary btn-full" style={{ flex: 2 }}>
                      {reviewSubmitting ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
                    </button>
                    {isEditing && (
                      <button type="button" onClick={cancelEditReview} className="btn btn-outline btn-full" style={{ flex: 1 }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <FiMessageSquare style={{ fontSize: '2.5rem', color: 'var(--text-light)', marginBottom: '12px' }} />
                <h4 style={{ marginBottom: '8px' }}>Share your feedback</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Please sign in to write reviews or modify your existing rating comments.
                </p>
                <Link to={`/login?redirect=products/${id}`} className="btn btn-primary btn-full">
                  Sign In to Review
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="section-padding" style={{ paddingTop: '0px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            Related Products
          </h3>
          <div className="product-grid">
            {relatedProducts.map((prod) => {
              const rDiscountPrice = prod.price * (1 - (prod.discount || 0) / 100);
              const rFinalPrice = Math.round(rDiscountPrice * 100) / 100;
              return (
                <div key={prod._id} className="card product-card">
                  {prod.discount > 0 && (
                    <div className="product-card-discount">-{prod.discount}%</div>
                  )}
                  <Link to={`/products/${prod._id}`} className="product-card-image">
                    <img src={prod.images[0]} alt={prod.name} />
                  </Link>
                  <div className="product-card-content">
                    <span className="product-card-category">{prod.category}</span>
                    <Link to={`/products/${prod._id}`} className="product-card-title">
                      {prod.name}
                    </Link>
                    <div className="product-card-price-row">
                      <span className="price-actual">₹{rFinalPrice}</span>
                      {prod.discount > 0 && (
                        <span className="price-original">₹{prod.price}</span>
                      )}
                    </div>
                    <Link to={`/products/${prod._id}`} className="btn btn-outline btn-sm btn-full" style={{ marginTop: 'auto' }}>
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
