import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiArrowLeft, FiClock, FiMapPin, FiCreditCard, FiShoppingBag, FiLoader } from 'react-icons/fi';

const OrderDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await orderAPI.getOrderDetails(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to retrieve order details.');
      } finally {
        setLoading(false);
      }
    };
    if (id && isAuthenticated) {
      fetchOrderDetails();
    }
  }, [id, isAuthenticated]);

  if (authLoading) {
    return (
      <div className="loader-container">
        <FiLoader className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=orders/${id}`} replace />;
  }

  if (loading) {
    return (
      <div className="loader-container">
        <FiLoader className="spinner" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container section-padding text-center">
        <div className="alert alert-danger" style={{ display: 'inline-block' }}>{error || 'Order not found.'}</div>
        <div style={{ marginTop: '20px' }}>
          <Link to="/orders" className="btn btn-primary">
            <FiArrowLeft /> Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  return (
    <div className="container section-padding" style={{ paddingTop: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <button onClick={() => navigate(isAdmin ? '/admin/orders' : '/orders')} className="btn btn-outline btn-sm">
          <FiArrowLeft /> {isAdmin ? 'Back to Store Orders' : 'Back to Orders'}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Order Details</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Order ID:{' '}
            <span style={{ fontFamily: 'monospace', fontWeight: '600', color: 'var(--secondary)' }}>
              {order._id}
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span className="status-badge" style={{ backgroundColor: '#e2e8f0', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '500' }}>
            Placed on: {new Date(order.createdAt).toLocaleDateString()}
          </span>
          <span className={`status-badge ${getStatusClass(order.orderStatus)}`} style={{ fontSize: '0.85rem' }}>
            Status: {order.orderStatus}
          </span>
        </div>
      </div>

      <div className="cart-layout">
        {/* Left: Items list & Shipping Address */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Items card */}
          <div className="admin-card">
            <h3><FiShoppingBag /> Order Items</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              {order.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <div>
                    <span style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--secondary)' }}>
                      {item.name}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Qty: {item.quantity} x ₹{item.price}
                    </span>
                  </div>
                  <span style={{ fontWeight: '750', color: 'var(--secondary)' }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Details */}
          <div className="admin-card">
            <h3><FiMapPin /> Delivery Address</h3>
            <div style={{ marginTop: '16px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              <p style={{ color: 'var(--secondary)', fontWeight: '600' }}>{order.user?.name}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Right: Payment & Invoicing details */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="summary-card" style={{ position: 'static' }}>
            <h3>Invoice Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total Paid</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="admin-card">
            <h3><FiCreditCard /> Payment Information</h3>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="success-line">
                <span className="success-line-label">Method:</span>
                <span className="success-line-val" style={{ fontWeight: '600' }}>{order.paymentMethod}</span>
              </div>
              <div className="success-line">
                <span className="success-line-label">Payment Status:</span>
                <span className={`status-badge ${getStatusClass(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h3><FiClock /> Order Tracking</h3>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="success-line">
                <span className="success-line-label">Current Stage:</span>
                <span className={`status-badge ${getStatusClass(order.orderStatus)}`} style={{ fontWeight: '600' }}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="success-line">
                <span className="success-line-label">Last Updated:</span>
                <span className="success-line-val">
                  {new Date(order.updatedAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrderDetails;
