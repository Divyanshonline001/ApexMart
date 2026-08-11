import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingBag, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiSettings, FiBriefcase } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown-container')) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
          Apex<span>Mart</span>
        </Link>

        {/* Search Bar */}
        <form className="nav-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search products, brands and categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search button">
            <FiSearch />
          </button>
        </form>

        {/* Navigation Links - Desktop */}
        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={`nav-link ${isActive('/products') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/products?category=Electronics"
              className={`nav-link ${location.search.includes('Electronics') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Electronics
            </Link>
          </li>
          <li>
            <Link
              to="/products?category=Fashion"
              className={`nav-link ${location.search.includes('Fashion') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Fashion
            </Link>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className="nav-actions">
          {/* Shopping Cart */}
          <Link to="/cart" className="nav-icon-btn cart-btn" aria-label="Cart link">
            <FiShoppingBag />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* User Controls */}
          {isAuthenticated ? (
            <div className="user-dropdown-container">
              <button
                className="nav-user-toggle"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <span className="user-avatar-name">{user?.name?.charAt(0)}</span>
                <span className="user-name-text">{user?.name?.split(' ')[0]}</span>
              </button>
              {userDropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-user-name">{user.name}</p>
                    <p className="dropdown-user-email">{user.email}</p>
                  </div>
                  <Link to="/profile" className="dropdown-item">
                    <FiUser /> Profile Info
                  </Link>
                  <Link to="/orders" className="dropdown-item">
                    <FiBriefcase /> Order History
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item admin-link-item">
                      <FiSettings /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Hamburger Menu - Mobile */}
          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
