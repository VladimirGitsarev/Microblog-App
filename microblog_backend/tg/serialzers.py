from rest_framework import serializers

from tg.models import TelegramUser


class TelegramUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = TelegramUser
        fields = '__all__'
        depth = 1
