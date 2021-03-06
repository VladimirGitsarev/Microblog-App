from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from authentication.serializers import SmallUserSerializer
from blog.models import Post, Comment, Vote, Option


class VoteSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()

    def get_options(self, obj):
        return OptionSerializer(obj.option_set.all(), many=True).data

    class Meta:
        model = Vote
        fields = ('id', 'created_at', 'expires', 'users', 'options')


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = '__all__'


class RetrievePostSerializer(serializers.ModelSerializer):
    user = SmallUserSerializer()
    repost = serializers.SerializerMethodField()
    reposts = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    vote = VoteSerializer()

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
        fields = (
            'id',
            'user',
            'body',
            'soft_deleted',
            'created_at',
            'updated_at',
            'likes',
            'dislikes',
            'repost',
            'images',
            'reposts',
            'comments',
            'vote'
        )


class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = (
            'id',
            'user',
            'body',
            'soft_deleted',
            'created_at',
            'updated_at',
            'likes',
            'dislikes',
            'repost',
            'images',
            'vote'
        )


class CommentSerializer(serializers.ModelSerializer):
    user = SmallUserSerializer()

    class Meta:
        model = Comment
        fields = (
            'id',
            'user',
            'post',
            'body',
            'soft_deleted',
            'created_at',
            'updated_at'
        )