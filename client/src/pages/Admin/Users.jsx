import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { FiArrowLeft, FiTrash2, FiLoader } from 'react-icons/fi';

const AdminUsers = () => {
  const { user: currentUser, isAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userAPI.getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve user directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUser?._id) {
      alert('You cannot modify your own administrative role.');
      return;
    }
    
    try {
      await userAPI.updateUser(userId, { role: newRole });
      setToastMessage(`User role updated to "${newRole}" successfully.`);
      setTimeout(() => setToastMessage(''), 3000);
      
      // Update state locally
      setUsers(prevUsers =>
        prevUsers.map(usr => (usr._id === userId ? { ...usr, role: newRole } : usr))
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  const handleDelete = async (userId, userName) => {
    if (userId === currentUser?._id) {
      alert('You cannot delete your own administrative account.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      try {
        await userAPI.deleteUser(userId);
        setToastMessage(`User "${userName}" deleted successfully.`);
        setTimeout(() => setToastMessage(''), 3000);
        fetchUsers(); // Reload
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to delete user.');
      }
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

      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Store Users</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
        Manage registered accounts, permissions, and database roles
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loader-container">
          <FiLoader className="spinner" />
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <h3>No Users Found</h3>
          <p>No user accounts exist in the database.</p>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: '20px' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registered Date</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((usr) => (
                  <tr key={usr._id}>
                    <td style={{ fontWeight: '600' }}>{usr.name}</td>
                    <td>{usr.email}</td>
                    <td>
                      {new Date(usr.createdAt).toLocaleDateString(undefined, {
                        dateStyle: 'medium',
                      })}
                    </td>
                    <td>
                      <select
                        value={usr.role}
                        onChange={(e) => handleRoleChange(usr._id, e.target.value)}
                        disabled={usr._id === currentUser?._id}
                        className="form-control"
                        style={{ width: '120px', padding: '6px 12px', fontSize: '0.85rem' }}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(usr._id, usr.name)}
                        disabled={usr._id === currentUser?._id}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px' }}
                        title="Delete User"
                        aria-label="Delete user button"
                      >
                        <FiTrash2 />
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

export default AdminUsers;
