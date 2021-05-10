from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.conf import settings

import jwt

from rest_framework.viewsets import ReadOnlyModelViewSet, GenericViewSet
from rest_framework.mixins import ListModelMixin, UpdateModelMixin
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import GenericAPIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import filters
from rest_framework import status

from authentication.serializers import (
    DefaultUserSerializer,
    CreateUserSerializer,
    UpdateUserSerializer,
    ResetPasswordUserSerializer,
    ResetPasswordSerializer,
)
from authentication.models import User

from authentication.services.email.register import RegisterEmail
from authentication.services.email.password import PasswordEmail


class AuthApi(
    GenericViewSet,
    UpdateModelMixin,
    ListModelMixin
):
    default_serializer_class = DefaultUserSerializer
    permission_classes = (IsAuthenticated, )
    queryset = User.objects.all()

    serializer_classes = {
        'partial_update': UpdateUserSerializer,
    }

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)

    def list(self, request, *args, **kwargs):
        """Get current authenticated user info"""
        return Response(self.get_serializer(request.user).data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        """Allow PATCH if user updates itself"""
        if request.user.id == int(kwargs['pk']):
            user = self.get_serializer().update(request.user, request.data)
            return Response(DefaultUserSerializer(user).data, status=status.HTTP_200_OK)
        return Response({'detail': 'user can update only it\'s profile'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put'])
    def password(self, request, *args, **kwargs):
        """Update password if user updates its password and if password is valid"""
        if request.user.id == int(kwargs['pk']):
            user = request.user
            try:
                validate_password(request.data['password'])
                user.set_password(request.data['password'])
                user.save()
            except ValidationError as e:
                return Response({'detail': e})
        return Response({'detail': 'password successfully updated'})


class UserViewSet(ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = DefaultUserSerializer
    permission_classes = (IsAuthenticated, )

    filter_backends = (filters.SearchFilter, )
    search_fields = ['username', 'first_name', 'last_name']

    @action(detail=False, methods=['get'])
    def followers(self, request, *args, **kwargs):
        """Get a list of followers for current authenticated user"""
        users = self.get_serializer(request.user.followers.all(), many=True).data
        return Response(users, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def following(self, request, *args, **kwargs):
        """Get a list of following for current authenticated user"""
        users = self.get_serializer(request.user.following.all(), many=True).data
        return Response(users, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def follow(self, request, pk=None):
        requested_user = User.objects.get(id=pk)
        if requested_user not in request.user.following.all():
            request.user.following.add(requested_user)
            return Response(
                {
                    'detail': f'You\'re now following {requested_user.username}.',
                    'user': self.get_serializer(requested_user).data,
                },
                status=status.HTTP_200_OK
            )
        else:
            request.user.following.remove(requested_user)
            return Response(
                {
                    'detail': f'You\'re not following {requested_user.username} anymore.',
                    'user': self.get_serializer(requested_user).data,
                },
                status=status.HTTP_200_OK
            )


class RegisterView(GenericAPIView):
    queryset = User.objects.all()
    serializer_class = CreateUserSerializer
    permission_classes = (AllowAny, )

    def get(self, request, *args, **kwargs):
        """Confirm profile activation by checking the token from email link"""
        response = RegisterEmail.activate_profile(kwargs['token'])
        return Response({'detail': response}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """Create new profile and send activation link"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(is_active=False)
        url = request.build_absolute_uri()
        RegisterEmail().send_email(serializer.data, url)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ResetPasswordView(GenericAPIView):

    def get_serializer_class(self):
        return ResetPasswordUserSerializer if self.request.method == 'POST' else ResetPasswordSerializer

    def get(self, request, *args, **kwargs):
        """Check if reset password link is still active when token provided"""
        if kwargs.get('token'):
            try:
                payload = jwt.decode(kwargs.get('token'), settings.EMAIL_SECRET_KEY, algorithms=['HS256'])
            except jwt.exceptions.ExpiredSignatureError:
                return Response({'details': 'this link is no longer available'}, status=status.HTTP_400_BAD_REQUEST)
            user = User.objects.get(id=payload.get('user_id'))
            return Response({'details': f'enter new password for {user}'}, status=status.HTTP_200_OK)
        return Response({'details': 'enter your username to reset the password'}, status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """Send email for password reset if user with given username exists"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(username=serializer.validated_data.get('username'))
        url = request.build_absolute_uri()
        PasswordEmail.send_email(user, url)
        return Response(
            {'details': f'message was sent to {user.email} to reset the password'},
            status=status.HTTP_200_OK,
        )

    def put(self, request, *args, **kwargs):
        """Update password for user specified in token"""
        payload = jwt.decode(kwargs.get('token'), settings.EMAIL_SECRET_KEY, algorithms=['HS256'])
        user = User.objects.get(id=payload.get('user_id'))
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user.set_password(request.data.get('password'))
        user.save()
        return Response({'details': 'password successfully updated'}, status=status.HTTP_200_OK)
