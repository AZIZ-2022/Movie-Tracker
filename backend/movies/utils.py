import requests
from django.conf import settings

def search_omdb(query):
    """
    Search for movies using OMDB API.
    
    Args:
        query (str): Movie title to search for
    
    Returns:
        dict: Search results from OMDB API
    """
    api_key = settings.OMDB_API_KEY
    url = f"http://www.omdbapi.com/?apikey={api_key}&s={query}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise error for bad status codes
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        return {'Error': str(e)}


def get_movie_details(imdb_id):
    """
    Get detailed information about a specific movie by IMDB ID.
    
    Args:
        imdb_id (str): IMDB ID of the movie (e.g., 'tt0133093')
    
    Returns:
        dict: Detailed movie information from OMDB API
    """
    api_key = settings.OMDB_API_KEY
    url = f"http://www.omdbapi.com/?apikey={api_key}&i={imdb_id}&plot=full"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        return {'Error': str(e)}