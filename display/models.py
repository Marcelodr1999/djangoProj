from django.db import models
from datetime import datetime

class Display(models.Model):
    message = models.TextField(blank=True)
    msg_date = models.DateTimeField(default=datetime.now, blank=True)