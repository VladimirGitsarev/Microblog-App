import os

from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'microblog_backend.settings')

app = Celery('microblog_backend', include=['microblog_backend.tasks'])
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
