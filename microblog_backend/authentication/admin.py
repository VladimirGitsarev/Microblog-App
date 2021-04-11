from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib import admin

from authentication.models import User


class UserAdmin(BaseUserAdmin):
    fieldsets = (
        *BaseUserAdmin.fieldsets,
        (
            'Extended',
            {
                'fields': (
                    'birth_date', 'location', 'status', 'link', 'following'
                ),
            },
        ),
    )


admin.site.register(User, UserAdmin)