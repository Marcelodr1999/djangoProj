from django.urls import path

from . import views

urlpatterns = [
    # path('', views.home, name='display'),
      path('', views.create_post, name='create_post'),
      path('messages/', views.messages_view, name='get_user_messages'),
]

