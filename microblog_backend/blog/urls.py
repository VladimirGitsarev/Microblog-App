from django.urls import path, include

from rest_framework.routers import DefaultRouter

from blog.views import PostViewSet, CommentViewSet

app_name = 'blog'

router = DefaultRouter()
router.register('posts', PostViewSet, basename='posts')
router.register('comments', CommentViewSet, basename='comments')

urlpatterns = [
    path('', include(router.urls)),
]
