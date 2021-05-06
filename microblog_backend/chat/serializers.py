from rest_framework import serializers

from authentication.serializers import SmallUserSerializer
from chat.models import Chat, Message


class RetrieveChatSerializer(serializers.ModelSerializer):
    participants = SmallUserSerializer(read_only=True, many=True)

    class Meta:
        model = Chat
        fields = ('id', 'participants', 'created_at', )


class CreateChatSerializer(serializers.ModelSerializer):

    class Meta:
        model = Chat
        fields = ('id', 'participants', 'created_at', )


class MessageSerializer(serializers.ModelSerializer):
    sender = SmallUserSerializer()

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

    class Meta:
        model = Message
        fields = ('id', 'message', 'sender', 'chat', 'created_at', )