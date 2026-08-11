import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI } from '../../services/api';
import { FiPlus, FiEdit, FiTrash2, FiArrowLeft, FiLoader } from 'react-icons/fi';

const ProductsList = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productAPI.getProducts({ limit: 100 });
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch products catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      try {
        await productAPI.deleteProduct(id);
        setToastMessage(`Product "${name}" deleted successfully.`);
        setTimeout(() => setToastMessage(''), 3000);
        fetchProducts(); // reload
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to delete product.');
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

      <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Product Catalog</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage products, inventory, and listings details</p>
        </div>
        <Link to="/admin/products/add" className="btn btn-primary">
          <FiPlus /> Add New Product
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loader-container">
          <FiLoader className="spinner" />
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h3>No products in database.</h3>
          <p>Get started by creating your very first catalog entry.</p>
          <Link to="/admin/products/add" className="btn btn-primary" style={{ marginTop: '10px' }}>
            Add Product
          </Link>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: '20px' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: 'none' }}>
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', backgroundColor: '#f1f5f9' }}
                      />
                      <span style={{ fontWeight: '600', maxWidth: '240px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {prod.name}
                      </span>
                    </td>
                    <td>{prod.category}</td>
                    <td style={{ fontWeight: '500' }}>₹{prod.price.toFixed(2)}</td>
                    <td>{prod.discount}%</td>
                    <td>
                      <span style={{ fontWeight: '600', color: prod.stock === 0 ? 'var(--danger)' : prod.stock < 5 ? 'var(--accent)' : 'inherit' }}>
                        {prod.stock} units
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link to={`/admin/products/edit/${prod._id}`} className="btn btn-outline btn-sm" style={{ padding: '6px' }} title="Edit Product">
                          <FiEdit />
                        </Link>
                        <button onClick={() => handleDelete(prod._id, prod.name)} className="btn btn-danger btn-sm" style={{ padding: '6px' }} title="Delete Product" aria-label="Delete product button">
                          <FiTrash2 />
                        </button>
                      </div>
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

export default ProductsList;
