from django.db import models


class SoftDelete(models.Model):
    soft_deleted = models.BooleanField(default=False)

    @staticmethod
    def make_soft_delete(obj, flag):
        obj.soft_deleted = flag
        obj.save(update_fields=('soft_deleted',))

    class Meta:
        abstract = True


class CreatedAt(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


class UpdatedAt(models.Model):
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
