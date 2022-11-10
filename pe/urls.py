from django.urls import path
from django.contrib.staticfiles.views import serve

from . import views

urlpatterns = [
    path('pe_submit/', views.pe_submit, name='pe_submit'),
    path('pe_submit/', serve, {'path': '/pe/OUTPUT'}),
]
