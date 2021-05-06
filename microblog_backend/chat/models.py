from django.db import models
from authentication.models import User

from core.models.abstract_models import CreatedAt, UpdatedAt, SoftDelete


class Chat(CreatedAt, UpdatedAt, SoftDelete):

    participants = models.ManyToManyField(User, related_name='chat_participants', blank=True)

    def __str__(self):
        return f'Chat {self.id}: {self.participants.all()}'


class Message(CreatedAt, UpdatedAt, SoftDelete):
    message = models.CharField(max_length=300)
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f'Message from {self.sender} to chat {self.chat.id}'
