from django.urls import path, re_path
from django.views.static import serve

from . import views

urlpatterns = [
    path('cas9_submit/', views.cas9_submit, name='cas9_submit'),
    path('cas9_result/', views.cas9_result, name='cas9_result'),
    re_path(r'^cas9_task/(?P<path>.*)$',serve,{"document_root":"/disk2/users/cbiweb/html/CRISPRone/cas9/tmp/"}),
]