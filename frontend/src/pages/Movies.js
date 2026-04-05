import React, { useState, useEffect } from 'react';
import MovieSearch from '../components/MovieSearch';
import MovieCard from '../components/MovieCard';
import movieService from '../services/movieService';
import { toast } from 'react-toastify';
import './Movies.css';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all movies from our database
  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const data = await movieService.getAllMovies();
      setMovies(data);
    } catch (error) {
      console.error('Failed to load movies:', error);
    }
    setLoading(false);
  };

  const handleMovieAdded = (newMovie) => {
    // Add new movie to the list
    setMovies([newMovie, ...movies]);
  };

  return (
    <div className="movies-page">
      <div className="movies-header">
        <h1>🎬 Discover Movies</h1>
        <p>Search for movies and add them to your collection</p>
      </div>

      <MovieSearch onMovieSelect={handleMovieAdded} />

      <div className="movies-section">
        <h2>All Movies ({movies.length})</h2>
        
        {loading ? (
          <p>Loading movies...</p>
        ) : movies.length === 0 ? (
          <div className="empty-state">
            <p>No movies yet. Search and add some movies above! 🎥</p>
          </div>
        ) : (
          <div className="movies-list">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie}
                onWatchlistChange={loadMovies}
                onReviewChange={loadMovies}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Movies;