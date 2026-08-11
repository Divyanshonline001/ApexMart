import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiLoader } from 'react-icons/fi';

const Cart = () => {
  const {
    cartItems,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    shippingCost,
    cartTotal,
  } = useCart();

  if (loading) {
    return (
      <div className="loader-container">
        <FiLoader className="spinner" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container section-padding text-center">
        <div className="empty-state" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <FiShoppingBag />
          <h3>Your Shopping Cart is Empty</h3>
          <p>Before you check out, you must add some premium items to your shopping cart.</p>
          <Link to="/products" className="btn btn-primary">
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section-padding" style={{ paddingTop: '40px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Shopping Cart</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
        You have {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items in your cart
      </p>

      <div className="cart-layout">
        {/* Cart items list */}
        <div className="cart-items-section">
          {cartItems.map((item) => {
            const originalPrice = item.product.price;
            const discount = item.product.discount || 0;
            const discountedPrice = originalPrice * (1 - discount / 100);
            const finalPrice = Math.round(discountedPrice * 100) / 100;

            return (
              <div key={item.product._id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.product.images[0]} alt={item.product.name} />
                </div>
                <div className="cart-item-info">
                  <span className="cart-item-category">{item.product.category}</span>
                  <Link to={`/products/${item.product._id}`} className="cart-item-title">
                    {item.product.name}
                  </Link>
                  <div className="cart-item-price">₹{finalPrice}</div>
                </div>

                {/* Quantity Toggle */}
                <div className="qty-selector">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                  >
                    +
                  </button>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="cart-item-remove"
                  title="Remove item"
                  aria-label="Remove item button"
                >
                  <FiTrash2 />
                </button>
              </div>
            );
          })}

          <div className="cart-buttons-row">
            <Link to="/products" className="btn btn-outline">
              Continue Shopping
            </Link>
            <button onClick={clearCart} className="btn btn-danger btn-outline" style={{ border: '1px solid var(--danger)' }}>
              Clear Cart
            </button>
          </div>
        </div>

        {/* Pricing Summary */}
        <aside className="summary-card">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{cartSubtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}</span>
          </div>
          {shippingCost > 0 && (
            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '14px', textAlign: 'right' }}>
              Add ₹${(1500 - cartSubtotal).toFixed(2)} more for FREE shipping!
            </div>
          )}
          <div className="summary-row total-row">
            <span>Total</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="btn btn-primary btn-lg btn-full" style={{ marginTop: '24px' }}>
            Proceed to Checkout <FiArrowRight />
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
