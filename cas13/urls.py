from django.urls import path, re_path
from django.views.static import serve

from . import views

urlpatterns = [
    ## old
    path('cas13_submit/', views.cas13_submit, name='cas13_submit'),
    path('cas13_result/', views.cas13_result, name='cas13_result'),
    re_path(r'^cas13_task/(?P<path>.*)$',serve,{"document_root":"/disk2/users/cbiweb/html/CRISPRone/cas13/tmp/"}),
    ## New
    path('cas13_API/', views.cas13_API, name='cas13_API'),
    path('cas13_module_API/', views.cas13_module_API, name='cas13_module_API'),
    path('cas13_namedb_list', views.cas13_namedb_list, name='cas13_namedb_list'),
]
