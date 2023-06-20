import hashlib
import os
import random
import string
import json
from http.client import HTTPResponse

from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from pkg_resources import ContextualVersionConflict

from cas9 import cas9_function, tasks

from cas9.models import result_cas9_list

# Create your views here.


def baseEditor_submit(request):
    return render(request, 'baseEditor/submit.html')


def baseEditor_result(request):
    """
    增加个判断
    若customizedPAM有输入则不使用PAM Type下拉选择框的内容
    输出表单增加推荐sgRNA: 根据脱靶低, 靠近5'端, 在保守区域等把推荐sgRNA用颜色高亮表示
    如何避免找到的sgRNA跨越外显子的?
    """
    records = {}
    
    if request.method == "GET":
        records['task_id'] = request.GET.get('task_id')
        return render(request, 'baseEditor/result.html', records)
    
    elif request.method == "POST":
        pamType = request.POST.get('pamType')
        name_db = request.POST.get('targetGenome')
        inputSequence = request.POST.get('inputSequence')
        if pamType == 'custom':
            customizedPAM = request.POST.get('customizedPAM')
            pamType = customizedPAM
            sgRNAModule = request.POST.get('sgRNAModule')
            spacerLength = request.POST.get('spacerLength')
        else:
            sgRNAModule, spacerLength = cas9_function.initial_sgRNA(pamType)

        task_id = hashlib.md5((pamType + name_db + inputSequence + sgRNAModule + str(spacerLength)).encode('utf-8')).hexdigest()
        task_path = 'baseEditor/tmp/{}'.format(task_id)

        if result_cas9_list.objects.filter(task_id__exact=task_id, task_finished=1).exists():
            return HttpResponseRedirect('/baseEditor_result?task_id={}'.format(task_id))
        
        input_type = cas9_function.input_sequence_classify(inputSequence)
        if input_type['locus']:
            fasta_sequence, fasta_sequence_position = cas9_function.subseq_locus(name_db, inputSequence)
            os.system("mkdir -p {}".format(task_path))
            fasta_file = open('{}/{}.fasta'.format(task_path, task_id), 'w')
            fasta_file.write(">{}".format(task_id) + "\n")
            fasta_file.write(fasta_sequence)
            fasta_file.close()
        elif input_type['position']:
            fasta_sequence, fasta_sequence_position = cas9_function.subseq_position(name_db, inputSequence)
            os.system("mkdir -p {}".format(task_path))
            fasta_file = open('{}/{}.fasta'.format(task_path, task_id), 'w')
            fasta_file.write(">{}".format(task_id) + "\n")
            fasta_file.write(fasta_sequence)
            fasta_file.close()
        elif input_type['seq']:
            os.system("mkdir -p {}".format(task_path))
            fasta_sequence, fasta_sequence_position = cas9_function.subseq_seq(name_db, task_path, task_id, inputSequence)

        tasks.form2resultjson.apply_async(args=[fasta_sequence_position, pamType, spacerLength, sgRNAModule, name_db, task_path, task_id])

        return HttpResponseRedirect('/baseEditor_result?task_id={}'.format(task_id))
