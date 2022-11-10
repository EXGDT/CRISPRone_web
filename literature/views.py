from django.shortcuts import render

# Create your views here.

def literature(request):
    return render(request, 'literature/literature.html')