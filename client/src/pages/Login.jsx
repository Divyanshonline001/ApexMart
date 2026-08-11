import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiLoader } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const { login, isAuthenticated, loading: authLoading } = useAuth();
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

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLocalLoading(true);
    const res = await login(email, password);
    setLocalLoading(false);

    if (!res.success) {
      setError(res.error || 'Invalid credentials. Please try again.');
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
          <h2>Welcome Back</h2>
          <p>Login to your account to continue shopping</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
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
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '38px' }}
              />
              <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={localLoading}
            className="btn btn-primary btn-lg btn-full"
            style={{ marginTop: '10px' }}
          >
            {localLoading ? (
              <>
                <FiLoader className="spinner spinner-sm" /> Logging In...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register Here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
