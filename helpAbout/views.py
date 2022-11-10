from django.shortcuts import render
import pandas as pd

# Create your views here.


#####################################################################################
genome_metadata = "/disk2/users/cbiweb/html/CRISPRone/helpAbout/static/helpAbout/Genome_Metadata.csv"

#####################################################################################

def help(request):
    return render(request, 'helpAbout/help.html')

def download(request):
    download_metadata = {}
    csv_file = genome_metadata
    genome_metadata_js = csvtojs(csv_file)
    download_metadata['genome_metadata_js'] = genome_metadata_js
    return render(request, 'helpAbout/download.html', download_metadata)

def news(request):
    if request.method == "POST":
        input_parameters_results = "xzp"
        return render(request, 'helpAbout/news.html', input_parameters_results)
    else:
        return render(request, 'helpAbout/news.html')


def contact_us(request):
    if request.method == "POST":
        return render(request, 'helpAbout/contact_us_result.html')
    else:
        return render(request, 'helpAbout/contact_us.html')


#####################################################################################
########################################### My def ##################################
#####################################################################################
def csvtojs(csv_file):
    pd_df = pd.read_csv(csv_file)
    data_json = pd_df.to_json(orient="records")
    return data_json
