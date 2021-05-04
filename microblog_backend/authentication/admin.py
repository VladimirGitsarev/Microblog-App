from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib import admin

from authentication.models import User
from blog.admin import PostsInstanceInline, CommentsInstanceInline


class UserAdmin(BaseUserAdmin):
    inlines = [PostsInstanceInline, CommentsInstanceInline]
    fieldsets = (
        *BaseUserAdmin.fieldsets,
        (
            'Extended',
            {
                'fields': (
                    'birth_date', 'location', 'status', 'link', 'following', 'image'
                ),
            },
        ),
    )


admin.site.register(User, UserAdmin)