from django.urls import path
from django.contrib.staticfiles.views import serve

from . import views

urlpatterns = [
    path('baseEditor_submit/', views.baseEditor_submit, name='baseEditor_submit'),
]
