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
from users.models import CustomUser
from django.db.models import Q

#@login_required
@csrf_exempt
# def messages_view(request):
#     user_id = request.headers.get('X-User-ID')

#     if user_id is not None:
        
#         messages = Display.objects.filter(user_id=user_id)

#         # Convert the messages to a list of dictionaries
#         messages_data = [
#             {'id': message.id, 'message': message.message, 'msg_date': message.msg_date}
#             for message in messages
#         ]

#         return JsonResponse({'messages': messages_data})
#     else:
#         return JsonResponse({'success': False, 'message': 'User ID not found in session'})
def messages_view(request):
    user_id = request.headers.get('X-User-ID')

    if user_id is not None:
        try:
            current_user = CustomUser.objects.get(id=int(user_id))
            following_users_ids = current_user.following.values_list('id', flat=True)

            # Fetch messages from the current user and the users they follow
            messages = Display.objects.filter(
                Q(user_id=user_id) | Q(user_id__in=following_users_ids)
            ).order_by('-msg_date')

            # Convert the messages to a list of dictionaries
            messages_data = [
                {'id': message.id, 'message': message.message, 'msg_date': message.msg_date, 'email': message.user_id.email}
                for message in messages
            ]

            return JsonResponse({'messages': messages_data})
        except CustomUser.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User not found.'}, status=404)
    else:
        return JsonResponse({'success': False, 'message': 'User ID not found in session'}, status=401)
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
    

@csrf_exempt
def update_message_view(request, message_id):
    if request.method == 'POST':
        user_id = request.headers.get('X-User-ID')
        if user_id is not None:
            try:
                message = Display.objects.get(id=message_id, user_id=user_id)
                data = json.loads(request.body)
                new_message = data.get('message')
                if new_message is not None:
                    message.message = new_message
                    message.save()
                    return JsonResponse({'success': True, 'message': 'Message updated successfully'})
                else:
                    return JsonResponse({'success': False, 'message': 'Invalid message content'}, status=400)
            except Display.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Message not found'}, status=404)
        else:
            return JsonResponse({'success': False, 'message': 'User ID not found in session'}, status=401)
    else:
        return JsonResponse({'detail': 'Method not allowed'}, status=405)

@csrf_exempt
def delete_message_view(request, message_id):
    user_id = request.headers.get('X-User-ID')

    if user_id is not None:
        try:
            # Check if the message exists and belongs to the user
            message = Display.objects.get(id=message_id, user_id=user_id)
            message.delete()
            return JsonResponse({'success': True, 'message': 'Message deleted successfully'})
        except Display.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Message not found'}, status=404)
    else:
        return JsonResponse({'success': False, 'message': 'User ID not found in session'}, status=401)