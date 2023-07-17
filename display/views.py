from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.http import JsonResponse
from .models import Display
from .forms import PostForm
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
import datetime
from django.conf import settings


def current_datetime(request):
    now = datetime.datetime.now()
    html = "<html><body>It is now %s.</body></html>" % now
    return HttpResponse(html)

# def send_json(request):

#     messages = list(Display.objects.values())
#     # data = [{'name': 'Bob', 'message': 'anything'},
#     #         {'name': 'Julia', 'message': messages}]

#     return JsonResponse(messages, safe=False)


def make_post(request):
    msg = list(Display.objects.filter(id=2).values())
    return JsonResponse(msg, safe=False)



@csrf_exempt
def home(request):
    displays = Display.objects.filter(user_id=2) # change 2 to whatever id you want to grab (can be variable)
   # displays = Display.objects.all() # Display all messages
    data = [{'id': display.id, 'content': display.message, 'created_at': display.msg_date} for display in displays]
    return JsonResponse(data, safe=False)


@csrf_exempt
def create_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            # display = form.save(commit=False)
            # display.user_id_id = form.cleaned_data['user_id']
            # display.save()
            form.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'errors': form.errors})
    else:
        # form = PostForm()
        return JsonResponse({'detail': 'Method not allowed'}, status=405)