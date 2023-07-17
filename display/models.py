from django.db import models
from datetime import datetime
from django.utils import timezone

from django.conf import settings

class Display(models.Model):
    message = models.TextField(blank=True)
    msg_date = models.DateTimeField(default=timezone.now, blank=True)
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, db_column='user_id', on_delete=models.CASCADE, blank=True, null=True)


