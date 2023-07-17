from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('loggedin_user/', views.loggedin_user, name='loggedin_user'),
]