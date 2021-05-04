from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.mixins import (
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
    DestroyModelMixin,
)

from blog.serializers import PostSerializer, CommentSerializer
from blog.models import Post, Comment


class PostViewSet(
    GenericViewSet,
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
    DestroyModelMixin
):

    queryset = Post.objects.filter(soft_deleted=False)
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated, )

    def list(self, request, *args, **kwargs):
        user = request.user
        serializer = self.serializer_class
        posts = self.queryset.filter(user__in=user.following.all()).order_by('-created_at')
        return Response(serializer(posts, many=True).data, status=status.HTTP_200_OK)

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
            return Response({'details': f'post {post} unliked'}, status=status.HTTP_200_OK)
        post.dislikes.remove(request.user)
        post.likes.add(request.user)
        return Response({'details': f'post {post} liked'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def dislike(self, request, pk):
        post = self.get_object()
        if request.user in post.dislikes.all():
            post.dislikes.remove(request.user)
            return Response({'details': f'post {post} undisliked'}, status=status.HTTP_200_OK)
        post.dislikes.add(request.user)
        post.likes.remove(request.user)
        return Response({'details': f'post {post} disliked'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get', 'post'])
    def comments(self, request, pk):
        post = self.get_object()

        if request.method == 'GET':
            serializer = CommentSerializer(post.comment_set.all(), many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.method == 'POST':
            comment = post.comment_set.create(user=request.user, body=request.data['body'])
            return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)


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