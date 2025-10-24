// src/components/Header.jsx

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header-container">
      {/* ... (logo) ... */}
      <nav className="header-nav">
        {user ? (
          // --- Logged-in ---
          <>
            <Link to="/dashboard">My Dashboard</Link> {/* <-- ADD THIS LINK */}
            <span>Welcome, {user.name}!</span>
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          // --- Logged-out ---
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;