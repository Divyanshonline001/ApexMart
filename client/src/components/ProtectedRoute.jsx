import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiShield } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// ── Spinner shown while auth state is being resolved ──────────────────────────
const AuthLoader = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
    }}
  >
    <div className="loading-spinner" />
  </div>
);

// ── Blocks unauthenticated users → redirect to /login ─────────────────────────
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// ── Blocks non-admin users → shows 403 Forbidden page ─────────────────────────
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoader />;

  // Not logged in at all → send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but not an admin → show 403 page
  if (!isAdmin) {
    return (
      <div className="container section-padding">
        <div
          className="empty-state"
          style={{
            maxWidth: '520px',
            margin: '80px auto',
            textAlign: 'center',
            padding: '48px 32px',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff4d4f22, #ff4d4f44)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <FiShield style={{ fontSize: '2.4rem', color: '#ff4d4f' }} />
          </div>

          {/* Badge */}
          <span
            style={{
              display: 'inline-block',
              background: '#ff4d4f22',
              color: '#ff4d4f',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '4px 12px',
              borderRadius: '999px',
              marginBottom: '16px',
            }}
          >
            403 — Access Denied
          </span>

          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              marginBottom: '12px',
              color: 'var(--text-primary)',
            }}
          >
            Admin Access Only
          </h2>

          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.6 }}>
            This area is restricted to administrators. You don't have the required permissions
            to view this page.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary">
              Go to Home
            </Link>
            <Link to="/profile" className="btn btn-outline">
              My Account
            </Link>
          </div>

          {/* Lock icon watermark */}
          <div style={{ marginTop: '32px', opacity: 0.08 }}>
            <FiLock style={{ fontSize: '6rem', color: 'var(--text-primary)' }} />
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
