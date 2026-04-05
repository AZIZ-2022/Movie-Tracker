import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import movieService from '../services/movieService';
import { toast } from 'react-toastify';
import './Reviews.css';

function Reviews() {
  const { isAuthenticated } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadReviews();
    }
  }, [isAuthenticated]);

  const loadReviews = async () => {
    try {
      const data = await movieService.getReviews();
      setReviews(data);
    } catch (error) {
      toast.error('Failed to load reviews');
      console.error(error);
    }
    setLoading(false);
  };

  const handleEdit = (review) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditText(review.review_text);
  };

  const handleUpdate = async (reviewId) => {
    try {
      await movieService.updateReview(reviewId, editRating, editText);
      toast.success('Review updated!');
      setEditingId(null);
      loadReviews();
    } catch (error) {
      toast.error('Failed to update review');
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await movieService.deleteReview(reviewId);
        toast.success('Review deleted');
        loadReviews();
      } catch (error) {
        toast.error('Failed to delete review');
      }
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <h1>📝 My Reviews</h1>
        <p>Movies you've reviewed</p>
      </div>

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="empty-state">
          <h2>No reviews yet</h2>
          <p>Start reviewing movies from the Movies page! ⭐</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-movie">
                <img 
                  src={review.movie.poster !== 'N/A' && review.movie.poster ? review.movie.poster : 'https://via.placeholder.com/150x225?text=No+Poster'} 
                  alt={review.movie.title}
                  className="review-poster"
                />
                <div className="review-movie-info">
                  <h3>{review.movie.title}</h3>
                  <p>{review.movie.year}</p>
                </div>
              </div>

              {editingId === review.id ? (
                <div className="review-edit-form">
                  <div className="rating-selector">
                    <label>Rating: </label>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditRating(star)}
                        className={`star-button ${editRating >= star ? 'active' : ''}`}
                      >
                        ⭐
                      </button>
                    ))}
                    <span>({editRating}/5)</span>
                  </div>
                  
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows="4"
                    className="review-textarea"
                  />
                  
                  <div className="review-actions">
                    <button onClick={() => handleUpdate(review.id)} className="save-button">
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="cancel-button">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="review-content">
                  <div className="review-rating">
                    {'⭐'.repeat(review.rating)} ({review.rating}/5)
                  </div>
                  <p className="review-text">{review.review_text || 'No review text'}</p>
                  <p className="review-date">
                    Reviewed on {new Date(review.created_at).toLocaleDateString()}
                  </p>
                  
                  <div className="review-actions">
                    <button onClick={() => handleEdit(review)} className="edit-button">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(review.id)} className="delete-button">
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reviews;