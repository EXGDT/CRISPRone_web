from django.shortcuts import render

# Create your views here.

def editingAnalysis(request):
    return render(request, 'editedAnalysis/editingAnalysis.html')

def offTargetAnalysis(request):
    return render(request, 'editedAnalysis/offTargetAnalysis.html')