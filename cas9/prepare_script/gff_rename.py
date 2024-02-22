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


def process_gff3(lines):
    records = []
    children = {}
    type_counter = {}
    unique_id_counter = {}

    for line in lines:
        if line.startswith("#"):
            continue
        parts = line.strip().split("\t")
        attr_dict = parse_attributes(parts[8])
        record = {
            "seqid": parts[0],
            "source": parts[1],
            "type": parts[2],
            "start": parts[3],
            "end": parts[4],
            "score": parts[5],
            "strand": parts[6],
            "phase": parts[7],
            "attributes": attr_dict
        }
        records.append(record)


input_file_path = 'Gossypium_hirsutum_Jin668_HZAU.gff3'

base_name, _ = os.path.splitext(input_file_path)

output_file_path = f"{base_name}.processed.gff3"

with open(input_file_path, 'r') as gff_file:
    gff3_content = gff_file.readlines()

processed_lines = process_gff3(gff3_content)

with open(output_file_path, 'w') as processed_file:
    for line in processed_lines:
        processed_file.write(line + '\n')

obo_path = 'SO-Ontologies/Ontology_Files/so.obo'