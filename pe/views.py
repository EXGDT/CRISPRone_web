from ast import parse
from cgi import print_form
from distutils.log import error
from fcntl import DN_DELETE
from django.shortcuts import render
from django.contrib import messages
import re, sys, uuid
import subprocess
import textwrap
import json, os, string
from Bio.Seq import Seq
import pandas as pd

# Create your views here.


#####################################################################################
binDir = ""
scriptDir = ""
contactEmail = ""
OUTPUTPATH = "/disk2/users/cbiweb/html/CRISPRone/pe/OUTPUT/"
GENOMEPATH = "/disk2/users/cbiweb/html/CRISPRone/data/"
pe_vector_seq_left_arm = "cttgtacaaagtggttgataacagcgactacaaggatgatgtcggcagaggcatcttgaacgatagcctttcctttatcgcaatgatggcatttgtaggtgccaccttccttttctactgtccttttgatgaagtgacagatagctgggcaatggaatccgaggaggtttcccgatattaccctttgttgaaaagtctca"
pe_vector_seq_right_arm = "gttttagagctagaaatagcaaaaggctagtccgtttttagcgcgtgcatgcctgcaggtccacaaattcgggtcaaggcggaagccagcgcgccaccccacgtcagcaaatacggaggcgcggggttgacggcgtcacccggtcTTCTCCATCTGGAGGATCACCCAAAAAGAAGCGTAAAGTTtaagaattcgcggccgcactcgagatatctagacccagcttt"
### pegLIT
pe_scaffold_seq = "GTTTTAGAGCTAGAAATAGCAAGTTAAAATAAGGCTAGTCCGTTATCAACTTGAAAAAGTGGCACCGAGTCGGTGC"
# https://peglit.liugroup.us/
tevopreQ1_seq = "CGCGGTTCTATCTAGTTACGCGTTAAACCAACTAGAA"
mpknot_seq = "GGGTCAGGAGCCCCCCCCCTGAACCCAGGATAACCCTCAAAGTCGGGGGGCAACCC"
errmes_noPAM = '''
    <p><strong><i class="fas fa-exclamation-triangle"></i> No sgRNA with PAM (NGG) find near the mutation site based on selected parameters (PAM, PBS and RT length, PBS Tm) for pegRNAs Design.</strong></p>
    <p><strong><i class="fas fa-book"></i> Please change the mutation site or parameters or try <a href="#" class="alert-link">another CRISPR System <i class="fas fa-external-link-alt"></i></a> !!!</strong></p>
     '''
errmes_mutation = '''
    <p><strong><i class="fas fa-exclamation-triangle"></i> Error: The mutation sequence is longer than length of seted RT template.</strong></p>
     '''

vseq = '''
<script>
  window.seqviz
    .Viewer("peVector", {
      name: "PE_Vector_HZAU",
      //file: "D:/google_downlound/snippet/PEBP.dna",
      seq: "ATGTTGGTCATTGCATGGAATGAAGTCATAATTTGTATTGGTTGCCCCATGGAAGACCACACTTTTGCTGTTGGTCAGGAGTTCCCTGATGTCAAGGCCTTCCGTAATGCTATTAAGGAAGCTGCCATTGCACAGCACTTTGAGCTGCGTATTATAAAGAGTGACCTTATCCGTTACTTTGCCAAGTGCGCCACAGAAGGATGTCCATGGCGTATTCGTGCAGTTAAGCTTCCCAATTCTCCAACTTTCACAATTAGAAGTCTTGAAGGAGCACATACTTGTGGGAAAAATGCACAAAATGGACACCATCAAGCTTCTGTGGATTGGATTGTGAGTTTTATAGAGGAACGACTACGGGATAACATCAATTACAAGCCAAAGGATATATTGCATGACATTCATAAACAATATGGGATCATCATACCATACAAGCAAGCTTGGCGTGCAAAGGAACGGGGACTTGCTGCTATTTATGGCTCTTCAGAAGAAGGATACTGCATGCTTCCCACATTTTGTGAGGAAATAAAGAAAACAAACCCTGGAAGTATTGCAGAGTTATTCACCACTGGTGCAGATAACCGTTTCCAGCGGCTATTTGTTTCCTTTCATGCATCCATATGTGGATTCTTGAGTGGATGCTTGCCTATTGTTGGGCTTGGTGGAATCCAGCTTAAAAGCAAATACCTCGGTACTTTGCTTTCAGCAACTGCTTTTGATGCTGATGGTGGTTTATTTCCTCTTGCATTTGGCGTTGTTGATACAGAAAATGATGATAGCTGGATCTGGTTCTTATCAGAGTTGCATAAGGCTTTGGAGATTGAGAAAATGCCACAGCTCACTTTTCTATCAGATGGTCAAAAAGGCACTTTAGATGCAATAAGGAGAAAGTTCCCAAATTCTTGTCATGCCTTTTGCGAATTCATGAGCTATCTTAGTGAAAGCATTAGCAAAGAGTTCAAGAACTCAAGGCTTTTCCATCTTCTCTGGAAAGCTGCATATGCTACAACTACGACTGTTTTTAAAGAGAAAATGGCTGAAATAGAGGAGGCTTCTCCTGAAGCTGCAAAGTGGATACAGAAATTTCCACCTTCCCGCTGGGCATTGTTGTATTTCGAAGGGACACGTTATGGGCACCTCTCATCCAACATTGAGGAATTTAATCGGTGGATTCTTGATGCTTTAGAGTTACCCATAATACAGGTGGTTGAGCAAATTCACAACAAATTGATGTCTGAGTTTGAGGACCGTCGAACTAGAAGTCATTCTTGGTTTTCTGTACTAGCCCCTAGTGCTGAGACACGCATGCAAGAAGTTATCAGCCGTGCATCAACATATCAAGTTCTGCGGTCAGATGAAGTAGAATTTGAGGTTATATCAGCTGAACGATCAGACATTGTGAATATTGGGAAACACTCTTGTTCATGTCGTGATTGGCAACTTTATGGAATACCTTGTGCACTTGCTGCGGCAGCAATCATGTCATGCCGAAAAGATGTATATGCTTTCGCAGAGAAATGCTTTACAGTTGACAAGAAGTACAGCATCGGCCTGGACATCGGCACCAACTCTGTGGGCTGGGCCGTGATCACCGACGAGTACAAGGTGCCCAGCAAGAAATTCAAGGTGCTGGGCAACACCGACCGGCACAGCATCAAGAAGAACCTGATCGGAGCCCTGCTGTTCGACAGCGGCGAAACAGCCGAGGCCACCCGGCTGAAGAGAACCGCCAGAAGAAGATACACCAGACGGAAGAACCGGATCTGCTATCTGCAAGAGATCTTCAGCAACGAGATGGCCAAGGTGGACGACAGCTTCTTCCACAGACTGGAAGAGTCCTTCCTGGTGGAAGAGGATAAGAAGCACGAGCGGCACCCCATCTTCGGCAACATCGTGGACGAGGTGGCCTACCACGAGAAGTACCCCACCATCTACCACCTGAGAAAGAAACTGGTGGACAGCACCGACAAGGCCGACCTGCGGCTGATCTATCTGGCCCTGGC",
      showIndex: true,
      annotations: [
                        { start: 100, end: 600, name: "nCas9", direction: -1, color: "#9DEAED" },
                        { start: 700, end: 900, name: "Ubi promoter", direction: -1, color: "#8FDE8C" },
                        { start: 1000, end: 1050, name: "Spacer sequence", direction: -1, color: "#8CDEBD" },
                        { start: 1050, end: 1100, name: "Scaffold sequence", direction: -1, color: "#FAA887" },
                        { start: 1100, end: 1200, name: "RTT sequence", direction: -1, color: "#C59CFF" },
                        { start: 1200, end: 1300, name: "PBS sequence", direction: -1, color: "#F7C672" },
                        { start: 1300, end: 1400, name: "pegLIT Linker sequence", direction: -1, color: "#F07F7F" },
                        { start: 1400, end: 1500, name: "RNA motifs", direction: -1, color: "#F099F7" },
                        { start: 1500, end: 1600, name: "U6-7", direction: -1, color: "#6B81FF" }
                    ],
      translations: [
                      { start: 100, end: 600, direction: 1 }, // [0, 90]
                    ],
      enzymes: ["PstI", "EcoRI"],
      zoom: { linear: 50, circular: 0 },
      highlightedRegions: [
                        { start: 100, end: 600, color: "#9DEAED" },
                        { start: 700, end: 900, color: "#8FDE8C" },
                        { start: 1000, end: 1100, color: "#8CDEBD" }, //Spacer sequence
                        { start: 1050, end: 1100, color: "#FAA887" },
                        { start: 1100, end: 1200, color: "#C59CFF" }, //RTT sequence
                        { start: 1200, end: 1300, color: "#F7C672" }, //PBS sequence
                        { start: 1300, end: 1400, color: "#F07F7F" }, //pegLIT Linker sequence
                        { start: 1400, end: 1500, color: "#F099F7" },  //RNA motifs
                        { start: 1500, end: 1600, color: "#6B81FF" }
                    ],
      style: { height: "80vh", width: "68vw" }
    })
    .render();
</script>
'''
#####################################################################################

def pe_submit(request):
    if request.method == "POST":
        input_parameters_results = {}
        # 1. 通过div的name来获取所有表单的变量值
        # inputSequence
        inputSequence = request.POST.get('inputSequence').strip().upper()
        if inputSequenceCheck(inputSequence):
            input_parameters_results['inputSequence'] = '<br>'.join(textwrap.wrap(''.join(inputSequence), 100))
            input_parameters_results['refSequence'] = inputSequenceParse(inputSequence)[0]
            input_parameters_results['editSequence'] =  inputSequenceParse(inputSequence)[1]
        else:
            errmes = '<p><strong><i class="fas fa-exclamation-triangle"></i> Error: Input sequence contains a character not in the following list: [A, T, C, G, (, ), +, -, /].</strong></p>'
            messages.add_message(request, messages.WARNING, errmes)
        # mutationType
        if "/" in inputSequence and "-" in inputSequence and "+" in inputSequence:
            mutationType = "Substitution & Insertion & Deletion"
        elif "/" in inputSequence and "+" in inputSequence:
            mutationType = "Substitution & Insertion"
        elif "/" in inputSequence and "-" in inputSequence:
            mutationType = "Substitution & Deletion"
        elif "-" in inputSequence and "+" in inputSequence:
            mutationType = "Insertion & Deletion"
        elif "+" in inputSequence:
            mutationType = "Insertion"
        elif "-" in inputSequence:
            mutationType = "Deletion"
        elif "/" in inputSequence:
            mutationType = "Substitution"
        else:
            mutationType = ""
            errmes = '<p><strong><i class="fas fa-exclamation-triangle"></i> Error: No mutation site find. The format should be ATCG(A/T)GGG! Please try a example.</strong> <i class="fas fa-level-up-alt"></i></p>'
            messages.add_message(request, messages.WARNING, errmes)
        # PAM
        pamType1 = request.POST.get('pamType')
        pamType2 = request.POST.get('customizedPAM')
        if pamType1 == "xxx" and not pamType2.strip().upper():
            input_parameters_results['pamType'] = "Not PAM"
            errmes = '<p><strong><i class="fas fa-exclamation-triangle"></i> Error: Not PAM.</strong> <i class="fas fa-level-up-alt"></i></p>'
            messages.add_message(request, messages.WARNING, errmes)
        elif pamType1 == "xxx" and not not pamType2.strip().upper():
            input_parameters_results['pamType'] = pamType2.strip().upper()
        # elif pamType1 != "xxx" and not not (pamType2 or "").strip().upper():
        #     input_parameters_results['pamType'] = "Error: Only one PAM is need. Select or Customized."
        #     errmes = '<p><strong><i class="fas fa-exclamation-triangle"></i> Error: Only one PAM is need. Select or Customized.</strong> <i class="fas fa-level-up-alt"></i></p>'
        #     messages.add_message(request, messages.WARNING, errmes)
        else:
            input_parameters_results['pamType'] = pamType1
        targetGenome = request.POST.get('targetGenome')
        cutDistance = request.POST.get('cutDistance')
        spacerLength = request.POST.get('spacerLength')
        spacerGCmin = request.POST.get('spacerGCmin')
        spacerGCmax = request.POST.get('spacerGCmax')
        pbsLengthmin = request.POST.get('pbsLengthmin')
        pbsLengthmax = request.POST.get('pbsLengthmax')
        pbsGCmin = request.POST.get('pbsGCmin')
        pbsGCmax = request.POST.get('pbsGCmax')
        pbsTmmin = request.POST.get('pbsTmmin')
        pbsTmmax = request.POST.get('pbsTmmax')
        rtLengthmin = request.POST.get('rtLengthmin')
        rtLengthmax = request.POST.get('rtLengthmax')
        ngRNAspacers = request.POST.getlist('ngRNAspacers')
        ngRNAmin = request.POST.get('ngRNAmin')
        ngRNAmax = request.POST.get('ngRNAmax')
        pegLIT = request.POST.getlist('pegLIT')
        linkerPattern = request.POST.get('linkerPattern').strip().upper()
        motifsRNA = request.POST.get('motifsRNA')
        excludeFirstCRT = request.POST.getlist('excludeFirstCRT')
        dualpegRNA = request.POST.getlist('dualpegRNA')
        ########
        input_parameters_results['mutationType'] = mutationType
        input_parameters_results['targetGenome'] = targetGenome
        input_parameters_results['cutDistance'] = cutDistance
        input_parameters_results['spacerLength'] = spacerLength
        input_parameters_results['spacerGC'] = spacerGCmin + "-" + spacerGCmax
        input_parameters_results['pbsLength'] = pbsLengthmin + "-" + pbsLengthmax
        input_parameters_results['pbsGC'] = pbsGCmin + "-" + pbsGCmax
        input_parameters_results['pbsTm'] = pbsTmmin + "-" + pbsTmmax
        input_parameters_results['rtLength'] = rtLengthmin + "-" + rtLengthmax
        input_parameters_results['ngRNAspacers'] = ngRNAspacers[0]
        input_parameters_results['ngRNA'] = ngRNAmin + "-" + ngRNAmax
        input_parameters_results['pegLIT'] = pegLIT[0]
        input_parameters_results['linkerPattern'] = linkerPattern
        input_parameters_results['motifsRNA'] = motifsRNA
        input_parameters_results['excludeFirstCRT'] = excludeFirstCRT[0]
        input_parameters_results['dualpegRNA'] = dualpegRNA[0]
        input_parameters_results['pe_vector'] = pe_vector_seq_left_arm
        # 2. 根际设定参数查找合适的pegRNA
        pegRNAs = find_and_check_pegRNA(inputSequence, input_parameters_results['pamType'], cutDistance, spacerLength, [spacerGCmin, spacerGCmax], targetGenome, [rtLengthmin, rtLengthmax], [pbsLengthmin, pbsLengthmax], [pbsGCmin, pbsGCmax], [pbsTmmin, pbsTmmax], excludeFirstCRT, [ngRNAmin, ngRNAmax], linkerPattern, motifsRNA)
        input_parameters_results['pegRNAspacersJS'] = pegRNAs[0]
        input_parameters_results['pegRNAs_seq_Seqviz_Viewer'] = vseq
        messages.add_message(request, messages.WARNING, pegRNAs[1])
        return render(request, 'pe/result.html', input_parameters_results)
    else:
        return render(request, 'pe/submit.html')


#####################################################################################
########################################### My def ##################################
#####################################################################################
def error_messages(error_list):
    """
    输入的error是list
    """
    error_list_html = []
    for errmes in error_list:
        if "ERROR" in errmes:
            errmes_html = '<p><strong><i class="fas fa-exclamation-triangle"></i>' + errmes + '</strong> <i class="fas fa-level-up-alt"></i></p>'
        else:
            errmes_html = '<p><strong><i class="fas fa-book"></i>' + errmes + '</strong></p>'
        error_list_html.append(errmes_html)
    return error_list_html


def inputSequenceCheck(sequence):
    dna = set('ACTG+-/()')
    return all(base.upper() in dna for base in sequence)


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


def gc_content(sequence):
    """" GC content in a DNA sequence """
    return round((sequence.count('C') + sequence.count('G')) / len(sequence) * 100)


def seq_Tm(sequence):
    """"
    Calculate DNA Melting Temperature 
    https://onestopdataanalysis.com/calculate-melting-temperature/
    """
    from Bio.SeqUtils import MeltingTemp
    return int(MeltingTemp.Tm_GC(sequence))


def pe_sequence_pegLIT(pegRNA_seq, pe_scaffold_seq, pbs_seq, rt_seq, linker_pattern, motifs_RNA):
    """
    https://peglit.liugroup.us/installation
    https://github.com/sshen8/peglit
    运行速度挺慢的
    输出为有最高值的linker序列, peglit.score对应计算选定linker时PBS, spacer, template, and scaffold 的得分值 (0到1之间, 越高越好)
    
    import peglit
    if motifs_RNA == "tevopreQ1":
        motifs_RNA_seq = tevopreQ1_seq
    elif motifs_RNA == "mpknot":
        motifs_RNA_seq = mpknot_seq
    linker = peglit.pegLIT(seq_spacer = pegRNA_seq, seq_scaffold = pe_scaffold_seq, seq_template = rt_seq, seq_pbs = pbs_seq, seq_motif = motifs_RNA_seq, linker_pattern = linker_pattern)
    subscores = peglit.score(eq_spacer = pegRNA_seq, seq_scaffold = pe_scaffold_seq, seq_template = rt_seq, seq_pbs = pbs_seq, seq_linker = linker)
    return linker, subscores
    """
    return "xzp1", "xzp2"


def pd2json2_fix_header(pd_df):
    """
    输出结果用于https://www.datatables.net/examples/index 可视化
    https://appdividend.com/2022/03/15/pandas-to_json/
    """
    data_json = pd_df.to_json(orient="records")
    return data_json


def sgRNA_on_off_target(sgRNA, genome):
    """"
    Calculate DNA Melting Temperature 
    https://onestopdataanalysis.com/calculate-melting-temperature/
    sgRNA需包括PAM序列
    https://github.com/ChenRui-TAAS/sgRNA-specificity-calculation-for-CRISPR-Cas9
    https://code.google.com/archive/p/batmis/wikis/User_Manual.wiki
    基因组必须用 BatMis 的子命令 build_index 建立索引
    输出sgRNA的脱靶位点详细信息和mismatch对应数量统计(字典的形式)
    
    identifer = str(uuid.uuid1())
    sgRNA_fa = OUTPUTPATH + identifer + ".fa"
    sgRNA_fa_edit = open(sgRNA_fa, "w")
    sgRNA_fa_edit.write('>sgRNA\n' + sgRNA)
    sgRNA_fa_edit.close()
    hitsfile = OUTPUTPATH + identifer
    hitsfile_sam = OUTPUTPATH + identifer + ".sam"
    hitsfile_txt = OUTPUTPATH + identifer + ".txt"
    if genome == "Ghirsutum_HZAU_v1.1":
        genome_file = GENOMEPATH + "Gossypium_hirsutum_genome.fasta"
    # 1. 运行batman找到sgRNA的给定错配数下全基因组hit结果
    batman_cmd = "batman -g " + genome_file + " -q " + sgRNA_fa + " -o " + hitsfile + " -n 5 -mall; batdecode -g " + genome_file + " -i " + hitsfile + " -o " + hitsfile_sam + "; cat " + hitsfile_sam + " | \grep -v '@' | awk -F\"\\t\" 'BEGIN{OFS=\"\\t\"; print\"sgRNA\\tChr\\tStart\\tmismatch\"} {print $10,$3,$4,$12}' | sed 's/NM:i://g' > " + hitsfile_txt
    batman_Process = subprocess.Popen(batman_cmd, shell=True,  stdout=subprocess.PIPE)
    #hits = batman_Process.stdout.read()
    batman_Process.wait()
    # 2. 解析hit结果
    if batman_Process.returncode != 0:
        print("Could not run '%s'. Return code %s" % (batman_cmd, str(batman_Process.returncode)))
        print ("please send us an email, we will fix this error as quickly as possible. %s " % contactEmail)
        #sys.exit(0)
    else:
        import pandas as pd
        sgRNA_off_target_df = pd.read_table(hitsfile_txt)
        mismatch_count_dict = sgRNA_off_target_df['mismatch'].value_counts().to_dict()
    os.remove(sgRNA_fa)
    os.remove(hitsfile)
    os.remove(hitsfile_sam)
    return sgRNA_off_target_df, mismatch_count_dict
    """
    return "a", "b"


def find_PAM_range(sequence, strand, cutDistance, rtLength):
    errmes_info = []
    # 1. 先根据 RT 长度, 切割位点 (选定PAM后其实切割位点是固定的) 以及突变位点长度确定PAM可以存在的坐标区间
    if strand == "+":
        ## 正链突变起始位点(+ATCG), 即 ( 出现位置
        mutation = re.search(r"\([A-Z+-/]+\)", sequence)
    elif strand == "-":
        ## 负链突变起始位点, 负链时正链的序列反向互补，所以对应的突变起始位点(+ATCG), 即 ) 出现位置
        mutation = re.search(r"\)[A-Z+-/]+\(", sequence)
    else:
        errmes = "Error: Only '+' or '-' can be set for strand !!!"
        errmes_info.append(errmes)
    if "/" in sequence:
        mutation_seq = re.sub(r'[+-/()]','',mutation[0])
        mutation_len = len(mutation_seq)/2
    else:
        mutation_seq = re.sub(r'[+-/()]','',mutation[0])
        mutation_len = len(mutation_seq)
    if int(mutation_len) > int(max(rtLength[0],rtLength[1])):
        errmes = errmes_mutation
        errmes_info.append(errmes)
    mutation_start = int(mutation.start())
    # pam_min_start, pam_min_end, pam_max_start 和 pam_max_end 位置都对应的是找到的PAM的起始位置, 即 NGG 中 N 的位置
    pam_min_start = mutation.start() - int(rtLength[0]) + abs(int(cutDistance))
    pam_min_end = mutation_start + abs(int(cutDistance))
    pam_max_start = mutation.start() - int(rtLength[1]) + abs(int(cutDistance))
    pam_max_end = int(mutation_start) + abs(int(cutDistance))
    pam_start = min(pam_min_start, pam_max_start)
    pam_end = max(pam_min_end, pam_max_end)
    return mutation_start, pam_start, pam_end, errmes_info


def find_ngRNA_spacers(pegRNA, sequence, spacerLength, mypam, ngRNA_pam_start, ngRNA_pam_end, strand, pegRNA_start, genome):
    """
    ngRNA 与 pegRNA 需满足: 在pegRNA所在链的互补链, 且距离pegRNA切口处40-90bp范围内, 其中 50bp 最佳
    """
    ngRNAs_option = {}
    if mypam == "NGG":
        # 20bp+NGG
        mypam = r'[ATCG]GG'
    elif mypam == "NG":
        # 20bp+NG
        mypam = r'[ATCG]G'
    # 20bp+NGG
    pamSites = re.finditer(mypam, sequence)
    for site in pamSites:
        # PAM距离序列起始不足20bp 或 PAM 起点不在上述确定的 PAM 范围内
        if int(site.start()) - int(spacerLength) < 0 or int(site.start()) < ngRNA_pam_start or int(site.start()) > ngRNA_pam_end:
            pass
        else:
            sgRNA_start = int(site.start()) - int(spacerLength)
            sgRNA_end = int(site.end()) - 3
            pam_seq = site[0]
            sgRNA_seq = sequence[sgRNA_start:sgRNA_end]
            ngRNAs_option["pegRNA_spacer_sequence"] = pegRNA
            ngRNAs_option["ngRNAs_spacer_sequence"] = sgRNA_seq
            ngRNAs_option["ngRNAs_pam"] = pam_seq
            ngRNAs_option["ngRNAs_strand"] = strand
            ngRNAs_option["ngRNAs_start"] = site.start()
            ngRNAs_option["ngRNAs_nickTopegDistance"] = (len(sequence) - pegRNA_start + 1) - int(site.start())
            ngRNAs_option["ngRNAs_spacerGCcontent"] = gc_content(sgRNA_seq)
            ngRNAs_option["ngRNAs_OffTarget"] = sgRNA_on_off_target(sgRNA_seq + pam_seq, genome)[1]
    if bool(ngRNAs_option): # 判断字典是否为空
        ngRNAs_option_df = pd.DataFrame([ngRNAs_option])
    else:
        ngRNAs_option_df = None
    return ngRNAs_option_df


def pe_sequence_spacers_Seqviz_Viewer(allseq, annotations, highlightedRegions):
    """
    完整的PE序列, 包括pegRNA, PBS, RT, motifs_RNA等
    可以在载体图中展示和标注: https://github.com/Lattice-Automation/seqviz
    """
    seqviz_Viewer_Template = '''   
            <script>
                window.seqviz
                .Viewer("peVector", {
                    name: "PE_Vector_HZAU",
                    seq: %s,
                    showIndex: true,
                    annotations: %s,
                    enzymes: ["PstI", "EcoRI"],
                    zoom: { linear: 50, circular: 0 },
                    bpColors: { "A": "#FF0000", "T": "blue", 12: "#00FFFF" },
                    highlightedRegions: %s,
                    style: { height: "80vh", width: "68vw" }
                })
                .render();
            </script>
       ''' % (allseq, annotations, highlightedRegions)
    return seqviz_Viewer_Template


def pe_sequence_spacers_Seqviz_Viewer_annotations(spacerLength, rtLength, pbsLength, pegLITLinkerSeq, motifs_RNA):
    annotations = '''
                    [
                        { start: 300, end: 1500, name: "Cas9", direction: -1, color: "#FAA887" },
                        { start: 1800, end: 2000, name: "Ubi promoter", direction: -1, color: "#9DEAED" },
                        { start: %s, end: %s, name: "Spacer sequence", direction: -1, color: "#8FDE8C" },
                        { start: %s, end: %s, name: "RTT sequence", direction: -1, color: "#CFF283" },
                        { start: %s, end: %s, name: "PBS sequence", direction: -1, color: "#8CDEBD" },
                        { start: %s, end: %s, name: "pegLIT Linker sequence", direction: -1, color: "#F0A3CE" },
                        { start: %s, end: %s, name: "RNA motifs", direction: -1, color: "#F7C672" }
                    ]
        ''' % (len(pe_vector_seq_left_arm), len(pe_vector_seq_left_arm) + int(spacerLength), 
               len(pe_vector_seq_left_arm) + int(spacerLength), len(pe_vector_seq_left_arm) + int(spacerLength) + int(rtLength),
               len(pe_vector_seq_left_arm) + int(spacerLength) + int(rtLength), len(pe_vector_seq_left_arm) + int(spacerLength) + int(rtLength) + int(pbsLength),
               len(pe_vector_seq_left_arm) + int(spacerLength) + int(rtLength) + int(pbsLength), len(pe_vector_seq_left_arm) + int(spacerLength) + int(rtLength) + int(pbsLength) + len(pegLITLinkerSeq),
               len(pe_vector_seq_left_arm) + int(spacerLength) + int(rtLength) + int(pbsLength) + len(pegLITLinkerSeq), len(pe_vector_seq_left_arm) + int(spacerLength) + int(rtLength) + int(pbsLength) + len(pegLITLinkerSeq) + len(motifs_RNA))
    return annotations


def pe_sequence_spacers_Seqviz_Viewer_highlightedRegions(spacerLength, rtLength, pbsLength, pegLITLinkerSeq, motifs_RNA):
    highlightedRegions = '''
                    [
                        { start: %s, end: %s, color: "#8FDE8C" }, //Spacer sequence
                        { start: %s, end: %s, color: "#CFF283" }, //RTT sequence
                        { start: %s, end: %s, color: "#8CDEBD" }, //PBS sequence
                        { start: %s, end: %s, color: "#F0A3CE" }, //pegLIT Linker sequence
                        { start: %s, end: %s, color: "#F7C672" }  //RNA motifs
                    ]
        ''' % (len(pe_vector_seq_left_arm), len(pe_vector_seq_left_arm) + int(spacerLength), 
               len(pe_vector_seq_left_arm) + int(spacerLength), len(pe_vector_seq_left_arm) + int(spacerLength) + int(rtLength),
               len(pe_vector_seq_left_arm) + int(spacerLength) + int(rtLength), len(pe_vector_seq_left_arm) + int(spacerLength) + int(rtLength) + int(pbsLength),
               len(pe_vector_seq_left_arm) + int(spacerLength) + int(rtLength) + int(pbsLength), len(pe_vector_seq_left_arm) + int(spacerLength) + int(rtLength) + int(pbsLength) + len(pegLITLinkerSeq),
               len(pe_vector_seq_left_arm) + int(spacerLength) + int(rtLength) + int(pbsLength) + len(pegLITLinkerSeq), len(pe_vector_seq_left_arm) + int(spacerLength) + int(rtLength) + int(pbsLength) + len(pegLITLinkerSeq) + len(motifs_RNA))
    return highlightedRegions


def find_pegRNA_in_range(annotations_ref, annotations_edit, mypam, mypam_start, mypam_end, cutDistance, spacerLength, pegRNAspacerGC, strand, genome, mutation_start, rtLength, pbsLength, pbsGC, best_pbs_tm, rt_exclude_first_c, ngRNAmin, ngRNAmax):
    """
    根据 PAM 存在的起始和终止区间以及突变位点找符合特征的所有候选sgRNA
    输出是两个 dataframe
    """
    sgRNAs_option = {}
    pbs_seq_info = {}
    rt_seq_info = {}
    if mypam == "NGG":
        # 20bp+NGG
        mypam = r'[ATCG]GG'
    elif mypam == "NG":
        # 20bp+NG
        mypam = r'[ATCG]G'
    # 20bp+NGG
    mypam = r'[ATCG]GG'
    pamSites = re.finditer(mypam, annotations_ref)
    print(mypam)
    print(annotations_ref)
    for site in pamSites:
        print("ffffffffffffffffffffffffffffffffffff")
        print(site)
        # PAM距离序列起始不足20bp 或 PAM 起点不在上述确定的 PAM 范围内
        if int(site.start()) - int(spacerLength) < 0 or int(site.start()) < mypam_start or int(site.start()) > mypam_end:
            print("99999999999999999999999999999999999999")
            pass
        else:
            sgRNA_start = int(site.start()) - int(spacerLength)
            sgRNA_end = int(site.end()) - 3
            pam_seq = site[0]
            sgRNA_seq = annotations_ref[sgRNA_start:sgRNA_end]
            if gc_content(sgRNA_seq) < int(pegRNAspacerGC[0]) or gc_content(sgRNA_seq) > int(pegRNAspacerGC[1]):
                pass
            else:
                sgRNAs_option["spacer_sequence"] = sgRNA_seq
                sgRNAs_option["PAM"] = pam_seq
                sgRNAs_option["strand"] = strand
                sgRNAs_option["start"] = sgRNA_start
                sgRNAs_option["end"] = sgRNA_end
                sgRNAs_option["peg-to-edit distance"] = mutation_start - site.start()
                sgRNAs_option["spacer GC content"] = gc_content(sgRNA_seq)
                sgRNAs_option["Off Target"] = sgRNA_on_off_target(sgRNA_seq + pam_seq, genome)[1]
                print("000000000000000000000000000000000000000000000000000")
                for pbsStep in range(int(pbsLength[0]), int(pbsLength[1])):
                    pbs_end = int(site.start()) - abs(int(cutDistance))
                    pbs_start = pbs_end - int(pbsStep)
                    pbs_seq = annotations_ref[pbs_start:pbs_end]
                    pbs_seq_len = len(pbs_seq)
                    pbs_seq_gc = gc_content(pbs_seq)
                    if pbs_seq_gc < int(pbsGC[0]) or pbs_seq_gc > int(pbsGC[1]):
                        pass
                    else:
                        pbs_seq_tm = seq_Tm(pbs_seq)
                        pbs_seq_info["spacer_sequence"] = sgRNA_seq
                        pbs_seq_info["PBS_length"] = pbs_seq_len
                        pbs_seq_info["PBS_start"] = pbs_start
                        pbs_seq_info["PBS_end"] = pbs_end
                        pbs_seq_info["PBS_seq"] = pbs_seq
                        pbs_seq_info["PBS_GC_content"] = pbs_seq_gc
                        pbs_seq_info["PBS_Tm"] = pbs_seq_tm
                        if int(best_pbs_tm[0]) <= pbs_seq_tm <= int(best_pbs_tm[1]):
                            pbs_seq_info["PBS_Level"] = "Recommended"
                        else:
                            pbs_seq_info["PBS_Level"] = ""
                for rtStep in range(int(rtLength[0]), int(rtLength[1])):
                    rt_start = site.start() - abs(int(cutDistance))
                    rt_end = rt_start + int(rtStep)
                    rt_seq = annotations_edit[rt_start:rt_end]
                    if rt_exclude_first_c == "excludeFirstCRT" and rt_seq.startswith("C"):
                        pass
                    else:
                        rt_seq_len = len(rt_seq)
                        rt_seq_gc = gc_content(rt_seq)
                        rt_seq_info["spacer_sequence"] = sgRNA_seq
                        rt_seq_info["RTT_length"] = rt_seq_len
                        rt_seq_info["RTT_start"] = rt_start
                        rt_seq_info["RTT_end"] = rt_end
                        rt_seq_info["RTT_seq"] = rt_seq
                        rt_seq_info["RTT_GC_content"] = rt_seq_gc
                ## ngRNAs
                pegRNA_start = int(site.start())
                ngRNA_pam_start = len(annotations_ref) - (int(pegRNA_start) + int(ngRNAmax) + 1)
                ngRNA_pam_end = len(annotations_ref) - (int(pegRNA_start) + int(ngRNAmin) + 1)
                ngRNAs_df = find_ngRNA_spacers(sgRNA_seq, str(Seq(annotations_ref).reverse_complement()), spacerLength, mypam, ngRNA_pam_start, ngRNA_pam_end, "-", pegRNA_start, genome)
    ### 判断字典是否为空
    if bool(sgRNAs_option):
        sgRNAs_option_df = pd.DataFrame([sgRNAs_option])
        pbs_seq_info_df = pd.DataFrame([pbs_seq_info])
        rt_seq_info_df = pd.DataFrame([rt_seq_info])
        ## 交叉PBS和RT序列
        pbs_rt_df = pbs_seq_info_df.merge(rt_seq_info_df, how='cross')
    else:
        sgRNAs_option_df = pbs_rt_df = ngRNAs_df = None
    return sgRNAs_option_df, pbs_rt_df, ngRNAs_df



def find_pegRNA_in_range_both_strand(sequence, mypam, cutDistance, spacerLength, pegRNAspacerGC, genome, rtLength, pbsLength, pbsGC, best_pbs_tm, rt_exclude_first_c, ngRNA_Distance, linker_pattern, motifs_RNA):
    """
    根据 PAM 存在的起始和终止区间以及突变位点找符合特征的所有候选sgRNA
    输出是两个 dataframe
    """
    parseSeq = inputSequenceParse(sequence)
    # 正链, 此时序列形式为: ----- PBS ---- 20 bp ---- cut --- NGG ---- RT (A/T) -------
    for_annotations_ref = parseSeq[2]
    for_annotations_edit = parseSeq[3]
    for_range = find_PAM_range(sequence, "+", cutDistance, rtLength)
    for_mutation_start = for_range[0]
    for_mypam_start = for_range[1]
    for_mypam_end = for_range[2]
    for_pegRNAs = find_pegRNA_in_range(for_annotations_ref, for_annotations_edit, mypam, for_mypam_start, for_mypam_end, cutDistance, spacerLength, pegRNAspacerGC, "+", genome, for_mutation_start, rtLength, pbsLength, pbsGC, best_pbs_tm, rt_exclude_first_c, ngRNA_Distance[0], ngRNA_Distance[1])
    # 负链时对输入序列反向互补, 此时序列形式为: ----- PBS --- 20 bp --- cut ---- NGG ---- RT (A/T) ----
    rev_annotations_ref = str(Seq(parseSeq[2]).reverse_complement())
    rev_annotations_edit = str(Seq(parseSeq[3]).reverse_complement())
    rev_range = find_PAM_range(sequence[::-1], "-", cutDistance, rtLength)
    rev_mutation_start = rev_range[0]
    rev_mypam_start = rev_range[1]
    rev_mypam_end = rev_range[2]
    rev_pegRNAs = find_pegRNA_in_range(rev_annotations_ref, rev_annotations_edit, mypam, rev_mypam_start, rev_mypam_end, cutDistance, spacerLength, pegRNAspacerGC, "-", genome, rev_mutation_start, rtLength, pbsLength, pbsGC, best_pbs_tm, rt_exclude_first_c, ngRNA_Distance[0], ngRNA_Distance[1])
    ## Merge two strand
    print("111111111111111111111111111111111111111")
    print(for_pegRNAs)
    print(rev_pegRNAs)
    sgRNAs_option_df = pd.concat([for_pegRNAs[0], rev_pegRNAs[0]])
    sgRNAs_option_df.insert(0, 'id', "") # 添加空列来放 + 号, 点击后展开
    pbs_rt_df = pd.concat([for_pegRNAs[1], rev_pegRNAs[1]])
    ngRNAs_df = pd.concat([for_pegRNAs[2], rev_pegRNAs[2]])
    ### Merge sgRNAs_option and pbs_rt
    sgRNAs_option_pbs_rt_df = pd.merge(left = sgRNAs_option_df, right = pbs_rt_df, left_on = 'spacer_sequence', right_on = 'spacer_sequence_x', how = "outer").drop(['spacer_sequence_x', 'spacer_sequence_y'], axis=1)
    ### Merge sgRNAs_option and pbs_rt and ngRNA
    sgRNAs_option_pbs_rt_ngRNAs_df = pd.merge(left = sgRNAs_option_pbs_rt_df, right = ngRNAs_df, left_on = 'spacer_sequence', right_on = 'pegRNA_spacer_sequence', how = "outer").drop(['pegRNA_spacer_sequence'], axis=1)
    ### Merge sgRNAs_option and pbs_rt and ngRNA amd pegLIT
    ## pegLIT
    pegLITs = {}
    for row in sgRNAs_option_pbs_rt_df.itertuples(index=True, name='Pandas'):
        pegLIT = pe_sequence_pegLIT(row.spacer_sequence, pe_scaffold_seq, row.PBS_seq, row.RTT_seq, linker_pattern, motifs_RNA)
        pegLITs["pegRNA_spacer_sequence"] = row.spacer_sequence
        pegLITs["pegLIT_linker"] = pegLIT[0]
        pegLITs["pegLIT_linker_score"] = pegLIT[1]
        pegLITs["motifs_RNA"] = motifs_RNA
        if motifs_RNA == "tevopreQ1":
            motifs_RNA_seq = tevopreQ1_seq
        elif motifs_RNA == "mpknot":
            motifs_RNA_seq = mpknot_seq
        pegLITs["motifs_RNA_seq"] = motifs_RNA_seq
        pegLITs["pegRNAs_seq_Seqviz_Viewer_annotations"] = pe_sequence_spacers_Seqviz_Viewer_annotations(spacerLength, row.RTT_length, row.PBS_length, pegLIT[0], motifs_RNA_seq)
        pegLITs["pegRNAs_seq_Seqviz_Viewer_highlightedRegions"] = pe_sequence_spacers_Seqviz_Viewer_highlightedRegions(spacerLength, row.RTT_length, row.PBS_length, pegLIT[0], motifs_RNA_seq)
    pegLITs_df = pd.DataFrame([pegLITs])
    sgRNAs_option_pbs_rt_pegLITs_df = pd.merge(left = sgRNAs_option_pbs_rt_ngRNAs_df, right = pegLITs_df, left_on = 'spacer_sequence', right_on = 'pegRNA_spacer_sequence', how = "outer").drop(['pegRNA_spacer_sequence'], axis=1)
    sgRNAs_option_pbs_rt_pegLITs_df["pegRNAs_seq5_3"] = sgRNAs_option_pbs_rt_pegLITs_df['spacer_sequence'].astype(str) + pe_scaffold_seq + sgRNAs_option_pbs_rt_pegLITs_df['RTT_seq'].astype(str) + sgRNAs_option_pbs_rt_pegLITs_df['PBS_seq'].astype(str) + sgRNAs_option_pbs_rt_pegLITs_df['pegLIT_linker'].astype(str) + sgRNAs_option_pbs_rt_pegLITs_df['motifs_RNA_seq'].astype(str)
    ## Seqviz_Viewer
    sgRNAs_option_pbs_rt_pegLITs_df["pegRNAs_seq_Seqviz_Viewer"] = pe_sequence_spacers_Seqviz_Viewer(str(pe_vector_seq_left_arm + sgRNAs_option_pbs_rt_pegLITs_df['pegRNAs_seq5_3'].astype(str) + pe_vector_seq_right_arm), sgRNAs_option_pbs_rt_pegLITs_df['pegRNAs_seq_Seqviz_Viewer_annotations'].astype(str), sgRNAs_option_pbs_rt_pegLITs_df['pegRNAs_seq_Seqviz_Viewer_highlightedRegions'].astype(str))
    pegRNAs_df = sgRNAs_option_pbs_rt_pegLITs_df
    pegRNAs_js = pd2json2_fix_header(pegRNAs_df)
    return pegRNAs_js


def find_and_check_pegRNA(sequence, pam, cutDistance, spacerLength, pegRNAspacerGC, genome, rtLength, pbsLength, pbsGC, best_pbs_tm, rt_exclude_first_c, ngRNA_Distance, linker_pattern, motifs_RNA):
    """
    思路: 先根据突变位点确定切割位点, 再确定PAM对应的sgRNA, 当sgRNA确定后RT和PBS序列就基本固定了
    spacer sequence 就是sgRNA序列
    rtLength 和 pbsLength 是list, 一个范围, 包括最大最小值 [1,10]
    输出: 一个由找到的 sgRNA 和 PBS+RT的dataframe组成的json 和一个错误信息列表
    """
    all_errmes = []
    # 1. 先根据 RT 长度, 切割位点 (选定PAM后其实切割位点是固定的) 以及突变位点长度确定正链和负链时PAM可以存在的坐标区间
    # 2. 根据 PAM 序列找可能的 PAM 位置
    pegRNAs_option_js = find_pegRNA_in_range_both_strand(sequence, pam, cutDistance, spacerLength, pegRNAspacerGC, genome, rtLength, pbsLength, pbsGC, best_pbs_tm, rt_exclude_first_c, ngRNA_Distance, linker_pattern, motifs_RNA)
    # 3. 判断有没有合适的sgRNA位点
    if len(pegRNAs_option_js) == 0 :
        errmes = errmes_noPAM
        all_errmes.append(errmes)
    return pegRNAs_option_js, all_errmes


def pegRNA_peimer(sequence):
    """
    针对 pe_sequence_spacers 序列设计的载体构建引物
    """
    pass
