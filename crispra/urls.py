from django.urls import path
from django.contrib.staticfiles.views import serve

from . import views

urlpatterns = [
    path('crispra_submit/', views.crispra_submit, name='crispra_submit'),
]
