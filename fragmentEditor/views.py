from django.shortcuts import render

# Create your views here.


def fragmentEditor_Deletion_submit(request):
    if request.method == "POST":
        input_parameters_results = "xzp"
        return render(request, 'fragmentEditor/fragmentEditor_Deletion_result.html', input_parameters_results)
    else:
        return render(request, 'fragmentEditor/fragmentEditor_Deletion_submit.html')


def fragmentEditor_Inversion_submit(request):
    if request.method == "POST":
        input_parameters_results = "xzp"
        return render(request, 'fragmentEditor/fragmentEditor_Inversion_result.html', input_parameters_results)
    else:
        return render(request, 'fragmentEditor/fragmentEditor_Inversion_submit.html')


def fragmentEditor_Translocation_submit(request):
    if request.method == "POST":
        input_parameters_results = "xzp"
        return render(request, 'fragmentEditor/fragmentEditor_Translocation_result.html', input_parameters_results)
    else:
        return render(request, 'fragmentEditor/fragmentEditor_Translocation_submit.html')
