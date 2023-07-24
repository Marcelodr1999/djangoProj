from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login as auth_login
from django.contrib.auth.decorators import login_required
import json
from django.contrib.auth.forms import UserCreationForm
from users.models import CustomUser





class RegistrationForm(UserCreationForm):
    # Add any additional fields you want to include in the registration form
    # You can customize the form by overriding fields or adding new ones.

    class Meta:
        model = CustomUser
        fields = ['email', 'password1', 'password2']


@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        form = RegistrationForm(data)
        if form.is_valid():
            form.save()
            return JsonResponse({'success': True, 'message': 'Registration successful'})
        else:
            return JsonResponse({'success': False, 'errors': form.errors})
    else:
        return JsonResponse({'detail': 'Method not allowed'}, status=405)
    


@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            # Perform any necessary validation on the data
            if not email or not password:
                return JsonResponse({'success': False, 'message': 'Invalid login credentials'})
            
            # Authenticate the user
            user = authenticate(request, email=email, password=password)
            if user is not None:
                # Login the user
                auth_login(request, user)
                request.session['email'] = user.email
                request.session['id'] = user.id

                response_data = {
                    'success': True,
                    'message': 'Login successful',
                    'email': user.email,
                    'id': user.id  
                }
                return JsonResponse(response_data)
            else:
                return JsonResponse({'success': False, 'message': 'Invalid login credentials'})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON data'})
    return JsonResponse({'success': False, 'message': 'Invalid request method'})


@csrf_exempt
def editname(request):
    if request.method == 'POST':
        user_id = request.headers.get('X-User-ID')

        if user_id:
            try:
                # Retrieve the CustomUser object based on the user_id
                user = CustomUser.objects.get(id=user_id)

                # Get the first name and last name from the JSON request data
                data = json.loads(request.body)
                first_name = data.get('first_name')
                last_name = data.get('last_name')

                # Update the first name and last name
                user.first_name = first_name
                user.last_name = last_name
                user.save()

                return JsonResponse({'success': True, 'message': 'Name updated successfully'})
            except CustomUser.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'User not found'})
            except json.JSONDecodeError:
                return JsonResponse({'success': False, 'message': 'Invalid JSON data'})
        else:
            return JsonResponse({'success': False, 'message': 'User ID not found in session'})
    else:
        return JsonResponse({'detail': 'Method not allowed'}, status=405)
    
@csrf_exempt
def delete_account_view(request):
    if request.method == 'POST':
        user_id = request.headers.get('X-User-ID')
        if user_id is not None:
            try:
                user = CustomUser.objects.get(id=user_id)
                user.delete()
                return JsonResponse({'success': True, 'message': 'Account deleted successfully'})
            except CustomUser.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'User not found'}, status=404)
        else:
            return JsonResponse({'success': False, 'message': 'User ID not found in session'}, status=401)
    else:
        return JsonResponse({'detail': 'Method not allowed'}, status=405)
    
@csrf_exempt
@login_required 
def loggedin_user(request):
    user = request.user
    email = user.email
    return JsonResponse({'email': email})