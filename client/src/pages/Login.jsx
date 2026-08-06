import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(formData);

      if (res.data && res.data.success) {
        login(res.data.token, res.data.user);
        navigate('/');
      } else {
        setError(res.data.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <div className="brand-icon" style={{ margin: '0 auto 1rem', width: '48px', height: '48px' }}>
          <LogIn size={26} />
        </div>
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Log in to upload and manage study resources</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Email Address</label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              name="email"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="student@dept.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              name="password"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Don't have an account? <Link to="/register" style={{ fontWeight: '600' }}>Register Now</Link>
      </div>
    </div>
  );
};

export default Login;
