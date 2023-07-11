from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.contrib.auth.models import User

import datetime
from .models import Display

def current_datetime(request):
    now = datetime.datetime.now()
    html = "<html><body>It is now %s.</body></html>" % now
    return HttpResponse(html)

def send_json(request):

    messages = list(Display.objects.values())
    # data = [{'name': 'Bob', 'message': 'anything'},
    #         {'name': 'Julia', 'message': messages}]

    return JsonResponse(messages, safe=False)


def make_post(request):
    msg = list(Display.objects.filter(id=2).values())

    # posts = [{'name': 'Bob', 'message': 'anything'},
    #         {'name': 'Julia', 'message': msg}]
    return JsonResponse(msg, safe=False)