from django.urls import path
from django.contrib.staticfiles.views import serve

from . import views

urlpatterns = [
    ## old
    path('baseEditor_submit/', views.baseEditor_submit, name='baseEditor_submit'),
    ## New
    path('baseEditor_API/', views.baseEditor_API, name='baseEditor_API'),
    path('baseEditor_module_API/', views.baseEditor_module_API, name='baseEditor_module_API'),
    path('baseEditor_namedb_list', views.baseEditor_namedb_list, name='baseEditor_namedb_list'),
]
