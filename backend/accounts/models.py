from django.contrib.auth.models import AbstractUser
from django.db import models

# Custom User Model
class User(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    This allows us to add extra fields to users.
    """
    # Email field - must be unique (no two users can have same email)
    email = models.EmailField(unique=True)
    
    # Bio field - optional text field for user biography
    bio = models.TextField(blank=True, null=True)
    
    # Profile picture URL - optional
    profile_picture = models.URLField(blank=True, null=True)
    
    # Timestamp when user account was created - auto-set
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        # When we print a user object, show their username
        return self.username