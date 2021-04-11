from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    birth_date = models.DateField(blank=True, null=True)
    status = models.CharField(blank=True, null=True, max_length=255, default=None)
    location = models.CharField(blank=True, null=True, max_length=255, default=None)
    link = models.CharField(blank=True, null=True, max_length=255, default=None)
    following = models.ManyToManyField('self', symmetrical=False, default=None, blank=True, related_name='followers')