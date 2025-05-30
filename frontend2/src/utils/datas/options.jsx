// Target genome选项
export const target_genome = [
    { value: "Actinidia_chinensis", label:"Actinidia chinensis" },
    { value: "Aegilops_tauschii", label:"Aegilops tauschii" },
    { value: "Aegle_marmelos", label:"Aegle marmelos" },
    { value: "Arabidopsis_thaliana", label:"Arabidopsis thaliana" },
    { value: "Asparagus_officinalis", label:"Asparagus officinalis" },
    { value: "Avena_sativa", label:"Avena sativa" },
    { value: "Beta_vulgaris", label:"Beta vulgaris" },
    { value: "Brassica_napus", label:"Brassica napus" },
    { value: "Camelina_sativa", label:"Camelina sativa" },
    { value: "Capsicum_annuum", label:"Capsicum annuum" },
    { value: "Chenopodium_quinoa", label:"Chenopodium quinoa" },
    { value: "Citrus_australasica", label:"Citrus australasica" },
    { value: "Citrus_clementina", label:"Citrus clementina" },
    { value: "Citrus_hongheensis", label:"Citrus hongheensis" },
    { value: "Citrus_ichangensis", label:"Citrus ichangensis" },
    { value: "Citrus_mangshanensis", label:"Citrus mangshanensis" },
    { value: "Citrus_medica", label:"Citrus medica" },
    { value: "Citrus_reticulata", label:"Citrus reticulata" },
    { value: "Citrus_sinensis", label:"Citrus sinensis" },
    { value: "Clausena_lansium", label:"Clausena lansium" },
    { value: "Coffea_canephora", label:"Coffea canephora" },
    { value: "Cucumis_melo", label:"Cucumis melo" },
    { value: "Cucumis_sativus", label:"Cucumis sativus" },
    { value: "Daucus_carota", label:"Daucus carota" },
    { value: "Ficus_carica", label:"Ficus carica" },
    { value: "Fortunella_hindsii", label:"Fortunella_hindsii" },
    { value: "Glycine_max", label:"Glycine max" },
    { value: "Gossypium_hirsutum_Jin668_HZAU", label:"Gossypium hirsutum Jin668 HZAU" },
    { value: "Gossypium_hirsutum_Jin668_V1.1_HZAU", label:"Gossypium hirsutum Jin668 V1.1 HZAU" },
    { value: "Helianthus_annuus", label:"Helianthus annuus" },
    { value: "Hordeum_vulgare", label:"Hordeum vulgare" },
    { value: "Manihot_esculenta", label:"Manihot esculenta" },
    { value: "Oryza_nivara", label:"Oryza nivara" },
    { value: "Oryza_sativa", label:"Oryza sativa" },
    { value: "Oryza_sativa_japnase", label:"Oryza sativa japnase" },
    { value: "Papaver_somniferum", label:"Papaver somniferum" },
    { value: "Phaseolus_vulgaris", label:"Phaseolus vulgaris" },
    { value: "Physcomitrium_patens", label:"Physcomitrium patens" },
    { value: "Pistacia_vera", label:"Pistacia vera" },
    { value: "Pisum_sativum", label:"Pisum sativum" },
    { value: "Rosa_chinensis", label:"Rosa chinensis" },
    { value: "Saccharum_spontaneum", label:"Saccharum spontaneum" },
    { value: "Sesamum_indicum", label:"Sesamum_indicum" },
    { value: "Solanum_lycopersicum", label:"Solanum_lycopersicum" },
    { value: "Sorghum_bicolor", label:"Sorghum bicolor" },
    { value: "Theobroma_cacao", label:"Theobroma cacao" },
    { value: "Triticum_aestivum", label:"Triticum aestivum" },
    { value: "Vigna_radiata", label:"Vigna radiata" },
    { value: "Vitis_vinifera", label:"Vitis vinifera" },
    { value: "Zea_mays", label:"Zea mays" },
];
// PAM Types选项
export const cas9_PAM_Types = [
    { value: 'NGG', label: 'SpCas9 from Streptococcus pyogenes: 5\'-NGG-3\'' },
    { value: 'PAM', label: "Customized PAM: 5'-XXX-3'" },
    { value: 'NG', label: "NG-Cas9 or xCas9 3.7 (TLlkDlV SpCas9) from Streptococcus pyogenes: 5'-NG-3'" },
    { value: 'NNG', label: "20bp-NNG- Cas9 S. canis" },
    { value: 'NGN', label: "20bp-NGN-SpG" },
    { value: 'NNGT', label: "20bp-NNGT-Cas9 S. canis- high efficiency PAM, recommended" },
    { value: 'NAA', label: "20bp-NAA-iSpyMacCas921bp-NNG(A/G)(A/G)T- Cas9 s. Aureus" },
    { value: 'NNGRRT', label: "20bp-NNG(A/G)(A/G)T-Cas9 S. Aureus with 20bp-guides" },
    { value: 'NGK', label: "20bp-NG(G/T)-xCas9, recommended PAM, see notes" },
    { value: 'NNNRRT', label: "21bp-NNN(A/G)(A/G)T-KKH SaCas9" },
    { value: 'NNNRRT-20', label: "20bp-NNN(A/G)(A/G)T-KKH SaCas9 with 20bp-guides" },
    { value: 'NGA', label: "20bp-NGA- Cas9 S. Pyogenes mutant VQR" },
    { value: 'NNNNCC', label: "24bp-NNNNCC-Nme2Cas9" },
    { value: 'NGCG', label: "20bp-NGCG-Cas9 S. Pyogenes mutant VRER" },
    { value: 'NNAGAA', label: "20bp-NNAGAA-Cas9 S.Thermophilus" },
    { value: 'NGGNG', label: "20bp-NGGNG-Cas9 S.Thermophilus" },
    { value: 'NNNNGRTT', label: "20bp-NNNNG(A/C)TT-Cas9 N. Meningitidis" },
    { value: 'NNNNACA', label: "20bp-NNNNACA- Cas9 Campylobacter jejuni, original PAM" },
    { value: 'NNNNRYAC', label: "22bp-NNNNRYAC-Cas9 Campylobacter jejuni, revised PAM" },
    { value: 'NNNVRYAC', label: "22bp-NNNVRYAC-Cas9 Campylobacter jejuni, opt. efficiency" },
    { value: 'TTCN', lable: "TTCN-20bp-CasX" },
    { value: 'YTTV', label: "YTTV-20bp-MAD7 Nuclease, Lui, Schiel, Maksimova et al, CRISPR J 2020" },
    { value: 'NNNNCNAA', label: "20bp-NNNNCNAA-Thermo Cas9 - Walker et al, Metab Eng Comm 2020" },
    { value: 'NNN', label: "20bp-NNN-SpRY, Walton et al Science 2020" },
    { value: 'NRN', label: "20bp-NRN-SpRY (high efficiency PAM)" },
    { value: 'NYN', label: "20bp-NYN-SpRY (low efficiency PAM)" },
]
export const cpf1_PAM_Types = [
    { value: 'TTTR', label: "TTT(A/C/G)-23bp-Cas12a(Cpf1)-recommended, 23bp guides" },
    { value: 'PAM', label: "Customized PAM: 5'-XXX-3'" },
    { value: 'TTR', label: "TT(A/C/G)-23bp-Cas12a (Cpf1)-recommended, 23bp guides" },
    { value: 'TTTRIDT', label: "TTT(A/C/G)-21bp-Cas12a (Cpf1)-21bp guides recommended by IDT" },
    { value: 'TTTN', label: "TTTN-23bp-Cas12a(Cpf1)-low efficiency" },
    { value: 'NGTN', label: "NGTN-23bp-ShCAST/AcCAST, Strecker et al, Science 2019" },
    { value: 'TRCR', label: "T(C/T)C(A/C/G)-23bp-TYCV As-Cpf1 K607R" },
    { value: 'TATR', label: "TAT(A/C/G)-23bp-TATV AS-Cpf1 K548V" },
    { value: 'TTTA', label: "TTTA-23bp-TTTA LbCpf1" },
    { value: 'TCTA', label: "TCTA-23bp-TCTA LbCpf1" },
    { value: 'TCCA', label: "TCCA-23bp-TCCA LbCpf1" },
    { value: 'CCCA', label: "CCCA-23bp-CCCA LbCpf1" },
    { value: 'GGTT', label: "GGTT-23bp-CCCA LbCpf1" },
    { value: 'TTYN', label: "TTYN- Or VTTV- orTRTV-23bp -enCas12aE174R/S542R/K548R -Kleinstiver et al Nat Biot 2019" },
];
export const c2c1_PAM_Types = [
    { value: 'TTN', label: "TTN-20bp-Ghcas12b" },
    { value: 'PAM', label: "Customized PAM: 5'-XXX-3'" },
    { value: 'ATTN', label: "ATTN-23bp-BhCas12b v4" },
];
export const baseEditors_PAM_Types = [
    { value: 'NGG', label: "SpCas9 from Streptococcus pyogenes: 5'-NGG-3'" },
    { value: 'NG', label: "NG-Cas9 or xCas9 3.7 (TLlKDIV SpCas9) from Streptococcus pyogenes: 5'-NG-3'" },
    { value: 'PAM', label: "Customized PAM: 5'-XXX-3'" },
];
export const primer_PAM_Types = [
    { value: 'NGG', label: 'SpCas9 from Streptococcus pyogenes: 5&apos;-NGG-3&apos' },
    { value: 'NG', label: 'NG-Cas9 or xCas9 3.7 (TLlKDlV SpCas9) from Streptococcus pyogenes: 5&apos;-NG-3&apos' },
    { value: 'NNG', label: '20bp-NNG - Cas9 S. cani' },
    { value: 'NGN', label: '20bp-NGN - Sp' },
    { value: 'NNGT', label: '20bp-NNGT - Cas9 S. canis - high efficiency PAM, recommende' },
    { value: 'NAA', label: '20bp-NAA - iSpyMacCas' },
    { value: 'NNGRRT', label: '21bp-NNG(A/G)(A/G)T - Cas9 S. Aureu' },
    { value: 'NNGRRT-20', label: '20bp-NNG(A/G)(A/G)T - Cas9 S. Aureus with 20bp-guide' },
    { value: 'NGK', label: '20bp-NG(G/T) - xCas9, recommended PAM, see note' },
    { value: 'NNNRRT', label: '21bp-NNN(A/G)(A/G)T - KKH SaCas' },
    { value: 'NNNRRT-20', label: '20bp-NNN(A/G)(A/G)T - KKH SaCas9 with 20bp-guide' },
    { value: 'NGA', label: '20bp-NGA - Cas9 S. Pyogenes mutant VQ' },
    { value: 'NNNNCC', label: '24bp-NNNNCC - Nme2Cas' },
    { value: 'NGCG', label: '20bp-NGCG - Cas9 S. Pyogenes mutant VRE' },
    { value: 'NNAGAA', label: '20bp-NNAGAA - Cas9 S. Thermophilu' },
    { value: 'NGGNG', label: '20bp-NGGNG - Cas9 S. Thermophilu' },
    { value: 'NNNNGMTT', label: '20bp-NNNNG(A/C)TT - Cas9 N. Meningitidi' },
    { value: 'NNNNACA', label: '20bp-NNNNACA - Cas9 Campylobacter jejuni, original PA' },
    { value: 'NNNNRYAC', label: '22bp-NNNNRYAC - Cas9 Campylobacter jejuni, revised PA' },
    { value: 'NNNVRYAC', label: '22bp-NNNVRYAC - Cas9 Campylobacter jejuni, opt. efficienc' },
    { value: 'NNNNCNAA', label: '20bp-NNNNCNAA - Thermo Cas9 - Walker et al, Metab Eng Comm 202' },
    { value: 'NNN', label: '20bp-NNN - SpRY, Walton et al Science 202' },
]
export const crispra_PAM_Types = [
    { value: 'NGG', label: "SpCas9 from Streptococcus pyogenes: 5'-NGG-3'" },
    { value: 'NG', label: "NG-Cas9 or xCas9 3.7 (TLlKDIV SpCas9) from Streptococcus pyogenes: 5'-NG-3'" },
    { value: 'PAM', label: "Customized PAM: 5'-XXX-3'" },
]
export const knockin_PAM_Types = [
    { value: 'NGG', label: "SpCas9 from Streptococcus pyogenes: 5'-NGG-3'" },
    { value: 'NG', label: "NG-Cas9 or xCas9 3.7 (TLlKDIV SpCas9) from Streptococcus pyogenes: 5'-NG-3'" },
    { value: 'PAM', label: "Customized PAM: 5'-XXX-3'" },
]
export const epigenome_PAM_Types = [
    { value: 'NGG', label: "SpCas9 from Streptococcus pyogenes: 5'-NGG-3'" },
    { value: 'NG', label: "NG-Cas9 or xCas9 3.7 (TLlKDIV SpCas9) from Streptococcus pyogenes: 5'-NG-3'" },
    { value: 'PAM', label: "Customized PAM: 5'-XXX-3'" },
];
export const fragment_PAM_Types = [
    { value: 'NGG', label: "SpCas9 from Streptococcus pyogenes: 5'-NGG-3'" },
    { value: 'NG', label: "NG-Cas9 or xCas9 3.7 (TLlKDIV SpCas9) from Streptococcus pyogenes: 5'-NG-3'" },
    { value: 'PAM', label: "Customized PAM: 5'-XXX-3'" },
];




















