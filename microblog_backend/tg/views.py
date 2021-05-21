from botocore.exceptions import ValidationError
from django.shortcuts import render

from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status

from tg.models import TelegramUser
from tg.serialzers import TelegramUserSerializer


class TelegramView(GenericAPIView):
    queryset = TelegramUser.objects.all()
    serializer_class = TelegramUserSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        """Get current user telegram profile"""
        tg_user = self.get_queryset(user=request.user)
        return Response(self.get_serializer(tg_user).data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        if 'code' in request.data:
            tg_user = self.get_queryset().filter(tg_id=request.data.get('code')).first()
            if tg_user:
                tg_user.user = request.user
                tg_user.is_active = True
                tg_user.save(update_fields=['user', 'is_active'])
                return Response({'detail': 'Telegram bot has been activated.'}, status=status.HTTP_200_OK)
            return Response({'detail': 'This activation code is not valid.'})
        return Response({'detail': 'Empty code.'}, status=status.HTTP_400_BAD_REQUEST)
