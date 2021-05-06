from django.db import models
from authentication.models import User
from core.models.abstract_models import CreatedAt, UpdatedAt, SoftDelete


class Post(CreatedAt, UpdatedAt, SoftDelete):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    body = models.CharField(max_length=300)
    likes = models.ManyToManyField(User, related_name='post_likes', blank=True)
    dislikes = models.ManyToManyField(User, related_name='post_dislikes', blank=True)
    repost = models.ForeignKey('self', default=None, null=True, blank=True, on_delete=models.DO_NOTHING)

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
    image = models.ImageField(blank=True, upload_to='posts/')

    def __str__(self):
        return f'Image {self.image} for {self.post}'
