from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include('movies.urls')),

     # Authentication endpoints
    path('api/auth/', include('accounts.urls')),
]