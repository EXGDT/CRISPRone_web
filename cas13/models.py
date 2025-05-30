from django.db import models

# Create your models here.

class result_cas13_list(models.Model):
    def __str__(self):
        return self.task_id
    task_id = models.CharField(max_length=64, primary_key=True)
    name_db = models.CharField(max_length=255)
    input_sequence = models.TextField()
    transcript_id = models.TextField(default="")
    spacer_length = models.PositiveSmallIntegerField()
    sgRNA_json = models.JSONField(default=dict)
    sgRNA_with_JBrowse_json = models.JSONField(default=dict)
    task_status = models.CharField(max_length=20)
    log = models.TextField(default="")