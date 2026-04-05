import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>🎬 Welcome to Movie Tracker</h1>
        <p className="home-subtitle">
          Track, rate, and review your favorite movies all in one place!
        </p>
        
        <div className="home-features">
          <div className="feature">
            <span className="feature-icon">🔍</span>
            <h3>Search Movies</h3>
            <p>Find any movie from our vast database</p>
          </div>
          
          <div className="feature">
            <span className="feature-icon">📝</span>
            <h3>Write Reviews</h3>
            <p>Share your thoughts and rate movies</p>
          </div>
          
          <div className="feature">
            <span className="feature-icon">⭐</span>
            <h3>Track Watchlist</h3>
            <p>Keep track of movies you want to watch</p>
          </div>
        </div>

        <div className="home-cta">
          <Link to="/register" className="cta-button primary">
            Get Started
          </Link>
          <Link to="/movies" className="cta-button secondary">
            Browse Movies
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;