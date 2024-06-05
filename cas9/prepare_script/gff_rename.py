from sys import argv
import pandas as pd
import re
import os
from pandarallel import pandarallel
pandarallel.initialize(nb_workers=16)


def parse_obo_file(obo_path):
    term_pattern = re.compile(r"\[Term\]")
    id_pattern = re.compile(r"id: (\S+)")
    name_pattern = re.compile(r"name: (.+)")
    is_a_pattern = re.compile(r"is_a: (\S+)")

    terms = {}
    term_names = {}
    term_parents = {}

    with open(obo_path, 'r') as file:
        for line in file:
            if term_pattern.search(line):
                if 'id' in locals() and 'name' in locals():
                    terms[id] = {'name': name, 'parents': parents}
                id, name, parents = None, None, []
            elif id_match := id_pattern.match(line):
                id = id_match.group(1)
            elif name_match := name_pattern.match(line):
                name = name_match.group(1)
                term_names[id] = name
            elif is_a_match := is_a_pattern.match(line):
                parents.append(is_a_match.group(1))

        if 'id' in locals() and 'name' in locals():
            terms[id] = {'name': name, 'parents': parents}

    for term_id, info in terms.items():
        term_name = info['name']
        parent_names = [term_names[parent_id] for parent_id in info['parents'] if parent_id in term_names]
        term_parents[term_name] = parent_names

    return term_parents


def parse_attributes(attr_str):
    attr_dict = {}
    for attr in attr_str.split(";"):
        key, value = attr.split("=")
        attr_dict[key] = value
    return attr_dict


def format_attributes(attr_dict):
    return ";".join([f"{key}={value}" for key, value in attr_dict.items()])


def process_gff3(gff3_path):
    cols = ['seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes']
    gff_raw = pd.read_csv(gff3_path, sep='\t', names=cols, comment='#')
    gff_raw['ID'] = gff_raw['attributes'].str.extract(r'ID=([^;]+)')
    gff_raw['Parent'] = gff_raw['attributes'].str.extract(r'Parent=([^;]+)')
    gff_raw.loc[gff_raw['attributes'].str.contains('Parent='), 'ID'] = pd.NA

    return gff_raw


# def process_gff3(gff3_path):
#     with open(gff3_path, 'r') as gff_file:
#         gff_lines = gff_file.readlines()
#         for line in gff_lines:
#             if line.startswith("##gff-version"):
#                 version = line.split()[1]
#                 break


input_file_path = '/disk2/users/yxguo/test/test.gff3'

base_name, _ = os.path.splitext(input_file_path)

output_file_path = f"{base_name}.processed.gff3"

final_list = process_gff3(input_file_path)

print(final_list)

obo_path = 'SO-Ontologies/Ontology_Files/so.obo'