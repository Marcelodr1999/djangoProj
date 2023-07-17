from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login as auth_login


@csrf_exempt
def register(request):
    if request.method == 'POST':
        # Extract and validate the registration data from the request
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        # Perform any necessary validation on the data
        if not email or not password:
            return JsonResponse({'success': False, 'message': 'Invalid registration data'})
        
        # Create a new user
        user = settings.AUTH_USER_MODEL.objects.create_user(email=email, password=password)
        
        # Perform any additional tasks after registration
        # (e.g., sending a confirmation email)
        
        return JsonResponse({'success': True, 'message': 'Registration successful'})
    

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        # Extract and validate the login data from the request
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        # Perform any necessary validation on the data
        if not email or not password:
            return JsonResponse({'success': False, 'message': 'Invalid login credentials'})
        
        # Authenticate the user
        user = authenticate(request, email=email, password=password)
        if user is not None:
            # Login the user
            auth_login(request, user)
            return JsonResponse({'success': True, 'message': 'Login successful'})
        else:
            return JsonResponse({'success': False, 'message': 'Invalid login credentials'})
    return JsonResponse({'success': False, 'message': 'Invalid request method'})
