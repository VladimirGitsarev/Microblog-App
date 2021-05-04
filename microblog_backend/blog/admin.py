from django.contrib import admin

from blog.models import Post, Comment

from jet.admin import CompactInline


class BaseModelMixinAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at', 'updated_at')


class PostsInstanceInline(CompactInline):
    model = Post
    extra = 1
    show_change_link = True


class CommentsInstanceInline(CompactInline):
    model = Comment
    extra = 1
    show_change_link = True


admin.site.register(Post, BaseModelMixinAdmin)
admin.site.register(Comment, BaseModelMixinAdmin)