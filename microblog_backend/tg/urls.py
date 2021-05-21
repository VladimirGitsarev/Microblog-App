from django.urls import path, include

from tg.views import TelegramView

app_name = 'tg'

urlpatterns = [
    path('profile/', TelegramView.as_view(), name='telegram_view'),
]
