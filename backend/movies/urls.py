from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for ViewSets
# Router automatically creates URLs for CRUD operations
router = DefaultRouter()
router.register(r'movies', views.MovieViewSet, basename='movie')
router.register(r'watchlist', views.WatchlistViewSet, basename='watchlist')
router.register(r'reviews', views.ReviewViewSet, basename='review')

# URL patterns
urlpatterns = [
    # OMDB search endpoints
    path('search/', views.search_movies, name='search-movies'),
    path('omdb/<str:imdb_id>/', views.get_movie_from_omdb, name='omdb-movie-detail'),
    
    # Include router URLs
    path('', include(router.urls)),
]