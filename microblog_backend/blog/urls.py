from django.urls import path, include

from rest_framework.routers import DefaultRouter

from blog.views import PostViewSet, CommentViewSet, VoteViewSet

app_name = 'blog'

router = DefaultRouter()
router.register('posts', PostViewSet, basename='posts')
router.register('comments', CommentViewSet, basename='comments')
router.register('votes', VoteViewSet, basename='votes')

urlpatterns = [
    path('', include(router.urls)),
]
