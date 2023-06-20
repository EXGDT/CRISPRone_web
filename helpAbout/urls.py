from django.urls import path, re_path
from django.contrib.staticfiles.views import serve

from . import views

urlpatterns = [
    path('help/', views.help, name='help'),
    path('download/', views.download, name='download'),
    path('news/', views.news, name='news'),
    path('contact_us/', views.contact_us, name='contact_us'),
    re_path(r'^data/(?P<file_path>.*)$', views.stream_http_download, name='file_download'),
]
