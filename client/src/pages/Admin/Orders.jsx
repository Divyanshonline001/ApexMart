import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';
import { FiArrowLeft, FiEye, FiLoader } from 'react-icons/fi';

const AdminOrders = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderAPI.getAllOrders();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch store orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      setToastMessage(`Order status updated to "${newStatus}" successfully.`);
      setTimeout(() => setToastMessage(''), 3000);
      
      // Update local state instead of full reload to save bandwidth
      setOrders(prevOrders => 
        prevOrders.map(ord => 
          ord._id === orderId 
            ? { ...ord, orderStatus: newStatus, paymentStatus: newStatus === 'Delivered' ? 'Paid' : newStatus === 'Cancelled' ? 'Failed' : ord.paymentStatus } 
            : ord
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  // Guards
  if (authLoading) {
    return (
      <div className="loader-container">
        <FiLoader className="spinner" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  return (
    <div className="container section-padding" style={{ paddingTop: '40px' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast success">{toastMessage}</div>
        </div>
      )}

      <div style={{ marginBottom: '24px' }}>
        <Link to="/admin" className="btn btn-outline btn-sm">
          <FiArrowLeft /> Back to Dashboard
        </Link>
      </div>

      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Store Orders</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
        Monitor client purchases, invoice details, and process shipping stages
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loader-container">
          <FiLoader className="spinner" />
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <h3>No Orders Found</h3>
          <p>Clients have not placed any store orders yet.</p>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: '20px' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date Placed</th>
                  <th>Amount</th>
                  <th>Stage Status</th>
                  <th>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord._id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: '500', fontSize: '0.85rem' }}>
                      {ord._id}
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{ord.user?.name || 'Guest User'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {ord.user?.email || 'No email'}
                      </div>
                    </td>
                    <td>
                      {new Date(ord.createdAt).toLocaleDateString(undefined, {
                        dateStyle: 'medium',
                      })}
                    </td>
                    <td style={{ fontWeight: '600' }}>₹{ord.total.toFixed(2)}</td>
                    <td>
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        disabled={ord.orderStatus === 'Cancelled'}
                        className={`status-badge ${getStatusClass(ord.orderStatus)}`}
                        style={{ border: '1px solid var(--border-color)', outline: 'none', cursor: ord.orderStatus === 'Cancelled' ? 'not-allowed' : 'pointer', padding: '4px 8px' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <Link to={`/orders/${ord._id}`} className="btn btn-outline btn-sm" style={{ padding: '6px' }} title="Inspect Order Details">
                        <FiEye /> View
                      </Link>
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

export default AdminOrders;
