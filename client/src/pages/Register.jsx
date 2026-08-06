import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.full_name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password
      });

      if (res.data && res.data.success) {
        register(res.data.token, res.data.user);
        navigate('/');
      } else {
        setError(res.data.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <div className="brand-icon" style={{ margin: '0 auto 1rem', width: '48px', height: '48px' }}>
          <UserPlus size={26} />
        </div>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Register to upload study notes for your department</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Full Name</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              name="full_name"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="e.g. John Doe"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
            <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

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

        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              name="password"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Confirm Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              name="confirm_password"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Repeat password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
            <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Already have an account? <Link to="/login" style={{ fontWeight: '600' }}>Log In</Link>
      </div>
    </div>
  );
};

export default Register;
