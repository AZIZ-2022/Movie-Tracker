from django.db import models
from django.conf import settings

# Movie Model - stores information about movies
class Movie(models.Model):
    """
    Stores movie data fetched from OMDB API.
    Each movie is identified by its unique IMDB ID.
    """
    # IMDB ID - unique identifier from IMDB (like tt0133093 for The Matrix)
    imdb_id = models.CharField(max_length=20, unique=True)
    
    # Movie title
    title = models.CharField(max_length=300)
    
    # Release year
    year = models.CharField(max_length=10)
    
    # Genres (comma-separated like "Action, Sci-Fi")
    genre = models.CharField(max_length=100, blank=True)
    
    # Plot/summary of the movie
    plot = models.TextField(blank=True)
    
    # URL to poster image
    poster = models.URLField(blank=True, null=True)
    
    # Director name
    director = models.CharField(max_length=200, blank=True)
    
    # Actors (comma-separated)
    actors = models.TextField(blank=True)
    
    # Movie runtime (like "136 min")
    runtime = models.CharField(max_length=20, blank=True)
    
    # IMDB rating (like "8.7")
    rating = models.CharField(max_length=10, blank=True)
    
    # When this movie was added to our database
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        # Display as "The Matrix (1999)"
        return f"{self.title} ({self.year})"
    
    class Meta:
        # Order movies by newest first when querying
        ordering = ['-created_at']


# Watchlist Model - stores movies users want to watch
class Watchlist(models.Model):
    """
    Links users to movies they're interested in watching.
    This is the "Interested" button functionality.
    """
    # Which user added this to their watchlist
    # ForeignKey creates a relationship: many watchlist items belong to one user
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Our custom User model
        on_delete=models.CASCADE,   # If user is deleted, delete their watchlist too
        related_name='watchlist'    # Access via user.watchlist.all()
    )
    
    # Which movie is in the watchlist
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,   # If movie is deleted, remove from watchlists
        related_name='in_watchlists'  # Access via movie.in_watchlists.all()
    )
    
    # When was this added to watchlist
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        # Each user can add a specific movie only once
        unique_together = ('user', 'movie')
        # Show newest additions first
        ordering = ['-added_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"


# Review Model - stores user reviews and ratings
class Review(models.Model):
    """
    Stores reviews and ratings that users give to movies they've watched.
    """
    # Rating choices (1-5 stars)
    RATING_CHOICES = [
        (1, '1 - Terrible'),
        (2, '2 - Poor'),
        (3, '3 - Average'),
        (4, '4 - Good'),
        (5, '5 - Excellent'),
    ]
    
    # Who wrote this review
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews'  # Access via user.reviews.all()
    )
    
    # Which movie is being reviewed
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        related_name='reviews'  # Access via movie.reviews.all()
    )
    
    # Rating (1-5) - user must choose from RATING_CHOICES
    rating = models.IntegerField(choices=RATING_CHOICES)
    
    # Review text - optional
    review_text = models.TextField(blank=True)
    
    # When review was created
    created_at = models.DateTimeField(auto_now_add=True)
    
    # When review was last updated
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        # One user can only review a movie once
        unique_together = ('user', 'movie')
        # Show newest reviews first
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.movie.title} ({self.rating}/5)"
