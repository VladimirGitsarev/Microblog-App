from rest_framework import serializers

from authentication.serializers import SmallUserSerializer
from tg.models import TelegramUser


class TelegramUserSerializer(serializers.ModelSerializer):
    user = SmallUserSerializer()

    class Meta:
        model = TelegramUser
        fields = '__all__'
        depth = 1
