import hashlib
import os
import random
import string
import json
import subprocess
from http.client import HTTPResponse
from Bio import SeqIO
import pandas as pd
from django.conf import settings

from django.http import HttpResponseRedirect, HttpResponseNotFound, HttpResponseBadRequest, JsonResponse, FileResponse
from django.shortcuts import render, redirect
from pkg_resources import ContextualVersionConflict

from rest_framework.decorators import api_view
from rest_framework.response import Response

from cas13 import tasks

from cas13.models import result_cas13_list

from celery import chain

# Create your views here.

@api_view(['POST'])
def cas13_API(request):
    data = request.data
    # {inputSequence: 'AAAA', spacerLength: '20', name_db: 'Gossypium_hirsutum_TM1_HAU'}
    inputSequence = data['inputSequence']
    name_db = data['name_db']
    spacerLength = data['spacerLength']
    hash_input = f"{name_db}{inputSequence}{spacerLength}"
    task_id = hashlib.sha256(hash_input.encode('utf-8')).hexdigest()
    tasks.cas13_task_process.delay(task_id, inputSequence, spacerLength, name_db)
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


def cas13_submit(request):
    return Resonse(request)
