from django.shortcuts import render
from pkg_resources import ContextualVersionConflict

# Create your views here.

import pymysql
db = pymysql.connect(host="localhost", user="che", password="che_123", database="test")
cursor = db.cursor()


def crispra_submit(request):
    if request.method == "POST":
        # sql = "select * from Gossypium_hirsutum_gene_model_gff3"
        # cursor.execute(sql)
        form_inputs = {}
        PAM_seqs = request.POST.get('pam')
        max_mixmatch = request.POST.get('max_mismatch')
        name_db = request.POST.get('genome')
        loc = request.POST.get('locus')
        position = request.POST.get('position')
        seq = request.POST.get('sequence')


        form_inputs['PAM_seqs'] = PAM_seqs
        form_inputs['max_mismatch'] = max_mixmatch
        form_inputs['name_db'] = name_db
        form_inputs['loc'] = loc
        form_inputs['position'] = position
        form_inputs['seq'] = seq

        return render(request, 'crispra/crispra_result.html', form_inputs)
    else:
        return render(request, 'crispra/crispra_submit.html')

