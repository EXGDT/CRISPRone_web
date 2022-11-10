from django.shortcuts import render

# Create your views here.


def epigenome_submit(request):
    if request.method == "POST":
        input_parameters_results = "xzp"
        return render(request, 'epigenome/result.html', input_parameters_results)
    else:
        return render(request, 'epigenome/submit.html')
