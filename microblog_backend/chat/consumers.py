import datetime
import json
import django

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from authentication.models import User
from authentication.serializers import SmallUserSerializer
from chat.models import Message


class ChatConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def get_avatar(self):
        return User.objects.get(id=self.scope['user'].id).avatar

    @database_sync_to_async
    def save_message(self, message):
        return Message.objects.create(message=message, sender=self.scope['user'], chat_id=self.chat_id)

    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = 'chat_%s' % self.chat_id
        self.avatar = await self.get_avatar() if str(self.scope['user']) != 'AnonymousUser' \
            else 'https://www.pinclipart.com/picdir/big/164-1640714_user-symbol-interface-contact-phone-set-add-sign.png'


        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': SmallUserSerializer(self.scope["user"]).data,
                'created_at': datetime.datetime.now().isoformat()
            }
        )

        await self.save_message(message)

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        user = event['sender']
        created_at = event['created_at']
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': user,
            'created_at': created_at
        }))
