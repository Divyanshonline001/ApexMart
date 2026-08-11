import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiLoader } from 'react-icons/fi';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [isAdminChecked, setIsAdminChecked] = useState(false);
  const [adminCode, setAdminCode] = useState('');

  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect ? `/${redirect}` : '/');
    }
  }, [isAuthenticated, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (isAdminChecked && adminCode !== 'admin123') {
      setError('Invalid admin verification code.');
      return;
    }

    setLocalLoading(true);
    const role = isAdminChecked ? 'admin' : 'user';
    const res = await register(name, email, password, role);
    setLocalLoading(false);

    if (!res.success) {
      setError(res.error || 'Registration failed. Email may already be in use.');
    }
  };

  if (authLoading) {
    return (
      <div className="loader-container">
        <FiLoader className="spinner" />
      </div>
    );
  }

  return (
    <div className="container flex-center" style={{ minHeight: 'calc(100vh - var(--header-height) - 350px)' }}>
      <div className="auth-layout">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join ApexMart and experience premium shopping</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                id="name"
                type="text"
                className="form-control"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ paddingLeft: '38px' }}
              />
              <FiUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '38px' }}
              />
              <FiMail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '38px' }}
              />
              <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="confirmPassword"
                type="password"
                className="form-control"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ paddingLeft: '38px' }}
              />
              <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '15px', marginBottom: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}>
              <input
                type="checkbox"
                checked={isAdminChecked}
                onChange={(e) => {
                  setIsAdminChecked(e.target.checked);
                  setError('');
                }}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              Register as Administrator
            </label>
          </div>

          {isAdminChecked && (
            <div className="form-group" style={{ animation: 'fadeIn 0.2s ease-out' }}>
              <label htmlFor="adminCode">Admin Verification Code *</label>
              <input
                id="adminCode"
                type="password"
                className="form-control"
                placeholder="Enter verification code (default: admin123)"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                Tip: Enter <strong>admin123</strong> to activate administrator permissions.
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={localLoading}
            className="btn btn-primary btn-lg btn-full"
            style={{ marginTop: '10px' }}
          >
            {localLoading ? (
              <>
                <FiLoader className="spinner spinner-sm" /> Registering...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Log In Here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
