import React, { useEffect, useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, productAPI, userAPI } from '../../services/api';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiAlertCircle, FiSettings, FiLoader, FiEye } from 'react-icons/fi';

const Dashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminStats = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch all data for calculations
        const [usersData, productsRes, ordersData] = await Promise.all([
          userAPI.getUsers(),
          productAPI.getProducts({ limit: 100 }), // Fetch products without short limit
          orderAPI.getAllOrders(),
        ]);

        const totalUsers = usersData.length;
        const totalProducts = productsRes.totalProducts;
        const allOrders = ordersData || [];
        const totalOrders = allOrders.length;

        // Calculate Revenue (sum of all delivered orders or total order amounts)
        const totalRev = allOrders.reduce((sum, ord) => {
          return sum + (ord.orderStatus === 'Delivered' || ord.paymentStatus === 'Paid' ? ord.total : 0);
        }, 0);

        // Filter low stock products (stock < 5)
        const lowStock = (productsRes.products || []).filter(prod => prod.stock < 5);

        // Calculate best-selling products from order items
        const itemSalesMap = {};
        allOrders.forEach(ord => {
          if (ord.orderStatus !== 'Cancelled') {
            ord.items.forEach(item => {
              itemSalesMap[item.name] = (itemSalesMap[item.name] || 0) + item.quantity;
            });
          }
        });
        
        const sortedSales = Object.entries(itemSalesMap)
          .map(([name, qty]) => ({ name, qty }))
          .sort((a, b) => b.qty - a.qty)
          .slice(0, 5);

        setUsersCount(totalUsers);
        setProductsCount(totalProducts);
        setOrdersCount(totalOrders);
        setRevenue(totalRev);
        setRecentOrders(allOrders.slice(0, 5));
        setLowStockProducts(lowStock);
        setBestSellers(sortedSales);
      } catch (err) {
        console.error(err);
        setError('Failed to compute dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchAdminStats();
    }
  }, [isAdmin]);

  // Route Guard
  if (authLoading) {
    return (
      <div className="loader-container">
        <FiLoader className="spinner" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  return (
    <div className="container section-padding" style={{ paddingTop: '40px' }}>
      {/* Admin Panel Header Menu */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Overview of your e-commerce operations</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/products" className="btn btn-outline btn-sm">
            Manage Products
          </Link>
          <Link to="/admin/orders" className="btn btn-outline btn-sm">
            Manage Orders
          </Link>
          <Link to="/admin/users" className="btn btn-outline btn-sm">
            Manage Users
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loader-container">
          <FiLoader className="spinner" />
        </div>
      ) : (
        <>
          {/* Key Metric Counters */}
          <div className="admin-stats-grid">
            <div className="stat-card">
              <div className="stat-icon flex-center" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                <FiDollarSign />
              </div>
              <div className="stat-info">
                <p>Total Revenue</p>
                <h3>₹{revenue.toFixed(2)}</h3>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon flex-center" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <FiShoppingBag />
              </div>
              <div className="stat-info">
                <p>Total Orders</p>
                <h3>{ordersCount}</h3>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon flex-center" style={{ backgroundColor: '#fdf2f2', color: '#ef4444' }}>
                <FiPackage />
              </div>
              <div className="stat-info">
                <p>Total Products</p>
                <h3>{productsCount}</h3>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon flex-center" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
                <FiUsers />
              </div>
              <div className="stat-info">
                <p>Registered Users</p>
                <h3>{usersCount}</h3>
              </div>
            </div>
          </div>

          {/* Low Stock Alerts */}
          {lowStockProducts.length > 0 && (
            <div className="alert alert-danger" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                <FiAlertCircle /> Low Stock Warning!
              </div>
              <p style={{ fontSize: '0.85rem' }}>
                The following products are running out of stock (less than 5 units left):{' '}
                {lowStockProducts.map(prod => `"${prod.name}" (${prod.stock} left)`).join(', ')}.
              </p>
            </div>
          )}

          {/* Recent Orders & Sales Trends Grid */}
          <div className="admin-recent-flex">
            {/* Left: Recent Orders */}
            <div className="admin-card" style={{ padding: '20px' }}>
              <h3>Recent Orders</h3>
              <div className="table-responsive" style={{ marginTop: '10px' }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((ord) => (
                      <tr key={ord._id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{ord._id}</td>
                        <td>{ord.user?.name || 'Guest'}</td>
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
                            <FiEye /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Best Sellers List */}
            <div className="admin-card">
              <h3>Top Selling Products</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                {bestSellers.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No sales recorded yet.</p>
                ) : (
                  bestSellers.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.name}</span>
                      <span className="badge badge-primary">{item.qty} Sold</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
