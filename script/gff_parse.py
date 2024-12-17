import re
import os
import pandas as pd
import numpy as np
import multiprocessing
from concurrent.futures import ProcessPoolExecutor
from pandarallel import pandarallel
# pandarallel.initialize(nb_workers=20, progress_bar=False)
pd.set_option('display.max_columns', None)


def parse_attributes(attr_str):
    attr_dict = {}
    for attr in attr_str.split(";"):
        key, value = attr.split("=")
        attr_dict[key] = value
    return attr_dict


def format_attributes(attr_dict):
    return ";".join([f"{key}={value}" for key, value in attr_dict.items()])


def remove_type_notin_obo(gff_dataframe):
    with open('SO-Ontologies/Ontology_Files/so.obo') as f:
        obo_content = f.read()
        pattern = re.compile(r'^name: (.+)$', re.MULTILINE)
        names = set(pattern.findall(obo_content))
    gff_dataframe = gff_dataframe[gff_dataframe.iloc[:, 2].isin(names)]
    return gff_dataframe


"""
before:
Pp01    JGI     CDS     40476   40616   .       +       0       ID=Prupe.1G000100.1_v2.0.a1.CDS.1;Parent=Prupe.1G000100.1_v2.0.a1
Pp01    JGI     CDS     40721   40830   .       +       0       ID=Prupe.1G000100.1_v2.0.a1.CDS.2;Parent=Prupe.1G000100.1_v2.0.a1
Pp01    JGI     CDS     40942   41014   .       +       1       ID=Prupe.1G000100.1_v2.0.a1.CDS.3;Parent=Prupe.1G000100.1_v2.0.a1
after:
Pp01    JGI     CDS     40476   40616   .       +       0       ID=NaN;Parent=Prupe.1G000100.1_v2.0.a1
Pp01    JGI     CDS     40721   40830   .       +       0       ID=NaN;Parent=Prupe.1G000100.1_v2.0.a1
Pp01    JGI     CDS     40942   41014   .       +       1       ID=NaN;Parent=Prupe.1G000100.1_v2.0.a1
"""
def update_family_level_check_n_clear(gff_new, current_level):
    current_family_level_col = f'Family_level_{current_level + 1}'
    previous_family_level_col = f'Family_level_{current_level}'
    types_to_check = ['CDS', 'five_prime_UTR', 'three_prime_UTR']
    gff_new['mark'] = (gff_new['Parent'] == gff_new[current_family_level_col])
    relevant_rows = gff_new['type'].isin(types_to_check)
    unique_counts = gff_new.loc[relevant_rows].groupby(previous_family_level_col)[current_family_level_col].transform('nunique')
    gff_new.loc[relevant_rows & (unique_counts > 1), current_family_level_col] = np.nan
    return gff_new


"""
before:
Pp01    JGI     CDS     40476   40616   .       +       0       ID=NaN;Parent=Prupe.1G000100.1_v2.0.a1
Pp01    JGI     CDS     40721   40830   .       +       0       ID=NaN;Parent=Prupe.1G000100.1_v2.0.a1
Pp01    JGI     CDS     40942   41014   .       +       1       ID=NaN;Parent=Prupe.1G000100.1_v2.0.a1
after:
Pp01    JGI     CDS     40476   40616   .       +       0       ID=Parent=Prupe.1G000100.1_v2.0.a1.CDS;Parent=Prupe.1G000100.1_v2.0.a1
Pp01    JGI     CDS     40721   40830   .       +       0       ID=Parent=Prupe.1G000100.1_v2.0.a1.CDS;Parent=Prupe.1G000100.1_v2.0.a1
Pp01    JGI     CDS     40942   41014   .       +       1       ID=Parent=Prupe.1G000100.1_v2.0.a1.CDS;Parent=Prupe.1G000100.1_v2.0.a1
"""
def update_family_level_continuous(gff_new, current_level):
    types_to_fill = ['CDS', 'five_prime_UTR', 'three_prime_UTR']
    current_family_level_col = f'Family_level_{current_level + 1}'
    previous_family_level_col = f'Family_level_{current_level}'
    update_expression = gff_new[previous_family_level_col] + '.' + gff_new['type']
    mask = (gff_new['type'].isin(types_to_fill)) & (gff_new[current_family_level_col].isnull()) & (gff_new['level'] == current_level + 1)
    gff_new.loc[mask, current_family_level_col] = update_expression[mask]
    marked_mask = gff_new['mark'] == True
    gff_new.loc[marked_mask, current_family_level_col] = update_expression[marked_mask]
    gff_new.loc[marked_mask, 'Parent'] = update_expression[marked_mask]
    return gff_new


"""
before:
Chr01   GSAman  exon    8920    9018    .       +       .       Parent=OsMH_01T0000025.1
Chr01   GSAman  exon    10020   10123   .       +       .       Parent=OsMH_01T0000025.1
Chr01   GSAman  exon    11699   12507   .       +       .       Parent=OsMH_01T0000025.1
Chr01   GSAman  exon    12591   12713   .       +       .       Parent=OsMH_01T0000025.1
after:
Chr01   GSAman  exon    8920    9018    .       +       .       ID:OsMH_01T0000025.1.exon.1;Parent=OsMH_01T0000025.1
Chr01   GSAman  exon    10020   10123   .       +       .       ID:OsMH_01T0000025.1.exon.2;Parent=OsMH_01T0000025.1
Chr01   GSAman  exon    11699   12507   .       +       .       ID:OsMH_01T0000025.1.exon.3;Parent=OsMH_01T0000025.1
Chr01   GSAman  exon    12591   12713   .       +       .       ID:OsMH_01T0000025.1.exon.4;Parent=OsMH_01T0000025.1
"""
def update_family_level_disperse(gff_new, current_level):
    current_family_level_col = f'Family_level_{current_level + 1}'
    print(f'current_level={current_family_level_col}')
    previous_family_level_col = f'Family_level_{current_level}'
    # mask = gff_new[current_family_level_col].isnull()
    mask = (gff_new[current_family_level_col].isnull()) & (gff_new['level'] == current_level + 1)
    df_to_process = gff_new.loc[mask]
    df_to_process.loc[:, 'new_name'] = (
        df_to_process[previous_family_level_col] + '.' + 
        df_to_process['type'] + '.' + 
        (df_to_process.groupby([previous_family_level_col, 'type']).cumcount() + 1).astype(str)
    )
    gff_new.loc[mask, current_family_level_col] = df_to_process['new_name']
    for level in range(1, gff_new['level'].max() + 1):
        gff_new.loc[gff_new['level'] == level, 'ID'] = gff_new[f'Family_level_{level}']
    for level in range(2, gff_new['level'].max() + 1):
        gff_new.loc[gff_new['level'] == level, 'Parent'] = gff_new[f'Family_level_{level-1}']
    gff_new['attributes'] = gff_new['attributes'].str.replace(r'ID=[^;]*;?', '', regex=True)
    gff_new['attributes'] = gff_new['attributes'].str.replace(r'Parent=[^;]*;?', '', regex=True)
    gff_new['attributes'] = gff_new['attributes'].str.replace(r'Family=[^;]*;?', '', regex=True)
    gff_new['attributes'] = ('ID=' + gff_new['ID'].astype(str) + 
                             ';Parent=' + gff_new['Parent'].astype(str).fillna('') + 
                             ';Family=' + gff_new['Family_level_1'].astype(str).fillna('') + 
                             ';' + gff_new['attributes']).str.strip(';')
    gff_new['attributes'] = gff_new['attributes'].str.replace(';Parent=nan', '')
    gff_new['attributes'] = gff_new['attributes'].str.strip(';')
    gff_new['attributes'] = gff_new['attributes'].str.replace(r'^;|;$|(?<=;) +', '', regex=True)
    return gff_new


"""
before:
Chr01   TBtools gene    7552    15388   .       +       .       ID=OsMH_01G0000025
Chr01   TBtools gene    45014045        45014442        .       -       .       ID=OsMH_01G0711400
after:
Chr01   TBtools intergenic_region    0    7551   .       +       .       ID=intergenic_region
Chr01   TBtools gene    7552    15388   .       +       .       ID=OsMH_01G0000025
Chr01   TBtools intergenic_region    15389    45014044   .       +       .       ID=intergenic_region
Chr01   TBtools gene    45014045        45014442        .       -       .       ID=OsMH_01G0711400
Chr01   TBtools intergenic_region    45014443    45027022   .       +       .       ID=intergenic_region
"""
def generate_intergenic_records_vect_improved(gff_raw, fai_path):
    seq_lengths = pd.read_csv(fai_path, sep='\t', header=None, names=['seqid', 'length', 'offset', 'linebases', 'linewidth'])
    seq_lengths['seqid'] = seq_lengths['seqid'].astype(str)
    seq_lengths_dict = seq_lengths.set_index('seqid')['length'].to_dict()
    genes = gff_raw[gff_raw['type'] == 'gene'].copy()
    genes['seqid'] = genes['seqid'].astype(str)
    genes_sorted = genes.sort_values(by=['seqid', 'strand', 'start'])
    intergenic_records = []
    for (seqid, strand), group in genes_sorted.groupby(['seqid', 'strand']):
        dummy_start = pd.DataFrame({
            'seqid': [seqid],
            'end': [0]
        })
        dummy_end = pd.DataFrame({
            'seqid': [seqid],
            'start': [seq_lengths_dict[seqid] + 1],
            'end': [seq_lengths_dict[seqid]]
        })
        modified_group = pd.concat([dummy_start, group[['seqid', 'start', 'end']], dummy_end], ignore_index=True)
        intergenic_starts = modified_group['end'].shift(1) + 1
        intergenic_ends = modified_group['start'] - 1
        intergenic_df = pd.DataFrame({
            'seqid': seqid,
            'source': 'CRISPRall',
            'type': 'intergenic_region',
            'start': intergenic_starts[1:].values.astype(int),
            'end': intergenic_ends[1:].values.astype(int),
            'score': '.',
            'strand': strand,
            'phase': '.',
            'attributes': 'ID=intergenic_region'
        })
        intergenic_records.append(intergenic_df)
    intergenic_records_df = pd.concat(intergenic_records, ignore_index=True)
    merged_gff = pd.concat([gff_raw, intergenic_records_df], ignore_index=True).sort_values(by=['seqid', 'strand', 'start'])
    return merged_gff


def add_interval_column(gff_new):
    invalid_rows = gff_new[gff_new['start'] > gff_new['end']]
    if not invalid_rows.empty:
        gff_new = gff_new.drop(invalid_rows.index)
    gff_new['interval'] = pd.IntervalIndex.from_arrays(gff_new['start'], gff_new['end'], closed='both')
    return gff_new


def remove_reduntant_col(gff_new):
    for level in range(1, gff_new['level'].max() + 1):
        gff_new.loc[gff_new['level'] == level, 'ID'] = gff_new[f'Family_level_{level}']
    for level in range(2, gff_new['level'].max() + 1):
        gff_new.loc[gff_new['level'] == level, 'Parent'] = gff_new[f'Family_level_{level-1}']
    gff_new['attributes'] = gff_new['attributes'].str.replace(r'ID=[^;]*;?', '', regex=True)
    gff_new['attributes'] = gff_new['attributes'].str.replace(r'Parent=[^;]*;?', '', regex=True)
    gff_new['attributes'] = gff_new['attributes'].str.replace(r'Family=[^;]*;?', '', regex=True)
    gff_new['attributes'] = ('ID=' + gff_new['ID'].astype(str) + 
                             ';Parent=' + gff_new['Parent'].astype(str).fillna('') + 
                             ';Family=' + gff_new['Family_level_1'].astype(str).fillna('') + 
                             ';' + gff_new['attributes']).str.strip(';')
    gff_new['attributes'] = gff_new['attributes'].str.replace(';Parent=nan', '')
    gff_new['attributes'] = gff_new['attributes'].str.strip(';')
    gff_new['attributes'] = gff_new['attributes'].str.replace(r'^;|;$|(?<=;) +', '', regex=True)
    gff_new = gff_new.iloc[:, :9]
    return gff_new


def process_gff3(gff3_path, fai_path, output_file_path):
    cols = ['seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes']
    gff_raw = pd.read_csv(gff3_path, sep='\t', names=cols, comment='#')
    gff_raw.loc[:, 'seqid'] = gff_raw['seqid'].astype(str)
    gff_raw = generate_intergenic_records_vect_improved(gff_raw, fai_path)
    gff_raw = remove_type_notin_obo(gff_raw)
    gff_raw.loc[:, 'ID'] = gff_raw['attributes'].str.extract(r'ID=([^;]+)')
    gff_raw.loc[:, 'Parent'] = gff_raw['attributes'].str.extract(r'Parent=([^;]+)')
    gff_raw.loc[:, 'Parent'] = gff_raw['Parent'].str.split(',')
    gff_raw = gff_raw.explode('Parent')
    gff_raw.loc[:, 'Family_level_1'] = np.where(gff_raw['Parent'].isna(), gff_raw['ID'], pd.NA)

    id_parent_map = gff_raw.dropna(subset=['ID', 'Parent']).set_index('ID')['Parent'].to_dict()

    root_records = gff_raw[(gff_raw['Parent'].isna()) & (gff_raw['ID'].notna())]
    gff_new = root_records.copy()
    gff_raw = gff_raw.drop(root_records.index)

    gff_new.loc[:, 'Family_level_2'] = pd.NA
    current_level = 2
    while True:
        parent_ids = gff_new['ID'].dropna().unique()
        level_records = gff_raw[gff_raw['Parent'].isin(parent_ids)]
        if level_records.empty:
            break

        level_records.loc[:, f"Family_level_{current_level}"] = level_records["ID"]
        level_records.loc[:, f"Family_level_{current_level - 1}"] = level_records["Parent"]
        gff_new = pd.concat([gff_new, level_records], ignore_index=True)

        gff_raw = gff_raw.drop(level_records.index)
        current_level += 1
    
    gff_new['Family_level_1'] = gff_new['Parent'].map(id_parent_map).fillna(gff_new['Family_level_1'])

    fill_level_counts = current_level - 3

    while fill_level_counts:
        gff_new[f'Family_level_{fill_level_counts}'] = gff_new[f'Family_level_{fill_level_counts + 1}'].map(id_parent_map).fillna(gff_new[f'Family_level_{fill_level_counts}'])
        fill_level_counts -= 1

    family_level_cols = [col for col in gff_new.columns if col.startswith('Family_level_')]
    gff_new.loc[gff_new['ID'].notna() & gff_new['Parent'].isna(), 'level'] = 1
    gff_new.loc[gff_new['Parent'].notna() & gff_new['ID'].isna(), 'level'] = -1
    gff_new['level_temp'] = gff_new[family_level_cols].notna().sum(axis=1)
    gff_new.loc[gff_new['ID'].notna() & gff_new['Parent'].notna(), 'level'] = gff_new['level_temp']
    gff_new.drop('level_temp', axis=1, inplace=True)
    gff_new['non_empty_family_levels'] = gff_new[family_level_cols].notna().sum(axis=1)
    bottom_records_mask = gff_new['level'] == -1
    gff_new.loc[bottom_records_mask, 'level'] = gff_new.loc[bottom_records_mask, 'non_empty_family_levels'] + 1
    gff_new.drop('non_empty_family_levels', axis=1, inplace=True)
    gff_new['level'] = gff_new['level'].astype(int)
    
    gff_new = gff_new.sort_values(by=['seqid', 'strand', 'start', 'end', 'level'], ascending=[True, True, True, False, True])
    gff_new.reset_index(drop=True, inplace=True)

    i = 1
    while i <= gff_new['level'].max() - 2:
        front_part_gff_new = gff_new[gff_new['level'] <= i]
        latter_part_gff_new = gff_new[gff_new['level'] > i]
        # print(f"before sorted (level = {i + 1}):")
        # print(latter_part_gff_new.iloc[:50, np.r_[2:5, 10:gff_new.shape[1]]])
        sorted_latter_part_gff_new = latter_part_gff_new.sort_values(by=[f'Family_level_{i + 1}','start' , 'end', 'level'], ascending=[True, True, False, True])
        # print(f"after sorted (level = {i + 1}):")
        # print(sorted_latter_part_gff_new.iloc[:50, np.r_[2:5, 10:gff_new.shape[1]]])
        front_part_gff_new_indexes = front_part_gff_new.index.tolist()
        index_ranges = [(front_part_gff_new_indexes[i], front_part_gff_new_indexes[i + 1] if i + 1 < len(front_part_gff_new_indexes) else sorted_latter_part_gff_new.index.max() + 1) for i in range(len(front_part_gff_new_indexes))]
        parts = []
        for start_index, end_index in index_ranges:
            parts.append(front_part_gff_new.loc[[start_index]])
            corresponding_records = sorted_latter_part_gff_new[(sorted_latter_part_gff_new.index > start_index) & (sorted_latter_part_gff_new.index < end_index)]
            parts.append(corresponding_records)
        gff_new = pd.concat(parts).reset_index(drop=True)
        gff_new = update_family_level_check_n_clear(gff_new, i + 1)
        gff_new = update_family_level_continuous(gff_new, i + 1)
        gff_new = update_family_level_disperse(gff_new, i + 1)
        # print(front_part_gff_new.iloc[:50, np.r_[2:5, 10:gff_new.shape[1]]])
        # print(latter_part_gff_new.iloc[:50, np.r_[2:5, 10:gff_new.shape[1]]])
        # print(sorted_latter_part_gff_new.iloc[:50, np.r_[2:5, 10:gff_new.shape[1]]])
        # print(sorted_latter_part_gff_new[sorted_latter_part_gff_new['level']==4])
        # print(gff_new.iloc[:50, np.r_[2:5, 9:gff_new.shape[1]]])
        i += 1

    # print(level_1_df.iloc[:50, np.r_[2:5, 10:gff_new.shape[1]]])
    # print(sorted_other_levels_df.iloc[:50, np.r_[2:5, 10:gff_new.shape[1]]])
    # print(final_df.iloc[:50, np.r_[2:5, 10:gff_new.shape[1]]])
    gff_new = add_interval_column(gff_new)
    gff_new.to_pickle(output_file_path + '.pkl')
    gff_new.to_csv(output_file_path + '.pkl.gff3', sep='\t', index=False, header=False, na_rep='NaN')
    gff_new = remove_reduntant_col(gff_new)
    gff_new.to_csv(output_file_path, sep='\t', index=False, header=False)


def main1():
    # genome_dir = "test_gff_n_fasta"
    # annotation_dir = "test_gff_n_fasta"
    genome_dir = "genome_files"
    annotation_dir = "annotation_files"
    processed_annotation_dir = "processed_annotation_files"
    genome_files = {os.path.splitext(file)[0]: file for file in os.listdir(genome_dir) if file.endswith('.fa')}
    annotation_files = {os.path.splitext(file)[0]: file for file in os.listdir(annotation_dir) if file.endswith('.gff3')}
    for base_name in genome_files:
        if base_name in annotation_files:
            print(base_name)
            fai_path = os.path.join(genome_dir, genome_files[base_name] + '.fai')
            gff_path = os.path.join(annotation_dir, annotation_files[base_name])
            output_file_path = os.path.join(processed_annotation_dir, f"{base_name}.processed.gff3")
            process_gff3(gff_path, fai_path, output_file_path)
        else:
            print(f"No matching GFF file for {base_name}")


def main():
    # genome_dir = "test_gff_n_fasta"
    # annotation_dir = "test_gff_n_fasta"
    genome_dir = "genome_files"
    annotation_dir = "annotation_files"
    processed_annotation_dir = "processed_annotation_files"
    os.makedirs(processed_annotation_dir, exist_ok=True)
    genome_files = {os.path.splitext(file)[0]: file for file in os.listdir(genome_dir) if file.endswith('.fa')}
    annotation_files = {os.path.splitext(file)[0]: file for file in os.listdir(annotation_dir) if file.endswith('.gff3')}
    num_cores = multiprocessing.cpu_count()
    num_processes = max(1, int(num_cores * 0.5))
    with ProcessPoolExecutor(max_workers=num_processes) as executor:
        futures = []
        for base_name in genome_files:
            if base_name in annotation_files:
                print(f"Queueing {base_name} for processing...")
                fai_path = os.path.join(genome_dir, genome_files[base_name] + '.fai')
                gff_path = os.path.join(annotation_dir, annotation_files[base_name])
                output_file_path = os.path.join(processed_annotation_dir, f"{base_name}.processed.gff3")
                future = executor.submit(process_gff3, gff_path, fai_path, output_file_path)
                futures.append(future)
            else:
                print(f"No matching GFF file for {base_name}")
        for future in futures:
            future.result()


if __name__ == "__main__":
    main()
