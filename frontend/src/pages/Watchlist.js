import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import movieService from '../services/movieService';
import { toast } from 'react-toastify';
import './Watchlist.css';

function Watchlist() {
  const { isAuthenticated } = useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadWatchlist();
    }
  }, [isAuthenticated]);

  const loadWatchlist = async () => {
    try {
      const data = await movieService.getWatchlist();
      setWatchlist(data);
    } catch (error) {
      toast.error('Failed to load watchlist');
      console.error(error);
    }
    setLoading(false);
  };

  const handleRemove = async (watchlistId) => {
    try {
      await movieService.removeFromWatchlist(watchlistId);
      toast.success('Removed from watchlist');
      loadWatchlist();
    } catch (error) {
      toast.error('Failed to remove from watchlist');
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <h1>⭐ My Watchlist</h1>
        <p>Movies you want to watch</p>
      </div>

      {loading ? (
        <p>Loading watchlist...</p>
      ) : watchlist.length === 0 ? (
        <div className="empty-state">
          <h2>Your watchlist is empty</h2>
          <p>Add movies from the Movies page to get started! 🎬</p>
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map((item) => (
            <div key={item.id} className="watchlist-card">
              <img 
                src={item.movie.poster !== 'N/A' && item.movie.poster ? item.movie.poster : 'https://via.placeholder.com/200x300?text=No+Poster'} 
                alt={item.movie.title}
                className="watchlist-poster"
              />
              <div className="watchlist-info">
                <h3>{item.movie.title}</h3>
                <p className="watchlist-year">{item.movie.year}</p>
                <p className="watchlist-genre">{item.movie.genre}</p>
                <p className="watchlist-rating">⭐ {item.movie.rating || 'N/A'}</p>
                <button 
                  onClick={() => handleRemove(item.id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;