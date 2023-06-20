from django.shortcuts import render
from django.http import HttpResponse, Http404, StreamingHttpResponse, FileResponse
import pandas as pd
from django.core.mail import send_mail
from django.conf import settings

# Create your views here.


#####################################################################################
genome_metadata = "static/helpAbout/Genome_Metadata.csv"

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
    return render(request, 'helpAbout/news.html')


def contact_us(request):
    if request.method == "GET":
        return render(request, 'helpAbout/contact_us.html')
        #return render(request, 'helpAbout/contact_us_result.html')
    if request.method == 'POST':
        #useremail = request.form['yourEmail']
        #title = request.form['myvectors']
        send_list = []
        send_list.append(request.POST['yourEmail'])
        send_mail(
            "Subject here",
            "Here is the message.",
            settings.EMAIL_HOST_USER,
            send_list,
            fail_silently=False,
        )
        #flash(Markup('Data successfully Send.'))
        #return render(request, 'helpAbout/contact_us.html')
        return HttpResponse('fasddd')


#####################################################################################
########################################### My def ##################################
#####################################################################################
def csvtojs(csv_file):
    pd_df = pd.read_csv(csv_file)
    data_json = pd_df.to_json(orient="records")
    return data_json

# Use StreamingHttpResponse to download a large file
def stream_http_download(request, file_path):
    try:
        response = StreamingHttpResponse(open(file_path, 'rb'))
        response['content_type'] = "application/octet-stream"
        response['Content-Disposition'] = 'attachment; filename=' + os.path.basename(file_path)
        return response
    except Exception:
        raise Http404
