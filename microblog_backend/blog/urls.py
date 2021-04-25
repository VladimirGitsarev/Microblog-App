from django.urls import path, include

from rest_framework.routers import DefaultRouter

from blog.views import PostViewSet

app_name = 'blog'

router = DefaultRouter()
router.register('post', PostViewSet, basename='post')

urlpatterns = [
    path('', include(router.urls)),
]
