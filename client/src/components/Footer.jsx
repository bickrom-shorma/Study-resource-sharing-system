import React from 'react';
import { BookOpen, Shield, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: '700' }}>
            <BookOpen size={20} color="#6366f1" />
            <span>Study Resource Sharing System</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Shield size={14} color="#10b981" /> Official Department Portal
            </span>
            <span>PDF Notes & Lecture Material</span>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem' }}>
          <p>© {new Date().getFullYear()} Study Resource Sharing System. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Designed with <Heart size={14} color="#ef4444" fill="#ef4444" /> for Department Students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
