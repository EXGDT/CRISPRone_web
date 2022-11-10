from django.urls import path
from django.contrib.staticfiles.views import serve

from . import views

urlpatterns = [
    path('literature/', views.literature, name='literature'),
]
