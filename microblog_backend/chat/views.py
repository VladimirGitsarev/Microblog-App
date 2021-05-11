from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import action

from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.mixins import (
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
    DestroyModelMixin,
)

from authentication.models import User
from chat.serializers import RetrieveChatSerializer, CreateChatSerializer, MessageSerializer
from chat.models import Chat, Message


class ChatViewSet(
    GenericViewSet,
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
):
    default_serializer_class = RetrieveChatSerializer
    permission_classes = (IsAuthenticated, )
    serializer_classes = {
        'create': CreateChatSerializer,
    }

    def get_serializer_class(self):
        return self.serializer_classes.get(self.action, self.default_serializer_class)

    def get_queryset(self):
        return Chat.objects.filter(participants__id=self.request.user.id).order_by('-created_at')

    @action(detail=True, methods=['get'])
    def messages(self, request, pk):
        messages = Message.objects.filter(chat=self.get_object())
        return Response(MessageSerializer(messages, many=True).data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        user_chat = Chat.objects.filter(participants__id=request.user.id) \
                                .filter(participants__id=request.data.get('participants'))
        if user_chat.exists():
            return Response(RetrieveChatSerializer(user_chat.first()).data, status=status.HTTP_200_OK)
        else:
            request.data['participants'] = [request.user.id, request.data.get('participants')]
            return super().create(request)