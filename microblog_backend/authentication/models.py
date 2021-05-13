from hashlib import md5

from django.contrib.auth.models import AbstractUser
from django.db import models

from authentication.services.compress import Compressor


class User(AbstractUser):
    birth_date = models.DateField(blank=True, null=True)
    status = models.CharField(blank=True, null=True, max_length=255, default=None)
    location = models.CharField(blank=True, null=True, max_length=255, default=None)
    link = models.CharField(blank=True, null=True, max_length=255, default=None)
    following = models.ManyToManyField('self', symmetrical=False, default=None, blank=True, related_name='followers')
    image = models.ImageField(blank=True, null=True, upload_to='profiles/')

    @property
    def avatar(self):
        if self.image:
            return self.image.url
        digest = md5(self.email.lower().encode('utf-8')).hexdigest()
        return 'https://www.gravatar.com/avatar/{}?d=identicon&s={}'.format(digest, 150)

    def save(self, *args, **kwargs):
        if self.image:
            new_image = Compressor(self.image).compress()
            self.image = new_image
        super().save(*args, **kwargs)
