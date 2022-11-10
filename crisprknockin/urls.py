from django.urls import path
from django.contrib.staticfiles.views import serve

from . import views

urlpatterns = [
    path('crisprknockin_submit/', views.crisprknockin_submit, name='crisprknockin_submit'),
]
