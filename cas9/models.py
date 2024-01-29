from django.db import models

# Create your models here.

class result_cas9_list(models.Model):
    def __str__(self):
        return self.task_id
    task_id = models.CharField(max_length=32, primary_key=True)
    pamType = models.CharField(max_length=30)
    name_db = models.CharField(max_length=255)
    inputSequence = models.TextField()
    sgRNAModule = models.CharField(max_length=20)
    spacerLength = models.PositiveSmallIntegerField()
    sgRNAJson = models.JSONField(default=dict)
    task_finished = models.BooleanField(default=False)


class genome_gff_data(models.Model):
    name_db = models.CharField(max_length=255,  primary_key=True)
    genome_file = models.FileField(upload_to='genome_files')
    annotation_file = models.FileField(upload_to='annotation_files')
    

# class result_cas9_list_sgRNAs(models.Model):
#     sgRNA_
#     sgRNA_id = models.CharField(max_length=255)
#     sgRNA_position = models.CharField(max_length=255)
#     sgRNA_strand = models.CharField(max_length=20)
#     sgRNA_seq = models.CharField(max_length=255)
#     sgRNA_seq_html = models.CharField(max_length=255)
#     sgRNA_GC = models.CharField(max_length=20)
#     sgRNA_family = models.CharField(max_length=255)
#     sgRNA_type = models.CharField(max_length=255)
