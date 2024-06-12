from django.shortcuts import render
from django.contrib import messages
import re
import logging
logger = logging.getLogger(__name__)
# logger.setLevel(logging.INFO)


import textwrap
import re

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

def cas13_submit(request):
    # logger.info("test message")
    # logger.error('Something went wrong!')
    if request.method == "POST":
        input_parameters_results = {}
        inputSequence = request.POST.get('inputSequence').strip().upper()
        targetGenome = request.POST.get('targetGenome').strip()
        sgRNALength = int(request.POST.get('sgRNALength'))
        
        
        (type, seq) = inputSequenceCheck(inputSequence)
        logger.error(seq)
        if type == "seq":
            input_parameters_results['inputSequence'] = seq[1]
            input_parameters_results['targetGenome'] = targetGenome
            input_parameters_results['sgRNALength'] = sgRNALength
            seq_length = len(seq[1])
            sgrnas = []
            i=0
            # logger.error(seq[0])
            seqid = seq[0].strip().lstrip('>')
            while(1):
                cerna = seq[1][i:i+sgRNALength]
                # pos = seq[0]+':'+str(i)+'..'+str((i+24))
                pos = f'{seqid}:{i}...{i+sgRNALength}'
                sgrnas.append([i+1,cerna, pos])
                i=i+1
                logger.error(pos)
                if((i+sgRNALength)>seq_length):
                    break
            input_parameters_results['sgrnas'] = sgrnas
            
            
        
        # input_parameters_results['inputSequence'] = '<br>'.join(textwrap.wrap(''.join(inputSequence), 100))
        # input_parameters_results['refSequence'] = inputSequenceParse(inputSequence)[0]
        # input_parameters_results['editSequence'] =  inputSequenceParse(inputSequence)[1]
        # else:
        #     # errmes = '<p><strong><i class="fas fa-exclamation-triangle"></i> Error: Input sequence contains a character not in the following list: [A, T, C, G, (, ), +, -, /].</strong></p>'
        #     errmes = 'Error: Input sequence contains a character not in the following list: [A, T, C, G, (, ), +, -, /].'
        #     messages.add_message(request, messages.WARNING, errmes)

        return render(request, 'cas13/result.html', input_parameters_results)
    else:
        return render(request, 'cas13/submit.html')

def cas13_result(request):
    # result = request.GET.get("name")
    return render(request, 'cas13/result.html')

def inputSequenceCheck(sequence):
    # 输入为序列
    if(re.search(r'^>', sequence)):
        split = sequence.split('\n')
        logger.error(split[1])
        # return split[1]
        dna = set('ACTG')
        return 'seq', split
    # 输入为坐标位置
    if(re.search(r':', sequence)):
        logger.error(sequence)
        return 'pos', sequence
    # 不是以上2种，则为gene ID
    logger.error(sequence)
    return 'gid', sequence


    # return all(base.upper() in dna for base in sequence)

def inputSequenceParse(sequence):
    annotations_ref_coler = []
    annotations_edit_coler = []
    annotations_ref = []
    annotations_edit = []
    mysequence = re.split('\(|\)',sequence)
    for seq in mysequence:
        if "+" in seq:
            ref_seq_coler = '<span style="background-color:#ebf7f0; color:#3CB371; font-size:18px"><b>^</b></span>'
            edit_seq_coler = '<span style="background-color:#ebf7f0; color:#3CB371; font-size:18px"><b>' + ''.join(seq.split("+")[1]) + '</b></span>'
            ref_seq = ""
            edit_seq = ''.join(seq.split("+")[1])
        elif "-" in seq:
            ref_seq_coler = '<span style="background-color:#fbe7eb; color:#DC143C; font-size:18px"><b>' + ''.join(seq.split("-")[1]) + '</b></span>'
            edit_seq_coler = '<span style="background-color:#fbe7eb; color:#DC143C; font-size:18px"><b>^</b></span>'
            ref_seq = ''.join(seq.split("-")[1])
            edit_seq = ""
        elif "/" in seq:
            ref_seq_coler = '<span style="background-color:#e8f3ff; color:#1E90FF; font-size:18px"><b>' + ''.join(seq.split("/")[0]) + '</b></span>'
            edit_seq_coler = '<span style="background-color:#e8f3ff; color:#1E90FF; font-size:18px"><b>' + ''.join(seq.split("/")[1]) + '</b></span>'
            ref_seq = ''.join(seq.split("/")[0])
            edit_seq = ''.join(seq.split("/")[1])
        else:
            ref_seq_coler = edit_seq_coler = ref_seq = edit_seq = seq
        annotations_ref_coler.append(ref_seq_coler)
        annotations_edit_coler.append(edit_seq_coler)
        annotations_ref.append(ref_seq)
        annotations_edit.append(edit_seq)
    return '<br>'.join(textwrap.wrap(''.join(annotations_ref_coler), 100)), '<br>'.join(textwrap.wrap(''.join(annotations_edit_coler), 100)), ''.join(annotations_ref), ''.join(annotations_edit)

########################################## New Cas13 ##########################################
@api_view(['POST'])
def cas13_API(request):
    data = request.data
    # {inputSequence: 'AAAA', pam: 'NNGRRT', spacerLength: '', sgRNAModule: 'spacerpam', name_db: 'Gossypium_hirsutum_TM1_HAU'}
    inputSequence = data['inputSequence']
    name_db = data['name_db']
    pam = data['pam']
    spacerLength = data['spacerLength']
    sgRNAModule = data['sgRNAModule']
    hash_input = f"{pam}{name_db}{inputSequence}{sgRNAModule}{spacerLength}"
    task_id = hashlib.sha256(hash_input.encode('utf-8')).hexdigest()
    tasks.cas13_task_process.delay(task_id, inputSequence, pam, spacerLength, sgRNAModule, name_db)
    return Response(task_id)


def cas13_namedb_list(request):
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


def cas13_module_API(request):
    task_id = request.GET.get('task_id')
    task = result_cas13_list.objects.get(task_id=task_id)
    return JsonResponse({"task_id": task.task_id, "task_status": task.task_status, "sgRNAJson": task.sgRNA_json})
