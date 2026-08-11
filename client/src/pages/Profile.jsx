import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { FiUser, FiBriefcase, FiLock, FiLogOut, FiEye, FiSettings, FiLoader } from 'react-icons/fi';

const Profile = () => {
  const { user, isAuthenticated, loading: authLoading, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('info'); // 'info', 'orders', 'security'
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Load orders if the active tab changes to 'orders'
  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === 'orders' && isAuthenticated) {
        setOrdersLoading(true);
        setOrdersError('');
        try {
          const data = await orderAPI.getMyOrders();
          setOrders(data || []);
        } catch (err) {
          console.error(err);
          setOrdersError('Failed to fetch orders history.');
        } finally {
          setOrdersLoading(false);
        }
      }
    };
    fetchOrders();
  }, [activeTab, isAuthenticated]);

  if (authLoading) {
    return (
      <div className="loader-container">
        <FiLoader className="spinner" />
      </div>
    );
  }

  // Route Guard
  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=profile" replace />;
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });

    if (!name || !email) {
      setMsg({ text: 'Name and email are required.', type: 'danger' });
      return;
    }

    setSaving(true);
    const res = await updateProfile({ name, email });
    setSaving(false);

    if (res.success) {
      setMsg({ text: 'Profile updated successfully!', type: 'success' });
    } else {
      setMsg({ text: res.error || 'Failed to update profile.', type: 'danger' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });

    if (!password || !confirmPassword) {
      setMsg({ text: 'Please fill in both password fields.', type: 'danger' });
      return;
    }

    if (password !== confirmPassword) {
      setMsg({ text: 'Passwords do not match.', type: 'danger' });
      return;
    }

    if (password.length < 6) {
      setMsg({ text: 'Password must be at least 6 characters.', type: 'danger' });
      return;
    }

    setSaving(true);
    const res = await updateProfile({ password });
    setSaving(false);

    if (res.success) {
      setMsg({ text: 'Password updated successfully!', type: 'success' });
      setPassword('');
      setConfirmPassword('');
    } else {
      setMsg({ text: res.error || 'Failed to change password.', type: 'danger' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  return (
    <div className="container section-padding" style={{ paddingTop: '40px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>User Account</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
        Manage your profile information and view your active order statuses
      </p>

      <div className="profile-layout">
        {/* Sidebar Nav */}
        <aside className="profile-sidebar">
          <div className="profile-sidebar-header">
            <div
              className="user-avatar-name"
              style={{ width: '60px', height: '60px', fontSize: '1.75rem', margin: '0 auto 12px' }}
            >
              {user?.name?.charAt(0)}
            </div>
            <h3>{user?.name}</h3>
            <p>{user?.role === 'admin' ? 'Administrator' : 'Premium Customer'}</p>
          </div>

          <button
            onClick={() => {
              setActiveTab('info');
              setMsg({ text: '', type: '' });
            }}
            className={`profile-nav-item ${activeTab === 'info' ? 'active' : ''}`}
          >
            <FiUser /> Profile Details
          </button>
          <button
            onClick={() => {
              setActiveTab('orders');
              setMsg({ text: '', type: '' });
            }}
            className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
          >
            <FiBriefcase /> Order History
          </button>
          <button
            onClick={() => {
              setActiveTab('security');
              setMsg({ text: '', type: '' });
            }}
            className={`profile-nav-item ${activeTab === 'security' ? 'active' : ''}`}
          >
            <FiLock /> Password Security
          </button>
          {user?.role === 'admin' && (
            <button onClick={() => navigate('/admin')} className="profile-nav-item" style={{ color: 'var(--accent)' }}>
              <FiSettings /> Admin Panel
            </button>
          )}
          <button onClick={handleLogout} className="profile-nav-item logout-btn">
            <FiLogOut /> Log Out
          </button>
        </aside>

        {/* Content Panel */}
        <main className="profile-content-panel">
          {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

          {/* TAB 1: Profile Info */}
          {activeTab === 'info' && (
            <div>
              <h3>Account Details</h3>
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Account Role</label>
                  <input type="text" className="form-control" value={user?.role} disabled readOnly />
                </div>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ marginTop: '10px' }}>
                  {saving ? 'Saving...' : 'Update Details'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Order History */}
          {activeTab === 'orders' && (
            <div>
              <h3>Order History</h3>
              {ordersLoading ? (
                <div style={{ textAlign: 'center', padding: '30px' }}>
                  <FiLoader className="spinner" />
                </div>
              ) : ordersError ? (
                <div className="alert alert-danger">{ordersError}</div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  <FiBriefcase style={{ fontSize: '2rem', marginBottom: '10px' }} />
                  <p>You have not placed any orders yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => (
                        <tr key={ord._id}>
                          <td style={{ fontFamily: 'monospace', fontWeight: '500', fontSize: '0.85rem' }}>
                            {ord._id}
                          </td>
                          <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
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
                              style={{ padding: '4px 8px' }}
                            >
                              <FiEye /> View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Security */}
          {activeTab === 'security' && (
            <div>
              <h3>Change Password</h3>
              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ marginTop: '10px' }}>
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
