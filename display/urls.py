from django.urls import path

from . import views

urlpatterns = [
    # path('', views.send_json, name='display'),
     path('', views.home, name='display'),

]

