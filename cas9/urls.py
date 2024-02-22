from django.urls import path, re_path
from django.views.static import serve

from . import views

urlpatterns = [
    path('cas9_submit/', views.cas9_submit, name='cas9_submit'),
    path('cas9_result/', views.cas9_result, name='cas9_result'),
    path('cas9_API/', views.cas9_API, name='cas9_API'),
    path('cas9_pagi_ontarget/', views.cas9_pagi_ontarget, name='cas9_pagi_ontarget'),
    path('cas9_pagi_offtarget/', views.cas9_pagi_offtarget, name='cas9_pagi_offtarget'),
    re_path(r'^cas9_task/(?P<path>.*)$',serve,{"document_root":"/disk2/users/yxguo/html/CRISPRone/cas9/tmp/"}),
]
