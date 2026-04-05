import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Navbar.css';

function Navbar() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🎬 Movie Tracker
        </Link>

        <ul className="navbar-menu">
          <li>
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          <li>
            <Link to="/movies" className="navbar-link">Movies</Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link to="/watchlist" className="navbar-link">Watchlist</Link>
              </li>
              <li>
                <Link to="/reviews" className="navbar-link">Reviews</Link>
              </li>
              <li>
                <span className="navbar-user">👤 {user?.username}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="navbar-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="navbar-link">Login</Link>
              </li>
              <li>
                <Link to="/register" className="navbar-button">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;