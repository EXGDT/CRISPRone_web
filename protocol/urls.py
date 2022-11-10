from django.urls import path
from django.contrib.staticfiles.views import serve

from . import views

urlpatterns = [
    path('protocol_plasmidsList/', views.protocol_plasmidsList, name='protocol_plasmidsList'),
    path('protocol_getPlasmids/', views.protocol_getPlasmids, name='protocol_getPlasmids'),
]
