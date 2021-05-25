from botocore.exceptions import ValidationError
from django.shortcuts import render

from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status

from tg.serialzers import TelegramUserSerializer
from tg.models import TelegramUser
from tg.management.commands.bot import TelegramBot


class TelegramView(GenericAPIView):
    queryset = TelegramUser.objects.all()
    serializer_class = TelegramUserSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        """Get current user telegram profile"""
        tg_user = self.get_queryset().filter(user=request.user).first()
        if tg_user:
            return Response(self.get_serializer(tg_user).data, status=status.HTTP_200_OK)
        return Response({'detail': 'Your account is not connected to Telegram.'}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, *args, **kwargs):
        if 'code' in request.data:
            tg_user = self.get_queryset().filter(tg_id=request.data.get('code')).first()
            if tg_user:
                tg_user.user = request.user
                tg_user.is_active = True
                tg_user.save(update_fields=['user', 'is_active'])
                tg = TelegramBot()
                tg.bot.send_message(
                    tg_user.tg_id,
                    f'*Congratulations!*\n\n'
                    f'Bot is successfully connected to your Microblog account. '
                    f'Your telegram account _@{tg_user.username}_ '
                    f'linked to _@{tg_user.user.username}_ Microblog account.',
                    "Markdown"
                )
                return Response(self.get_serializer(tg_user).data, status=status.HTTP_200_OK)
            return Response({'detail': 'This activation code is not valid.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'Empty code.'}, status=status.HTTP_400_BAD_REQUEST)
