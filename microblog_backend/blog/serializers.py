from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from authentication.serializers import SmallUserSerializer
from blog.models import Post, Comment


class RetrievePostSerializer(serializers.ModelSerializer):
    user = SmallUserSerializer()
    repost = serializers.SerializerMethodField()
    reposts = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()

    def get_repost(self, obj):
        if obj.repost_id:
            post = Post.objects.get(id=obj.repost_id)
            serializer = RetrievePostSerializer(post)
            return serializer.data

    def get_reposts(self, obj):
        return list(Post.objects.filter(repost=obj).values_list('id', flat=True))

    def get_comments(self, obj):
        return list(Comment.objects.filter(post=obj).values_list('id', flat=True))

    class Meta:
        model = Post
        fields = ('id', 'user', 'body', 'soft_deleted', 'created_at', 'updated_at', 'likes', 'dislikes', 'repost', 'images', 'reposts', 'comments')


class CreatePostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ('id', 'user', 'body', 'soft_deleted', 'created_at', 'updated_at', 'likes', 'dislikes', 'repost', 'images')


class CommentSerializer(serializers.ModelSerializer):
    user = SmallUserSerializer()

    class Meta:
        model = Comment
        fields = ('id', 'user', 'post', 'body', 'soft_deleted', 'created_at', 'updated_at')