from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from authentication.serializers import SmallUserSerializer
from blog.models import Post, Comment


class RetrievePostSerializer(serializers.ModelSerializer):
    user = SmallUserSerializer()

    class Meta:
        model = Post
        fields = ('id', 'user', 'body', 'soft_deleted', 'created_at', 'updated_at', 'likes', 'dislikes', 'repost', 'images')


class CreatePostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ('id', 'user', 'body', 'soft_deleted', 'created_at', 'updated_at', 'likes', 'dislikes', 'repost', 'images')


class CommentSerializer(serializers.ModelSerializer):
    user = SmallUserSerializer()

    class Meta:
        model = Comment
        fields = ('id', 'user', 'post', 'body', 'soft_deleted', 'created_at', 'updated_at')