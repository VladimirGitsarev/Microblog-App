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

from authentication.serializers import UserSerializer, ResetPasswordUserSerializer, ResetPasswordSerializer
from authentication.models import User

from authentication.services.email.register import RegisterEmail
from authentication.services.email.password import PasswordEmail


class AuthApi(
    GenericViewSet,
    UpdateModelMixin,
    ListModelMixin
):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, )
    queryset = User.objects.all()

    def list(self, request, *args, **kwargs):
        """Get current authenticated user info"""
        return Response(self.get_serializer(request.user).data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        """Allow PATCH if user updates itself"""
        if request.user.id == int(kwargs['pk']):
            return super().partial_update(request)
        return Response({'detail': 'user can update only it\'s profile'}, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
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
            print(request.user.following.all())
            return Response(f'You\'re now following {requested_user.username}.', status=status.HTTP_200_OK)
        else:
            print(request.user.following.all())
            return Response(f'You\'re not following {requested_user.username} anymore.', status=status.HTTP_200_OK)



class RegisterView(GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
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
