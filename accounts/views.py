from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login as auth_login
from django.contrib.auth.decorators import login_required
import json
from django.contrib.auth.forms import UserCreationForm
from users.models import CustomUser

from django.views.decorators.http import require_POST

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
                request.session['first_name'] = user.first_name

                response_data = {
                    'success': True,
                    'message': 'Login successful',
                    'email': user.email,
                    'id': user.id,  
                    'first_name': user.first_name,
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


from django.db.models import Q

@csrf_exempt
# def search_users_view(request):
#     search_query = request.GET.get('q')
#     if search_query:
#         # Perform case-insensitive search on the email field
#         users = CustomUser.objects.filter(Q(email__icontains=search_query))
#         user_id_header = request.headers.get('X-User-ID')
#         current_user = None
#         if user_id_header:
#             try:
#                 current_user = CustomUser.objects.get(id=int(user_id_header))
#             except CustomUser.DoesNotExist:
#                 pass

#         # serialized_users = [{'id': user.id, 'email': user.email, 'is_followed': current_user.following.filter(id=user.id).exists() if current_user else False} for user in users]
#         serialized_users = [{'id': user.id, 'email': user.email, 'is_followed': current_user.is_followed_by(user) if current_user else False} for user in users]
#         return JsonResponse({'users': serialized_users})
#     else:
#         return JsonResponse({'success': False, 'message': 'Search query not provided'}, status=400)
def search_users_view(request):
    search_query = request.GET.get('q')
    if search_query:
        # Perform case-insensitive search on the email field
        users = CustomUser.objects.filter(Q(email__icontains=search_query))
        user_id_header = request.headers.get('X-User-ID')
        current_user = None
        if user_id_header:
            try:
                current_user = CustomUser.objects.get(id=int(user_id_header))
            except CustomUser.DoesNotExist:
                pass

        # Debug: Check if current_user is correctly retrieved
        print('Current User:', current_user)

        # Debug: Check if the users followed by the current_user are correct
        if current_user:
            followed_users = current_user.following.all()
            print('Followed Users:', followed_users)

        serialized_users = [{'id': user.id, 'email': user.email, 'is_followed': current_user.is_followed(user) if current_user else False} for user in users]
        return JsonResponse({'users': serialized_users})
    else:
        return JsonResponse({'success': False, 'message': 'Search query not provided'}, status=400)

@require_POST
@csrf_exempt
def follow_user_view(request, user_id):
    if request.method == 'POST':
        user_id_header = request.headers.get('Y-User-Id')
        
        if user_id_header is None:
            return JsonResponse({'success': False, 'message': 'User ID not found in session.'}, status=401)

        try:
            current_user = CustomUser.objects.get(id=int(user_id_header))
            user_to_follow = CustomUser.objects.get(id=int(user_id))

            # Check if the current user is already following the user_to_follow
            if current_user.following.filter(id=user_to_follow.id).exists():
                # User is already following, return an error response or handle as needed
                return JsonResponse({'success': False, 'message': 'You are already following this user.'}, status=400)

            # Perform the follow action
            current_user.following.add(user_to_follow)
            return JsonResponse({'success': True, 'message': 'User followed successfully.'})

        except CustomUser.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User not found.'}, status=404)

    else:
        return JsonResponse({'detail': 'Method not allowed'}, status=405)
    
@require_POST
@csrf_exempt
def unfollow_user_view(request, user_id):
    user_id_header = request.headers.get('X-User-ID')
    
    if user_id_header is None:
        return JsonResponse({'success': False, 'message': 'User ID not found in session.'}, status=401)

    try:
        current_user = CustomUser.objects.get(id=int(user_id_header))
        user_to_unfollow = CustomUser.objects.get(id=int(user_id))

        # Check if the current user is following the user_to_unfollow
        if not current_user.following.filter(id=user_to_unfollow.id).exists():
            # User is not following, return an error response or handle as needed
            return JsonResponse({'success': False, 'message': 'You are not following this user.'}, status=400)

        # Perform the unfollow action
        current_user.following.remove(user_to_unfollow)
        return JsonResponse({'success': True, 'message': 'User unfollowed successfully.'})

    except CustomUser.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'User not found.'}, status=404)
    

@csrf_exempt
def get_followed_users(request):
    user_id = request.headers.get('X-User-ID')

    if user_id is not None:
        try:
            current_user = CustomUser.objects.get(id=int(user_id))
            followed_users = current_user.followed_users()
            serialized_users = [{'id': user.id, 'email': user.email} for user in followed_users]

            return JsonResponse({'users': serialized_users})
        except CustomUser.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User not found.'}, status=404)

    else:
        return JsonResponse({'success': False, 'message': 'User ID not found in session.'}, status=401)