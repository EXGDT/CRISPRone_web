from django.urls import path
from django.contrib.staticfiles.views import serve

from . import views

urlpatterns = [
    path('fragmentEditor_Deletion_submit/', views.fragmentEditor_Deletion_submit, name='fragmentEditor_Deletion_submit'),
    path('fragmentEditor_Inversion_submit/', views.fragmentEditor_Inversion_submit, name='fragmentEditor_Inversion_submit'),
    path('fragmentEditor_Translocation_submit/', views.fragmentEditor_Translocation_submit, name='fragmentEditor_Translocation_submit'),
]
