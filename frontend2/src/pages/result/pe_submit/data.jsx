export const PBS_and_RT_RowRender = () => (
    <div className="pbs-rt-content">
        <h2>pegRNA sequences</h2>
        <p>pegRNAs sequence(5&apos;-3&apos;)</p>
        <span>TTTGACGGTAGCTGCTGAGGGTTTTAGAGCTAGAAATAGCAAGTTAAAATAAGGCTAGTCCGTTATCAACTTGAAAAAGTGGCACCGAGTCGGTGCAGGCGGTAGAGACCCTGACGGTAGCTGCTGnannan</span>
        <hr />
        <p>PE Vector Viewer</p>
    </div>
);

export const parameters = {
    sequences: [
        {
            label: "Input Sequence",
            value: `CACACCTACACTGCTCGAAGTAAATATGCGAAGCGCGCGGCCTGGCCGGAGGCGTTCCGCGCCGCCACGTGTTCGTTAACTGTTGATTGGTGGCACATAA
GCAATCGTAGTCCGTCAAATTCAGCTCTGTTATCCCGGGCGTTATGTGTCAAATGGCGTAGAACGGGATTGACTGTTTGACGGTAGCTGCTGAGGCGG(G
/T)AGAGACCCTCCGTCGGGCTATGTCACTAATACTTTCCAAACGCCCCGTACCGATGCTGAACAAGTCGATGCAGGCTCCCGTCTTTGAAAAGGGGTAA
ACATACAAGTGGATAGATGATGGGTAGGGGCCTCCAATACATCCAACACTCTACGCCCTCTCCAAGAGCTAGAAGGGCACCCTGCAGTTGGAAAGGG`,
            type: "plain"
        },
        {
            label: "Reference DNA Sequence",
            value: `CACACCTACACTGCTCGAAGTAAATATGCGAAGCGCGCGGCCTGGCCGGAGGCGTTCCGCGCCGCCACGTGTTCGTTAACTGTTGATTGGTGGCACATAA
GCAATCGTAGTCCGTCAAATTCAGCTCTGTTATCCCGGGCGTTATGTGTCAAATGGCGTAGAACGGGATTGACTGTTTGACGGTAGCTGCTGAGGCGG
CTATGTCACTAATACTTTCCAAACGCCCCGTACCGATGCTGAACAAGTCGATGCAGGCTCCCGTCTTTGAAAAGGGGTAAACATACAAGTGGATAGATGA
TGGGTAGGGGCCTCCAATACATCCAACACTCTACGCCCTCTCCAAGAGCTAGAAGGGCACCCTGCAGTTGGAAAGGG`,
            type: "sequence",
            note: {
                items: [
                    { type: "mutation-type-substitution", text: "Substitution" },
                    { type: "mutation-type-deletion", text: "Deletion" },
                    { type: "mutation-type-spacer", text: "pegRNA spacer" },
                    { type: "mutation-type-ngrna", text: "ngRNA spacer" }
                ]
            }
        },
        {
            label: "Edited DNA Sequence",
            value: `CACACCTACACTGCTCGAAGTAAATATGCGAAGCGCGCGGCCTGGCCGGAGGCGTTCCGCGCCGCCACGTGTTCGTTAACTGTTGATTGGTGGCACATAA
GCAATCGTAGTCCGTCAAATTCAGCTCTGTTATCCCGGGCGTTATGTGTCAAATGGCGTAGAACGGGATTGACTGTTTGACGGTAGCTGCTGAGGCGG
CTATGTCACTAATACTTTCCAAACGCCCCGTACCGATGCTGAACAAGTCGATGCAGGCTCCCGTCTTTGAAAAGGGGTAAACATACAAGTGGATAGATGA
TGGGTAGGGGCCTCCAATACATCCAACACTCTACGCCCTCTCCAAGAGCTAGAAGGGCACCCTGCAGTTGGAAAGGG`,
            type: "sequence",
            note: {
                items: [
                    { type: "mutation-type-substitution", text: "Substitution" },
                    { type: "mutation-type-deletion", text: "Deletion" },
                    { text: "pegRNA spacer 1-17nt" },
                    { text: "PBS" },
                    { text: "RTT" },
                    { text: "ngRNA spacer" }
                ]
            }
        }
    ],
    settings: [
        { label: "Mutation Type", value: "Substitution" },
        { label: "PAM Type", value: "custom" },
        { label: "Target Genome", value: "Gossypium_hirsutum_Jin668_HZAU" },
        { label: "Cut distance to PAM", value: "-3" },
        { label: "Spacer GC content (%)", value: "40-60" },
        { label: "PBS Length (bp)", value: "7-16" },
        { label: "PBS GC content (%)", value: "40-60" },
        { label: "Recommended Tm of PBS sequence (℃)", value: "20-40" },
        { label: "Homologous RT template length (bp)", value: "7-16" },
        { label: "Exclude first C in RT template", value: "excludeFirstCRT" },
        { label: "Dual-pegRNA model", value: "dualpegRNA" },
        { label: "ngRNA spacers", value: "ngRNAspacers" },
        { label: "Distance of secondary nicking sgRNAS (ngRNA) to pegRNA (bp)", value: "40-150" },
        { label: "PegLIT", value: "pegLIT" },
        { label: "Incorporated structured RNA motifs", value: "tevopreQ1" },
        { label: "Linker Pattern", value: "AAAA" }
    ]
};


export const dataSource = [
    {
        key: '1',
        spacer_sequence: 'TTTGACGGTAGCTGCTGAGG',
        pam: 'CGG',
        strand: '+',
        start: '175',
        peg_to_edit_distance: '3',
        spacer_gc_content: '50%',
        off_target: 'b',
    },
    {
        key: '2',
        spacer_sequence: 'TTAGTGACATAGCCCGACGG',
        pam: 'AGG',
        strand: '-',
        start: '165',
        peg_to_edit_distance: '9',
        spacer_gc_content: '50%',
        off_target: 'b',
    }
];


export const pegRNA_extensions_dataSource = [
    {
        key: '1',
        pbs_length: '15',
        pbs_seq: 'TGACGGTAGCTGCTG',
        pbs_gc_content: '60%',
        pbs_tm: '44',
        pbs_level: '',
        ptt_length: '15',
        ptt_seq: 'AGGCGGTAGAGACCC',
        ptt_gc_content: '67%',
        pegLIT_linker: '',
        pegLIT_linker_score: '',
        pegLIT_motifs_RNA: '',
    },
    {
        key: '2',
        pbs_length: '15',
        pbs_seq: 'AGTGACATAGCCCGA',
        pbs_gc_content: '53%',
        pbs_tm: '41',
        pbs_level: '',
        ptt_length: '15',
        ptt_seq: 'CGGAGGGTCTCTACC',
        ptt_gc_content: '67%',
        pegLIT_linker: 'xzp1',
        pegLIT_linker_score: 'xzp2',
        pegLIT_motifs_RNA: 'tevopreQ1',
    }
];


export const ngRNA_sequence_dataSource = [
    {
        key: '1',
        spacer_sequence: 'ATGTGTCAAATGGCGTAGAA',
        pam: 'CGG',
        strand: '-',
        start: '163',
        nick_to_peg_distance: '46',
        spacer_gc_content: '40%',
        off_target: 'b',
    },
    {
        key: '2',
        spacer_sequence: 'CAGCATCGGTACGGGGCGTT',
        pam: 'TGG',
        strand: '-',
        start: '156',
        nick_to_peg_distance: '43',
        spacer_gc_content: '65%',
        off_target: 'b',
    }
];