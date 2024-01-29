from django.shortcuts import render

# Create your views here.
def barcodeDesign(request):
    return render(request, 'barcodeDesign/editingAnalysis.html')

def editingAnalysis(request):
    return render(request, 'editedAnalysis/editingAnalysis.html')

def offTargetAnalysis(request):
    return render(request, 'editedAnalysis/offTargetAnalysis.html')
