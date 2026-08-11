import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { FiBriefcase, FiEye, FiArrowLeft, FiLoader } from 'react-icons/fi';

const Orders = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (isAuthenticated) {
        try {
          const data = await orderAPI.getMyOrders();
          setOrders(data || []);
        } catch (err) {
          console.error(err);
          setError('Failed to load orders.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrders();
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="loader-container">
        <FiLoader className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=orders" replace />;
  }

  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  return (
    <div className="container section-padding" style={{ paddingTop: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/profile" className="btn btn-outline btn-sm">
          <FiArrowLeft /> Back to Profile
        </Link>
      </div>

      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>My Orders</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
        Track your current orders and review past purchases
      </p>

      {loading ? (
        <div className="loader-container">
          <FiLoader className="spinner" />
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : orders.length === 0 ? (
        <div className="empty-state" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <FiBriefcase />
          <h3>No Orders Found</h3>
          <p>You haven't placed any orders yet. Check out our catalog and buy some items!</p>
          <Link to="/products" className="btn btn-primary">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="profile-content-panel" style={{ padding: '20px' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date Placed</th>
                  <th>Items Count</th>
                  <th>Order Status</th>
                  <th>Total Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord._id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: '500', fontSize: '0.85rem' }}>
                      {ord._id}
                    </td>
                    <td>
                      {new Date(ord.createdAt).toLocaleDateString(undefined, {
                        dateStyle: 'medium',
                      })}
                    </td>
                    <td>
                      {ord.items.reduce((acc, item) => acc + item.quantity, 0)}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(ord.orderStatus)}`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td style={{ fontWeight: '600' }}>₹{ord.total.toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/orders/${ord._id}`)}
                        className="btn btn-outline btn-sm"
                      >
                        <FiEye /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
