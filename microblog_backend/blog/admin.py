from django.contrib import admin
from blog.models import Post


class BaseModelMixinAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at', 'updated_at')


admin.site.register(Post, BaseModelMixinAdmin)