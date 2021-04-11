from django.contrib.auth.password_validation import validate_password

from rest_framework.exceptions import APIException
from rest_framework import serializers

from authentication.models import User


class UserSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        """Create and save new user instance"""
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        """Disallow user update password"""
        if 'password' in validated_data:
            raise APIException(detail='use /auth/user/password/ to update password')
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'email', 'birth_date', 'location', 'status', 'link', 'is_active')
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'email': {'required': True}
        }


class ResetPasswordUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=128)

    def validate_username(self, username):
        """Check if user exists"""
        if not self.Meta.model.objects.filter(username=username).exists():
            raise serializers.ValidationError("User doesn't exist.")
        return username

    class Meta:
        model = User
        fields = ('username', )


class ResetPasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=128)

    def validate_password(self, password):
        validate_password(password)
        return password

    class Meta:
        model = User
        fields = ('password', )