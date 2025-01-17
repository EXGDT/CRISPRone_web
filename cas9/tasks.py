import shlex
import subprocess
import re
import json
import os
import time

from celery import shared_task

from cas9.models import result_cas9_list

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


def initial_sgRNA(pamType):
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
    sgRNAModule, spacerLength = pam_dict[pamType]
    return sgRNAModule, spacerLength


def input_sequence_classify(inputSequence):
    """
    分类输入
    locus的序列id格式一般比较复杂, 只匹配数字字母和下划线是不够的, 建议是所有字符
    """
    import re
    input_type = {"locus": None, "position": None, "seq": None}
    
    if re.search(r'^.+:\d+-\d+$', inputSequence):
        input_type['position'] = inputSequence
    elif sorted(set(list(inputSequence.replace('\n', '')))) == ['A', 'C', 'G', 'T']:
        input_type['seq'] = inputSequence
    elif inputSequence.startswith(">") and sorted(set(list(inputSequence.split('\n')[1]))) == ['A', 'C', 'G', 'T']:
        input_type['seq'] = inputSequence
    elif inputSequence.startswith(">") and sorted(set(list(inputSequence.split('\r')[1]))) == ['A', 'C', 'G', 'T']:
        input_type['seq'] = inputSequence
    elif inputSequence.startswith(">") and sorted(set(list(inputSequence.split('\r\n')[1]))) == ['A', 'C', 'G', 'T']:
        input_type['seq'] = inputSequence
    else:
        input_type['locus'] = inputSequence
    
    return input_type


@shared_task
def subseq_position(name_db, position):
    import pysam
    position = position.strip().replace(",", "")
    seqid = position.split(':')[0]
    start = int(position.split(':')[1].split('-')[0])
    end = int(position.split(':')[1].split('-')[1])
    genome_handle = pysam.FastaFile("./data/{}.fasta".format(name_db))
    return genome_handle.fetch(seqid, start, end), {"seqid": seqid, "start": start, "end": end}


@shared_task
def subseq_locus(name_db, locus):
    import pandas as pd
    import pysam

    # cursor = mysql_connect()
    # cursor.execute("select seqid,start,end from {}_gene_model where ID='{}'".format(name_db, locus))
    # seqid, start, end = cursor.fetchone()
    genome_handle = pysam.FastaFile("./data/{}.fasta".format(name_db))
    gff_pandas = pd.read_pickle('./data/{}_gene_model_sorted_withintergenic_family.plk'.format(name_db))
    locus = gff_pandas.loc[:, locus, 'gene'][['seqid', 'start', 'end']].iloc[0].tolist()
    seqid, start, end = locus[0], locus[1], locus[2]
    return genome_handle.fetch(seqid, start, end), {"seqid": seqid, "start": start, "end": end}


@shared_task
def subseq_seq(name_db, task_path, task_id, seq):
    """
    这个函数最后的代码部分感觉有点问题, blastn.out6输出有时候可能会比较多, 取8和9的最小和最大值有时候不合适, 如下:
    Ghir_A01G000010	Ghir_A02	100.000	214	0	0	90	303	25575	25362	3.24e-108	396
    Ghir_A01G000010	Ghir_A02	100.000	91	0	0	1	91	25747	25657	7.69e-40	169
    Ghir_A01G000010	Ghir_A01	100.000	214	0	0	90	303	14086	13873	3.24e-108	396
    Ghir_A01G000010	Ghir_A01	100.000	91	0	0	1	91	14258	14168	7.69e-40	169
    Ghir_A01G000010	Ghir_D13	100.000	36	0	0	9	44	11821	11786	2.89e-09	67.6
    Ghir_A01G000010	Ghir_D08	100.000	36	0	0	9	44	69027613	69027648	2.89e-09	67.6
    Ghir_A01G000010	Ghir_D03	100.000	36	0	0	9	44	52683211	52683246	2.89e-09	67.6
    两个解决办法: blastn的阈值设置的严格一些, 减少输出; 或者对blastn.out6结果做筛选; 可以两者结合;
    blastn 添加参数: -evalue 1e-5 -max_target_seqs 1
    筛选blastn.out6: 统计序列长度, 用blastn.out6的第四列除以长度, 这个比值最高的一个就是最佳匹配
    极端场景: 用户输入的序列和对应基因组不匹配时, blastn结果可能是空的, 此时在前端给出提示
    """
    import pandas as pd
    from Bio import SeqIO
    if seq.split("\n")[0].startswith(">"):
        print(task_path)
        print(task_id)
        fasta_file = open('{}/{}.fasta'.format(task_path, task_id), 'w')
        fasta_file.write(seq)
        fasta_file.close()
    else:
        fasta_file = open('{}/{}.fasta'.format(task_path, task_id), 'w')
        fasta_file.write(">{}".format(task_id) + "\n")
        fasta_file.write(seq)
        fasta_file.close()

    blastn_command = """
        /usr/local/bin/blastn \
        -query {}/{}.fasta \
        -db data/{}.fasta \
        -perc_identity 100 \
        -out {}/{}.blastn.out6 \
        -outfmt "6 qseqid sseqid pident length mismatch gapopen qstart qend sstart send evalue bitscore qlen qcovhsp" \
        -num_threads 12
    """.format(task_path, task_id, name_db, task_path, task_id)
    print(blastn_command)
    print(shlex.split(blastn_command))
    blastn_process = subprocess.Popen(shlex.split(blastn_command), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    blastn_stdout, blastn_stderr = blastn_process.communicate()
    print(blastn_stdout)
    print(blastn_stderr)
    # os.system(blastn_command)
    blastnfmt6_pandas = pd.read_csv(
        '{}/{}.blastn.out6'.format(task_path, task_id), 
        sep='\t', 
        names=['qseqid', 'seqid', 'pident', 'length', 'mismatch', 'gapopen', 'qstart', 'qend', 'start', 'end', 'evalue', 'bitscore', 'qlen', 'qcovhsp'])
    blastnfmt6_100_pandas = blastnfmt6_pandas.loc[(blastnfmt6_pandas['pident'] == 100) & (blastnfmt6_pandas['qcovhsp'] == 100)]
    blastnfmt6_100_pandas.to_csv('{}/{}.blastn.100.out6'.format(task_path, task_id), sep='\t', header=False, index=False)
    sequence = str(next(SeqIO.parse('{}/{}.fasta'.format(task_path, task_id), 'fasta')).seq)
    blastnfmt6_100_dicts = blastnfmt6_100_pandas[['seqid', 'start', 'end']].to_dict('records')
    print(blastnfmt6_100_dicts[0])
    # return sequence, {"seqid": seqid, "start": min(start, end), "end": max(start, end)}
    return sequence, blastnfmt6_100_dicts[0]


@shared_task
def adjust_parameters(subseq_seq_result):
    fasta_sequence, fasta_sequence_position = subseq_seq_result
    return fasta_sequence_position


@shared_task 
def generate_sequence_for_batmis(fasta_sequence_position, pam, spacerLength, sgRNAModule, name_db, task_path):
    # generate_sequence_for_batmis({'seqid': 'Ghir_A01', 'start': 9500, 'end': 10000}, 'TTCN', 24, 'spacerPam', 'Gossypium_hirsutum', 'cas9/tmp/f6fde88fe177920797f6cfff20155087')
    import json
    import re

    import pandas as pd
    import pysam
    from Bio import SeqIO
    from Bio.Seq import Seq
    from Bio.SeqRecord import SeqRecord
    
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
    
    regex = ''
    for alpha in pam:
        regex = regex + IUPAC_dict[alpha]
        
    
    pam_dict_spacerPam = {
        'NGG': r'\w{{{}}}[A|T|C|G]GG'.format(spacerLength),
        'NG': r'\w{{{}}}[A|T|C|G]G'.format(spacerLength),
        'NNG': r'\w{{{}}}[A|T|C|G][A|T|C|G]G'.format(spacerLength),
        'NGN': r'\w{{{}}}[A|T|C|G]G[A|T|C|G]'.format(spacerLength),
        'NNGT': r'\w{{{}}}[A|T|C|G][A|T|C|G]GT'.format(spacerLength),
        'NAA': r'\w{{{}}}[A|T|C|G]AA'.format(spacerLength),
        'NNGRRT': r'\w{{{}}}[A|T|C|G][A|T|C|G]G[A|G][A|G]T'.format(spacerLength),
        'NGK': r'\w{{{}}}[A|T|C|G]G[T|G]'.format(spacerLength),
        'NNNRRT': r'\w{{{}}}[A|T|C|G][A|T|C|G][A|T|C|G][A|G][A|G]T'.format(spacerLength),
        'NGA': r'\w{{{}}}[A|T|C|G]GA'.format(spacerLength),
        'NNNNCC': r'\w{{{}}}[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G]CC'.format(spacerLength),
        'NGCG': r'\w{{{}}}[A|T|C|G]GCG'.format(spacerLength),
        'NNAGAA': r'\w{{{}}}[A|T|C|G][A|T|C|G]AGAA'.format(spacerLength),
        'NGGNG': r'\w{{{}}}[A|T|C|G]GG[A|T|C|G]G'.format(spacerLength),
        'NNNNGMTT': r'\w{{{}}}[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G]G[A|C]TT'.format(spacerLength),
        'NNNNACA': r'\w{{{}}}[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G]ACA'.format(spacerLength),
        'NNNNRYAC': r'\w{{{}}}[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G][A|G][T|C]AC'.format(spacerLength),
        'TTCN': r'TTC[A|T|C|G]\w{{{}}}'.format(spacerLength),
        'YTTV': r'[T|C]TT[A|C|G]\w{{{}}}'.format(spacerLength),
        'NNNNCNAA': r'\w{{{}}}[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G]C[A|T|C|G]AA'.format(spacerLength),
        'NNN': r'\w{{{}}}[A|T|C|G][A|T|C|G][A|T|C|G]'.format(spacerLength),
        'NRN': r'\w{{{}}}[A|T|C|G][A|G][A|T|C|G]'.format(spacerLength),
        'NYN': r'\w{{{}}}[A|T|C|G][T|C][A|T|C|G]'.format(spacerLength)
    }
    
    pam_dict_spacerPam = {pam: re.compile('\w{{{}}}'.format(spacerLength) + regex)}
    
    pam_dict_pamSpacer = {
        'NGG': r'[A|T|C|G]GG\w{{{}}}'.format(spacerLength),
        'NG': r'[A|T|C|G]G\w{{{}}}'.format(spacerLength),
        'NNG': r'[A|T|C|G][A|T|C|G]G\w{{{}}}'.format(spacerLength),
        'NGN': r'[A|T|C|G]G[A|T|C|G]\w{{{}}}'.format(spacerLength),
        'NNGT': r'[A|T|C|G][A|T|C|G]GT\w{{{}}}'.format(spacerLength),
        'NAA': r'[A|T|C|G]AA\w{{{}}}'.format(spacerLength),
        'NNGRRT': r'[A|T|C|G][A|T|C|G]G[A|G][A|G]T\w{{{}}}'.format(spacerLength),
        'NGK': r'[A|T|C|G]G[T|G]\w{{{}}}'.format(spacerLength),
        'NNNRRT': r'[A|T|C|G][A|T|C|G][A|T|C|G][A|G][A|G]T\w{{{}}}'.format(spacerLength),
        'NGA': r'[A|T|C|G]GA\w{{{}}}'.format(spacerLength),
        'NNNNCC': r'[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G]CC\w{{{}}}'.format(spacerLength),
        'NGCG': r'[A|T|C|G]GCG\w{{{}}}'.format(spacerLength),
        'NNAGAA': r'[A|T|C|G][A|T|C|G]AGAA\w{{{}}}'.format(spacerLength),
        'NGGNG': r'[A|T|C|G]GG[A|T|C|G]G\w{{{}}}'.format(spacerLength),
        'NNNNGMTT': r'[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G]G[A|C]TT\w{{{}}}'.format(spacerLength),
        'NNNNACA': r'[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G]ACA\w{{{}}}'.format(spacerLength),
        'NNNNRYAC': r'[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G][A|G][T|C]AC\w{{{}}}'.format(spacerLength),
        'TTCN': r'TTC[A|T|C|G]\w{{{}}}'.format(spacerLength),
        'YTTV': r'[T|C]TT[A|C|G]\w{{{}}}'.format(spacerLength),
        'NNNNCNAA': r'[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G]C[A|T|C|G]AA\w{{{}}}'.format(spacerLength),
        'NNN': r'[A|T|C|G][A|T|C|G][A|T|C|G]\w{{{}}}'.format(spacerLength),
        'NRN': r'[A|T|C|G][A|G][A|T|C|G]\w{{{}}}'.format(spacerLength),
        'NYN': r'[A|T|C|G][T|C][A|T|C|G]\w{{{}}}'.format(spacerLength)
    }
    
    pam_dict_pamSpacer = {pam: re.compile(regex + '\w{{{}}}'.format(spacerLength))}
    
    pam_dict = pam_dict_spacerPam if sgRNAModule == 'spacerpam' else pam_dict_pamSpacer
    spacerLength = int(spacerLength)
    
    genome_handle = pysam.FastaFile("./data/{}_genome.fasta".format(name_db))
    chromosome_length = genome_handle.get_reference_length(fasta_sequence_position['seqid'])
    target_seqid = fasta_sequence_position['seqid']
    target_start = fasta_sequence_position['start'] - spacerLength if fasta_sequence_position['start'] > spacerLength else 1
    target_end = fasta_sequence_position['end'] + spacerLength if fasta_sequence_position['end'] + spacerLength < chromosome_length else chromosome_length
    target_seq = genome_handle.fetch(target_seqid, target_start, target_end)
    target_seq_reverse = str(Seq(target_seq).reverse_complement())
    
    gff_file_pandas = pd.read_pickle(
        "data/{}_gene_model_sorted_withintergenic_family.plk".format(name_db)
    )
    gff_file_pandas.sort_index(inplace=True)
    family_records = gff_file_pandas.loc[target_seqid, :, 'gene']
    try:
        family = family_records[family_records['interval'].apply(lambda x: x.overlaps(pd.Interval(target_start, target_end)))].iloc[0, -1]
        family_record = gff_file_pandas.loc[target_seqid, family]
        family_record = family_record[~family_record['type'].isin(['mRNA', 'gene'])]
    except:
        family = 'intergenic'
        family_record = pd.DataFrame()

    def ontarget_apply():
        if family_record.empty:
            return 'intergenic', 'intergenic'
        else:
            confirmed_records = family_record[family_record['interval'].apply(lambda row: row.overlaps(pd.Interval(sgRNA_position_start, sgRNA_position_end)))]
            if confirmed_records.empty:
                # print(family_record["family"])
                return family_record.iloc[0, -1], 'intron'
            else:
                return confirmed_records.iloc[0, -1], ", ".join(confirmed_records['type'].unique().tolist())

    sgRNA_seqrecords = []
    sgRNA_dataframe = pd.DataFrame(columns=['sgRNA_id', 'sgRNA_position', 'sgRNA_strand', 'sgRNA_seq', 'sgRNA_seq_html', 'sgRNA_GC', 'sgRNA_family', 'sgRNA_type'])
    for idx, sgRNA in enumerate(re.finditer(pam_dict[pam], target_seq)):
        sgRNA_seq = sgRNA.group()
        sgRNA_seq_html = str("<span style='font-weight:900'>" + sgRNA_seq + '</span>' + '</br>' + '|' * len(sgRNA_seq) + '</br>' + Seq(sgRNA_seq).complement())
        sgRNA_id = 'Guide_' + str(idx)
        sgRNA_GC = str('{:.2f}'.format((sgRNA_seq.count('C') + sgRNA_seq.count('G')) / len(sgRNA_seq) * 100)) + '%'
        sgRNA_position_start = target_start + sgRNA.start()
        sgRNA_position_end = target_start + sgRNA.end() - 1
        sgRNA_position = target_seqid + ':' + str(sgRNA_position_start)
        sgRNA_family, sgRNA_type = ontarget_apply()
        sgRNA_seqrecord = SeqRecord(Seq(sgRNA_seq), sgRNA_id, '', '')
        sgRNA_seqrecords.append(sgRNA_seqrecord)
        sgRNA_dataframe.loc[idx] = [sgRNA_id, sgRNA_position, "5'------3'", sgRNA_seq, sgRNA_seq_html, sgRNA_GC, sgRNA_family, sgRNA_type]
    
    sgRNA_reverse_seqrecords = []
    sgRNA_reverse_dataframe = pd.DataFrame(columns=['sgRNA_id', 'sgRNA_position', 'sgRNA_strand', 'sgRNA_seq', 'sgRNA_seq_html', 'sgRNA_GC', 'sgRNA_family', 'sgRNA_type'])
    for idx, sgRNA_reverse in enumerate(re.finditer(pam_dict[pam], target_seq_reverse)):
        sgRNA_reverse_seq = sgRNA_reverse.group()
        sgRNA_reverse_seq_html = str(Seq(sgRNA_reverse_seq).complement()[::-1] + '</br>' + '|' * len(sgRNA_reverse_seq) + '</br>' + "<span style='font-weight:900'>" + sgRNA_reverse_seq[::-1] + '</span>')
        sgRNA_reverse_id = 'Guide_reverse_' + str(idx)
        sgRNA_reverse_GC = str('{:.2f}'.format((sgRNA_reverse_seq.count('C') + sgRNA_reverse_seq.count('G')) / len(sgRNA_reverse_seq) * 100)) + '%'
        sgRNA_reverse_position_end = target_end - sgRNA_reverse.start() - 1
        sgRNA_reverse_position_start = target_end - sgRNA_reverse.end()
        sgRNA_reverse_position = target_seqid + ':' + str(sgRNA_reverse_position_end)
        sgRNA_reverse_family, sgRNA_reverse_type = ontarget_apply()
        sgRNA_reverse_seqrecord = SeqRecord(Seq(sgRNA_reverse_seq), sgRNA_reverse_id, '', '')
        sgRNA_reverse_seqrecords.append(sgRNA_reverse_seqrecord)
        sgRNA_reverse_dataframe.loc[idx] = [sgRNA_reverse_id, sgRNA_reverse_position, "3'------5'", sgRNA_reverse_seq, sgRNA_reverse_seq_html, sgRNA_reverse_GC, sgRNA_reverse_family, sgRNA_reverse_type]
        
    sgRNA_dataframe = pd.concat([sgRNA_dataframe, sgRNA_reverse_dataframe])
    sgRNA_dataframe.reset_index(inplace=True, drop=True)
    sgRNA_json = sgRNA_dataframe.to_json(orient='records')
    json_handle = json.loads(sgRNA_json)
    json_handle = {'total': len(json_handle), 'rows': json_handle}
    with open('{}/Guide.json'.format(task_path), 'w') as file_handle:
        json.dump(json_handle, file_handle)
    
    SeqIO.write(sgRNA_seqrecords + sgRNA_reverse_seqrecords, '{}/Guide.fasta'.format(task_path), 'fasta')

    return sgRNA_dataframe
    

@shared_task 
def run_batmis(task_path, name_db, task_id):
    # run_batmis('cas9/tmp/f6fde88fe177920797f6cfff20155087', 'Gossypium_hirsutum', 'f6fde88fe177920797f6cfff20155087')
    import os
    
    param_dict = {'task_path': task_path, 'name_db': name_db, 'task_id': task_id}
    os.system('batman -q {task_path}/Guide.fasta -g data/{name_db}_genome.fasta -n 5 -mall -l /dev/null -o {task_path}/{task_id}.bin 1> /dev/null'.format(**param_dict))
    os.system('batdecode -i {task_path}/{task_id}.bin -g data/{name_db}_genome.fasta -o {task_path}/{task_id}.txt'.format(**param_dict))
    os.system('samtools view -bS {task_path}/{task_id}.txt > {task_path}/{task_id}.bam'.format(**param_dict))
    os.system('bedtools intersect -a {task_path}/{task_id}.bam -b data/{name_db}_gene_model.gff3 -wo -bed > {task_path}/{task_id}.intersect'.format(**param_dict))
    return '{task_path}/{task_id}.txt'.format(**param_dict), '{task_path}/{task_id}.intersect'.format(**param_dict)


@shared_task
def parse_batmis_sam(sam_file, intersect_file, spacerLength, name_db):
    # parse_batmis_sam('cas9/tmp/f6fde88fe177920797f6cfff20155087/f6fde88fe177920797f6cfff20155087.txt', 'cas9/tmp/f6fde88fe177920797f6cfff20155087/f6fde88fe177920797f6cfff20155087.intersect', 24, 'Gossypium_hirsutum')
    import json
    import re

    import pandas as pd
    import pysam
    from pandarallel import pandarallel
    pandarallel.initialize(nb_workers=20, progress_bar=False)
    
    spacerLength = int(spacerLength)
    sam_pandas = pd.read_csv(
        sam_file,
        header=None,
        sep='\t',
        comment='@',
        names=['qname','flag','rname','pos','mapq','cigar','rnext','pnext','tlen','seq','qual','NM','MD']
    )
    genome_handle = pysam.FastaFile('data/{}_genome.fasta'.format(name_db))
    sam_pandas['NM'] = sam_pandas.apply(lambda row: row['NM'].replace('NM:i:', ''), axis=1)
    sam_pandas['MD'] = sam_pandas.apply(lambda row: row['MD'].replace('MD:Z:', ''), axis=1)
    sam_pandas['pos_end'] = sam_pandas.apply(lambda row: row['pos'] + spacerLength, axis=1, result_type='expand')
    sam_pandas['rseq'] = sam_pandas.apply(lambda row: genome_handle.fetch(row['rname'], row['pos']-1, row['pos_end']-2), axis=1, result_type='expand')
    sam_pandas['pos_0_base']=sam_pandas.apply(lambda row: row['pos'] - 1, axis=1)
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
    
    def merge_extract(row):
        if isinstance(sam_pandas.loc[row['seqid'], row['sgRNA_start']], pd.DataFrame):
            return sam_pandas.loc[row['seqid'], row['sgRNA_start']].iloc[0]
        else:
            return sam_pandas.loc[row['seqid'], row['sgRNA_start']]

    if len(sam_pandas) < 1000:
        intersect_pandas[
            ['qname', 'flag', 'rname', 'pos', 'seq', 'NM', 'MD', 'pos_end', 'rseq', 'pos_0_base']
            ] = intersect_pandas.apply(merge_extract, axis=1, result_type='expand')
        intersect_pandas["family"] = intersect_pandas.apply(
            lambda row: re.search(r'ID=(.*);', row.attributes).group(1) if row.type == "gene"
            else re.search(r'ID=cds\.(.*?)\.', row.attributes).group(1) if row.type == "CDS"
            else re.search(r'ID=(.*?)\.', row.attributes).group(1),
            axis=1
        )
    else:
        intersect_pandas[
            ['qname', 'flag', 'rname', 'pos', 'seq', 'NM', 'MD', 'pos_end', 'rseq', 'pos_0_base']
            ] = intersect_pandas.parallel_apply(merge_extract, axis=1, result_type='expand')
        intersect_pandas["family"] = intersect_pandas.parallel_apply(
            lambda row: re.search(r'ID=(.*);', row.attributes).group(1) if row.type == "gene"
            else re.search(r'ID=cds\.(.*?)\.', row.attributes).group(1) if row.type == "CDS"
            else re.search(r'ID=(.*?)\.', row.attributes).group(1),
            axis=1
        )
    intersect_pandas.set_index(['seq', 'family'], inplace=True, drop=True)

    for target_seq in intersect_pandas.index.get_level_values(0).unique():
        intersect_target_tmp_pandas = intersect_pandas.loc[target_seq]
        intersect_target_pandas = intersect_target_tmp_pandas[intersect_target_tmp_pandas['type']=='gene'].drop_duplicates()
        intersect_target_pandas['types_list'] = intersect_target_tmp_pandas.groupby('family').apply(lambda x: sorted(x.type.unique().tolist()))
        intersect_target_pandas['types'] = intersect_target_pandas.apply(lambda row: 'intron' if len(row.types_list) == 2 else ', '.join(row.types_list).replace(', gene, mRNA', ''), axis=1)
        intersect_target_pandas.reset_index(level='family', inplace=True)
        intersect_target_json = intersect_target_pandas.to_json(orient='records')
        json_handle = json.loads(intersect_target_json)
        json_handle = {'total': len(json_handle), 'rows': json_handle}
        prefix = re.match(r'(.*)\.', sam_file).group(1) + '_' + target_seq + '.'
        with open(prefix + 'json', 'w') as file_handle:
            json.dump(json_handle, file_handle)
    
    return sam_pandas, intersect_pandas


@shared_task
def finish_job(task_id, task_path):
    import json
    with open(task_path + '/Guide.json') as guide_json_handle:
        guide_json = json.load(guide_json_handle)
        for i in range(guide_json['total']):
            sgRNA_seq = guide_json['rows'][i]['sgRNA_seq']
            try:
                with open(task_path + '/' + task_id + '_' + sgRNA_seq + '.json') as sgRNA_seq_handle:
                    sgRNA_json = json.load(sgRNA_seq_handle)
                offtarget_num = sgRNA_json['total']
                guide_json['rows'][i]['offtarget_num'] = offtarget_num
            except FileNotFoundError:
                guide_json['rows'][i]['offtarget_num'] = 0
    with open(task_path + '/Guide.json', 'w') as guide_json_handle:
        json.dump(guide_json, guide_json_handle)
    open(task_path + '/task_finished', 'w').close()
    

@shared_task
def form2resultjson(fasta_sequence_position, pam, spacerLength, sgRNAModule, name_db, task_path, task_id):
    import json
    import os
    import re

    import billiard as multiprocessing
    import pandas as pd
    import pysam
    from Bio import SeqIO
    from Bio.Seq import Seq
    from Bio.SeqRecord import SeqRecord
    from pandarallel import pandarallel
    pandarallel.initialize(nb_workers=20, progress_bar=True)
    
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
    
    regex = ''
    for alpha in pam:
        regex = regex + IUPAC_dict[alpha]
    
    pam_dict_spacerPam = {
        'NGG': r'\w{{{}}}[A|T|C|G]GG'.format(spacerLength),
        'NG': r'\w{{{}}}[A|T|C|G]G'.format(spacerLength),
        'NNG': r'\w{{{}}}[A|T|C|G][A|T|C|G]G'.format(spacerLength),
        'NGN': r'\w{{{}}}[A|T|C|G]G[A|T|C|G]'.format(spacerLength),
        'NNGT': r'\w{{{}}}[A|T|C|G][A|T|C|G]GT'.format(spacerLength),
        'NAA': r'\w{{{}}}[A|T|C|G]AA'.format(spacerLength),
        'NNGRRT': r'\w{{{}}}[A|T|C|G][A|T|C|G]G[A|G][A|G]T'.format(spacerLength),
        'NGK': r'\w{{{}}}[A|T|C|G]G[T|G]'.format(spacerLength),
        'NNNRRT': r'\w{{{}}}[A|T|C|G][A|T|C|G][A|T|C|G][A|G][A|G]T'.format(spacerLength),
        'NGA': r'\w{{{}}}[A|T|C|G]GA'.format(spacerLength),
        'NNNNCC': r'\w{{{}}}[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G]CC'.format(spacerLength),
        'NGCG': r'\w{{{}}}[A|T|C|G]GCG'.format(spacerLength),
        'NNAGAA': r'\w{{{}}}[A|T|C|G][A|T|C|G]AGAA'.format(spacerLength),
        'NGGNG': r'\w{{{}}}[A|T|C|G]GG[A|T|C|G]G'.format(spacerLength),
        'NNNNGMTT': r'\w{{{}}}[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G]G[A|C]TT'.format(spacerLength),
        'NNNNACA': r'\w{{{}}}[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G]ACA'.format(spacerLength),
        'NNNNRYAC': r'\w{{{}}}[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G][A|G][T|C]AC'.format(spacerLength),
        'TTCN': r'TTC[A|T|C|G]\w{{{}}}'.format(spacerLength),
        'YTTV': r'[T|C]TT[A|C|G]\w{{{}}}'.format(spacerLength),
        'NNNNCNAA': r'\w{{{}}}[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G]C[A|T|C|G]AA'.format(spacerLength),
        'NNN': r'\w{{{}}}[A|T|C|G][A|T|C|G][A|T|C|G]'.format(spacerLength),
        'NRN': r'\w{{{}}}[A|T|C|G][A|G][A|T|C|G]'.format(spacerLength),
        'NYN': r'\w{{{}}}[A|T|C|G][T|C][A|T|C|G]'.format(spacerLength)
    }
    
    pam_dict_spacerPam = {pam: re.compile('\w{{{}}}'.format(spacerLength) + regex)}
    
    pam_dict_pamSpacer = {
        'NGG': r'[A|T|C|G]GG\w{{{}}}'.format(spacerLength),
        'NG': r'[A|T|C|G]G\w{{{}}}'.format(spacerLength),
        'NNG': r'[A|T|C|G][A|T|C|G]G\w{{{}}}'.format(spacerLength),
        'NGN': r'[A|T|C|G]G[A|T|C|G]\w{{{}}}'.format(spacerLength),
        'NNGT': r'[A|T|C|G][A|T|C|G]GT\w{{{}}}'.format(spacerLength),
        'NAA': r'[A|T|C|G]AA\w{{{}}}'.format(spacerLength),
        'NNGRRT': r'[A|T|C|G][A|T|C|G]G[A|G][A|G]T\w{{{}}}'.format(spacerLength),
        'NGK': r'[A|T|C|G]G[T|G]\w{{{}}}'.format(spacerLength),
        'NNNRRT': r'[A|T|C|G][A|T|C|G][A|T|C|G][A|G][A|G]T\w{{{}}}'.format(spacerLength),
        'NGA': r'[A|T|C|G]GA\w{{{}}}'.format(spacerLength),
        'NNNNCC': r'[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G]CC\w{{{}}}'.format(spacerLength),
        'NGCG': r'[A|T|C|G]GCG\w{{{}}}'.format(spacerLength),
        'NNAGAA': r'[A|T|C|G][A|T|C|G]AGAA\w{{{}}}'.format(spacerLength),
        'NGGNG': r'[A|T|C|G]GG[A|T|C|G]G\w{{{}}}'.format(spacerLength),
        'NNNNGMTT': r'[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G]G[A|C]TT\w{{{}}}'.format(spacerLength),
        'NNNNACA': r'[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G]ACA\w{{{}}}'.format(spacerLength),
        'NNNNRYAC': r'[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G][A|G][T|C]AC\w{{{}}}'.format(spacerLength),
        'TTCN': r'TTC[A|T|C|G]\w{{{}}}'.format(spacerLength),
        'YTTV': r'[T|C]TT[A|C|G]\w{{{}}}'.format(spacerLength),
        'NNNNCNAA': r'[A|T|C|G][A|T|C|G][A|T|C|G][A|T|C|G]C[A|T|C|G]AA\w{{{}}}'.format(spacerLength),
        'NNN': r'[A|T|C|G][A|T|C|G][A|T|C|G]\w{{{}}}'.format(spacerLength),
        'NRN': r'[A|T|C|G][A|G][A|T|C|G]\w{{{}}}'.format(spacerLength),
        'NYN': r'[A|T|C|G][T|C][A|T|C|G]\w{{{}}}'.format(spacerLength)
    }
    
    pam_dict_pamSpacer = {pam: re.compile(regex + '\w{{{}}}'.format(spacerLength))}
    
    pam_dict = pam_dict_spacerPam if sgRNAModule == 'spacerpam' else pam_dict_pamSpacer
    spacerLength = int(spacerLength)
    
    genome_handle = pysam.FastaFile("./data/{}.fasta".format(name_db))
    chromosome_length = genome_handle.get_reference_length(fasta_sequence_position['seqid'])
    target_seqid = fasta_sequence_position['seqid']
    target_start = fasta_sequence_position['start'] - spacerLength if fasta_sequence_position['start'] > spacerLength else 1
    target_end = fasta_sequence_position['end'] + spacerLength if fasta_sequence_position['end'] + spacerLength < chromosome_length else chromosome_length
    target_seq = genome_handle.fetch(target_seqid, target_start, target_end)
    target_seq_reverse = str(Seq(target_seq).reverse_complement())
    
    gff_file_pandas = pd.read_pickle(
        "data/{}_withintergenic_fixed_family.plk".format(name_db)
    )
    gff_file_pandas.sort_index(inplace=True)
    family_records = gff_file_pandas.loc[target_seqid, :, 'gene']
    try:
        family = family_records[family_records['interval'].apply(lambda x: x.overlaps(pd.Interval(target_start, target_end)))].iloc[0, -1]
        family_record = gff_file_pandas.loc[target_seqid, family]
        family_record = family_record[~family_record['type'].isin(['mRNA', 'gene'])]
    except:
        family = 'intergenic'
        family_record = pd.DataFrame()

    def ontarget_apply():
        if family_record.empty:
            return 'intergenic', 'intergenic'
        else:
            confirmed_records = family_record[family_record['interval'].apply(lambda row: row.overlaps(pd.Interval(sgRNA_position_start, sgRNA_position_end)))]
            if confirmed_records.empty:
                # print(family_record["family"])
                return family_record.iloc[0, -1], 'intron'
            else:
                return confirmed_records.iloc[0, -1], ", ".join(confirmed_records['type'].unique().tolist())

    sgRNA_seqrecords = []
    sgRNA_dataframe = pd.DataFrame(columns=['sgRNA_id', 'sgRNA_position', 'sgRNA_strand', 'sgRNA_seq', 'sgRNA_seq_html', 'sgRNA_GC', 'sgRNA_family', 'sgRNA_type'])
    for idx, sgRNA in enumerate(re.finditer(pam_dict[pam], target_seq)):
        sgRNA_seq = sgRNA.group()
        sgRNA_seq_html = str("<span style='font-weight:900'>" + sgRNA_seq + '</span>' + '</br>' + '|' * len(sgRNA_seq) + '</br>' + Seq(sgRNA_seq).complement())
        sgRNA_id = 'Guide_' + str(idx)
        sgRNA_GC = str('{:.2f}'.format((sgRNA_seq.count('C') + sgRNA_seq.count('G')) / len(sgRNA_seq) * 100)) + '%'
        sgRNA_position_start = target_start + sgRNA.start()
        sgRNA_position_end = target_start + sgRNA.end() - 1
        sgRNA_position = target_seqid + ':' + str(sgRNA_position_start)
        sgRNA_family, sgRNA_type = ontarget_apply()
        sgRNA_seqrecord = SeqRecord(Seq(sgRNA_seq), sgRNA_id, '', '')
        sgRNA_seqrecords.append(sgRNA_seqrecord)
        sgRNA_dataframe.loc[idx] = [sgRNA_id, sgRNA_position, "5'------3'", sgRNA_seq, sgRNA_seq_html, sgRNA_GC, sgRNA_family, sgRNA_type]
    
    sgRNA_reverse_seqrecords = []
    sgRNA_reverse_dataframe = pd.DataFrame(columns=['sgRNA_id', 'sgRNA_position', 'sgRNA_strand', 'sgRNA_seq', 'sgRNA_seq_html', 'sgRNA_GC', 'sgRNA_family', 'sgRNA_type'])
    for idx, sgRNA_reverse in enumerate(re.finditer(pam_dict[pam], target_seq_reverse)):
        sgRNA_reverse_seq = sgRNA_reverse.group()
        sgRNA_reverse_seq_html = str(Seq(sgRNA_reverse_seq).complement()[::-1] + '</br>' + '|' * len(sgRNA_reverse_seq) + '</br>' + "<span style='font-weight:900'>" + sgRNA_reverse_seq[::-1] + '</span>')
        sgRNA_reverse_id = 'Guide_reverse_' + str(idx)
        sgRNA_reverse_GC = str('{:.2f}'.format((sgRNA_reverse_seq.count('C') + sgRNA_reverse_seq.count('G')) / len(sgRNA_reverse_seq) * 100)) + '%'
        sgRNA_reverse_position_end = target_end - sgRNA_reverse.start() - 1
        sgRNA_reverse_position_start = target_end - sgRNA_reverse.end()
        sgRNA_reverse_position = target_seqid + ':' + str(sgRNA_reverse_position_end)
        sgRNA_reverse_family, sgRNA_reverse_type = ontarget_apply()
        sgRNA_reverse_seqrecord = SeqRecord(Seq(sgRNA_reverse_seq), sgRNA_reverse_id, '', '')
        sgRNA_reverse_seqrecords.append(sgRNA_reverse_seqrecord)
        sgRNA_reverse_dataframe.loc[idx] = [sgRNA_reverse_id, sgRNA_reverse_position, "3'------5'", sgRNA_reverse_seq, sgRNA_reverse_seq_html, sgRNA_reverse_GC, sgRNA_reverse_family, sgRNA_reverse_type]
        
    sgRNA_dataframe = pd.concat([sgRNA_dataframe, sgRNA_reverse_dataframe])
    sgRNA_dataframe.reset_index(inplace=True, drop=True)
    sgRNA_json = sgRNA_dataframe.to_json(orient='records')
    json_handle = json.loads(sgRNA_json)
    json_handle = {'total': len(json_handle), 'rows': json_handle}
    with open('{}/Guide.json'.format(task_path), 'w') as file_handle:
        json.dump(json_handle, file_handle)
    
    SeqIO.write(sgRNA_seqrecords + sgRNA_reverse_seqrecords, '{}/Guide.fasta'.format(task_path), 'fasta')

    param_dict = {'task_path': task_path, 'name_db': name_db, 'task_id': task_id}
    os.system('/disk2/users/yxguo/opt/bin/batman -q {task_path}/Guide.fasta -g data/{name_db}.fasta -n 5 -mall -l /dev/null -o {task_path}/{task_id}.bin 1> /dev/null'.format(**param_dict))
    os.system('/disk2/users/yxguo/opt/bin/batdecode -i {task_path}/{task_id}.bin -g data/{name_db}.fasta -o {task_path}/{task_id}.txt'.format(**param_dict))
    os.system('/disk2/users/yxguo/opt/bin/samtools view -bS {task_path}/{task_id}.txt > {task_path}/{task_id}.bam'.format(**param_dict))
    os.system('/disk2/users/yxguo/software/bedtools2/bin/bedtools intersect -a {task_path}/{task_id}.bam -b data/{name_db}.gff3 -wo -bed > {task_path}/{task_id}.intersect'.format(**param_dict))

    sam_file, intersect_file = '{task_path}/{task_id}.txt'.format(**param_dict), '{task_path}/{task_id}.intersect'.format(**param_dict)

    spacerLength = int(spacerLength)
    sam_pandas = pd.read_csv(
        sam_file,
        header=None,
        sep='\t',
        comment='@',
        names=['qname','flag','rname','pos','mapq','cigar','rnext','pnext','tlen','seq','qual','NM','MD']
    )
    genome_handle = pysam.FastaFile('data/{}.fasta'.format(name_db))
    sam_pandas['NM'] = sam_pandas.apply(lambda row: row['NM'].replace('NM:i:', ''), axis=1)
    sam_pandas['MD'] = sam_pandas.apply(lambda row: row['MD'].replace('MD:Z:', ''), axis=1)
    sam_pandas['pos_end'] = sam_pandas.apply(lambda row: row['pos'] + spacerLength, axis=1, result_type='expand')
    sam_pandas['rseq'] = sam_pandas.apply(lambda row: genome_handle.fetch(row['rname'], row['pos']-1, row['pos_end']-2), axis=1, result_type='expand')
    sam_pandas['pos_0_base']=sam_pandas.apply(lambda row: row['pos'] - 1, axis=1)
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
    
    def merge_extract(row):
        if isinstance(sam_pandas.loc[row['seqid'], row['sgRNA_start']], pd.DataFrame):
            return sam_pandas.loc[row['seqid'], row['sgRNA_start']].iloc[0]
        else:
            return sam_pandas.loc[row['seqid'], row['sgRNA_start']]

    if len(sam_pandas) < 1000:
        intersect_pandas[
            ['qname', 'flag', 'rname', 'pos', 'seq', 'NM', 'MD', 'pos_end', 'rseq', 'pos_0_base']
            ] = intersect_pandas.apply(merge_extract, axis=1, result_type='expand')
        intersect_pandas["family"] = intersect_pandas.apply(
            lambda row: re.search(r'ID=(.*);', row.attributes).group(1) if row.type == "gene"
            else re.search(r'ID=cds\.(.*?)\.', row.attributes).group(1) if row.type == "CDS"
            else re.search(r'ID=(.*?)\.', row.attributes).group(1),
            axis=1
        )
    else:
        intersect_pandas[
            ['qname', 'flag', 'rname', 'pos', 'seq', 'NM', 'MD', 'pos_end', 'rseq', 'pos_0_base']
            ] = intersect_pandas.parallel_apply(merge_extract, axis=1, result_type='expand')
        intersect_pandas["family"] = intersect_pandas.parallel_apply(
            lambda row: re.search(r'ID=(.*)', row.attributes).group(1) if row.type == "gene"
            # else re.search(r'ID=cds\.(.*?)\.', row.attributes).group(1) if row.type == "CDS"
            else re.search(r'ID=(.*?)\.', row.attributes).group(1),
            axis=1
        )
    intersect_pandas.set_index(['seq', 'family'], inplace=True, drop=True)

    # for target_seq in intersect_pandas.index.get_level_values(0).unique():
    #     intersect_target_tmp_pandas = intersect_pandas.loc[target_seq]
    #     intersect_target_pandas = intersect_target_tmp_pandas[intersect_target_tmp_pandas['type']=='gene'].drop_duplicates()
    #     intersect_target_pandas['types_list'] = intersect_target_tmp_pandas.groupby('family').apply(lambda x: sorted(x.type.unique().tolist()))
    #     intersect_target_pandas['types'] = intersect_target_pandas.apply(lambda row: 'intron' if len(row.types_list) == 2 else ', '.join(row.types_list).replace(', gene, mRNA', ''), axis=1)
    #     intersect_target_pandas.reset_index(level='family', inplace=True)
    #     intersect_target_json = intersect_target_pandas.to_json(orient='records')
    #     json_handle = json.loads(intersect_target_json)
    #     json_handle = {'total': len(json_handle), 'rows': json_handle}
    #     prefix = re.match(r'(.*)\.', sam_file).group(1) + '_' + target_seq + '.'
    #     with open(prefix + 'json', 'w') as file_handle:
    #         json.dump(json_handle, file_handle)

    # sam_pandas.to_pickle('{}/{}_sam_pandas.plk'.format(task_path, task_id))
    # intersect_pandas.to_pickle('{}/{}_intersect_pandas.plk'.format(task_path, task_id))

    # with open(task_path + '/Guide.json') as guide_json_handle:
    #     guide_json = json.load(guide_json_handle)
    #     for i in range(guide_json['total']):
    #         sgRNA_seq = guide_json['rows'][i]['sgRNA_seq']
    #         try:
    #             with open(task_path + '/' + task_id + '_' + sgRNA_seq + '.json') as sgRNA_seq_handle:
    #                 sgRNA_json = json.load(sgRNA_seq_handle)
    #             offtarget_num = sgRNA_json['total']
    #             guide_json['rows'][i]['offtarget_num'] = offtarget_num
    #         except FileNotFoundError:
    #             guide_json['rows'][i]['offtarget_num'] = 0
    # with open(task_path + '/Guide.json', 'w') as guide_json_handle:
    #     json.dump(guide_json, guide_json_handle)
    

    with open(task_path + '/Guide.json') as guide_json_handle:
        guide_json = json.load(guide_json_handle)
        for target_seq in intersect_pandas.index.get_level_values(0).unique():
            intersect_target_tmp_pandas = intersect_pandas.loc[target_seq]
            intersect_target_pandas = intersect_target_tmp_pandas[intersect_target_tmp_pandas['type']=='gene'].drop_duplicates()
            intersect_target_pandas['types_list'] = intersect_target_tmp_pandas.groupby('family').apply(lambda x: sorted(x.type.unique().tolist()))
            intersect_target_pandas['types'] = intersect_target_pandas.apply(lambda row: 'intron' if len(row.types_list) == 2 else ', '.join(row.types_list).replace(', gene, mRNA', ''), axis=1)
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
    with open(task_path + '/Guide.json2', 'w') as guide_json_handle:
        json.dump(guide_json, guide_json_handle)
    open(task_path + '/task_finished', 'w').close()
    task_finished = True

    cas9_task_object = result_cas9_list(
        pamType=pam,
        name_db=name_db,
        inputSequence=fasta_sequence_position,
        sgRNAModule=sgRNAModule,
        spacerLength=spacerLength,
        task_id=task_id,
        sgRNAJson = guide_json,
        task_finished = task_finished
    )
    cas9_task_object.save()

    return guide_json, task_finished
    

def form2Database(task_id, inputSequence, pam, spacerLength, sgRNAModule, name_db):
    start_time = time.time()

    cas9_task_record = result_cas9_list(task_id=task_id, input_sequence=inputSequence, pam_type=pam, spacer_length=spacerLength, sgRNA_module=sgRNAModule, name_db=name_db, task_status='running', sequence_position='')
    cas9_task_record.save()
    print(f"Create record: {time.time() - start_time:.2f} seconds")

    step_time = time.time()
    input_type = input_sequence_to_fasta_sequence_position(inputSequence)
    fasta_sequence, fasta_sequence_position = input_type_to_sequence_and_position(input_type, name_db, task_id)
    fasta_sequence_position_json = json.dumps(fasta_sequence_position)
    if fasta_sequence:
        cas9_task_record.sequence_position = fasta_sequence_position_json
        cas9_task_record.save()
    else:
        cas9_task_record.task_status = 'failed'
        cas9_task_record.log = 'empty BLAST result'
        cas9_task_record.save()
        return 0
    print(f"Parse input sequence: {time.time() - step_time:.2f} seconds")

    step_time = time.time()
    target_start, target_end, target_seq, target_seq_reverse = sequence_and_position_to_target_seq(name_db, fasta_sequence_position, spacerLength)
    print(f"Generate target sequence: {time.time() - step_time:.2f} seconds")

    step_time = time.time()
    family_records = target_to_ontarget(name_db, fasta_sequence_position['seqid'], target_start, target_end)
    print(f"Get family records: {time.time() - step_time:.2f} seconds")

    step_time = time.time()
    sgRNA_dataframe, sgRNA_json = generate_sgRNA_dataframe(family_records, target_seq, target_seq_reverse, target_start, target_end, fasta_sequence_position['seqid'], pam, spacerLength, sgRNAModule, task_id)
    print(f"Generate sgRNA dataframe and JSON: {time.time() - step_time:.2f} seconds")

    step_time = time.time()
    sam_file, intersect_file = run_batman(f'/tmp/CRISPRone/{task_id}', name_db, task_id)
    sam_pandas, intersect_pandas = intersect_to_pandas(sam_file, intersect_file, spacerLength, name_db, pam)
    print(f"Run BATMAN and intersection analysis: {time.time() - step_time:.2f} seconds")

    step_time = time.time()
    guide_json = sam_intersect_pandas_to_json(sam_pandas, intersect_pandas, f'/tmp/CRISPRone/{task_id}')
    print(f"Convert intersection data to JSON: {time.time() - step_time:.2f} seconds")

    step_time = time.time()
    cas9_task_record.sgRNA_json = guide_json
    cas9_task_record.task_status = 'finished'
    cas9_task_record.save()
    print(f"Total time: {time.time() - start_time:.2f} seconds")

    step_time = time.time()
    add_Jbrowse_to_json(task_id, guide_json)
    print(f"JSON3 is generated: {time.time() - step_time:.2f} seconds")

    return 0


def add_Jbrowse_to_json(task_id, guide_json):
    cas9_task_record = result_cas9_list.objects.get(task_id=task_id)
    sequence_position = json.loads(cas9_task_record.sequence_position)
    json_handle = {"TableData": {"json_data": guide_json},
                   "JbrowseInfo": {
                       "assembly": {
                           "name": cas9_task_record.name_db,
                           "fasta": f"http://crisprall.hzau.edu.cn/CRISPRone_data/genome_files/{cas9_task_record.name_db}.fa",
                           "fai": f"http://crisprall.hzau.edu.cn/CRISPRone_data/genome_files/{cas9_task_record.name_db}.fa.fai"
                        },
                       "tracks": {
                           "name": cas9_task_record.name_db,
                           "gff3_gz": f"http://crisprall.hzau.edu.cn/cas9_Jbrowse_API?task_id={task_id}&file_type=gff3.gz",
                           "gff3_tbi": f"http://crisprall.hzau.edu.cn/cas9_Jbrowse_API?task_id={task_id}&file_type=gff3.gz.csi"
                       },
                       "position": f"{sequence_position['seqid']}:{sequence_position['start']}..{sequence_position['end']}"
                       }}
    cas9_task_record.sgRNA_with_JBrowse_json = json_handle
    cas9_task_record.save()
    cas9_task_record.refresh_from_db()
    print(f'json_handle:{json_handle}')
    print(f'cas9_task_record.sgRNA_with_JBrowse_json:{cas9_task_record.sgRNA_with_JBrowse_json}')
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
    os.system(f'/disk2/users/yxguo/opt/bin/batman -q {task_path}/Guide.fasta -g data/genome_files/{name_db}.fa -n 5 -mall -l /dev/null -o {task_path}/{task_id}.bin 1> /dev/null')
    os.system(f'/disk2/users/yxguo/opt/bin/batdecode -i {task_path}/{task_id}.bin -g data/genome_files/{name_db}.fa -o {task_path}/{task_id}.txt')
    os.system(f'/disk2/users/yxguo/opt/bin/samtools view -bS {task_path}/{task_id}.txt > {task_path}/{task_id}.bam')
    os.system(f'/usr/local/bin/bedtools intersect -a {task_path}/{task_id}.bam -b data/processed_annotation_files/{name_db}.processed.gff3 -wo -bed > {task_path}/{task_id}.intersect')
    return f'{task_path}/{task_id}.txt', f'{task_path}/{task_id}.intersect'


def generate_sgRNA_dataframe(family_records, target_seq, target_seq_reverse, target_start, target_end, target_seqid, pam, spacerLength, sgRNAModule, task_id):
    task_path = f'/tmp/CRISPRone/{task_id}'
    def ontarget_apply():
        confirmed_records = family_records[family_records['interval'].apply(lambda row: row.overlaps(pd.Interval(sgRNA_position_start, sgRNA_position_end)))]
        if confirmed_records.empty:
            return family_records.iloc[0, -1], 'intron'
        else:
            return confirmed_records.iloc[0, -1], ", ".join(confirmed_records['ID'].unique().tolist())
    sgRNA_seqrecords = []
    sgRNA_dataframe = pd.DataFrame(columns=['sgRNA_id', 'sgRNA_position', 'sgRNA_strand', 'sgRNA_seq', 'sgRNA_seq_html', 'sgRNA_GC', 'sgRNA_family', 'sgRNA_type'])
    pam_regex = create_regex_patterns(pam, spacerLength, sgRNAModule)
    print(family_records)
    for idx, sgRNA in enumerate(re.finditer(pam_regex, target_seq)):
        sgRNA_seq = sgRNA.group()
        sgRNA_seq_html = str("<span style='font-weight:900'>" + sgRNA_seq + '</span>' + '</br>' + '|' * len(sgRNA_seq) + '</br>' + Seq(sgRNA_seq).complement())
        sgRNA_id = 'Guide_' + str(idx)
        sgRNA_GC = str('{:.2f}'.format((sgRNA_seq.count('C') + sgRNA_seq.count('G')) / len(sgRNA_seq) * 100)) + '%'
        sgRNA_position_start = target_start + sgRNA.start()
        sgRNA_position_end = target_start + sgRNA.end() - 1
        sgRNA_position = str(target_seqid) + ':' + str(sgRNA_position_start)
        sgRNA_family, sgRNA_type = ontarget_apply()
        sgRNA_seqrecord = SeqRecord(Seq(sgRNA_seq), sgRNA_id, '', '')
        sgRNA_seqrecords.append(sgRNA_seqrecord)
        sgRNA_dataframe.loc[idx] = [sgRNA_id, sgRNA_position, "5'------3'", sgRNA_seq, sgRNA_seq_html, sgRNA_GC, sgRNA_family, sgRNA_type]
    sgRNA_reverse_seqrecords = []
    sgRNA_reverse_dataframe = pd.DataFrame(columns=['sgRNA_id', 'sgRNA_position', 'sgRNA_strand', 'sgRNA_seq', 'sgRNA_seq_html', 'sgRNA_GC', 'sgRNA_family', 'sgRNA_type'])
    for idx, sgRNA_reverse in enumerate(re.finditer(pam_regex, target_seq_reverse)):
        sgRNA_reverse_seq = sgRNA_reverse.group()
        sgRNA_reverse_seq_html = str(Seq(sgRNA_reverse_seq).complement()[::-1] + '</br>' + '|' * len(sgRNA_reverse_seq) + '</br>' + "<span style='font-weight:900'>" + sgRNA_reverse_seq[::-1] + '</span>')
        sgRNA_reverse_id = 'Guide_reverse_' + str(idx)
        sgRNA_reverse_GC = str('{:.2f}'.format((sgRNA_reverse_seq.count('C') + sgRNA_reverse_seq.count('G')) / len(sgRNA_reverse_seq) * 100)) + '%'
        sgRNA_reverse_position_end = target_end - sgRNA_reverse.start() - 1
        sgRNA_reverse_position_start = target_end - sgRNA_reverse.end()
        sgRNA_reverse_position = target_seqid + ':' + str(sgRNA_reverse_position_end)
        sgRNA_reverse_family, sgRNA_reverse_type = ontarget_apply()
        sgRNA_reverse_seqrecord = SeqRecord(Seq(sgRNA_reverse_seq), sgRNA_reverse_id, '', '')
        sgRNA_reverse_seqrecords.append(sgRNA_reverse_seqrecord)
        sgRNA_reverse_dataframe.loc[idx] = [sgRNA_reverse_id, sgRNA_reverse_position, "3'------5'", sgRNA_reverse_seq, sgRNA_reverse_seq_html, sgRNA_reverse_GC, sgRNA_reverse_family, sgRNA_reverse_type]
    sgRNA_dataframe = pd.concat([sgRNA_dataframe, sgRNA_reverse_dataframe])
    sgRNA_dataframe.reset_index(inplace=True, drop=True)
    sgRNA_json = sgRNA_dataframe.to_json(orient='records')
    json_handle = json.loads(sgRNA_json)
    json_handle = {'total': len(json_handle), 'rows': json_handle}
    with open('{}/Guide.json'.format(task_path), 'w') as file_handle:
        json.dump(json_handle, file_handle)
    SeqIO.write(sgRNA_seqrecords + sgRNA_reverse_seqrecords, '{}/Guide.fasta'.format(task_path), 'fasta')
    return sgRNA_dataframe, sgRNA_json


def target_to_ontarget(name_db, target_seqid, target_start, target_end):
    base_path = f"data/processed_annotation_files/{name_db}"
    gff_path = f"{base_path}.processed.gff3"
    pickle_path = f"{base_path}.processed.gff3.pkl"
    gff_bed = pybedtools.BedTool(gff_path)
    target_bed = pybedtools.BedTool(f"{target_seqid}\t{target_start}\t{target_end}\t.\t.\t+", from_string=True)
    overlaps = gff_bed.intersect(target_bed, wa=True, u=True)
    df = pd.read_pickle(pickle_path)
    family_records = pd.DataFrame()
    for feature in overlaps:
        matches = df[(df['seqid'] == feature.chrom) & (df['start'] == int(feature.start) + 1) & (df['end'] == int(feature.end))]
        family_records = pd.concat([family_records, matches], ignore_index=True)
    return family_records


def sequence_and_position_to_target_seq(name_db, fasta_sequence_position, spacer_length):
    with pysam.FastaFile(f"./data/genome_files/{name_db}.fa") as genome_handle:
        seqid = fasta_sequence_position['seqid']
        start = fasta_sequence_position['start']
        end = fasta_sequence_position['end']
        chromosome_length = genome_handle.get_reference_length(seqid)
        target_start = max(start - spacer_length, 1)
        target_end = min(end + spacer_length, chromosome_length)
        print(f'seqid: {seqid}, target_start: {target_start}, target_end: {target_end}')
        target_seq = genome_handle.fetch(seqid, target_start, target_end)
        target_seq_reverse = str(Seq(target_seq).reverse_complement())
    return target_start, target_end, target_seq, target_seq_reverse


def create_regex_patterns(pam, spacerLength, sgRNAModule='spacerpam'):
    pam_regex = ''.join(IUPAC_dict[nuc] for nuc in pam if nuc in IUPAC_dict)
    if sgRNAModule == 'spacerpam':
        return rf'\w{{{spacerLength}}}{pam_regex}'
    elif sgRNAModule == 'pamspacer':
        return rf'{pam_regex}\w{{{spacerLength}}}'


def input_sequence_to_fasta_sequence_position(inputSequence):
    import re
    input_type = {"locus": None, "position": None, "seq": None}
    normalized_seq = inputSequence.replace('\r\n', '\n').replace('\r', '\n')
    if re.search(r'^[\w.-]+:\d+-\d+$', inputSequence):
        input_type['position'] = inputSequence
    elif re.fullmatch(r'(>[^\n]*\n)?[ACGT\n]+', normalized_seq, re.IGNORECASE):
        input_type['seq'] = inputSequence
    else:
        input_type['locus'] = inputSequence
    return input_type


def input_type_to_sequence_and_position(input_type, name_db, task_id):
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
        "-db", f"data/genome_files/{name_db}.fa",
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
                start = int(first_record[8])
                end = int(first_record[9])
                blastnfmt6_100_dict = {'seqid': seqid, 'start': start, 'end': end}
                sequence = str(next(SeqIO.parse(f'{task_path}/{task_id}.fasta', 'fasta')).seq)
                return sequence, blastnfmt6_100_dict
            else:
                return 0, 1
    if input_type['position']:
        seqid, position_range = input_type['position'].split(':')
        start, end = position_range.split('-')
        start, end = int(start), int(end)
        sequence = pysam.FastaFile(f'data/genome_files/{name_db}.fa').fetch(seqid, start, end)
        blastnfmt6_100_dict = {'seqid': seqid, 'start': start, 'end': end}
        return sequence, blastnfmt6_100_dict
    if input_type['locus']:
        genome_handle = pysam.FastaFile(f"./data/genome_files/{name_db}.fa")
        gff_pandas = pd.read_pickle(f"./data/processed_annotation_files/{name_db}.processed.gff3.pkl")
        locus = gff_pandas.loc[gff_pandas['ID'] == input_type['locus'], ['seqid', 'start', 'end']].iloc[0].tolist()
        seqid, start, end = locus[0], int(locus[1]), int(locus[2])
        return genome_handle.fetch(seqid, start, end), {"seqid": seqid, "start": start, "end": end}

    return 0, 1


@shared_task
def cas9_task_process(task_id, inputSequence, pam, spacerLength, sgRNAModule, name_db):

    if result_cas9_list.objects.filter(task_id=task_id).exists():
        form2Database(task_id, inputSequence, pam, spacerLength, sgRNAModule, name_db)
        return 0
    else:
        form2Database(task_id, inputSequence, pam, spacerLength, sgRNAModule, name_db)
        return 0