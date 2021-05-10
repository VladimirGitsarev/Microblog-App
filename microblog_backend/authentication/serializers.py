from django.contrib.auth.password_validation import validate_password

from rest_framework.exceptions import APIException
from rest_framework import serializers

from authentication.models import User


class DefaultUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'birth_date',
            'location',
            'status',
            'link',
            'is_active',
            'avatar',
            'date_joined',
            'followers',
            'following'
        )


class CreateUserSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        """Create and save new user instance"""
        user = User.objects.create_user(**validated_data)
        return user

    class Meta:
        model = User
        fields = (
            'username',
            'password',
            'first_name',
            'last_name',
            'email',
            'birth_date',
            'location',
            'status',
            'link',
        )

        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'email': {'required': True}
        }


class UpdateUserSerializer(serializers.ModelSerializer):

    def update(self, instance, validated_data):
        """Disallow user update password"""
        if 'password' in validated_data:
            raise APIException(detail='You need to update your password via email.')
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'password',
            'first_name',
            'last_name',
            'email',
            'birth_date',
            'location',
            'status',
            'link',
            'image'
        )


class SmallUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'avatar')


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