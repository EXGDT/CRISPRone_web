from django.urls import path, re_path
from django.views.static import serve

from . import views

urlpatterns = [
    path('cas12a_submit/', views.cas12a_submit, name='cas12a_submit'),
    path('cas12a_result/', views.cas12a_result, name='cas12a_result'),
    re_path(r'^cas12a_task/(?P<path>.*)$',serve,{"document_root":"/disk2/users/cbiweb/html/CRISPRone/cas12/tmp/"}),
    path('cas12b_submit/', views.cas12b_submit, name='cas12b_submit'),
    path('cas12b_result/', views.cas12b_result, name='cas12b_result'),
    re_path(r'^cas12b_task/(?P<path>.*)$',serve,{"document_root":"/disk2/users/cbiweb/html/CRISPRone/cas12/tmp/"}),
]
