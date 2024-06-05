from django.db import models

# Create your models here.
class result_cas12a_list(models.Model):
    def __str__(self):
        return self.task_id
    task_id = models.CharField(max_length=64, primary_key=True)
    pam_type = models.CharField(max_length=30)
    name_db = models.CharField(max_length=255)
    input_sequence = models.TextField()
    sgRNA_module = models.CharField(max_length=20)
    spacer_length = models.PositiveSmallIntegerField()
    sgRNA_json = models.JSONField(default=dict)
    task_status = models.CharField(max_length=20)
    log = models.TextField(default="")

class result_cas12b_list(models.Model):
    def __str__(self):
        return self.task_id
    task_id = models.CharField(max_length=64, primary_key=True)
    pam_type = models.CharField(max_length=30)
    name_db = models.CharField(max_length=255)
    input_sequence = models.TextField()
    sgRNA_module = models.CharField(max_length=20)
    spacer_length = models.PositiveSmallIntegerField()
    sgRNA_json = models.JSONField(default=dict)
    task_status = models.CharField(max_length=20)
    log = models.TextField(default="")
