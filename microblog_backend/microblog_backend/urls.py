from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('authentication.urls', namespace='auth')),
    path('blog/', include('blog.urls', namespace='blog')),
]
