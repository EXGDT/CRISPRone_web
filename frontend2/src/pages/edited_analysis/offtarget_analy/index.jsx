import off_target_analy from '@/assets/Image/offtarget_ana.png';
import dna_levels from '@/assets/Image/dna_levels.png';
import rna_levels from '@/assets/Image/rna_levels.png';
import './index.scss';

// 介绍部分属性
const introductionProps = {
    imgSrc: off_target_analy, // 图片路径
    title: 'What are off-target effects and why are concerning?', // 标题
    content: `Off-target CRISPR effects are unintended editing events that occur at untargeted sites in the genome that are genetically similar to the
         targeted site. A large number of studies have reported that there can occur in CRISPR edited plants. Therefore, it is necessary to detect the o
         ff-target mutatuin in transgenic plants. And for different CRISPR systems, this kind of off-target usually exists at the level of DNA and RNA.`, // 内容
    components: `The whole genome DNA and transcriptome of transgenic lines and controls were sequenced. Reference genome alignment and SNV call were 
        carried out, and then the genome distribution of SNV was counted. A workflow of these steps is in here.`,
    };
const contensProps = {
    dna_img: dna_levels,
    dna_para_one: `Genomic DNA was extracted from young leaves of an individual cotton plant (transgenic, negative (undergone tissue culture and plant regeneration but without T-DNA insertion) and WT) using the Pl
        ant Genomic DNA Kit (Tiangen Biotech, China). A total of four plants, including one WT plant, one negative plant, and two base editor plants, edited by GhABE7.10-nCas9 and GhABE7.10-dCas9 with two pair
        s of sgRNAs for GhPEBP (tRNA-sgRNA1-tRNA-sgRNA2) gene, were used to evaluate genome-wide genetic variants. For each plant, ca. 1.5 μg genomic DNA was prepared to generate a standard Illumina short-read
         genomic library and paired-end sequencing (2 × 150 bp) on the Illumina HiSeq 2500 sequencer in accordance with the manufacturer’s recommendations (Illumina, San Diego, CA), ultimately resulting in more than 1 
         Tb raw reads (the average depth being 50×). The filtered (Trimmomatic) and quality-checked (FastQC) clean reads were mapped to the reference-grade Gossypium hirsutum L. acc. TM-1 genome 
         (http://cotton.hzau.edu.cn/EN/download.php) with BWA (v0.7.17). Samtools (v1.9) was used to filter multiple mapping reads and sort BAM files by read name. The picard program (v2.1.1)
          (http://broadinstitute.github.io/picard/) was used to mark duplicative reads, and the Genome Analysis Toolkit (GATK v4.1), Sentieon (201911) (https://www.sentieon.com/), and LoFreq (v2.1.5) were employed to
           variant calling. The high-confidence SNVs, which had to be identified by all three software and filtered with parameters “QD < 2.0 || FS > 60.0 || MQ < 40.0 || MQRankSum < -12.5 || ReadPosRankSum < -8.0,” wer
           e used for subsequent analysis.`,
    dna_para_two: `Off-target sites were predicted by Cas-OFFinder (v2.4), allowing up to 5-nt mismatches. SnpEff was used to annotation and predicts the effects of each off-target variant based on Gossypium hirsutum L. acc. TM-1 genome.`,
    dna_para_three: `The Integrative Genomics Viewer (IGV) was used to check obtained SNVs.`,
    rna_img: rna_levels,
    rna_para_one: `The samples from individual plants that were used to detect off-target genomic mutations were also prepared for RNA-editing analysis. The total RNA of four plants described above was isolated as 
    previously described. For library construction, mRNAs were fragmented and converted to cDNA using oligo (dT) primers (Invitrogen, Carlsbad, CA, USA). High-throughput mRNA sequencing was carried out using the Il
    lumina Hiseq platform according to the manufacturer’s recommended protocol. We generated an average of 50× paired-end reads for each sample. Illumina paired-end reads were processed as previously described. In 
    brief, FastQC (v.0.11.8) and Trimmomatic (v.0.36) were used for quality control. Qualified reads were mapped to the reference genome Gossypium hirsutum L. acc. TM-1 genome (http://cotton.hzau.edu.cn/EN/download.php)
     using STAR (v.2.7.1a) in two-pass mode. Picard tools (v.2.9.2) was then applied to sort and mark duplicates of the mapped BAM files. RNA base editing variants were called using GATK (v4.1) and Sentieon (201911) 
     (https://www.sentieon.com/) from the refined BAM files. High-confidence SNVs were identified using both software. To identify variants with high confidence, we filtered variants with parameters “QD < 2.0 || FS > 60.0
      || MQ < 40.0 || MQRankSum < -12.5 || ReadPosRankSum < -8.0” and clusters of at least five SNVs that were within a window of 35 bases. The sum of mutations A-to-G and T-to-C were counted as edited as previously 
      described.`,
    rna_para_two:`SnpEff was also used to annotate and predict the effects of each off-target variant as for the above WGS analysis.`,
    rna_para_three:`The 20-bp sequences adjacent to off-target RNA-SNVs (containing NGG PAM in downstream region) were extracted from the Gossypium hirsutum L. acc. TM-1 genome and aligned using the R package msa.`,
    how_para_one:`Clone the software of DNA-seq-gatk-variant-calling<svg viewBox="0 0 1024 1024" width="15" height="15"><path d="M1009.777778 503.466667l-443.733334-455.111111c-5.688889-5.688889-11.377778 0-11.377777 5.688888v267.377778C8.533333 409.6 2.844444 918.755556 17.066667 932.977778c0 0 45.511111-48.355556 164.977777-113.777778 85.333333-48.355556 224.711111-85.333333 369.777778-102.4v261.688889c0 8.533333 11.377778 11.377778 14.222222 5.688889l443.733334-480.711111z m-398.222222 358.4v-199.111111l-36.977778-2.844445c-221.866667 8.533333-378.311111 73.955556-497.777778 156.444445 76.8-275.911111 267.377778-403.911111 466.488889-438.044445l68.266667-2.844444v-199.111111l312.888888 312.888888s8.533333 5.688889 8.533334 14.222223-8.533333 14.222222-8.533334 14.222222l-312.888888 344.177778z" fill="#1E2AE6"></path></svg>and RNA-seq-gatk-variant-calling<svg viewBox="0 0 1024 1024" width="15" height="15"><path d="M1009.777778 503.466667l-443.733334-455.111111c-5.688889-5.688889-11.377778 0-11.377777 5.688888v267.377778C8.533333 409.6 2.844444 918.755556 17.066667 932.977778c0 0 45.511111-48.355556 164.977777-113.777778 85.333333-48.355556 224.711111-85.333333 369.777778-102.4v261.688889c0 8.533333 11.377778 11.377778 14.222222 5.688889l443.733334-480.711111z m-398.222222 358.4v-199.111111l-36.977778-2.844445c-221.866667 8.533333-378.311111 73.955556-497.777778 156.444445 76.8-275.911111 267.377778-403.911111 466.488889-438.044445l68.266667-2.844444v-199.111111l312.888888 312.888888s8.533333 5.688889 8.533334 14.222223-8.533333 14.222222-8.533334 14.222222l-312.888888 344.177778z" fill="#1E2AE6"></path></svg>, and modify the config.yaml file for editing analysis.`,
    how_para_two:`Then run it with command as follows:`,
    how_para_three:`snakemake -j 100 -s workflow/Snakefile --use-conda --cluster-config config/cluster.json --cluster "bsub -q normal -o {cluster.output} -e {cluster.error} -n {threads}"`,
}

function OffTarget() {
    return (
        <div className="off_target_analy">
            <div className="introduction">
                {/* 左边的图片 */}
                <img src={introductionProps.imgSrc} alt="" className="introduction_img" />
                {/* 右边的文字内容 */}
                <div className="introduction_text">
                    <div className="introduction_text_top">
                        <h3 className="introduction_title">{introductionProps.title}</h3>
                        <p className="introduction_content">
                            {introductionProps.content}
                        </p>
                    </div>
                    <div className="introduction_text_bottom">
                        <h3>How to do?</h3>
                        <p>
                            {introductionProps.components}
                        </p>
                    </div>
                </div>
            </div>
            <div className="body">
                <div className="dna_level items">
                    <div className="title">
                        <span>DNA levels</span>
                    </div>
                    <hr />
                    <img src={contensProps.dna_img} alt="" />
                    <div className="content">
                        <h2>Detection of off-target mutations at DNA levels by WGS</h2>
                        <p>{contensProps.dna_para_one}</p>
                        <p>{contensProps.dna_para_two}</p>
                        <p>{contensProps.dna_para_three}</p>
                    </div>
                </div>
                <div className="rna_level items">
                    <div className="title">
                        <span>RNA levels</span>
                    </div>
                    <hr />
                    <img src={contensProps.rna_img} alt="" />
                    <div className="content">
                        <h2>Detection of off-target mutations in RNA sequence</h2>
                        <p>{contensProps.rna_para_one}</p>
                        <p>{contensProps.rna_para_two}</p>
                        <p>{contensProps.rna_para_three}</p>
                    </div>
                </div>
                <div className="how_to_do items">
                    <div className="title">
                        <span>How do I identify CRISPR editing off-target sites?</span>
                    </div>
                    <hr />
                    <div className="para">
                    <p className="how_para_one">Clone the software of DNA-seq-gatk-variant-calling<svg viewBox="0 0 1024 1024" width="15" height="15"><path d="M1009.777778 503.466667l-443.733334-455.111111c-5.688889-5.688889-11.377778 0-11.377777 5.688888v267.377778C8.533333 409.6 2.844444 918.755556 17.066667 932.977778c0 0 45.511111-48.355556 164.977777-113.777778 85.333333-48.355556 224.711111-85.333333 369.777778-102.4v261.688889c0 8.533333 11.377778 11.377778 14.222222 5.688889l443.733334-480.711111z m-398.222222 358.4v-199.111111l-36.977778-2.844445c-221.866667 8.533333-378.311111 73.955556-497.777778 156.444445 76.8-275.911111 267.377778-403.911111 466.488889-438.044445l68.266667-2.844444v-199.111111l312.888888 312.888888s8.533333 5.688889 8.533334 14.222223-8.533333 14.222222-8.533334 14.222222l-312.888888 344.177778z" fill="#1E2AE6"></path></svg>and RNA-seq-gatk-variant-calling<svg viewBox="0 0 1024 1024" width="15" height="15"><path d="M1009.777778 503.466667l-443.733334-455.111111c-5.688889-5.688889-11.377778 0-11.377777 5.688888v267.377778C8.533333 409.6 2.844444 918.755556 17.066667 932.977778c0 0 45.511111-48.355556 164.977777-113.777778 85.333333-48.355556 224.711111-85.333333 369.777778-102.4v261.688889c0 8.533333 11.377778 11.377778 14.222222 5.688889l443.733334-480.711111z m-398.222222 358.4v-199.111111l-36.977778-2.844445c-221.866667 8.533333-378.311111 73.955556-497.777778 156.444445 76.8-275.911111 267.377778-403.911111 466.488889-438.044445l68.266667-2.844444v-199.111111l312.888888 312.888888s8.533333 5.688889 8.533334 14.222223-8.533333 14.222222-8.533334 14.222222l-312.888888 344.177778z" fill="#1E2AE6"></path></svg>, and modify the config.yaml file for editing analysis.</p>
                    <p className="how_para_two">{contensProps.how_para_two}</p>
                    <p className="how_para_three">{contensProps.how_para_three}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OffTarget;