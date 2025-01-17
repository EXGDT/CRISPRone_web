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

        task_id = hashlib.md5(
            (pamType + name_db + inputSequence + sgRNAModule +
             str(spacerLength)).encode('utf-8')).hexdigest()
        task_path = 'cas9/tmp/{}'.format(task_id)

        if result_cas9_list.objects.filter(task_id__exact=task_id,
                                           task_finished=1).exists():
            # return HttpResponseRedirect('/cas9_result?task_id={}'.format(task_id))
            return HttpResponseRedirect(
                '/cas9_result?task_id={}'.format(task_id))

        input_type = cas9_function.input_sequence_classify(inputSequence)
        if input_type['locus']:
            fasta_sequence, fasta_sequence_position = tasks.subseq_locus(
                name_db, inputSequence)
            os.system("mkdir -p {}".format(task_path))
            fasta_file = open('{}/{}.fasta'.format(task_path, task_id), 'w')
            fasta_file.write(">{}".format(task_id) + "\n")
            fasta_file.write(fasta_sequence)
            fasta_file.close()
            tasks.form2resultjson.apply_async(args=[
                fasta_sequence_position, pamType, spacerLength, sgRNAModule,
                name_db, task_path, task_id
            ])
            return HttpResponseRedirect(
                '/cas9_result?task_id={}'.format(task_id))
        elif input_type['position']:
            fasta_sequence, fasta_sequence_position = tasks.subseq_position(
                name_db, inputSequence)
            os.system("mkdir -p {}".format(task_path))
            fasta_file = open('{}/{}.fasta'.format(task_path, task_id), 'w')
            fasta_file.write(">{}".format(task_id) + "\n")
            fasta_file.write(fasta_sequence)
            fasta_file.close()
            tasks.form2resultjson.apply_async(args=[
                fasta_sequence_position, pamType, spacerLength, sgRNAModule,
                name_db, task_path, task_id
            ])
            return HttpResponseRedirect(
                '/cas9_result?task_id={}'.format(task_id))
        elif input_type['seq']:
            os.system("mkdir -p {}".format(task_path))
            # fasta_sequence, fasta_sequence_position = tasks.subseq_seq(name_db, task_path, task_id, inputSequence)
            chain(
                tasks.subseq_seq.s(name_db, task_path, task_id, inputSequence),
                tasks.adjust_parameters.s(),
                tasks.form2resultjson.s(pamType, spacerLength, sgRNAModule,
                                        name_db, task_path,
                                        task_id)).apply_async()
            return HttpResponseRedirect(
                '/cas9_result?task_id={}'.format(task_id))

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
    if result_cas9_list.objects.filter(task_id__exact=taskId,
                                       task_finished=1).exists():
        record = result_cas9_list.objects.get(task_id=taskId)
        targetJsonDict = record.sgRNAJson
        pagiDict = {
            'total': targetJsonDict['total'],
            'rows': targetJsonDict['rows'][offset:offset + limit]
        }
        #pagiJson = json.dumps(pagiDict)
        return JsonResponse(pagiDict)
    else:
        return HttpResponseNotFound('')  # status=404


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
    offtargetPagiDict = {
        'total': offtargetDict['total'],
        'rows': offtargetDict['rows'][offset:offset + limit]
    }
    return JsonResponse(offtargetPagiDict)


# 2024-5-31
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
    tasks.cas9_task_process.delay(task_id, inputSequence, pam, spacerLength,
                                  sgRNAModule, name_db)
    return Response(task_id)


def cas9_namedb_list(request):
    file_path = 'data/genome_files'
    file_list = os.listdir(file_path)
    genomes = []
    for filename in file_list:
        base, ext = os.path.splitext(filename)
        if ext == '.fa':
            value = base
            label = value.replace('_', ' ')
            genomes.append({'label': label, 'value': value})
    print(genomes)
    return JsonResponse(genomes, safe=False)


def cas9_module_API(request):
    task_id = request.GET.get('task_id')
    task = result_cas9_list.objects.get(task_id=task_id)
    return JsonResponse({
        "task_id": task.task_id,
        "task_status": task.task_status,
        "sgRNAJson": task.sgRNA_json
    })


def cas9_fill_example(request):
    form = {}
    pam_dict = {
        'NGG': ['spacerpam', 20],
        'NG': ['spacerpam', 20],
        'NNG': ['spacerpam', 20],
        'NGN': ['spacerpam', 20],
        'NNGT': ['spacerpam', 20],
        'NAA': ['spacerpam', 20],
        'NNGRRT': ['spacerpam', 21],
        'NNGRRT-20': ['spacerpam', 20],
        'NGK': ['spacerpam', 20],
        'NNNRRT': ['spacerpam', 21],
        'NNNRRT-20': ['spacerpam', 20],
        'NGA': ['spacerpam', 20],
        'NNNNCC': ['spacerpam', 24],
        'NGCG': ['spacerpam', 20],
        'NNAGAA': ['spacerpam', 20],
        'NGGNG': ['spacerpam', 20],
        'NNNNGMTT': ['spacerpam', 20],
        'NNNNACA': ['spacerpam', 20],
        'NNNNRYAC': ['spacerpam', 22],
        'NNNVRYAC': ['spacerpam', 22],
        'TTCN': ['pamspacer', 20],
        'YTTV': ['pamspacer', 20],
        'NNNNCNAA': ['spacerpam', 20],
        'NNN': ['spacerpam', 20],
        'NRN': ['spacerpam', 20],
        'NYN': ['spacerpam', 20]
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
    

def cas9_Jbrowse_API(request):
    task_id = request.GET.get('task_id')
    file_type = request.GET.get('file_type')
    os.makedirs(f'/tmp/CRISPRone/{task_id}', exist_ok=True)
    cas9_task_record = result_cas9_list.objects.get(task_id=task_id)
    file_paths = {
        "fa": os.path.join(settings.BASE_DIR, f"data/genome_files/{cas9_task_record.name_db}.fa"),
        "fai": os.path.join(settings.BASE_DIR, f"data/genome_files/{cas9_task_record.name_db}.fa.fai"),
        "gff3.gz": f"/tmp/CRISPRone/{task_id}/{cas9_task_record.name_db}_{cas9_task_record.input_sequence}_sgRNA.gff3.gz",
        "gff3.gz.csi": f"/tmp/CRISPRone/{task_id}/{cas9_task_record.name_db}_{cas9_task_record.input_sequence}_sgRNA.gff3.gz.csi",
    }
    if all([os.path.exists(file_paths[file]) for file in file_paths]):
        return (
            FileResponse(open(file_paths['fa'], 'rb')) if file_type == 'fa' else
            FileResponse(open(file_paths['fai'], 'rb')) if file_type == 'fai' else
            FileResponse(open(file_paths['gff3.gz'], 'rb')) if file_type == 'gff3.gz' else
            FileResponse(open(file_paths['gff3.gz.csi'], 'rb')) if file_type == 'gff3.gz.csi' else
            HttpResponseNotFound()
        )
    else: 
        gff_file_path = f'/tmp/CRISPRone/{task_id}/{cas9_task_record.name_db}_{cas9_task_record.input_sequence}_sgRNA.gff3'
        with open(gff_file_path, 'w') as gff_file:
            gff_file.write("##gff-version 3\n")
        with open(gff_file_path, 'a') as gff_file:
            for row in cas9_task_record.sgRNA_json['rows']:
                sgRNA_id = row['sgRNA_id']
                seqid = row['sgRNA_position'].split(':')[0]
                start = int(row['sgRNA_position'].split(':')[1])
                end = start + len(row['sgRNA_seq']) - 1
                strand = '+' if row['sgRNA_strand'] == "5'------3'" else '-'
                score = '.'
                phase = '.'
                attributes = f"ID={sgRNA_id};Name={sgRNA_id};Sequence={row['sgRNA_seq']}"
                gff_line = "\t".join([
                    seqid,           # 序列ID
                    "sgRNA",         # 来源（Source）
                    "guide",         # 类型（Feature type）
                    str(start),      # 开始位置
                    str(end),        # 结束位置
                    score,           # 分数（Score）
                    strand,          # 链方向（Strand）
                    phase,           # 相位（Phase）
                    attributes       # 属性（Attributes）
                ])
                gff_file.write(gff_line + "\n")
        os.environ["LD_LIBRARY_PATH"] = "/disk2/users/yxguo/opt/lib64"
        subprocess.run(["sort", "-k1,1", "-k2,2n", gff_file_path, "-o", gff_file_path], check=True)
        subprocess.run(["/disk2/users/yxguo/opt/bin/bgzip", "-f", gff_file_path], check=True)
        subprocess.run(["/disk2/users/yxguo/opt/bin/tabix", "-p", "gff", "-C", f"{gff_file_path}.gz"], check=True)
        return (
            FileResponse(open(file_paths['fa'], 'rb')) if file_type == 'fa' else
            FileResponse(open(file_paths['fai'], 'rb')) if file_type == 'fai' else
            FileResponse(open(file_paths['gff3.gz'], 'rb')) if file_type == 'gff3.gz' else
            FileResponse(open(file_paths['gff3.gz.csi'], 'rb')) if file_type == 'gff3.gz.csi' else
            HttpResponseNotFound()
        )
