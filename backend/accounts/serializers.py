from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Handles creating new user accounts.
    """
    # Password fields - write only (never returned in response)
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'username', 
            'email', 
            'password', 
            'password2', 
            'bio', 
            'profile_picture'
        ]
        extra_kwargs = {
            'bio': {'required': False},
            'profile_picture': {'required': False},
        }
    
    def validate(self, attrs):
        """
        Validate that passwords match.
        """
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        return attrs
    
    def create(self, validated_data):
        """
        Create new user with encrypted password.
        """
        # Remove password2 (we don't need to store it)
        validated_data.pop('password2')
        
        # Create user with encrypted password
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            bio=validated_data.get('bio', ''),
            profile_picture=validated_data.get('profile_picture', ''),
        )
        
        return user


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user details.
    Used to return user information.
    """
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'bio',
            'profile_picture',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for changing password.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(
        required=True, 
        validators=[validate_password]
    )