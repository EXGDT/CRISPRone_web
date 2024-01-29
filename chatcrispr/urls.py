from django.urls import path
from django.contrib.staticfiles.views import serve

from . import views

urlpatterns = [
    path('chatcrispr/', views.chatcrispr_submit, name='chatcrispr'),
]
