import React from 'react';
import { Link } from 'react-router-dom';
import { Home, HelpCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="empty-state" style={{ maxWidth: '550px', margin: '4rem auto' }}>
      <HelpCircle size={64} color="#6366f1" style={{ marginBottom: '1rem' }} />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        The study resource or page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
        <Home size={18} /> Return to Home Page
      </Link>
    </div>
  );
};

export default NotFound;
