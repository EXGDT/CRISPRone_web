from django.contrib import admin

# Register your models here.

from .models import result_cas9_list

admin.site.register(result_cas9_list)

from .models import genome_gff_data

admin.site.register(genome_gff_data)
