from django.urls import path

from . import views

urlpatterns = [
    # path('', views.send_json, name='display'),
     path('', views.make_post, name='display'),

]

