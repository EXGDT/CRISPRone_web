//cas9
import cas9 from "@/assets/Image/cas9.png";
export const cas9_data = {
  // 介绍部分属性
  introductionProps: {
    imgSrc: cas9, // 图片路径
    title: "Design of CRISPR/Cas9 guide RNAs", // 标题
    content: `CRISPR/Cas enzymes will introduce a double-strand break (DSB)
              at a specific location based on a gRNA-defined target sequence.
              DSBs are preferentially repaired in the cell by non-homologous
              end joining (NHEJ), a mechanism which frequently causes insertions
              or deletions (indels) in the DNA. Indels often lead to frameshifts,
              creating loss of function alleles.`, // 内容
    components: [
      "Guide RNA (gRNA or sgRNA), a short synthetic RNA composed of a scaffold sequence necessary for Cas-binding and a user-defined ∼20 nucleotide spacer that defines the genomic target to be modified.",
      "CRISPR-associated endonuclease (Cas protein)",
    ], // 组件列表
  },
  // 基因组序列、基因组位置、基因组ID（回填信息）
  example: {
    Sequence: `>Ghjin_A01g000050
GGGTTAAGTTTGTTATGTTGCTTGTATTTCTGCGTGCCTTTTCTACTCTGAAGATACCAG
GATGTAACTTTGGTGATCTTTCTTCTTATTCTTGCCCTCCTCCCCTTTTAAAGATTTGGG
CTCACTCAGATAAAGGACCATCACCATCTCCATATGTAGCAACTCCACGAGCGCTTGTCC
AAGCTGCTTTTTGTATGGCCATGTTTCTTTACCTTTCACCATCTCGTCCCTTGTCCTGGT
TTACTGATCCTGCATACCAAGAATGGGGATTCTGGAGGAAGTTGAGTTACCAATATATGT
CTGGTTTTACAATGCGGTGGAAATATTATTTCATCTGGTCAATTTCAGAGGCTGCTATGG
TTATTTCTGGCCTGGGTTTCAGTGGATGGACTGAATCTTCACCACCAAAACCAAAATGGG
ATCGAGCAAAGGTTGTTGATATCCTAGGGTTTGAGTTAGCAAAGAGTTCAGTGCTGTTAC
CACTTGTCTTGAACATACAAG`,
    Position: "Ghjin_A01:80323913-80324566",
    ID: "Ghjin_A01g000010",
  },
};

//cas12
import c2c1 from "@/assets/Image/c2c1.png";
import cpf1 from "@/assets/Image/c2c1.png";

export const cas12_data = {
  // 介绍部分属性
  c2c1_introductionProps: {
    imgSrc: c2c1, // 图片路径
    title: "Design of CRISPR-Cas12b (C2c1) guide RNAs", // 标题
    content: `
    The CRISPR-Cas12b (TTN + 20bp) is an RNA-guided endonuclease that can specifically cleave target double stranded DNA in the presence of PAM.
    Cas12b has high cleavage activity, and the optimal temperature of cleavage reaction is 48 °C, which makes it nearly impossible to use it in
     mammalian and plant cells. Fortunately, scientists have found several other Cas12b variants which cleave DNA at lower temperatures. `, // 内容
    components: [
      "Cas12b nucleases are smaller than Cas9 and Cas12a/Cpf1",
      "Cas12b can maintain high enzyme activity in a wide temperature and pH range",
      "Cas12b have very high target specificity (low off-target editing)",
    ], // 组件列表
  },
  c2c1_example: {
    ID: "Ghjin_A01G000010",
    Position: "Ghjin_A01:80323913-80324566",
    Sequence: `>Ghjin_A01G000010
    ATGTTGAAACAAGATGGAACTCTGTGTTCCTTCTCACCGTGCATGGAGCAAGTGCAACGTTCATGTGAAACTCTGAGATCTGACTTTATAGAGATATATGGACCTTTGAAATACTGCTCCGCATGTATGAAATCTGTGAATGGAAAATGGATCACTCGAAGGTCAATGATGGGAATTCCATTGCATGCTCTCCACACAAGAGGAGGCCGCCTTCAAGTGAAGCAAGTGTGGGGGACAATGCAAGTTCTCCGAGAATCATGGCTTGGCCATCTGCTGAAACTCGAGGGCATACTGGATATTTGA`,
  },
  // 介绍部分属性
  cpf1_introductionProps: {
    imgSrc: cpf1, // 图片路径
    title: "Design of CRISPR-Cas12a (Cpf1) guide RNAs", // 标题
    content: `The CRISPR-Cas12a (TTTN + 23bp) System allows targeting of alternative sites that are not available to the CRISPR-Cas9 System and produces a staggered cut with a 5′ overhang.`, // 内容
    components: [
      "Enables genome editing in organisms with AT-rich genomes",
      "Allows interrogation of additional genomic regions compared to Cas9",
    ], // 组件列表
  },
  // 基因组序列、基因组位置、基因组ID（回填信息）
  cpf1_example: {
    Sequence: `>Ghjin_A01G000010
ATGTTGAAACAAGATGGAACTCTGTGTTCCTTCTCACCGTGCATGGAGCAAGTGCAACGTTCATGTGAAACTCTGAGATCTGACTTTATAGAGATATATGGACCTTTGAAATACTGCTCCGCATGTATGAAATCTGTGAATGGAAAATGGATCACTCGAAGGTCAATGATGGGAATTCCATTGCATGCTCTCCACACAAGAGGAGGCCGCCTTCAAGTGAAGCAAGTGTGGGGGACAATGCAAGTTCTCCGAGAATCATGGCTTGGCCATCTGCTGAAACTCGAGGGCATACTGGATATTTGA`,
    Position: "Ghjin_A01:80323913-80324566",
    ID: "Ghjin_A01G000010",
  },
};

// cas13
import cas13 from "@/assets/Image/cas13.png";
export const cas13_data = {
  // 介绍部分属性
  introductionProps: {
    imgSrc: cas13, // 图片路径
    title: "Design of CRISPR Cas13 guide RNAs", // 标题
    content: `The RNA-targeting endonuclease Cas13 (Type VI CRISPR) ability to selectively target cellular RNAs and influence gene expression without making permanent genetic changes.`, // 内容
    components: [
      "RNA editing doesn&apos;t require homology-directed repair (HDR) machinery.",
      "Cas13 enzymes also don&apos;t require a PAM sequence at the target locus.",
      "Cas13 enzymes do not contain the RuvC and HNH domains responsible for DNA cleavage, so they cannot directly edit the genome.",
    ], // 组件列表
  },
  // 基因组序列、基因组位置、基因组ID（回填信息）
  example: {
    Sequence: `>Ghjin_A01g000010
ATGTTGAAACAAGATGGAACTCTGTGTTCCTTCTCACCGTGCATGGAGCAAGTGCAACGTTCATGTGAAACTCTGAGATCTGACTTTATAGAGATATATGGACCTTTGAAATACTGCTCCGCATGTATGAAATCTGTGAATGGAAAATGGATCACTCGAAGGTCAATGATGGGAATTCCATTGCATGCTCTCCACACAAGAGGAGGCCGCCTTCAAGTGAAGCAAGTGTGGGGGACAATGCAAGTTCTCCGAGAATCATGGCTTGGCCATCTGCTGAAACTCGAGGGCATACTGGATATTTGA`,
    Position: "Ghjin_A01:80323913-80324566",
    ID: "Ghjin_A01g000010",
  },
};

// base editor
import baseEditor from "@/assets/Image/base_editer.png";
export const baseEditor_data = {
  introductionProps: {
    imgSrc: baseEditor, // 图片路径
    title: "Design of Base Editing guide RNAs", // 标题
    content: `Base editors (BE) have two principal components that are fused together to form a single protein: (i) a CRISPR protein, bound to a guide RNA, and (ii) a base editing enzyme, such as a deaminase, which carries out the desired chemical modification of the target DNA base.`, // 内容
    advantages: [
      "The creation of precise, predictable and efficient genetic outcomes at a targeted sequence;",
      "High efficiency editing without need for template-based homology directed repair;",
      "Avoidance of the unwanted consequences of double-stranded DNA breaks.",
    ],
    note: "The designed sgRNA can enable efficient disruption of genes through induction of STOP Codons and Alternative Splicing (AS).",
  },
  // 基因组序列、基因组位置、基因组ID（回填信息）
  example: {
    Sequence: `>Ghjin_A01g000010
ATGTTGAAACAAGATGGAACTCTGTGTTCCTTCTCACCGTGCATGGAGCAAGTGCAACGTTCATGTGAAACTCTGAGATCTGACTTTATAGAGATATATGGACCTTTGAAATACTGCTCCGCATGTATGAAATCTGTGAATGGAAAATGGATCACTCGAAGGTCAATGATGGGAATTCCATTGCATGCTCTCCACACAAGAGGAGGCCGCCTTCAAGTGAAGCAAGTGTGGGGGACAATGCAAGTTCTCCGAGAATCATGGCTTGGCCATCTGCTGAAACTCGAGGGCATACTGGATATTTGA`,
    Position: "Ghjin_A01:80323913-80324566",
    ID: "Ghjin_A01g000010",
  },
};

// primer editor
import primerEditor from "@/assets/Image/primer_editor.png";
export const primerEditor_data = {
  introductionProps: {
    imgSrc: primerEditor, // 图片路径
    title: "Design of Base Editing guide RNAs", // 标题
    content: ` Prime editing (PE) tools that consist of a reverse transcriptase linked with Cas9 nickase are capable of generating targeted insertions, deletions, and base conversions without producing DNA double strand breaks or requiring any donor DNA.`, // 内容
    components: [
      "Relatively less restricted by PAM / Universal and easy / Precise and flexible",
    ], // 组件列表,
    note: 'The designed mutations or corrections are marked as "Substitution (a/b), Insertion (+c), Deletion (-c)". "a" is the original sequence and "b" is the designed mutation sequence, "c" is the deletion (-) or insertion (+) sequence.',
  },
  example: {
    substitution:
      "CACACCTACACTGCTCGAAGTAAATATGCGAAGCGCGCGGCCTGGCCGGAGGCGTTCCGCGCCGCCACGTGTTCGTTAACTGTTGATTGGTGGCACATAAGCAATCGTAGTCCGTCAAATTCAGCTCTGTTATCCCGGGCGTTATGTGTCAAATGGCGTAGAACGGGATTGACTGTTTGACGGTAGCTGCTGAGGCGG(G/T)AGAGACCCTCCGTCGGGCTATGTCACTAATACTTTCCAAACGCCCCGTACCGATGCTGAACAAGTCGATGCAGGCTCCCGTCTTTGAAAAGGGGTAAACATACAAGTGGATAGATGATGGGTAGGGGCCTCCAATACATCCAACACTCTACGCCCTCTCCAAGAGCTAGAAGGGCACCCTGCAGTTGGAAAGGG",
    insertion:
      "CACACCTACACTGCTCGAAGTAAATATGCGAAGCGCGCGGCCTGGCCGGAGGCGTTCCGCGCCGCCACGTGTTCGTTAACTGTTGATTGGTGGCACATAAGCAATCGTAGTCCGTCAAATTCAGCTCTGTTATCCCGGGCGTTATGTGTCAAATGGCGTAGAACGGGATTGACTGTTTGACGGTAGCTGCTGAGGCGGGA(+GTAA)GAGACCCTCCGTCGGGCTATGTCACTAATACTTTCCAAACGCCCCGTACCGATGCTGAACAAGTCGATGCAGGCTCCCGTCTTTGAAAAGGGGTAAACATACAAGTGGATAGATGATGGGTAGGGGCCTCCAATACATCCAACACTCTACGCCCTCTCCAAGAGCTAGAAGGGCACCCTGCAGTTGGAAAGGG",
    deletion:
      "CACACCTACACTGCTCGAAGTAAATATGCGAAGCGCGCGGCCTGGCCGGAGGCGTTCCGCGCCGCCACGTGTTCGTTAACTGTTGATTGGTGGCACATAAGCAATCGTAGTCCGTCAAATTCAGCTCTGTTATCCCGGGCGTTATGTGTCAAATGGCGTAGAACGGGATTGACTGTTTGACGGTAGCTGCTGAGGCGGGAG(-AGAC)CCTCCGTCGGGCTATGTCACTAATACTTTCCAAACGCCCCGTACCGATGCTGAACAAGTCGATGCAGGCTCCCGTCTTTGAAAAGGGGTAAACATACAAGTGGATAGATGATGGGTAGGGGCCTCCAATACATCCAACACTCTACGCCCTCTCCAAGAGCTAGAAGGGCACCCTGCAGTTGGAAAGGG",
    substitution_insertion_deletion:
      "CACACCTACACTGCTCGAAGTAAATATGCGAAGCGCGCGGCCTGGCCGGAGGCGTTCCGCGCCGCCACGTGTTCGTTAACTGTTGATTGGTGGCACATAAGCAATCGTAGTCCGTCAAATTCAGCTCTGTTATCCCGGGCGTTATGTGTCAAATGGCGTAGAACGGGATTGACTGTTTGACGGTAGCTGCTGAGGCGG(G/T)A(+GTAA)G(-AGAC)CCTCCGTCGGGCTATGTCACTAATACTTTCCAAACGCCCCGTACCGATGCTGAACAAGTCGATGCAGGCTCCCGTCTTTGAAAAGGGGTAAACATACAAGTGGATAGATGATGGGTAGGGGCCTCCAATACATCCAACACTCTACGCCCTCTCCAAGAGCTAGAAGGGCACCCTGCAGTTGGAAAGGG",
  },
  // 参数说明
  input_sequences_popover_content: `Edit formatting examples:Substitution (ATGC/CGTA)| Insertion (+ATGC) | Deletion (-ATGC)`,
  content: `Predicted cleavage position: -3bp from the end of the provided sgRNA sequence`,
  pegLIT_content: `Automatically identify non-interfering nucleotide linkers between a pegRNA and 3&apos; motif.`,
  linker_pattern_content: `Usually set to N with 8bp: NNNNNNNN`,
  incorporated_structured_rna_motifs_content: `Incorporated the structured RNA motifs to the 3′ terminus of pegRNAs that enhance their stability and prevent degradation of the 3′ extension. The resulting engineered pegRNAs improve prime editing efficiency 3–4-fold and without increasing off-target editing activity.`,
};

//crispr ra
import crisper_a from "@/assets/Image/crisper_a.png";
export const crispr_ra_data = {
  // 介绍部分属性
  introductionProps: {
    imgSrc: crisper_a, // 图片路径
    imgClassName: "intro_img", // 图片样式
    title: "Design of CRISPR activation guide RNAs", // 标题
    content: `CCRISPR activation (CRISPRa) is an optimized method for specific gene overexpression. CRISPRa uses an inactivated CRISPR-Cas9 system (dCas9) to upregulate target genes within their native context. This method offers many advantages over more traditional gene overexpression techniques, such as cDNA and ORF.`, // 内容
    components: [
      "Temporary or sustained overexpression options",
      "CRISPR-based gene targeting specificity",
      "Upregulation within the gene's native context",
      "Natural cellular post-transcriptional processing",
      "Highly biologically relevant overexpression models",
    ], // 组件列表
  },
  example: {
    ID: "Ghjin_A01G000010",
    Position: "Ghjin_A01:80323913-80324566",
    Sequence: `>Ghjin_A01G000010
ATGTTGAAACAAGATGGAACTCTGTGTTCCTTCTCACCGTGCATGGAGCAAGTGCAACGTTCATGTGAAACTCTGAGATCTGACTTTATAGAGATATATGGACCTTTGAAATACTGCTCCGCATGTATGAAATCTGTGAATGGAAAATGGATCACTCGAAGGTCAATGATGGGAATTCCATTGCATGCTCTCCACACAAGAGGAGGCCGCCTTCAAGTGAAGCAAGTGTGGGGGACAATGCAAGTTCTCCGAGAATCATGGCTTGGCCATCTGCTGAAACTCGAGGGCATACTGGATATTTGA`,
  },
};

//crispr knock in
import crispr_knock_in from "@/assets/Image/knock_in.png";
export const crispr_knock_in_data = {
  // 介绍部分属性
  introductionProps: {
    imgSrc: crispr_knock_in, // 图片路径
    imgClassName: "intro_img", // 图片样式
    title: "Design of CRISPR Knock-ins guide RNAs", // 标题
    content: `CRISPR Knock-in experiments, wherein researchers insert a gene of interest at the specific site, rely on HDR. This mechanism uses a homologous template to repair DSBs and is therefore highly accurate. The precision of the HDR repair pathway can be coupled with the specificity of CRISPR-Cas to introduce the desired sequence into the target genomic region.`, // 内容
    components: [
      "Choose the Right Guide RNA",
      "Pick the Right DNA Donor Template",
      "Single-stranded DNA (ssDNA)",
      "Avoid Re-cutting by Cas9",
      "Optimizing HDR efficiency over NHEJ",
    ], // 组件列表
  },
  example: {
    ID: "Ghjin_A01G000010",
    Position: "Ghjin_A01:80323913-80324566",
    Sequence: `>Ghjin_A01G000010
ATGTTGAAACAAGATGGAACTCTGTGTTCCTTCTCACCGTGCATGGAGCAAGTGCAACGTTCATGTGAAACTCTGAGATCTGACTTTATAGAGATATATGGACCTTTGAAATACTGCTCCGCATGTATGAAATCTGTGAATGGAAAATGGATCACTCGAAGGTCAATGATGGGAATTCCATTGCATGCTCTCCACACAAGAGGAGGCCGCCTTCAAGTGAAGCAAGTGTGGGGGACAATGCAAGTTCTCCGAGAATCATGGCTTGGCCATCTGCTGAAACTCGAGGGCATACTGGATATTTGA`,
  },
};

//crispr epigenome
import crisper_epigenome from "@/assets/Image/crisper_epigenome.png";
export const crisper_epigenome_data = {
  // 介绍部分属性
  introductionProps: {
    imgSrc: crisper_epigenome, // 图片路径
    imgClassName: "intro_img", // 图片样式
    title: "Design of Epigenetics Editing guide RNAs", // 标题
    content: `
    The epigenome involves a complex set of cellular processes governing genomic activity.
Epigenome Editing (EE) enables researchers to activate and repress endogenous gene expression and can provide graded control over
 gene regulation. Recruitment of epigenome editing effector domains using CRISPR/Cas systems allows site-specific control over modifications to DNA, histones, and chromatin architecture.
    `, // 内容
    components: [
      "histone acetylation",
      "histone demethylation",
      "cytosine methylation",
      "cytosine demethylation",
    ], // 组件列表
  },
  example: {
    ID: "Ghjin_A01G000010",
    Position: "Ghjin_A01:80323913-80324566",
    Sequence: `>Ghjin_A01G000010
ATGTTGAAACAAGATGGAACTCTGTGTTCCTTCTCACCGTGCATGGAGCAAGTGCAACGTTCATGTGAAACTCTGAGATCTGACTTTATAGAGATATATGGACCTTTGAAATACTGCTCCGCATGTATGAAATCTGTGAATGGAAAATGGATCACTCGAAGGTCAATGATGGGAATTCCATTGCATGCTCTCCACACAAGAGGAGGCCGCCTTCAAGTGAAGCAAGTGTGGGGGACAATGCAAGTTCTCCGAGAATCATGGCTTGGCCATCTGCTGAAACTCGAGGGCATACTGGATATTTGA`,
  },
};

// fe
import deletion from "@/assets/Image/deletion.png";
export const fe_data = {
  // 介绍部分属性
  introductionProps: {
    imgSrc: deletion, // 图片路径
    imgClassName: "intro_img", // 图片样式
    title: "Design of Fragment Deletion Editing guide RNAs", // 标题
    content: `Base editors (BE) have two principal components that are fused together to form a single protein: (i) a CRISPR protein, bound to a guide RNA, and (ii) a base editing enzyme, such as a deaminase, which carries out the desired chemical modification of the target DNA base. `, // 内容
    components: [
      "The creation of precise, predictable and efficient genetic outcomes at a targeted sequence",
      "High efficiency editing without need for template-based homology directed repair",
      "Avoidance of the unwanted consequences of double-stranded DNA breaks",
    ], // 组件列表
  },
  example: {
    position: {
      left: "Ghir_A01:80323913-80324566",
      right: "Ghir_A01:80923900-80924588",
    },
    sequence: {
      left: `ATGTTGAAACAAGATGGAACTCTGTGTTCCTTCTCACCGTGCATGGAGCAAGTGCAACGTTCATGTGAAACTCTGAGATCTGACTTTATAGAGATATATGGACCTTTGAAATACTGCTCCGCATGTATGAAATCTGTGAATGGAAAATGGATCACTCGAAGGTCAATGATGGGAATTCCATTGCATGCTCTCCACACAAGAGGAGGCCGCCTTCAAGTGAAGCAAGTGTGGGGGACAATGCAAGTTCTCCGAGAATCATGGCTTGGCCATCTGCTGAAACTCGAGGGCATACTGGATATTTGA`,
      right: `ATGTTGAAACAAGATGGAACTCTGTGTTCCTTCTCACCGTGCATGGAGCAAGTGCAACGTTCATGTGAAACTCTGAGATCTGACTTTATAGAGATATATGGACCTTTGAAATACTGCTCCGCATGTATGAAATCTGTGAATGGAAAATGGATCACTCGAAGGTCAATGATGGGAATTCCATTGCATGCTCTCCACACAAGAGGAGGCCGCCTTCAAGTGAAGCAAGTGTGGGGGACAATGCAAGTTCTCCGAGAATCATGGCTTGGCCATCTGCTGAAACTCGAGGGCATACTGGATATTTGA`,
    },
  },
};

// help
export const helpItems = [
  {
    id: "crisprone",
    question: "What is CRISPRone?",
    answer:
      "CRISPRone is a comprehensive web-based tool for CRISPR-based genome editing design. It integrates various CRISPR systems including Cas9, Cas12, Cas13, Base Editors, Prime Editors, and more.",
  },
  {
    id: "characteristics",
    question: "What are the characteristics of CRISPRone?",
    answer:
      "CRISPRone features include: multi-system support, intuitive interface, comprehensive analysis tools, and real-time design validation. It supports various organisms and provides detailed guide RNA predictions.",
  },
  { id: "enzymes", question: "Notes on enzymes", answer: "answer" },
  { id: "genomes", question: "Notes on genomes", answer: "answer" },
  { id: "cas9", question: "How do you use Cas9 design?", answer: "answer" },
  {
    id: "cas12_cpf1",
    question: "How do you use Cas12 Cpf1 design?",
    answer: "answer",
  },
  {
    id: "cas12_c2c1",
    question: "How do you use Cas12 C2c1 design?",
    answer: "answer",
  },
  { id: "cas13", question: "How do you use Cas13 design?", answer: "answer" },
  {
    id: "base_editor",
    question: "How do you use Base Editor design?",
    answer: "answer",
  },
  {
    id: "prime_editor",
    question: "How do you use Prime Editor design?",
    answer: "answer",
  },
  {
    id: "prime_editing",
    question: "How prime editing works?",
    answer: "answer",
  },
  {
    id: "prime_editor_design",
    question: "Using the Prime Editor design tool in CRISPRone",
    answer: "answer",
  },
  {
    id: "crispr_knockin",
    question: "How do you use CIRSPRa design?",
    answer: "answer",
  },
  {
    id: "crispr_knockin2",
    question: "How do you use CIRSPR Knock-in design?",
    answer: "answer",
  },
  {
    id: "epigenome",
    question: "How do you use CIRSPR Epigenome design?",
    answer: "answer",
  },
  {
    id: "fragment_editor",
    question: "How do you use Fragment Editor design?",
    answer:
      "The Fragment Editor allows you to edit larger DNA sequences. Steps include: 1) Input your target sequence 2) Select modification type 3) Design and validate your editing strategy 4) Review predicted outcomes",
  },
];
