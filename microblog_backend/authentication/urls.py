from django.urls import path, include

from rest_framework.routers import DefaultRouter

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from authentication.views import AuthApi, RegisterView, UserViewSet, ResetPasswordView

app_name = 'authentication'

router = DefaultRouter()
router.register('user', AuthApi)
router.register('users', UserViewSet)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register_user'),
    path('register/<str:token>', RegisterView.as_view(), name='register_user_confirm'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('reset-password/<str:token>/', ResetPasswordView.as_view(), name='reset_password_confirm'),
    path('', include(router.urls)),
]