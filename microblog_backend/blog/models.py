from django.db import models

from core.models.abstract_models import CreatedAt, UpdatedAt, SoftDelete

from authentication.services.compress import Compressor
from authentication.models import User


class Vote(CreatedAt, UpdatedAt, SoftDelete):
    users = models.ManyToManyField(User, related_name='vote_users', blank=True)
    expires = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'Vote {self.id}'


class Option(CreatedAt, UpdatedAt, SoftDelete):
    vote = models.ForeignKey(Vote, default=None, null=True, blank=True, on_delete=models.DO_NOTHING)
    body = models.CharField(max_length=50)
    users = models.ManyToManyField(User, related_name='option_users', blank=True)

    def __str__(self):
        return f'Option {self.id} for vote'


class Post(CreatedAt, UpdatedAt, SoftDelete):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    body = models.CharField(max_length=300)
    likes = models.ManyToManyField(User, related_name='post_likes', blank=True)
    dislikes = models.ManyToManyField(User, related_name='post_dislikes', blank=True)
    repost = models.ForeignKey('self', default=None, null=True, blank=True, on_delete=models.DO_NOTHING)
    vote = models.ForeignKey(Vote, default=None, null=True, blank=True, on_delete=models.CASCADE)

    @property
    def images(self):
        return [image.image.url for image in PostImage.objects.filter(post=self)]

    def __str__(self):
        return f'Post {self.id} - {self.user.username}: {self.created_at}'


class Comment(CreatedAt, UpdatedAt, SoftDelete):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    body = models.CharField(max_length=300)

    def __str__(self):
        return f'Comment {self.id} by {self.user} for {self.post}'


class PostImage(CreatedAt):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    image = models.ImageField(blank=True, upload_to='posts/%Y/%m/%d')

    def __str__(self):
        return f'Image {self.image} for {self.post}'

    def save(self, *args, **kwargs):
        new_image = Compressor(self.image).compress()
        self.image = new_image
        super().save(*args, **kwargs)
