import sys


def intergenic_to_gff(gff_file, fai_file):
    new_gff_file = gff_file.removesuffix('.gff3').removesuffix('.gff') + "_intergenic.gff3"
    chr_length_dict = {}
    intergenic_start_end = {}
    genes_start_end = {}
    with open(fai_file) as fai_file_handle:
        for line in fai_file_handle:
            line = line.strip().split('\t')
            chr_length_dict[line[0]] = int(line[1])
            intergenic_start_end[line[0]] = []
            genes_start_end[line[0]] = []

    with open(gff_file) as gff_file_handle:
        for line in gff_file_handle:
            line = line.strip().split('\t')
            if line[2] == "gene":
                gene_start_end = (int(line[3]), int(line[4]))
                genes_start_end[line[0]].append(gene_start_end)

    for chr in list(genes_start_end.keys()):
        if not genes_start_end.get(chr):
            del genes_start_end[chr]

    for chr, starts_ends in genes_start_end.items():
        if starts_ends[0][0] == 1:
            continue
        else:
            intergenic_start_end[chr].append((1, starts_ends[0][0] - 1))
            tmp_intergenic_start = starts_ends[0][1] + 1
        for index in range(1, len(starts_ends)):
            if starts_ends[index][0] <= tmp_intergenic_start or starts_ends[index][0] <= starts_ends[index - 1][1]:
                continue
            else:
                tmp_intergenic_end = starts_ends[index][0] - 1
            # intergenic_start_end[chr].append((starts_ends[index - 1][1] + 1, starts_ends[index][0] - 1))
                intergenic_start_end[chr].append((tmp_intergenic_start, tmp_intergenic_end))
                tmp_intergenic_start = starts_ends[index][1] + 1
        if starts_ends[-1][1] == chr_length_dict[chr]:
            continue
        else:
            intergenic_start_end[chr].append((starts_ends[-1][1] + 1, chr_length_dict[chr]))

    with open(new_gff_file, 'w') as new_gff_file_handle:
        for chr, starts_ends in intergenic_start_end.items():
            for line in starts_ends:
                new_gff_file_handle.write(
                    chr + "\t" +
                    "intergenic" + "\t" +
                    "intergenic" + "\t" +
                    str(line[0]) + "\t" +
                    str(line[1]) + "\t" +
                    ".\t.\t.\t" +
                    "ID={}Intergenic;Name={}Intergenic".format(chr, chr) + "\n"
                    )


if __name__ == "__main__":
    gff_file, fai_file = sys.argv[1:3]
    intergenic_to_gff(gff_file, fai_file)
