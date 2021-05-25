from django.contrib import admin
from django.urls import path, re_path, include

urlpatterns = [
    path('jet/', include('jet.urls', 'jet')),  # Django JET URLS
    path('admin/', admin.site.urls),
    path('auth/', include('authentication.urls', namespace='auth')),
    path('blog/', include('blog.urls', namespace='blog')),
    path('chat/', include('chat.urls')),
    path('telegram/', include('tg.urls', namespace='tg'))
]
