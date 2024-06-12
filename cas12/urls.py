from django.urls import path, re_path
from django.views.static import serve

from . import views

urlpatterns = [
    ## old
    path('cas12a_submit/', views.cas12a_submit, name='cas12a_submit'),
    #path('cas12a_result/', views.cas12a_result, name='cas12a_result'),
    path('cas12b_submit/', views.cas12b_submit, name='cas12b_submit'),
    #path('cas12b_result/', views.cas12b_result, name='cas12b_result'),
    ## New
    path('cas12a_API/', views.cas12a_API, name='cas12a_API'),
    path('cas12a_module_API/', views.cas12a_module_API, name='cas12a_module_API'),
    # path('cas12a_namedb_list', views.cas12a_namedb_list, name='cas12a_namedb_list'),
    # path('cas12a_pagi_ontarget/', views.cas12a_pagi_ontarget, name='cas12a_pagi_ontarget'),
    # path('cas12a_pagi_offtarget/', views.cas12a_pagi_offtarget, name='cas12a_pagi_offtarget'),
    # re_path(r'^cas12a_task/(?P<path>.*)$',serve,{"document_root":"/disk2/users/yxguo/html/CRISPRone/cas12/tmp/"}),
    # path('cas12b_API/', views.cas12b_API, name='cas12b_API'),
    # path('cas12b_module_API/', views.cas12b_module_API, name='cas12b_module_API'),
    # path('cas12b_namedb_list', views.cas12b_namedb_list, name='cas12b_namedb_list'),
    # path('cas12b_pagi_ontarget/', views.cas12b_pagi_ontarget, name='cas12b_pagi_ontarget'),
    # path('cas12b_pagi_offtarget/', views.cas12b_pagi_offtarget, name='cas12b_pagi_offtarget'),
    # re_path(r'^cas12b_task/(?P<path>.*)$',serve,{"document_root":"/disk2/users/yxguo/html/CRISPRone/cas12/tmp/"}),
]
