import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { FiCheck, FiArrowRight, FiLoader } from 'react-icons/fi';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderAPI.getOrderDetails(orderId);
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError('Could not retrieve order details. Rest assured, your order is being processed.');
      } finally {
        setLoading(false);
      }
    };
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="loader-container">
        <FiLoader className="spinner" />
      </div>
    );
  }

  return (
    <div className="container section-padding">
      <div className="success-card">
        <div className="success-icon-wrapper flex-center">
          <FiCheck />
        </div>
        <h2>Order Confirmed!</h2>
        <p>Thank you for shopping with ApexMart. Your order has been placed and is now pending processing.</p>

        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          order && (
            <div className="success-details-box">
              <h3>Order Invoice Details</h3>
              <div className="success-line">
                <span className="success-line-label">Order Reference:</span>
                <span className="success-line-val" style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                  {order._id}
                </span>
              </div>
              <div className="success-line">
                <span className="success-line-label">Date:</span>
                <span className="success-line-val">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    dateStyle: 'medium',
                  })}
                </span>
              </div>
              <div className="success-line">
                <span className="success-line-label">Payment Method:</span>
                <span className="success-line-val">{order.paymentMethod}</span>
              </div>
              <div className="success-line">
                <span className="success-line-label">Status:</span>
                <span className="status-badge pending">{order.orderStatus}</span>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <div className="success-line" style={{ fontWeight: '700', fontSize: '1rem' }}>
                  <span>Total Amount Paid:</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Delivery Address:</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state},{' '}
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </p>
              </div>
            </div>
          )
        )}

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/products" className="btn btn-outline">
            Continue Shopping
          </Link>
          <Link to="/orders" className="btn btn-primary">
            View Order History <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
