from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers import (
    UserRegistrationSerializer, 
    UserSerializer, 
    ChangePasswordSerializer
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    
    POST /api/auth/register/
    Body: {
        "username": "john",
        "email": "john@example.com",
        "password": "securepass123",
        "password2": "securepass123"
    }
    """
    queryset = User.objects.all()
    permission_classes = [AllowAny]  # Anyone can register
    serializer_class = UserRegistrationSerializer
    
    def create(self, request, *args, **kwargs):
        """
        Create new user and return JWT tokens.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens for the new user
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """
    Get current logged-in user's profile.
    
    GET /api/auth/profile/
    Headers: Authorization: Bearer <access_token>
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """
    Update current user's profile.
    
    PUT/PATCH /api/auth/profile/update/
    """
    serializer = UserSerializer(
        request.user, 
        data=request.data, 
        partial=True  # Allow partial updates
    )
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    Change user's password.
    
    POST /api/auth/change-password/
    Body: {
        "old_password": "oldpass123",
        "new_password": "newpass123"
    }
    """
    serializer = ChangePasswordSerializer(data=request.data)
    
    if serializer.is_valid():
        # Check old password
        if not request.user.check_password(serializer.data.get('old_password')):
            return Response(
                {'old_password': ['Wrong password.']}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        request.user.set_password(serializer.data.get('new_password'))
        request.user.save()
        
        return Response({
            'message': 'Password updated successfully'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout user by blacklisting their refresh token.
    
    POST /api/auth/logout/
    Body: {
        "refresh": "<refresh_token>"
    }
    """
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()  # Blacklist the token
        
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )