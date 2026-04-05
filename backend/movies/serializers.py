from rest_framework import serializers
from .models import Movie, Watchlist, Review
from django.contrib.auth import get_user_model

# Get our custom User model
User = get_user_model()


# User Serializer - for displaying user info
class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model.
    Converts User objects to JSON and vice versa.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'bio', 'profile_picture', 'created_at']
        # Password should never be returned in API responses
        extra_kwargs = {
            'password': {'write_only': True}
        }


# Movie Serializer - for movie data
class MovieSerializer(serializers.ModelSerializer):
    """
    Serializer for Movie model.
    Includes count of reviews for each movie.
    """
    # This will count how many reviews this movie has
    review_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Movie
        fields = [
            'id', 
            'imdb_id', 
            'title', 
            'year', 
            'genre', 
            'plot', 
            'poster', 
            'director', 
            'actors', 
            'runtime', 
            'rating', 
            'review_count',
            'created_at'
        ]
    
    def get_review_count(self, obj):
        """
        Method to get the count of reviews for this movie.
        'obj' is the Movie instance.
        """
        return obj.reviews.count()


# Review Serializer - for reviews
class ReviewSerializer(serializers.ModelSerializer):
    """
    Serializer for Review model.
    Includes user and movie details in the response.
    """
    # Nested serializers to show full user and movie info
    user = UserSerializer(read_only=True)
    movie = MovieSerializer(read_only=True)
    
    # These fields are for creating/updating reviews
    user_id = serializers.IntegerField(write_only=True, required=False)
    movie_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Review
        fields = [
            'id',
            'user',
            'movie',
            'user_id',
            'movie_id',
            'rating',
            'review_text',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


# Watchlist Serializer - for watchlist items
class WatchlistSerializer(serializers.ModelSerializer):
    """
    Serializer for Watchlist model.
    Shows which movies are in user's watchlist.
    """
    user = UserSerializer(read_only=True)
    movie = MovieSerializer(read_only=True)
    
    # For creating watchlist items
    user_id = serializers.IntegerField(write_only=True, required=False)
    movie_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Watchlist
        fields = [
            'id',
            'user',
            'movie',
            'user_id',
            'movie_id',
            'added_at'
        ]
        read_only_fields = ['added_at']