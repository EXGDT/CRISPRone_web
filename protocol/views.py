from django.shortcuts import render

# Create your views here.

def protocol_plasmidsList(request):
    return render(request, 'protocol/plasmidsList.html')


def protocol_getPlasmids(request):
    if request.method == "POST":
        return render(request, 'protocol/getPlasmidsResult.html')
    else:
        return render(request, 'protocol/getPlasmids.html')
