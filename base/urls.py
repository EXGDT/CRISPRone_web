from django.urls import path
from django.contrib.staticfiles.views import serve

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('favicon.ico', serve, {'path': '/base/images/cereal_logo.png'}),
    path('index/', views.index, name='index'),
]
