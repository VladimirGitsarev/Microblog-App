from django.contrib import admin

from blog.models import Post, Comment, PostImage

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


class PostImageInline(CompactInline):
    model = PostImage
    extra = 1
    show_change_link = True


class PostAdmin(BaseModelMixinAdmin):
    inlines = (PostImageInline, )


admin.site.register(Post, PostAdmin)
admin.site.register(Comment, BaseModelMixinAdmin)
admin.site.register(PostImage)