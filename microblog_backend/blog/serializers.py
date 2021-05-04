from rest_framework import serializers

from authentication.serializers import SmallUserSerializer
from blog.models import Post, Comment


class PostSerializer(serializers.ModelSerializer):
    user = SmallUserSerializer()

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

    class Meta:
        model = Post
        fields = ('id', 'user', 'body', 'soft_deleted', 'created_at', 'updated_at', 'likes', 'dislikes', 'repost', )


class CommentSerializer(serializers.ModelSerializer):
    user = SmallUserSerializer()

    class Meta:
        model = Comment
        fields = ('id', 'user', 'post', 'body', 'soft_deleted', 'created_at', 'updated_at')