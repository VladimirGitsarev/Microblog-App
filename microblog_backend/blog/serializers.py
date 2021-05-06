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

    def create(self, validated_data):
        if len(dict(self.context['request'].FILES)['images']) > 5:
            raise ValidationError({'details': 'There cannot be more than 5 images for one post.'})
        else:
            post = super().create(validated_data)
            for image in dict(self.context['request'].FILES)['images']:
                post.postimage_set.create(image=image, user=self.context['request'].user)
            return post

    class Meta:
        model = Post
        fields = ('id', 'user', 'body', 'soft_deleted', 'created_at', 'updated_at', 'likes', 'dislikes', 'repost', 'images')


class CommentSerializer(serializers.ModelSerializer):
    user = SmallUserSerializer()

    class Meta:
        model = Comment
        fields = ('id', 'user', 'post', 'body', 'soft_deleted', 'created_at', 'updated_at')