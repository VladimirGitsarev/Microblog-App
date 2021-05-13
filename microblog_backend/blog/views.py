from django.db.models import Q
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.mixins import (
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
    DestroyModelMixin,
)

from blog.serializers import RetrievePostSerializer, CreatePostSerializer, CommentSerializer
from blog.models import Post, Comment


class PostViewSet(
    GenericViewSet,
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
    DestroyModelMixin
):

    queryset = Post.objects.filter(soft_deleted=False)
    default_serializer_class = RetrievePostSerializer
    permission_classes = (IsAuthenticated, )

    serializer_classes = {
        'create': CreatePostSerializer,
    }

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)

    def list(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer
        if 'username' in request.query_params:
            posts = self.queryset.filter(user__username=request.query_params.get('username')).order_by('-created_at')
        elif 'search' in request.query_params:
            posts = self.queryset.filter(body__contains=request.query_params.get('search')).order_by('-created_at')
        elif 'user_id' in request.query_params:
            posts = self.queryset.filter(user_id=request.query_params.get('user_id')).order_by('-created_at')
        else:
            posts = self.queryset.filter(user__in=user.following.all()).union(self.queryset.filter(user=user)).order_by('-created_at')
        return Response(serializer(posts, many=True).data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        if 'body' in request.data:
            data = {
                'body': request.data['body'],
                'user': request.user.id,
                'repost': request.data['repost'] if 'repost' in request.data else None
            }
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            post = serializer.save()

            if 'images' in dict(self.request.FILES):
                if len(dict(self.request.FILES)['images']) > 5:
                    raise ValidationError({'details': 'There cannot be more than 5 images for one post.'})

                for image in dict(request.FILES)['images']:
                    post.postimage_set.create(image=image, user=self.request.user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            raise ValidationError()

    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        if post.user == request.user:
            Comment.make_soft_delete(post, True)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({'details': 'You can delete only your posts'})

    @action(detail=True, methods=['post'])
    def like(self, request, pk):
        post = self.get_object()
        if request.user in post.likes.all():
            post.likes.remove(request.user)
            return Response(
                {
                    'likes': post.likes.all().values_list('id', flat=True),
                    'dislikes': post.dislikes.all().values_list('id', flat=True)
                },
                status=status.HTTP_200_OK
            )
        post.dislikes.remove(request.user)
        post.likes.add(request.user)
        return Response(
            {
                'likes': post.likes.all().values_list('id', flat=True),
                'dislikes': post.dislikes.all().values_list('id', flat=True)
            },
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def dislike(self, request, pk):
        post = self.get_object()
        if request.user in post.dislikes.all():
            post.dislikes.remove(request.user)
            return Response(
                {
                    'likes': post.likes.all().values_list('id', flat=True),
                    'dislikes': post.dislikes.all().values_list('id', flat=True)
                },
                status=status.HTTP_200_OK
            )
        post.dislikes.add(request.user)
        post.likes.remove(request.user)
        return Response(
            {
                'likes': post.likes.all().values_list('id', flat=True),
                'dislikes': post.dislikes.all().values_list('id', flat=True)
            },
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['get', 'post'])
    def comments(self, request, pk):
        post = self.get_object()

        if request.method == 'GET':
            serializer = CommentSerializer(post.comment_set.all(), many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.method == 'POST':
            comment = post.comment_set.create(user=request.user, body=request.data['body'])
            return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def recommend(self, request, *args, **kwargs):
        following = request.user.following.all()  # get user current user following
        liked = Post.objects.filter(likes=request.user)  # get posts liked by this user
        return Response({}, status=status.HTTP_200_OK)  # to do


class CommentViewSet(
    GenericViewSet,
    RetrieveModelMixin,
    DestroyModelMixin,
):
    queryset = Comment.objects.filter(soft_deleted=False)
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated, )

    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.user == request.user:
            Comment.make_soft_delete(comment, True)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({'details': 'You can delete only your comments'})
