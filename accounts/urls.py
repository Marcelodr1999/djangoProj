from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('loggedin_user/', views.loggedin_user, name='loggedin_user'),
    path('editname/', views.editname, name='editname'),
    path('delete_account/', views.delete_account_view, name='delete_account'),
]