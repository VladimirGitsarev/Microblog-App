from django.urls import path, include
from rest_framework.routers import DefaultRouter

from chat.views import ChatViewSet

app_name = 'chat'


router = DefaultRouter()
router.register('chats', ChatViewSet, basename='chats')


urlpatterns = [
    path('', include(router.urls)),
]