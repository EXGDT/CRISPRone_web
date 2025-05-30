import hashlib
import os
import random
import string
import json
from http.client import HTTPResponse
from Bio import SeqIO
import pandas as pd

from django.http import HttpResponseRedirect, HttpResponseNotFound, HttpResponseBadRequest, JsonResponse
from django.shortcuts import render,redirect
from pkg_resources import ContextualVersionConflict

from rest_framework.decorators import api_view
from rest_framework.response import Response

from cas12 import tasks

from cas12.models import result_cas12a_list

from celery import chain

## old
def cas12a_submit(request):
    if request.method == "POST":
        return render(request, 'cas12/cas12a_result.html')
    else:
        return render(request, 'cas12/cas12a_submit.html')

def cas12b_submit(request):
    if request.method == "POST":
        return render(request, 'cas12/cas12b_result.html')
    else:
        return render(request, 'cas12/cas12b_submit.html')

## Cas12a
@api_view(['POST'])
def cas12a_API(request):
    data = request.data
    # {inputSequence: 'AAAA', pam: 'NNGRRT', spacerLength: '', sgRNAModule: 'spacerpam', name_db: 'Gossypium_hirsutum_TM1_HAU'}
    inputSequence = data['inputSequence']
    name_db = data['name_db']
    pam = data['pam']
    spacerLength = data['spacerLength']
    sgRNAModule = data['sgRNAModule']
    hash_input = f"{pam}{name_db}{inputSequence}{sgRNAModule}{spacerLength}"
    task_id = hashlib.sha256(hash_input.encode('utf-8')).hexdigest()
    tasks.cas12a_task_process.delay(task_id, inputSequence, pam, spacerLength, sgRNAModule, name_db)
    return Response(task_id)


def cas12a_namedb_list(request):
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


def cas12a_module_API(request):
    task_id = request.GET.get('task_id')
    task = result_cas12a_list.objects.get(task_id=task_id)
    return JsonResponse({"task_id": task.task_id, "task_status": task.task_status, "sgRNAJson": task.sgRNA_json})

### Cas12b
@api_view(['POST'])
def cas12b_API(request):
    data = request.data
    # {inputSequence: 'AAAA', pam: 'NNGRRT', spacerLength: '', sgRNAModule: 'spacerpam', name_db: 'Gossypium_hirsutum_TM1_HAU'}
    inputSequence = data['inputSequence']
    name_db = data['name_db']
    pam = data['pam']
    spacerLength = data['spacerLength']
    sgRNAModule = data['sgRNAModule']
    hash_input = f"{pam}{name_db}{inputSequence}{sgRNAModule}{spacerLength}"
    task_id = hashlib.sha256(hash_input.encode('utf-8')).hexdigest()
    tasks.cas12b_task_process.delay(task_id, inputSequence, pam, spacerLength, sgRNAModule, name_db)
    return Response(task_id)


def cas12b_namedb_list(request):
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


def cas12b_module_API(request):
    task_id = request.GET.get('task_id')
    task = result_cas12b_list.objects.get(task_id=task_id)
    return JsonResponse({"task_id": task.task_id, "task_status": task.task_status, "sgRNAJson": task.sgRNA_json})

def cas12a_fill_example(request):
    form = {}
    pam_dict = {
        'TTN': ['pamspacer', 20],
        'ATTN': ['pamspacer', 20],
    }
    file_list = [x.split('.fa')[0] for x in os.listdir('data/genome_files') if x.endswith('.fa')]
    form['name_db'] = random.choice(file_list)
    seq_records = list(SeqIO.parse(f'data/genome_files/{form["name_db"]}.fa', 'fasta'))
    seq_record = random.choice(seq_records)
    random_length = random.randint(20, min(100, len(seq_record.seq)))
    start_pos = random.randint(0, len(seq_record.seq) - random_length)
    random_sequence = str(seq_record.seq[start_pos:start_pos + random_length])
    random_pos = f'{seq_record.id}:{start_pos}-{start_pos + random_length}'
    gff_pandas = pd.read_pickle(f'data/processed_annotation_files/{form["name_db"]}.processed.gff3.pkl')
    gene_ids = gff_pandas[gff_pandas['type'] == 'gene']['ID'].tolist()
    random_id = random.choice(gene_ids)
    form['inputSequence'] = random.choice([random_sequence, random_pos, random_id])
    form['pam'] = random.choice(list(pam_dict.keys()))
    form['spacerLength'] = pam_dict[form['pam']][1]
    form['sgRNAModule'] = pam_dict[form['pam']][0]
    print(form)
    return JsonResponse(form)


def cas12b_fill_example(request):
    form = {}
    pam_dict = {
        'TTTR': ['pamspacer', 23],
        'TTR': ['pamspacer', 23],
        'TTTRIDT': ['pamspacer', 21],
        'TTTN': ['pamspacer', 23],
        'NGTN': ['pamspacer', 23],
        'TRCR': ['pamspacer', 23],
        'TATR': ['pamspacer', 23],
        'TTTA': ['pamspacer', 23],
        'TCTA': ['pamspacer', 23],
        'TCCA': ['pamspacer', 23],
        'CCCA': ['pamspacer', 23],
        'GGTT': ['pamspacer', 23],
        'TTYN': ['pamspacer', 23],
    }
    file_list = [x.split('.fa')[0] for x in os.listdir('data/genome_files') if x.endswith('.fa')]
    form['name_db'] = random.choice(file_list)
    seq_records = list(SeqIO.parse(f'data/genome_files/{form["name_db"]}.fa', 'fasta'))
    seq_record = random.choice(seq_records)
    random_length = random.randint(20, min(100, len(seq_record.seq)))
    start_pos = random.randint(0, len(seq_record.seq) - random_length)
    random_sequence = str(seq_record.seq[start_pos:start_pos + random_length])
    random_pos = f'{seq_record.id}:{start_pos}-{start_pos + random_length}'
    gff_pandas = pd.read_pickle(f'data/processed_annotation_files/{form["name_db"]}.processed.gff3.pkl')
    gene_ids = gff_pandas[gff_pandas['type'] == 'gene']['ID'].tolist()
    random_id = random.choice(gene_ids)
    form['inputSequence'] = random.choice([random_sequence, random_pos, random_id])
    form['pam'] = random.choice(list(pam_dict.keys()))
    form['spacerLength'] = pam_dict[form['pam']][1]
    form['sgRNAModule'] = pam_dict[form['pam']][0]
    print(form)
    return JsonResponse(form)