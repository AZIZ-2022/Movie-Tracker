import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import movieService from '../services/movieService';
import { toast } from 'react-toastify';
import './MovieCard.css';

function MovieCard({ movie, onWatchlistChange, onReviewChange, showActions = true }) {
  const { isAuthenticated } = useContext(AuthContext);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddToWatchlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to watchlist');
      return;
    }

    setLoading(true);
    try {
      await movieService.addToWatchlist(movie.id);
      toast.success('Added to watchlist!');
      if (onWatchlistChange) onWatchlistChange();
    } catch (error) {
      toast.error(error.error || 'Failed to add to watchlist');
    }
    setLoading(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to write a review');
      return;
    }

    setLoading(true);
    try {
      await movieService.addReview(movie.id, rating, reviewText);
      toast.success('Review submitted!');
      setShowReviewForm(false);
      setReviewText('');
      if (onReviewChange) onReviewChange();
    } catch (error) {
      toast.error(error.error || 'Failed to submit review');
    }
    setLoading(false);
  };

  return (
    <div className="movie-card">
      <img 
        src={movie.poster !== 'N/A' && movie.poster ? movie.poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
        alt={movie.title}
        className="movie-poster"
      />
      
      <div className="movie-details">
        <h2>{movie.title}</h2>
        
        <div className="movie-meta">
          <span className="year">📅 {movie.year}</span>
          <span className="rating">⭐ {movie.rating || 'N/A'}</span>
          <span className="runtime">⏱️ {movie.runtime || 'N/A'}</span>
        </div>

        <div className="movie-genre">
          {movie.genre && movie.genre.split(',').map((g, index) => (
            <span key={index} className="genre-tag">{g.trim()}</span>
          ))}
        </div>

        <div className="movie-info">
          <p><strong>Director:</strong> {movie.director || 'N/A'}</p>
          <p><strong>Cast:</strong> {movie.actors || 'N/A'}</p>
        </div>

        <div className="movie-plot">
          <h3>Plot</h3>
          <p>{movie.plot || 'No plot available'}</p>
        </div>

        {showActions && (
          <div className="movie-actions">
            <button 
              onClick={handleAddToWatchlist} 
              className="action-button watchlist"
              disabled={loading}
            >
              ⭐ Add to Watchlist
            </button>
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)} 
              className="action-button review"
            >
              📝 Write Review
            </button>
          </div>
        )}

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="review-form">
            <h3>Write Your Review</h3>
            
            <div className="rating-selector">
              <label>Rating: </label>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`star-button ${rating >= star ? 'active' : ''}`}
                >
                  ⭐
                </button>
              ))}
              <span className="rating-text">({rating}/5)</span>
            </div>

            <textarea
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="4"
              className="review-textarea"
            />

            <div className="review-actions">
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowReviewForm(false)} 
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default MovieCard;