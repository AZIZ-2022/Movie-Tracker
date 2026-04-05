import React, { useState } from 'react';
import movieService from '../services/movieService';
import { toast } from 'react-toastify';
import './MovieSearch.css';

function MovieSearch({ onMovieSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      toast.error('Please enter a movie name');
      return;
    }

    setLoading(true);

    try {
      const data = await movieService.searchMovies(query);
      
      if (data.Response === 'True') {
        setResults(data.Search);
      } else {
        setResults([]);
        toast.info('No movies found');
      }
    } catch (error) {
      toast.error('Search failed. Please try again.');
      console.error(error);
    }

    setLoading(false);
  };

  const handleMovieClick = async (movie) => {
    try {
      // Get full movie details from OMDB
      const movieDetails = await movieService.getMovieFromOMDB(movie.imdbID);
      
      // Add to our database
      const savedMovie = await movieService.addMovie(movie.imdbID);
      
      // Pass to parent component
      if (onMovieSelect) {
        onMovieSelect(savedMovie);
      }
      
      toast.success(`${movie.Title} added!`);
      
      // Clear search
      setQuery('');
      setResults([]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to add movie');
    }
  };

  return (
    <div className="movie-search">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies... (e.g., Matrix, Inception)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          disabled={loading}
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? '🔍 Searching...' : '🔍 Search'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="search-results">
          <h3>Search Results ({results.length})</h3>
          <div className="results-grid">
            {results.map((movie) => (
              <div 
                key={movie.imdbID} 
                className="result-card"
                onClick={() => handleMovieClick(movie)}
              >
                <img 
                  src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Poster'} 
                  alt={movie.Title}
                  className="result-poster"
                />
                <div className="result-info">
                  <h4>{movie.Title}</h4>
                  <p>{movie.Year}</p>
                  <span className="result-type">{movie.Type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieSearch;