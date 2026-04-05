import api from './api';

// Movie Service
const movieService = {
  // Search movies in OMDB
  searchMovies: async (query) => {
    try {
      const response = await api.get(`/search/?q=${query}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get movie details from OMDB
  getMovieFromOMDB: async (imdbId) => {
    try {
      const response = await api.get(`/omdb/${imdbId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all movies from our database
  getAllMovies: async () => {
    try {
      const response = await api.get('/movies/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get specific movie from our database
  getMovie: async (id) => {
    try {
      const response = await api.get(`/movies/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add movie to our database
  addMovie: async (imdbId) => {
    try {
      const response = await api.post('/movies/', { imdb_id: imdbId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's watchlist
  getWatchlist: async () => {
    try {
      const response = await api.get('/watchlist/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add movie to watchlist
  addToWatchlist: async (movieId) => {
    try {
      const response = await api.post('/watchlist/', { movie_id: movieId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove from watchlist
  removeFromWatchlist: async (watchlistId) => {
    try {
      const response = await api.delete(`/watchlist/${watchlistId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's reviews
  getReviews: async () => {
    try {
      const response = await api.get('/reviews/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add review
  addReview: async (movieId, rating, reviewText) => {
    try {
      const response = await api.post('/reviews/', {
        movie_id: movieId,
        rating,
        review_text: reviewText,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update review
  updateReview: async (reviewId, rating, reviewText) => {
    try {
      const response = await api.patch(`/reviews/${reviewId}/`, {
        rating,
        review_text: reviewText,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete review
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default movieService;