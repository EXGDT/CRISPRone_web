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

from cas9 import cas9_function, tasks

from cas9.models import result_cas9_list

from celery import chain

# Create your views here.


def cas9_submit(request):
    """
    增加个判断
    若customizedPAM有输入则不使用PAM Type下拉选择框的内容
    输出表单增加推荐sgRNA: 根据脱靶低, 靠近5'端, 在保守区域等把推荐sgRNA用颜色高亮表示
    如何避免找到的sgRNA跨越外显子的?
    """
    
    if request.method == "POST":
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
        task_path = 'cas9/tmp/{}'.format(task_id)
        
        if result_cas9_list.objects.filter(task_id__exact=task_id, task_finished=1).exists():
            # return HttpResponseRedirect('/cas9_result?task_id={}'.format(task_id))
            return HttpResponseRedirect('/cas9_result?task_id={}'.format(task_id))
        
        input_type = cas9_function.input_sequence_classify(inputSequence)
        if input_type['locus']:
            fasta_sequence, fasta_sequence_position = tasks.subseq_locus(name_db, inputSequence)
            os.system("mkdir -p {}".format(task_path))
            fasta_file = open('{}/{}.fasta'.format(task_path, task_id), 'w')
            fasta_file.write(">{}".format(task_id) + "\n")
            fasta_file.write(fasta_sequence)
            fasta_file.close()
            tasks.form2resultjson.apply_async(args=[fasta_sequence_position, pamType, spacerLength, sgRNAModule, name_db, task_path, task_id])
            return HttpResponseRedirect('/cas9_result?task_id={}'.format(task_id))
        elif input_type['position']:
            fasta_sequence, fasta_sequence_position = tasks.subseq_position(name_db, inputSequence)
            os.system("mkdir -p {}".format(task_path))
            fasta_file = open('{}/{}.fasta'.format(task_path, task_id), 'w')
            fasta_file.write(">{}".format(task_id) + "\n")
            fasta_file.write(fasta_sequence)
            fasta_file.close()
            tasks.form2resultjson.apply_async(args=[fasta_sequence_position, pamType, spacerLength, sgRNAModule, name_db, task_path, task_id])
            return HttpResponseRedirect('/cas9_result?task_id={}'.format(task_id))
        elif input_type['seq']:
            os.system("mkdir -p {}".format(task_path))
            # fasta_sequence, fasta_sequence_position = tasks.subseq_seq(name_db, task_path, task_id, inputSequence)
            chain(
                tasks.subseq_seq.s(name_db, task_path, task_id, inputSequence), 
                tasks.adjust_parameters.s(),
                tasks.form2resultjson.s(pamType, spacerLength, sgRNAModule, name_db, task_path, task_id)
                ).apply_async()
            return HttpResponseRedirect('/cas9_result?task_id={}'.format(task_id))

        # cas9_function.run_flashfry(name_db, pamType, task_path, task_id)
        # ontarget_records = cas9_function.parse_discover(name_db, task_path, task_id, fasta_sequence_position)
        # offtarget_records = cas9_function.parse_discover_offtargets(name_db, task_path, task_id)

        # sgRNA_pandas = cas9_function.generate_sequence_for_batmis(fasta_sequence_position, pamType, spacerLength, sgRNAModule, name_db, task_path)
        # sam_file, intersect_file = cas9_function.run_batmis(task_path, name_db, task_id)
        # sam_pandas, intersect_pandas = cas9_function.parse_batmis_sam(sam_file, intersect_file, spacerLength, name_db)
        
        # sam_pandas.to_pickle('{}/{}_sam_pandas.plk'.format(task_path, task_id))
        # intersect_pandas.to_pickle('{}/{}_intersect_pandas.plk'.format(task_path, task_id))
        # cas9_function.finish_job(task_id, task_path)
        
        # tasks.form2resultjson.delay(fasta_sequence_position, pamType, spacerLength, sgRNAModule, name_db, task_path, task_id)
        # guide_json, task_finished = tasks.form2resultjson(fasta_sequence_position, pamType, spacerLength, sgRNAModule, name_db, task_path, task_id)
        # tasks.form2resultjson.apply_async(args=[fasta_sequence_position, pamType, spacerLength, sgRNAModule, name_db, task_path, task_id])
        # tasks.form2resultjson(fasta_sequence_position, pamType, spacerLength, sgRNAModule, name_db, task_path, task_id)

        # return HttpResponseRedirect('/cas9_result?task_id={}'.format(task_id))
    return render(request, 'cas9/submit.html')


def cas9_result(request):
    """
    增加个判断
    若customizedPAM有输入则不使用PAM Type下拉选择框的内容
    输出表单增加推荐sgRNA: 根据脱靶低, 靠近5'端, 在保守区域等把推荐sgRNA用颜色高亮表示
    如何避免找到的sgRNA跨越外显子的?
    """
    records = {}
    
    # if request.method == "GET":
    #     records['task_id'] = request.GET.get('task_id')
    #     return render(request, 'cas9/result.html', records) 
    records['task_id'] = request.GET.get('task_id')
    return render(request, 'cas9/result.html', records) 


def cas9_pagi_ontarget(request):
    offset = int(request.GET.get('offset'))
    limit = int(request.GET.get('limit'))
    taskId = request.GET.get('task_id')
    if result_cas9_list.objects.filter(task_id__exact=taskId, task_finished=1).exists():
        record = result_cas9_list.objects.get(task_id=taskId)
        targetJsonDict = record.sgRNAJson
        pagiDict = {'total':targetJsonDict['total'],'rows':targetJsonDict['rows'][offset:offset+limit]}
        #pagiJson = json.dumps(pagiDict)
        return JsonResponse(pagiDict)
    else:
        return HttpResponseNotFound('') # status=404


def cas9_pagi_offtarget(request):
    offset = int(request.GET.get('offset'))
    limit = int(request.GET.get('limit'))
    taskId = request.GET.get('task_id')
    sgRNA_seq = request.GET.get('sgRNA_seq')
    record = result_cas9_list.objects.get(task_id=taskId)
    ontargetJsonDict = record.sgRNAJson
    ontargetRowList = ontargetJsonDict['rows']
    for i in ontargetRowList:
        if i['sgRNA_seq'] == sgRNA_seq:
            offtargetDict = i['offtarget_json']
    offtargetPagiDict = {'total':offtargetDict['total'],'rows':offtargetDict['rows'][offset:offset+limit]}
    return JsonResponse(offtargetPagiDict)


@api_view(['POST'])
def cas9_API(request):
    data = request.data
    # {inputSequence: 'AAAA', pam: 'NNGRRT', spacerLength: '', sgRNAModule: 'spacerpam', name_db: 'Gossypium_hirsutum_TM1_HAU'}
    inputSequence = data['inputSequence']
    name_db = data['name_db']
    pam = data['pam']
    spacerLength = data['spacerLength']
    sgRNAModule = data['sgRNAModule']
    hash_input = f"{pam}{name_db}{inputSequence}{sgRNAModule}{spacerLength}"
    task_id = hashlib.sha256(hash_input.encode('utf-8')).hexdigest()
    tasks.cas9_task_process.delay(task_id, inputSequence, pam, spacerLength, sgRNAModule, name_db)
    return Response(task_id)
