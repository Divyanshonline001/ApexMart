import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import { FiCreditCard, FiArrowLeft, FiLoader } from 'react-icons/fi';

const Checkout = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { cartItems, cartSubtotal, shippingCost, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const [phone, setPhone] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  // Protect route
  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login?redirect=checkout" replace />;
  }

  // Redirect if cart is empty
  if (!placing && cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone) {
      setError('Please add a contact phone number.');
      return;
    }

    setPlacing(true);
    try {
      // Place order in backend database
      const orderData = await orderAPI.placeOrder({
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      });

      // Clear the local React cart context
      await clearCart();

      // Redirect to Order Success page
      navigate(`/order-success/${orderData._id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      setPlacing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="loader-container">
        <FiLoader className="spinner" />
      </div>
    );
  }

  return (
    <div className="container section-padding" style={{ paddingTop: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <button onClick={() => navigate('/cart')} className="btn btn-outline btn-sm">
          <FiArrowLeft /> Back to Cart
        </button>
      </div>

      <h1 style={{ fontSize: '2rem', marginBottom: '30px' }}>Checkout</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="checkout-layout">
        {/* Shipping Form Panel */}
        <form onSubmit={handleSubmit} className="checkout-form-panel">
          <h3>Customer Details</h3>
          <div className="checkout-grid" style={{ marginBottom: '24px' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" className="form-control" value={user?.name || ''} readOnly disabled />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="form-control" value={user?.email || ''} readOnly disabled />
            </div>
            <div className="form-group checkout-col-span">
              <label>Contact Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <h3>Delivery Address</h3>
          <div className="checkout-grid">
            <div className="form-group checkout-col-span">
              <label>Street Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                placeholder="e.g. 123 MG Road, Sector 4"
                value={shippingAddress.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                className="form-control"
                placeholder="e.g. Mumbai"
                value={shippingAddress.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>State / Region</label>
              <input
                type="text"
                name="state"
                className="form-control"
                placeholder="e.g. Maharashtra"
                value={shippingAddress.state}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Postal / Zip Code</label>
              <input
                type="text"
                name="postalCode"
                className="form-control"
                placeholder="e.g. 400001"
                value={shippingAddress.postalCode}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                className="form-control"
                placeholder="e.g. India"
                value={shippingAddress.country}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="checkout-payment-box">
            <h4>Payment Method</h4>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginTop: '10px' }}>
              <FiCreditCard /> Cash on Delivery (COD)
            </p>
            <p style={{ fontSize: '0.8rem', marginTop: '6px', color: '#475569' }}>
              For this version, we support COD. You will pay in cash upon receiving the delivery at your doorstep.
            </p>
          </div>
        </form>

        {/* Order details summary */}
        <aside className="summary-card">
          <h3>Items Summary</h3>
          <div className="checkout-summary-items">
            {cartItems.map((item) => {
              const discountedPrice = item.product.price * (1 - (item.product.discount || 0) / 100);
              const finalPrice = Math.round(discountedPrice * 100) / 100;
              return (
                <div key={item.product._id} className="checkout-item-line">
                  <div>
                    <span style={{ fontWeight: '600' }}>{item.product.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                      Qty: {item.quantity} x ₹{finalPrice}
                    </span>
                  </div>
                  <span style={{ fontWeight: '600' }}>₹{(finalPrice * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{cartSubtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}</span>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={placing}
            className="btn btn-primary btn-lg btn-full"
            style={{ marginTop: '24px' }}
          >
            {placing ? (
              <>
                <FiLoader className="spinner spinner-sm" /> Processing Order...
              </>
            ) : (
              'Place COD Order'
            )}
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
