from django.db import models
from datetime import datetime
from django.conf import settings

class Display(models.Model):
    message = models.TextField(blank=True)
    msg_date = models.DateTimeField(default=datetime.now, blank=True)
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)


    