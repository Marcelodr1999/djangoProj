from django.db import models
from django.conf import settings



class Msgtest(models.Model):
    msg = models.TextField(blank=False)
 

    