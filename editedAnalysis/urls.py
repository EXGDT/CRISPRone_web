from django.urls import path
from django.contrib.staticfiles.views import serve

from . import views

urlpatterns = [
    path('barcodeDesign/', views.barcodeDesign, name='barcodeDesign'),
    path('editingAnalysis/', views.editingAnalysis, name='editingAnalysis'),
    path('offTargetAnalysis/', views.offTargetAnalysis, name='offTargetAnalysis'),
]
