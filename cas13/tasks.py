import shlex
import subprocess
import re
import json
import os
import time

from celery import shared_task

from cas13.models import result_cas13_list

import pandas as pd
import pysam
from Bio import SeqIO
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord
import pybedtools
from pybedtools import BedTool
from pandarallel import pandarallel
pandarallel.initialize(nb_workers=20, progress_bar=False)

pd.set_option('display.max_columns', None)


IUPAC_dict = {
    'A': 'A',
    'T': 'T',
    'C': 'C',
    'G': 'G',
    'R': '[A|G]',
    'Y': '[C|T]',
    'S': '[G|C]',
    'W': '[A|T]',
    'K': '[G|T]',
    'M': '[A|C]',
    'B': '[C|G|T]',
    'D': '[A|G|T]',
    'H': '[A|C|T]',
    'V': '[A|C|G]',
    'N': '[A|T|C|G]'
}


def form2Database(task_id, inputSequence, spacerLength, name_db):
    start_time = time.time()

    cas13_task_record = result_cas13_list(task_id=task_id, input_sequence=inputSequence, spacer_length=spacerLength, name_db=name_db, task_status='running')
    cas13_task_record.save()
    print(f"Create record: {time.time() - start_time:.2f} seconds")

    step_time = time.time()
    input_type = input_sequence_to_input_type(inputSequence)
    fasta_sequence, transcript_id = input_type_to_transcript_id(input_type, name_db, task_id)
    if fasta_sequence:
        cas13_task_record.transcript_id = transcript_id
        cas13_task_record.save()
    else:
        cas13_task_record.task_status = 'failed'
        cas13_task_record.log = 'empty BLAST result'
        cas13_task_record.save()
        return 0
    print(f"Parse input sequence: {time.time() - step_time:.2f} seconds")

    step_time = time.time()
    target_seq = transcript_id_to_target_seq(name_db, transcript_id, spacerLength)
    print(f"Generate target sequence: {time.time() - step_time:.2f} seconds")

    step_time = time.time()
    sgRNA_records = target_seq_to_guide_fasta(target_seq, spacerLength, task_id)
    print(f"Generate target sequence: {time.time() - step_time:.2f} seconds")

    step_time = time.time()
    sam_file = run_batman(f'/tmp/CRISPRone/{task_id}', name_db, task_id)
    sam_pandas, intersect_pandas = intersect_to_pandas(sam_file, intersect_file, spacerLength, name_db)
    print(f"Run BATMAN and intersection analysis: {time.time() - step_time:.2f} seconds")

    step_time = time.time()
    guide_json = sam_intersect_pandas_to_json(sam_pandas, intersect_pandas, f'/tmp/CRISPRone/{task_id}')
    print(f"Convert intersection data to JSON: {time.time() - step_time:.2f} seconds")

    step_time = time.time()
    cas13_task_record.sgRNA_json = guide_json
    cas13_task_record.task_status = 'finished'
    cas13_task_record.save()
    print(f"Total time: {time.time() - start_time:.2f} seconds")

    step_time = time.time()
    add_Jbrowse_to_json(task_id, guide_json)
    print(f"JSON3 is generated: {time.time() - step_time:.2f} seconds")

    return 0


def add_Jbrowse_to_json(task_id, guide_json):
    cas13_task_record = result_cas13_list.objects.get(task_id=task_id)
    sequence_position = json.loads(cas13_task_record.sequence_position)
    json_handle = {"TableData": {"json_data": guide_json},
                   "JbrowseInfo": {
                       "assembly": {
                           "name": cas13_task_record.name_db,
                           "fasta": f"http://crisprall.hzau.edu.cn/CRISPRone_data/genome_files/{cas13_task_record.name_db}.fa",
                           "fai": f"http://crisprall.hzau.edu.cn/CRISPRone_data/genome_files/{cas13_task_record.name_db}.fa.fai"
                        },
                       "tracks": {
                           "name": cas13_task_record.name_db,
                           "gff3_gz": f"http://crisprall.hzau.edu.cn/cas13_Jbrowse_API?task_id={task_id}&file_type=gff3.gz",
                           "gff3_tbi": f"http://crisprall.hzau.edu.cn/cas13_Jbrowse_API?task_id={task_id}&file_type=gff3.gz.csi"
                       },
                       "position": f"{sequence_position['seqid']}:{sequence_position['start']}..{sequence_position['end']}"
                       }}
    cas13_task_record.sgRNA_with_JBrowse_json = json_handle
    cas13_task_record.save()
    cas13_task_record.refresh_from_db()
    print(f'json_handle:{json_handle}')
    print(f'cas13_task_record.sgRNA_with_JBrowse_json:{cas13_task_record.sgRNA_with_JBrowse_json}')
    with open(f'/tmp/CRISPRone/{task_id}/Guide.json3', 'w') as file_handle:
        json.dump(json_handle, file_handle)


def sam_intersect_pandas_to_json(sam_pandas, intersect_pandas, task_path):
    print(f"sam_pandas_name\n{sam_pandas.columns}")
    print(f"sam_pandas_10\n{sam_pandas.head(10)}")
    print(f"intersect_pandas_name\n{intersect_pandas.columns}")
    print(f"sam_pandas_shape\n{sam_pandas.shape}")
    print(f"intersect_pandas_10\n{intersect_pandas.head(10)}")
    print(f"intersect_pandas_shape\n{intersect_pandas.shape}")
    intersect_pandas.to_csv(f'{task_path}/intersect_pandas.csv')
    intersect_pandas.to_pickle(f'{task_path}/intersect_pandas.plk')
    sam_pandas.to_csv(f'{task_path}/sam_pandas.csv')
    sam_pandas.to_pickle(f'{task_path}/sam_pandas.plk')
    # def merge_extract(row):
    #     if len(sam_pandas.loc[(row['seqid'], row['sgRNA_start'])]) != 10:
    #         print(f"seqid={row['seqid']}, sgRNA_start={row['sgRNA_start']}")
    #         print(f"sam_pandas.loc[(row['seqid'], row['sgRNA_start'])]\n{sam_pandas.loc[(row['seqid'], row['sgRNA_start'])]}")
    #     return sam_pandas.loc[(row['seqid'], row['sgRNA_start'])].iloc[0]
    sam_pandas_reset = sam_pandas.reset_index(drop=True)
    merged_pandas = intersect_pandas.merge(sam_pandas_reset, left_on=['seqid', 'sgRNA_start'], right_on=['rname', 'pos_0_base'], how='left')
    merged_pandas['family'] = merged_pandas['attributes'].str.extract(r'Family=([^;]+)', expand=False)
    # if len(sam_pandas) < 1000:
    #     intersect_pandas[
    #         ['qname', 'flag', 'rname', 'pos', 'seq', 'NM', 'MD', 'pos_end', 'rseq', 'pos_0_base']
    #         ] = intersect_pandas.apply(lambda row: merge_extract(row), axis=1, result_type='expand')
    #     intersect_pandas['family'] = intersect_pandas['attributes'].str.extract(r'Family=([^;]+)', expand=False)
    # else:
    #     intersect_pandas[
    #         ['qname', 'flag', 'rname', 'pos', 'seq', 'NM', 'MD', 'pos_end', 'rseq', 'pos_0_base']
    #         ] = intersect_pandas.apply(lambda row: merge_extract(row), axis=1, result_type='expand')
    #     intersect_pandas['family'] = intersect_pandas['attributes'].str.extract(r'Family=([^;]+)', expand=False)
    merged_pandas.set_index(['seq', 'family'], inplace=True, drop=True)
    intersect_pandas = merged_pandas
    with open(f'{task_path}/Guide.json') as guide_json_handle:
        guide_json = json.load(guide_json_handle)
        for target_seq in intersect_pandas.index.get_level_values(0).unique():
            intersect_target_tmp_pandas = intersect_pandas.loc[target_seq]
            intersect_target_tmp_pandas.to_csv(f'{task_path}/intersect_target_tmp_pandas.csv')
            intersect_target_pandas = intersect_target_tmp_pandas[intersect_target_tmp_pandas['type']=='gene'].drop_duplicates()
            intersect_target_pandas.to_csv(f'{task_path}/intersect_target_pandas_1.csv')
            intersect_target_pandas['types_list'] = intersect_target_tmp_pandas.groupby('family').apply(lambda x: sorted(x.type.unique().tolist()))
            intersect_target_pandas.to_csv(f'{task_path}/intersect_target_pandas_2.csv')
            intersect_target_pandas['types'] = intersect_target_pandas.apply(lambda row: 'intron' if len(row.types_list) == 2 else ', '.join(row.types_list).replace(', gene, mRNA', ''), axis=1)
            intersect_target_pandas.to_csv(f'{task_path}/intersect_target_pandas_3.csv')
            intersect_target_pandas.reset_index(level='family', inplace=True)
            intersect_target_json = intersect_target_pandas.to_json(orient='records')
            json_handle = json.loads(intersect_target_json)
            json_handle = {'total': len(json_handle), 'rows': json_handle}
            for index, item in enumerate(guide_json['rows']):
                if target_seq == item['sgRNA_seq']:
                    guide_json['rows'][index]['offtarget_num'] = json_handle['total']
                    guide_json['rows'][index]['offtarget_json'] = json_handle
                    break
            else:
                guide_json['rows'][index]['offtarget_num'] = 0
                guide_json['rows'][index]['offtarget_json'] = None
    with open(f'{task_path}/Guide.json2', 'w') as guide_json_handle:
        json.dump(guide_json, guide_json_handle, indent=4)
    return guide_json


def intersect_to_pandas(sam_file, intersect_file, spacerLength, name_db, pam):
    def fetch_rseq(row):
        print(f"Fetching sequence for row: rname={row['rname']}, pos={row['pos']-1}, pos_end={row['pos_end']-1}")
        return genome_handle.fetch(row['rname'], row['pos']-1, row['pos_end']-1 + pam_length)
    pam_length = sum(1 for nuc in pam if nuc in IUPAC_dict)
    spacerLength = int(spacerLength)
    sam_pandas = pd.read_csv(
        sam_file,
        header=None,
        sep='\t',
        comment='@',
        names=['qname','flag','rname','pos','mapq','cigar','rnext','pnext','tlen','seq','qual','NM','MD']
    )
    genome_handle = pysam.FastaFile(f'data/genome_files/{name_db}.fa')
    sam_pandas['NM'] = sam_pandas['NM'].str.replace('NM:i:', '')
    sam_pandas['MD'] = sam_pandas['MD'].str.replace('MD:Z:', '')
    sam_pandas['pos_end'] = sam_pandas['pos'] + spacerLength
    # sam_pandas['rseq'] = sam_pandas.apply(lambda row: genome_handle.fetch(row['rname'], row['pos']-1, row['pos_end']-1 + pam_length), axis=1, result_type='expand')
    sam_pandas['rseq'] = sam_pandas.apply(fetch_rseq, axis=1, result_type='expand')
    sam_pandas['pos_0_base'] = sam_pandas['pos'] - 1
    sam_pandas.set_index(['rname', 'pos_0_base'], inplace=True, drop=False)
    sam_pandas.sort_index(inplace=True)
    intersect_pandas = pd.read_csv(
        intersect_file,
        header=None,
        sep='\t'
    )
    intersect_pandas.drop([3,4,5,6,7,8,9,10,11,12,21,13,17,19], axis=1, inplace=True)
    intersect_pandas.columns = ['seqid', 'sgRNA_start', 'sgRNA_end', 'type', 'start', 'end', 'strand', 'attributes']
    sam_pandas.drop(['mapq', 'cigar', 'rnext', 'pnext', 'tlen', 'qual'], axis=1, inplace=True)
    return sam_pandas, intersect_pandas


def run_batman(task_path, name_db, task_id):
    os.system(f'/disk2/users/yxguo/opt/bin/batman -q {task_path}/Guide.fasta -g data/rna_files/{name_db}_mRNA.fa -n 5 -mall -l /dev/null -o {task_path}/{task_id}.bin 1> /dev/null')
    os.system(f'/disk2/users/yxguo/opt/bin/batdecode -i {task_path}/{task_id}.bin -g data/rna_files/{name_db}_mRNA.fa -o {task_path}/{task_id}.txt')
    os.system(f'/disk2/users/yxguo/opt/bin/samtools view -bS {task_path}/{task_id}.txt > {task_path}/{task_id}.bam')
    return f'{task_path}/{task_id}.txt'


def target_seq_to_guide_fasta(target_seq, spacerLength, task_id):
    guide_count = 1
    sgRNA_seqrecords=[]
    for i in range(len(target_seq) - spacerLength + 1):
        spacer = target_seq[i:i + spacerLength]
        guide_id = f"Guide_{guide_count}"
        sgRNA_seqrecord = SeqRecord(Seq(spacer), guide_id, '', '')
        sgRNA_seqrecords.append(sgRNA_seqrecord)
        guide_count += 1
    SeqIO.write(sgRNA_seqrecords, f'/tmp/CRISPRone/{task_id}/Guide.fasta', 'fasta')
    return sgRNA_seqrecords


def transcript_id_to_target_seq(name_db, transcript_id, spacer_length):
    with pysam.FastaFile(f"./data/rna_files/{name_db}_mRNA.fa") as mRNA_handle:
        target_seq = mRNA_handle.fetch(transcript_id)
    return target_seq


def create_regex_patterns(pam, spacerLength, sgRNAModule='spacerpam'):
    pam_regex = ''.join(IUPAC_dict[nuc] for nuc in pam if nuc in IUPAC_dict)
    if sgRNAModule == 'spacerpam':
        return rf'\w{{{spacerLength}}}{pam_regex}'
    elif sgRNAModule == 'pamspacer':
        return rf'{pam_regex}\w{{{spacerLength}}}'


def input_sequence_to_input_type(inputSequence):
    import re
    input_type = {"locus": None, "position": None, "seq": None}
    normalized_seq = inputSequence.replace('\r\n', '\n').replace('\r', '\n')
    if re.search(r'^[\w.-]+:\d+-\d+$', inputSequence):
        input_type['position'] = inputSequence
    if re.fullmatch(r'(>[^\n]*\n)?[ACGTU\n]+', normalized_seq, re.IGNORECASE):
        input_type['seq'] = inputSequence
    else:
        input_type['locus'] = inputSequence
    return input_type


def input_type_to_transcript_id(input_type, name_db, task_id):
    import os
    import pandas as pd
    from Bio import SeqIO
    import pysam
    task_path = f'/tmp/CRISPRone/{task_id}'
    os.makedirs(task_path, exist_ok=True)
    if input_type['seq']:
        seq = input_type['seq']
        if not seq.startswith(">"):
            seq = f'>{task_id}\n{seq}'
        seq_path = os.path.join(task_path, f'{task_id}.fasta')
        with open(seq_path, 'w') as seq_file:
            seq_file.write(seq)
        blastn_command = [
        "/usr/local/bin/blastn",
        "-query", seq_path,
        "-db", f"data/rna_files/{name_db}_mRNA.fa",
        "-perc_identity", "100", "-max_target_seqs", "1", "-qcov_hsp_perc", "100",
        "-out", f"{task_path}/{task_id}.blastn.out6",
        "-outfmt", "6 qseqid sseqid pident length mismatch gapopen qstart qend sstart send evalue bitscore qlen qcovhsp",
        "-num_threads", "12"
        ]
        try:
            result = subprocess.run(blastn_command, check=True, text=True, capture_output=True)
            print(result.stdout)
        except subprocess.CalledProcessError as e:
            print(f"BLASTn failed: {e.stderr}")
        with open(f"{task_path}/{task_id}.blastn.out6") as blastn_out_file:
            first_line = blastn_out_file.readline().strip()
            if first_line: 
                first_record = first_line.split('\t')
                seqid = first_record[1]
                sequence = str(next(SeqIO.parse(f'{task_path}/{task_id}.fasta', 'fasta')).seq)
                # return sequence, seqid
                return seq.split('\n')[1], seqid
            else:
                return 0, 1
    if input_type['locus']:
        mRNA_handle = pysam.FastaFile(f"./data/rna_files/{name_db}_mRNA.fa")
        seqid = input_type['locus']
        return mRNA_handle.fetch(seqid), seqid
    return 0, 1


@shared_task
def cas13_task_process(task_id, inputSequence, spacerLength, name_db):
    if result_cas13_list.objects.filter(task_id=task_id).exists():
        form2Database(task_id, inputSequence, spacerLength, name_db)
        return 0
    else:
        form2Database(task_id, inputSequence, spacerLength, name_db)
        return 0