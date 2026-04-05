from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404

from .models import Movie, Watchlist, Review
from .serializers import MovieSerializer, WatchlistSerializer, ReviewSerializer
from .utils import search_omdb, get_movie_details


# OMDB Search View - Search movies from OMDB API
@api_view(['GET'])
def search_movies(request):
    """
    Search for movies using OMDB API.
    
    Usage: GET /api/movies/search/?q=matrix
    """
    query = request.query_params.get('q', '')
    
    if not query:
        return Response(
            {'error': 'Please provide a search query'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Search OMDB
    results = search_omdb(query)
    
    if 'Error' in results:
        return Response(
            {'error': results['Error']}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    return Response(results, status=status.HTTP_200_OK)


# Get Movie Details from OMDB
@api_view(['GET'])
def get_movie_from_omdb(request, imdb_id):
    """
    Get detailed movie information from OMDB by IMDB ID.
    
    Usage: GET /api/movies/omdb/tt0133093/
    """
    movie_data = get_movie_details(imdb_id)
    
    if 'Error' in movie_data:
        return Response(
            {'error': movie_data['Error']}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    return Response(movie_data, status=status.HTTP_200_OK)


# Movie ViewSet - CRUD operations for movies in our database
class MovieViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Movie model.
    Provides: list, create, retrieve, update, destroy
    """
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]  # Anyone can view movies
    
    def create(self, request, *args, **kwargs):
        """
        Create a movie in our database from OMDB data.
        Expects imdb_id in request data.
        """
        imdb_id = request.data.get('imdb_id')
        
        if not imdb_id:
            return Response(
                {'error': 'imdb_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if movie already exists
        if Movie.objects.filter(imdb_id=imdb_id).exists():
            movie = Movie.objects.get(imdb_id=imdb_id)
            serializer = self.get_serializer(movie)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # Fetch from OMDB
        movie_data = get_movie_details(imdb_id)
        
        if 'Error' in movie_data or movie_data.get('Response') == 'False':
            return Response(
                {'error': 'Movie not found in OMDB'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Create movie in our database
        movie = Movie.objects.create(
            imdb_id=movie_data.get('imdbID'),
            title=movie_data.get('Title'),
            year=movie_data.get('Year'),
            genre=movie_data.get('Genre', ''),
            plot=movie_data.get('Plot', ''),
            poster=movie_data.get('Poster', ''),
            director=movie_data.get('Director', ''),
            actors=movie_data.get('Actors', ''),
            runtime=movie_data.get('Runtime', ''),
            rating=movie_data.get('imdbRating', ''),
        )
        
        serializer = self.get_serializer(movie)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Watchlist ViewSet
class WatchlistViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Watchlist model.
    Manages user's watchlist (interested movies).
    """
    serializer_class = WatchlistSerializer
    permission_classes = [IsAuthenticated]  # Must be logged in
    
    def get_queryset(self):
        """
        Return watchlist items for the current user only.
        """
        return Watchlist.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """
        Add a movie to user's watchlist.
        """
        movie_id = request.data.get('movie_id')
        
        if not movie_id:
            return Response(
                {'error': 'movie_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if movie exists
        movie = get_object_or_404(Movie, id=movie_id)
        
        # Check if already in watchlist
        if Watchlist.objects.filter(user=request.user, movie=movie).exists():
            return Response(
                {'error': 'Movie already in watchlist'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Add to watchlist
        watchlist_item = Watchlist.objects.create(
            user=request.user,
            movie=movie
        )
        
        serializer = self.get_serializer(watchlist_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Review ViewSet
class ReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Review model.
    Manages user reviews and ratings.
    """
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Return reviews for the current user.
        Can filter by movie_id using query params.
        """
        queryset = Review.objects.filter(user=self.request.user)
        
        # Optional: filter by movie
        movie_id = self.request.query_params.get('movie_id')
        if movie_id:
            queryset = queryset.filter(movie_id=movie_id)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        """
        Create a review for a movie.
        """
        movie_id = request.data.get('movie_id')
        rating = request.data.get('rating')
        review_text = request.data.get('review_text', '')
        
        if not movie_id or not rating:
            return Response(
                {'error': 'movie_id and rating are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if movie exists
        movie = get_object_or_404(Movie, id=movie_id)
        
        # Check if user already reviewed this movie
        if Review.objects.filter(user=request.user, movie=movie).exists():
            return Response(
                {'error': 'You have already reviewed this movie'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create review
        review = Review.objects.create(
            user=request.user,
            movie=movie,
            rating=rating,
            review_text=review_text
        )
        
        serializer = self.get_serializer(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED)