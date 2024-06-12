from django.shortcuts import render
import hashlib
import os
import random
import string
import json
from http.client import HTTPResponse

from django.http import HttpResponseRedirect, HttpResponseNotFound, HttpResponseBadRequest, JsonResponse
from django.shortcuts import render,redirect
from pkg_resources import ContextualVersionConflict

from rest_framework.decorators import api_view
from rest_framework.response import Response

from cas12 import tasks

from cas12.models import result_cas12a_list

from celery import chain

# Create your views here.

def baseEditor_submit(request):
    if request.method == "POST":
        form_inputs = {}
        PAM_seqs = request.POST.get('pam')
        max_mixmatch = request.POST.get('max_mismatch')
        name_db = request.POST.get('name_db')
        loc = request.POST.get('locus')
        position = request.POST.get('position')
        seq = request.POST.get('sequence')
        form_inputs['PAM_seqs'] = PAM_seqs
        form_inputs['max_mismatch'] = max_mixmatch
        form_inputs['name_db'] = name_db
        form_inputs['loc'] = loc
        form_inputs['position'] = position
        form_inputs['seq'] = seq
        return render(request, 'baseEditor/result.html', form_inputs)
    else:
        return render(request, 'baseEditor/submit.html')



#####################################################################################
########################################### My def ##################################
#####################################################################################
def sgRNA_designer(genome):
    pass

def amino_acid_examination(genome):
    '''
    氨基酸翻译, 前后是否变化, 酸碱性, pH计算
    '''
    pass

def amino_acid_examination_InDel(genome):
    pass

def baseEditor_format_df(genome):
    pass


########################################## New baseEditor ##########################################
@api_view(['POST'])
def baseEditor_API(request):
    data = request.data
    # {inputSequence: 'AAAA', pam: 'NNGRRT', spacerLength: '', sgRNAModule: 'spacerpam', name_db: 'Gossypium_hirsutum_TM1_HAU'}
    inputSequence = data['inputSequence']
    name_db = data['name_db']
    pam = data['pam']
    spacerLength = data['spacerLength']
    sgRNAModule = data['sgRNAModule']
    hash_input = f"{pam}{name_db}{inputSequence}{sgRNAModule}{spacerLength}"
    task_id = hashlib.sha256(hash_input.encode('utf-8')).hexdigest()
    tasks.baseEditor_task_process.delay(task_id, inputSequence, pam, spacerLength, sgRNAModule, name_db)
    return Response(task_id)


def baseEditor_namedb_list(request):
    file_path = 'data/genome_files'
    file_list = os.listdir(file_path)
    genomes = []
    for filename in file_list:
        base, ext = os.path.splitext(filename)
        if ext == '.fa':
            value = base
            label = value.replace('_', ' ')
            genomes.append({
                'label': label,
                'value': value
            })
    print(genomes)
    return JsonResponse(genomes, safe=False)


def baseEditor_module_API(request):
    task_id = request.GET.get('task_id')
    task = result_baseEditor_list.objects.get(task_id=task_id)
    return JsonResponse({"task_id": task.task_id, "task_status": task.task_status, "sgRNAJson": task.sgRNA_json})
