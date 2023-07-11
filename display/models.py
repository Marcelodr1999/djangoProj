from django.db import models
from datetime import datetime
from django.contrib.auth.models import User

class Display(models.Model):
    message = models.TextField(blank=True)
    msg_date = models.DateTimeField(default=datetime.now, blank=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)


    