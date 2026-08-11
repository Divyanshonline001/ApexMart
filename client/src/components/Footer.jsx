import React from 'react';
import { Link } from 'react-router-dom';
import { FiTwitter, FiGithub, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer-minimal">
      <div className="container footer-minimal-container">

        {/* Top Section: Brand Info & Social Icons */}
        <div className="footer-top-row">
          <div className="footer-brand-info">
            <Link to="/" className="footer-logo-minimal">
              Apex<span>Mart</span>
            </Link>
            <p className="footer-tagline">
              Curated premium goods, designed for a modern lifestyle.
            </p>
          </div>

          <div className="footer-social-icons">
            <a href="https://www.linkedin.com/in/divyansh-rastogi-059550308" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FiTwitter /></a>
            <a href="https://github.com/Divyanshonline001" target="_blank" rel="noreferrer" aria-label="Github"><FiGithub /></a>
          </div>
        </div>

        {/* Middle Section: Quick Nav Links */}
        <div className="footer-links-row">
          <div className="footer-links-group">
            <Link to="/products">Shop All</Link>
            <Link to="/products?category=Electronics">Electronics</Link>
            <Link to="/products?category=Fashion">Fashion</Link>
            <Link to="/products?category=Accessories">Accessories</Link>
            <Link to="/products?category=Home">Home & Living</Link>
          </div>
          <div className="footer-links-group">
            <Link to="/profile">My Account</Link>
            <Link to="/orders">Track Orders</Link>
            <Link to="/cart">Shopping Cart</Link>
          </div>
        </div>

        <div className="footer-divider"></div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="footer-bottom-row">
          <p className="footer-copyright">&copy; {new Date().getFullYear()} ApexMart. All rights reserved.</p>
          <div className="footer-legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
