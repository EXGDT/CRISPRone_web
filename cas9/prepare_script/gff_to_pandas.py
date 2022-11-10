from sys import argv
import pandas as pd
import re
from pandarallel import pandarallel
pandarallel.initialize()


def gff_to_pandas(gff_file):
    gff_prefix = gff_file.removesuffix(".gff3").removesuffix(".gff")
    gff = pd.read_csv(
        gff_file,
        header=None,
        sep='\t',
        names=['seqid', 'source', 'type', 'start', 'end', 'score', 'strand', 'phase', 'attributes'])

    gff['interval'] = pd.IntervalIndex.from_arrays(gff['start'], gff['end'], closed='both')

    gff["family"] = gff.parallel_apply(
        lambda row: "intergenic" if row.type == "intergenic"
        else re.search(r'ID=(.*);', row.attributes).group(1) if row.type == "gene"
        else re.search(r'ID=cds\.(.*?)\.', row.attributes).group(1) if row.type == "CDS"
        else re.search(r'ID=(.*?)\.', row.attributes).group(1),
        axis=1
    )

    gff.set_index(['seqid', 'family', 'type'], inplace=True, drop=False)

    gff.to_csv(gff_prefix + "_family.gff3", sep='\t')
    gff.to_pickle(gff_prefix + "_family.plk")
    return gff


if __name__ == "__main__":
    gff_to_pandas(argv[1])
