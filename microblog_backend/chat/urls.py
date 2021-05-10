from django.urls import path, include
from rest_framework.routers import DefaultRouter

from chat.views import room, ChatViewSet

app_name = 'chat'


router = DefaultRouter()
router.register('chats', ChatViewSet, basename='chats')
# router.register('messages', MessageViewSet, basename='comments')


urlpatterns = [
    path('<int:chat_id>/', room, name='room'),
    path('', include(router.urls)),
]