from genericpath import isfile
from http.client import HTTPResponse
from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse
from pkg_resources import ContextualVersionConflict

# Create your views here.

from cas9 import cas9_function
import os
import random
import string
import hashlib


def cas12a_submit(request):
    return render(request, 'cas12/cas12a_submit.html')

def cas12a_result(request):
    """
    增加个判断
    若customizedPAM有输入则不使用PAM Type下拉选择框的内容
    输出表单增加推荐sgRNA: 根据脱靶低, 靠近5'端, 在保守区域等把推荐sgRNA用颜色高亮表示
    如何避免找到的sgRNA跨越外显子的?
    """
    records = {}
    
    if request.method == "GET":
        records['task_id'] = request.GET.get('task_id')
        return render(request, 'cas12/cas12a_result.html', records)
    
    elif request.method == "POST":
        pamType = request.POST.get('pamType')
        name_db = request.POST.get('targetGenome')
        inputSequence = request.POST.get('inputSequence')

        customizedPAM = request.POST.get('customizedPAM')
        sgRNAModule = request.POST.get('sgRNAModule')
        spacerLength = request.POST.get('spacerLength')

        task_id = hashlib.md5((pamType + name_db + inputSequence + sgRNAModule + spacerLength).encode('utf-8')).hexdigest()
        task_path = 'cas12/tmp/{}'.format(task_id)
        
        if os.path.isfile(task_path + '/task_finished'):
            print('task_finished')
            return HttpResponseRedirect('/cas12a_result?task_id={}'.format(task_id))
        
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

        # cas9_function.run_flashfry(name_db, pamType, task_path, task_id)
        # ontarget_records = cas9_function.parse_discover(name_db, task_path, task_id, fasta_sequence_position)
        # offtarget_records = cas9_function.parse_discover_offtargets(name_db, task_path, task_id)

        sgRNA_pandas = cas9_function.generate_sequence_for_batmis(fasta_sequence_position, pamType, spacerLength, sgRNAModule, name_db, task_path)
        sam_file, intersect_file = cas9_function.run_batmis(task_path, name_db, task_id)
        sam_pandas, intersect_pandas = cas9_function.parse_batmis_sam(sam_file, intersect_file, spacerLength, name_db)
        
        sam_pandas.to_pickle('{}/{}_sam_pandas.plk'.format(task_path, task_id))
        intersect_pandas.to_pickle('{}/{}_intersect_pandas.plk'.format(task_path, task_id))
        cas9_function.finish_job(task_id, task_path)

        return HttpResponseRedirect('/cas12a_result?task_id={}'.format(task_id))

##########################################################################################################################################################
def cas12b_submit(request):
    return render(request, 'cas12/cas12b_submit.html')

def cas12b_result(request):
    """
    增加个判断
    若customizedPAM有输入则不使用PAM Type下拉选择框的内容
    输出表单增加推荐sgRNA: 根据脱靶低, 靠近5'端, 在保守区域等把推荐sgRNA用颜色高亮表示
    如何避免找到的sgRNA跨越外显子的?
    """
    records = {}
    
    if request.method == "GET":
        records['task_id'] = request.GET.get('task_id')
        return render(request, 'cas12/cas12b_result.html', records)
    
    elif request.method == "POST":
        pamType = request.POST.get('pamType')
        name_db = request.POST.get('targetGenome')
        inputSequence = request.POST.get('inputSequence')

        customizedPAM = request.POST.get('customizedPAM')
        sgRNAModule = request.POST.get('sgRNAModule')
        spacerLength = request.POST.get('spacerLength')

        task_id = hashlib.md5((pamType + name_db + inputSequence + sgRNAModule + spacerLength).encode('utf-8')).hexdigest()
        task_path = 'cas12/tmp/{}'.format(task_id)
        
        if os.path.isfile(task_path + '/task_finished'):
            print('task_finished')
            return HttpResponseRedirect('/cas12b_result?task_id={}'.format(task_id))
        
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

        # cas9_function.run_flashfry(name_db, pamType, task_path, task_id)
        # ontarget_records = cas9_function.parse_discover(name_db, task_path, task_id, fasta_sequence_position)
        # offtarget_records = cas9_function.parse_discover_offtargets(name_db, task_path, task_id)

        sgRNA_pandas = cas9_function.generate_sequence_for_batmis(fasta_sequence_position, pamType, spacerLength, sgRNAModule, name_db, task_path)
        sam_file, intersect_file = cas9_function.run_batmis(task_path, name_db, task_id)
        sam_pandas, intersect_pandas = cas9_function.parse_batmis_sam(sam_file, intersect_file, spacerLength, name_db)
        
        sam_pandas.to_pickle('{}/{}_sam_pandas.plk'.format(task_path, task_id))
        intersect_pandas.to_pickle('{}/{}_intersect_pandas.plk'.format(task_path, task_id))
        cas9_function.finish_job(task_id, task_path)

        return HttpResponseRedirect('/cas12b_result?task_id={}'.format(task_id))
