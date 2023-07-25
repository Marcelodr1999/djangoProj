from django.urls import path

from . import views

urlpatterns = [
    # path('', views.home, name='display'),
      path('', views.create_post, name='create_post'),
      path('messages/', views.messages_view, name='get_user_messages'),
      path('delete_message/<int:message_id>/', views.delete_message_view, name='delete_message'),
      path('update_message/<int:message_id>/', views.update_message_view, name='update_message'),
]

