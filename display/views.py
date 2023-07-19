from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Display
from .forms import PostForm
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
import datetime
from django.conf import settings
import json

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

#@login_required
@csrf_exempt
def messages_view(request):
    user = request.user
    messages = Display.objects.filter(user_id=user.id)  # Assuming you have a Message model with a foreign key to the User model
    
    # Convert the messages to a list of dictionaries
    messages_data = [
        {'message': message.message, 'msg_date': message.msg_date}  # Customize the dictionary based on your Message model fields
        for message in messages
    ]
    

    return JsonResponse({'messages': messages_data})


@csrf_exempt
def home(request):
    displays = Display.objects.filter(user_id=2) # change 2 to whatever id you want to grab (can be variable)
   # displays = Display.objects.all() # Display all messages
    data = [{'id': display.id, 'content': display.message, 'created_at': display.msg_date} for display in displays]
    return JsonResponse(data, safe=False)


@csrf_exempt
def create_post(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            form = PostForm(data)
            if form.is_valid():
                form.save()
                return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False, 'errors': form.errors})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'errors': 'Invalid JSON data'})
    else:
        return JsonResponse({'detail': 'Method not allowed'}, status=405)