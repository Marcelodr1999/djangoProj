from django.shortcuts import render

from django.http import JsonResponse

from .forms import PostForm
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.conf import settings





        
# Create your views here.
@csrf_exempt
def create_post(request): 
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'errors': form.errors})
    else:
       return JsonResponse({'detail': 'Method not allowed'}, status=405)

# @csrf_exempt    
# def create_post(request):
#     if request.method == 'POST':
#         form = PostForm(request.POST)
#         if form.is_valid():
#             form.save()
#             return JsonResponse({'success': True})
#         else:
#             return JsonResponse({'success': False, 'errors': form.errors})
#     else:
#         displays = Msgtest.objects.all()
#         data = [{'id': display.id, 'msg': display.msg} for display in displays]
#         return JsonResponse(data, safe=False)