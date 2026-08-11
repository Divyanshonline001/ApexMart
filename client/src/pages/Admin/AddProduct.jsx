import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productAPI, uploadAPI } from '../../services/api';
import { FiArrowLeft, FiPlus, FiTrash2, FiLoader, FiUploadCloud, FiCheckCircle } from 'react-icons/fi';

const AddProduct = () => {
  const fileInputRef = React.useRef(null);
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Form Fields State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('0');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageMode, setImageMode] = useState('upload'); // 'upload' or 'url'
  const [uploading, setUploading] = useState(false);
  
  // Specs dynamic list
  const [specs, setSpecs] = useState([{ name: '', value: '' }]);
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    setError('');

    try {
      const res = await uploadAPI.uploadImage(formData);
      setImageUrl(res.url);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to upload image file.');
    } finally {
      setUploading(false);
    }
  };

  // Protect route
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

  const handleAddSpecField = () => {
    setSpecs([...specs, { name: '', value: '' }]);
  };

  const handleRemoveSpecField = (idx) => {
    setSpecs(specs.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx, field, value) => {
    const updated = [...specs];
    updated[idx][field] = value;
    setSpecs(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !description || price === '' || stock === '' || !imageUrl) {
      setError('Please fill in all required fields.');
      return;
    }

    if (Number(price) < 0 || Number(stock) < 0) {
      setError('Price and stock cannot be negative values.');
      return;
    }

    setSaving(true);
    try {
      // Filter out empty specifications
      const filteredSpecs = specs.filter(sp => sp.name.trim() !== '' && sp.value.trim() !== '');

      await productAPI.createProduct({
        name,
        category,
        description,
        price: Number(price),
        discount: Number(discount) || 0,
        stock: Number(stock),
        images: [imageUrl.trim()],
        specifications: filteredSpecs,
      });

      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create product.');
      setSaving(false);
    }
  };

  return (
    <div className="container section-padding" style={{ paddingTop: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/admin/products" className="btn btn-outline btn-sm">
          <FiArrowLeft /> Back to Catalog
        </Link>
      </div>

      <h1 style={{ fontSize: '2rem', marginBottom: '30px' }}>Add Product</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="checkout-layout">
        {/* Input Details */}
        <form onSubmit={handleSubmit} className="checkout-form-panel" style={{ gridColumn: '1 / -1' }}>
          <h3>General Information</h3>
          <div className="checkout-grid" style={{ marginBottom: '24px' }}>
            <div className="form-group checkout-col-span">
              <label>Product Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. AcousticMax Headphones"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Accessories">Accessories</option>
                <option value="Home">Home & Living</option>
              </select>
            </div>
            <div className="form-group checkout-col-span">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span>Product Image *</span>
                <span style={{ fontSize: '0.85rem' }}>
                  <button
                    type="button"
                    onClick={() => setImageMode(imageMode === 'upload' ? 'url' : 'upload')}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {imageMode === 'upload' ? 'Paste Image URL Instead' : 'Upload File from Computer'}
                  </button>
                </span>
              </label>

              {imageMode === 'upload' ? (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,.avif"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <div
                    className="file-dropzone"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    <FiUploadCloud className="file-dropzone-icon" />
                    <div className="file-dropzone-title">
                      {uploading ? 'Uploading image from device...' : 'Click to choose image file from your system'}
                    </div>
                    <div className="file-dropzone-subtitle">
                      Supports JPG, PNG, WEBP, AVIF, GIF, SVG (Up to 5MB)
                    </div>
                  </div>
                </div>
              ) : (
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required={!imageUrl}
                />
              )}

              {/* Live Preview Box */}
              {imageUrl && (
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-secondary)', padding: '10px', borderRadius: '8px' }}>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: '600' }}>✓ Image Ready</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', wordBreak: 'break-all', margin: '2px 0 0' }}>{imageUrl}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="form-group checkout-col-span">
              <label>Description *</label>
              <textarea
                rows="4"
                className="form-control"
                placeholder="Write detailed product descriptions here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>
          </div>

          <h3>Inventory & Pricing</h3>
          <div className="checkout-grid" style={{ marginBottom: '24px' }}>
            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Discount (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="form-control"
                placeholder="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            <div className="form-group checkout-col-span">
              <label>Stock Quantity *</label>
              <input
                type="number"
                min="0"
                className="form-control"
                placeholder="Available stock in warehouse"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
          </div>

          <h3>Product Specifications</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Add specific details such as dimension, battery life, weight, or materials.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {specs.map((spec, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Specification Name (e.g. Resolution)"
                  className="form-control"
                  style={{ flex: 1 }}
                  value={spec.name}
                  onChange={(e) => handleSpecChange(idx, 'name', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 1920x1080)"
                  className="form-control"
                  style={{ flex: 1.5 }}
                  value={spec.value}
                  onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpecField(idx)}
                  className="btn btn-danger btn-outline btn-sm"
                  style={{ border: '1px solid var(--danger)', padding: '10px' }}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSpecField}
              className="btn btn-outline btn-sm"
              style={{ width: 'fit-content', marginTop: '10px' }}
            >
              <FiPlus /> Add Specification Field
            </button>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '30px' }}>
            <Link to="/admin/products" className="btn btn-outline">
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Creating Product...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
