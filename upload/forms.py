from django import forms
from django.core.exceptions import ValidationError
from cas9.models import genome_gff_data


class FileUploadForm(forms.ModelForm):
    class Meta:
        model = genome_gff_data
        fields = ['genome_file', 'annotation_file']
    def format_validation(self):
        genome_file = self.cleaned_data.get('genome_file')
        annotation_file = self.cleaned_data.get('annotation_file')

        if genome_file.name.rsplit('.', 1)[0] != annotation_file.name.rsplit('.', 1)[0]:
            raise ValidationError("Prefix of genome and gff file should be same. e.g: Gossypium_hirsutum_Jin668_HZAU.fasta, Gossypium_hirsutum_Jin668_HZAU.gff3")
        if not genome_file.name.endwith('.fasta'):
            raise ValidationError('Genome file should be end with ".fasta"')
        if not annotation_file.name.endwith('.gff3'):
            raise ValidationError('Annotation file should be end with ".gff3"')
        
        