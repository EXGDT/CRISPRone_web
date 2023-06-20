from django.shortcuts import render

# Create your views here.

def baseEditor_submit(request):
    if request.method == "POST":
        form_inputs = {}
        PAM_seqs = request.POST.get('pam')
        max_mixmatch = request.POST.get('max_mismatch')
        name_db = request.POST.get('name_db')
        loc = request.POST.get('locus')
        position = request.POST.get('position')
        seq = request.POST.get('sequence')
        form_inputs['PAM_seqs'] = PAM_seqs
        form_inputs['max_mismatch'] = max_mixmatch
        form_inputs['name_db'] = name_db
        form_inputs['loc'] = loc
        form_inputs['position'] = position
        form_inputs['seq'] = seq
        return render(request, 'baseEditor/result.html', form_inputs)
    else:
        return render(request, 'baseEditor/submit.html')



#####################################################################################
########################################### My def ##################################
#####################################################################################
def sgRNA_designer(genome):
    pass

def amino_acid_examination(genome):
    '''
    氨基酸翻译, 前后是否变化, 酸碱性, pH计算
    '''
    pass

def amino_acid_examination_InDel(genome):
    pass

def baseEditor_format_df(genome):
    pass
