import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, Upload, Folder, LogIn, UserPlus, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-brand">
          <div className="brand-icon">
            <BookOpen size={22} />
          </div>
          <span>StudyShare</span>
        </Link>

        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/notes" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Browse Notes
            </NavLink>
          </li>

          {user ? (
            <>
              <li>
                <NavLink to="/upload" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  <Upload size={16} /> Upload Note
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-notes" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  <Folder size={16} /> My Notes
                </NavLink>
              </li>
              <li className="user-badge">
                <User size={14} />
                <span>{user.full_name}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-danger btn-sm">
                  <LogOut size={16} /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  <LogIn size={16} /> Login
                </NavLink>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary btn-sm">
                  <UserPlus size={16} /> Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
