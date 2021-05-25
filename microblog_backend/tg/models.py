from django.db import models

from authentication.models import User
from core.models.abstract_models import SoftDelete, CreatedAt


class TelegramUser(CreatedAt, SoftDelete):
    user = models.ForeignKey(User, default=None, null=True, blank=True, on_delete=models.CASCADE)
    tg_id = models.IntegerField()
    username = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255, null=True)
    last_name = models.CharField(max_length=255, null=True)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return f'Telegram user {self.username} ID {self.tg_id} for {self.user}'
