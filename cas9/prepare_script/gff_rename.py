from sys import argv
import pandas as pd
import re
from pandarallel import pandarallel
pandarallel.initialize(nb_workers=16)


def gff_rename(gff_file):
    gff = pd.read_csv(
        gff_file,
        header=None,
        sep='\t',
        comment='#',
        names=['seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes'])


    def find_id_or_parent(attributes, field):
        pattern = re.compile(r'\b' + field + r'=([^;]+)')
        match = pattern.search(attributes)
        return match.group(1) if match else None 
    

    def generate_family(row):
        if row.Parent == None:



    gff['ID'] = gff.iloc[:, 8].apply(lambda x: find_id_or_parent(x, 'ID'))
    gff['Parent'] = gff.iloc[:, 8].apply(lambda x: find_id_or_parent(x, 'Parent'))

    print(gff)
    print(gff['attributes'])

if __name__ == '__main__':
    gff_rename(argv[1])