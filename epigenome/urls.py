from django.urls import path
from django.contrib.staticfiles.views import serve

from . import views

urlpatterns = [
    path('epigenome_submit/', views.epigenome_submit, name='epigenome_submit'),
]
