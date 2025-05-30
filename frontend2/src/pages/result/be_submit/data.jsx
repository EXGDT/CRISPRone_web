const parameters = {
    sequences: [
        {
            label: "Input Sequence",
            value: `>Ghjin_A01g000050
GGGTTAAGTTTGTTATGTTGCTTGTATTTCTGCGTGCCTTTTCTACTCTGAAGATACCAG
GATGTAACTTTGGTGATCTTTCTTCTTATTCTTGCCCTCCTCCCCTTTTAAAGATTTGGG
CTCACTCAGATAAAGGACCATCACCATCTCCATATGTAGCAACTCCACGAGCGCTTGTCC
AAGCTGCTTTTTGTATGGCCATGTTTCTTTACCTTTCACCATCTCGTCCCTTGTCCTGGT
TTACTGATCCTGCATACCAAGAATGGGGATTCTGGAGGAAGTTGAGTTACCAATATATGT
CTGGTTTTACAATGCGGTGGAAATATTATTTCATCTGGTCAATTTCAGAGGCTGCTATGG
TTATTTCTGGCCTGGGTTTCAGTGGATGGACTGAATCTTCACCACCAAAACCAAAATGGG
ATCGAGCAAAGGTTGTTGATATCCTAGGGTTTGAGTTAGCAAAGAGTTCAGTGCTGTTAC
CACTTGTCTTGAACATACAAG`,
            type: "plain"
        }],
    settings: [
        { label: "Substitution module", value: "ABE" },
        { label: "Pam Type", value: "NGG" },
        { label: "Target Genome", value: "Gossypium_hirsutum_Jin668_HZAU" },
        { label: "Customized PAM", value: "-" },
        { label: "sgRNA Module", value: "spacerpam" },
        { label: "Spacer Length", value: "20" },
        { label: "Base editing window", value: [14, 16] }
    ]
}

const data = {
    "Sequence_Info": {
        "title": "homo sapiens FANCM, exon 2",
        "sequence_info": {
            "seq_num": "316",
            "sequence": "GGTCTACACAAGCTTCCACCAGGAAGGAAATATGGTGCAGTAAGAGAGTGCTTTTTCTTACACCTCAGGTCATGGTAAATGACCTTTCTAGAGGAGCTTGTCCCGCTGCTGAAATAAAGTGTTTAGTTATTGATGAAGCTCATAAAGCTCTCGGAAACTATGCTTATTGCCAG"
        },
        "amino_acid_info": {
            "seq_num": "316",
            "aminoacid": "GLHKLPPGRKYGAVRECFFLHLRSWXMTFLEELVPLLKXSVXLLMKLIKLSETMLIA"
        }
    },
    "Bool": false,
    "Pam": {
        "type": "NGG",
        "bool": "False"
    },
    "Table_data": [
        {
            "crisprTarget": "GGTCTACACAAGCTTCCACCAGG",
            "editingWindowSequence": "CTACA",
            "position": 1,
            "direction": "+",
            "gcContents": 55,
            "amino_acid_info": {
                "before": "LH",
                "after": "LY"
            },
            "seq_info": {
                "before": "CTACAC",
                "after": "TTATAC"
            },
            "msg_one": [
                [
                    -1,
                    0,
                    20,
                    3,
                    7
                ],
                [
                    -1,
                    20,
                    23
                ]
            ],
            "msg_two": [
                [
                    3,
                    9,
                    "_L__Y_"
                ],
                [
                    1,
                    10,
                    "_V__Y__T_"
                ],
                [
                    2,
                    8,
                    "_F__I_"
                ]
            ]
        },
        {
            "crisprTarget": "TACACAAGCTTCCACCAGGAAGG",
            "editingWindowSequence": "ACAAG",
            "position": 5,
            "direction": "+",
            "gcContents": 50,
            "amino_acid_info": {
                "before": "HK",
                "after": "HK"
            },
            "seq_info": {
                "before": "CACAAG",
                "after": "CATAAG"
            },
            "msg_one": [
                [
                    -1,
                    4,
                    24,
                    7,
                    11
                ],
                [
                    -1,
                    24,
                    27
                ]
            ],
            "msg_two": [
                [
                    6,
                    12,
                    "_H__K_"
                ],
                [
                    7,
                    13,
                    "_I__S_"
                ],
                [
                    5,
                    14,
                    "_T_Ter_A_"
                ]
            ]
        },
        {
            "crisprTarget": "CTTCCACCAGGAAGGAAATATGG",
            "editingWindowSequence": "CCACC",
            "position": 13,
            "direction": "+",
            "gcContents": 45,
            "amino_acid_info": {
                "before": "PP",
                "after": "LL"
            },
            "seq_info": {
                "before": "CCACCA",
                "after": "TTATTA"
            },
            "msg_one": [
                [
                    -1,
                    12,
                    32,
                    15,
                    19
                ],
                [
                    -1,
                    32,
                    35
                ]
            ],
            "msg_two": [
                [
                    15,
                    21,
                    "_L__L_"
                ],
                [
                    13,
                    22,
                    "_F__Y_Ter"
                ],
                [
                    14,
                    20,
                    "_F__I_"
                ]
            ]
        },
        {
            "crisprTarget": "GCACCATATTTCCTTCCTGGTGG",
            "editingWindowSequence": "CCATA",
            "position": 16,
            "direction": "-",
            "gcContents": 50,
            "amino_acid_info": {
                "before": "YG",
                "after": "YN"
            },
            "seq_info": {
                "before": "TATGGT",
                "after": "TATAAT"
            },
            "msg_one": [
                [
                    -1,
                    18,
                    38,
                    30,
                    34
                ],
                [
                    -1,
                    15,
                    18
                ]
            ],
            "msg_two": [
                [
                    30,
                    36,
                    "_Y__N_"
                ],
                [
                    28,
                    37,
                    "_N__I__M_"
                ],
                [
                    29,
                    35,
                    "_I_Ter"
                ]
            ]
        },
        {
            "crisprTarget": "ACTGCACCATATTTCCTTCCTGG",
            "editingWindowSequence": "GCACC",
            "position": 19,
            "direction": "-",
            "gcContents": 45,
            "amino_acid_info": {
                "before": "GA",
                "after": "NT"
            },
            "seq_info": {
                "before": "GGTGCA",
                "after": "AATACA"
            },
            "msg_one": [
                [
                    -1,
                    21,
                    41,
                    33,
                    37
                ],
                [
                    -1,
                    18,
                    21
                ]
            ],
            "msg_two": [
                [
                    33,
                    39,
                    "_N__T_"
                ],
                [
                    31,
                    40,
                    "_I__I__Q_"
                ],
                [
                    32,
                    38,
                    "Ter_Y_"
                ]
            ]
        },
        {
            "crisprTarget": "AGTGCTTTTTCTTACACCTCAGG",
            "editingWindowSequence": "GCTTT",
            "position": 47,
            "direction": "+",
            "gcContents": 40,
            "amino_acid_info": {
                "before": "CF",
                "after": "CF"
            },
            "seq_info": {
                "before": "TGCTTT",
                "after": "TGTTTT"
            },
            "msg_one": [
                [
                    -1,
                    46,
                    66,
                    49,
                    53
                ],
                [
                    -1,
                    66,
                    69
                ]
            ],
            "msg_two": [
                [
                    48,
                    54,
                    "_C__F_"
                ],
                [
                    49,
                    55,
                    "_V__F_"
                ],
                [
                    47,
                    56,
                    "_V__F__F_"
                ]
            ]
        },
        {
            "crisprTarget": "TTTTCTTACACCTCAGGTCATGG",
            "editingWindowSequence": "TCTTA",
            "position": 53,
            "direction": "+",
            "gcContents": 40,
            "amino_acid_info": {
                "before": "FL",
                "after": "FL"
            },
            "seq_info": {
                "before": "TTCTTA",
                "after": "TTTTTA"
            },
            "msg_one": [
                [
                    -1,
                    52,
                    72,
                    55,
                    59
                ],
                [
                    -1,
                    72,
                    75
                ]
            ],
            "msg_two": [
                [
                    54,
                    60,
                    "_F__L_"
                ],
                [
                    55,
                    61,
                    "_F__Y_"
                ],
                [
                    53,
                    62,
                    "_F__F__T_"
                ]
            ]
        },
        {
            "crisprTarget": "AGGTCATTTACCATGACCTGAGG",
            "editingWindowSequence": "TCATT",
            "position": 63,
            "direction": "-",
            "gcContents": 45,
            "amino_acid_info": {
                "before": "XMT",
                "after": "XIT"
            },
            "seq_info": {
                "before": "TAAATGACC",
                "after": "TAAATAACC"
            },
            "msg_one": [
                [
                    -1,
                    65,
                    85,
                    77,
                    81
                ],
                [
                    -1,
                    62,
                    65
                ]
            ],
            "msg_two": [
                [
                    75,
                    84,
                    "Ter_I__T_"
                ],
                [
                    76,
                    82,
                    "_K_Ter"
                ],
                [
                    77,
                    83,
                    "_N__N_"
                ]
            ]
        },
        {
            "crisprTarget": "CGGGACAAGCTCCTCTAGAAAGG",
            "editingWindowSequence": "GACAA",
            "position": 83,
            "direction": "-",
            "gcContents": 55,
            "amino_acid_info": {
                "before": "LV",
                "after": "LI"
            },
            "seq_info": {
                "before": "CTTGTC",
                "after": "CTTATC"
            },
            "msg_one": [
                [
                    -1,
                    85,
                    105,
                    97,
                    101
                ],
                [
                    -1,
                    82,
                    85
                ]
            ],
            "msg_two": [
                [
                    96,
                    102,
                    "_L__I_"
                ],
                [
                    97,
                    103,
                    "_L__S_"
                ],
                [
                    95,
                    104,
                    "_A__Y__P_"
                ]
            ]
        },
        {
            "crisprTarget": "AAACACTTTATTTCAGCAGCGGG",
            "editingWindowSequence": "CACTT",
            "position": 102,
            "direction": "-",
            "gcContents": 35,
            "amino_acid_info": {
                "before": "XSV",
                "after": "XNI"
            },
            "seq_info": {
                "before": "TAAAGTGTT",
                "after": "TAAAATATT"
            },
            "msg_one": [
                [
                    -1,
                    104,
                    124,
                    116,
                    120
                ],
                [
                    -1,
                    101,
                    104
                ]
            ],
            "msg_two": [
                [
                    114,
                    123,
                    "Ter_N__I_"
                ],
                [
                    115,
                    121,
                    "_K__I_"
                ],
                [
                    116,
                    122,
                    "_K__Y_"
                ]
            ]
        },
        {
            "crisprTarget": "TAAACACTTTATTTCAGCAGCGG",
            "editingWindowSequence": "ACACT",
            "position": 103,
            "direction": "-",
            "gcContents": 30,
            "amino_acid_info": {
                "before": "SV",
                "after": "NI"
            },
            "seq_info": {
                "before": "AGTGTT",
                "after": "AATATT"
            },
            "msg_one": [
                [
                    -1,
                    105,
                    125,
                    117,
                    121
                ],
                [
                    -1,
                    102,
                    105
                ]
            ],
            "msg_two": [
                [
                    117,
                    123,
                    "_N__I_"
                ],
                [
                    115,
                    124,
                    "_K__I__F_"
                ],
                [
                    116,
                    122,
                    "_K__Y_"
                ]
            ]
        },
        {
            "crisprTarget": "GATGAAGCTCATAAAGCTCTCGG",
            "editingWindowSequence": "GAAGC",
            "position": 132,
            "direction": "+",
            "gcContents": 40,
            "amino_acid_info": {
                "before": "MKL",
                "after": "MKF"
            },
            "seq_info": {
                "before": "ATGAAGCTC",
                "after": "ATGAAGTTC"
            },
            "msg_one": [
                [
                    -1,
                    131,
                    151,
                    134,
                    138
                ],
                [
                    -1,
                    151,
                    154
                ]
            ],
            "msg_two": [
                [
                    132,
                    141,
                    "_M__K__F_"
                ],
                [
                    133,
                    139,
                    "Ter_S_"
                ],
                [
                    134,
                    140,
                    "_E__V_"
                ]
            ]
        }
    ]
}

// 处理MD和序列,高亮显示错误碱基
const processMdAndSequence = (md, sequence) => {
    if (!md || !sequence) {
        return sequence || '';
    }

    let processedSeq = '';
    let seqIndex = 0;
    let i = 0;

    while (i < md.length && seqIndex < sequence.length) {
        let num = '';
        // 收集数字
        while (i < md.length && /\d/.test(md[i])) {
            num += md[i];
            i++;
        }

        if (num) {
            const segmentLength = parseInt(num, 10);
            // 添加匹配的序列部分
            processedSeq += `<span style="color:black;">${sequence.slice(seqIndex, seqIndex + segmentLength)}</span>`;
            seqIndex += segmentLength;
        }

        // 处理错配碱基
        if (i < md.length && /[A-Z]/.test(md[i])) {
            if (seqIndex < sequence.length) {
                processedSeq += `<span style="color:red;font-weight:bold;">${sequence[seqIndex]}</span>`;
                seqIndex++;
            }
            i++;
        }
    }

    return processedSeq;
};
// 处理序列，加粗或减淡碱基
const processSequence = (editingWindowSequence, before, after, direction) => {
    // 如果direction为-，先处理editingWindowSequence
    if (direction === '-') {
        // 首尾相反
        editingWindowSequence = editingWindowSequence.split('').reverse().join('');
        // 碱基互补替换
        editingWindowSequence = editingWindowSequence.replace(/[ATCG]/g, (base) => {
            switch (base) {
                case 'A': return 'T';
                case 'T': return 'A';
                case 'C': return 'G';
                case 'G': return 'C';
                default: return base;
            }
        });
    }

    // 找到editingWindowSequence在before中的位置
    const startIndex = before.indexOf(editingWindowSequence);

    // 处理新增字符（灰色标记）
    let grayIndices = [];
    if (startIndex === -1) {
        // 如果editingWindowSequence不在before中，说明是前缀
        grayIndices = Array.from({ length: editingWindowSequence.length }, (_, i) => i);
    } else {
        // 如果editingWindowSequence在before中，说明是后缀
        grayIndices = Array.from({ length: editingWindowSequence.length },
            (_, i) => i + startIndex + editingWindowSequence.length);
    }

    // 处理不同字符（红色标记）
    const redIndices = [];
    for (let i = 0; i < before.length; i++) {
        if (before[i] !== after[i]) {
            redIndices.push(i);
        }
    }

    // 构建最终HTML
    let result = ``;
    for (let i = 0; i < after.length; i++) {
        const char = after[i];
        if (grayIndices.includes(i)) {
            result += `<span style="color:#CECECE">${char}</span>`;
        } else if (redIndices.includes(i)) {
            result += `<span style="color:#383838"><b>${char}</b></span>`;
        } else {
            result += `<span style="color:#6D6D6D">${char}</span>`;
        }
    }

    return result;
}
// 处理氨基酸
const processAminoacid = (before, after) => {
    let result = '';
    for (let i = 0; i < after.length; i++) {
        const char = after[i];
        if (i >= before.length || char !== before[i]) {
            result += `<span style="color:red">&nbsp&nbsp${char}&nbsp&nbsp</span>`;
        } else {
            result += `&nbsp&nbsp${char}&nbsp&nbsp`;
        }
    }
    for (let i = 0; i < result.length; i++) {
        const char = result[i];
        if (char === 'X') {
            result = result.replace('&nbspX&nbsp&nbsp', 'TER');
        }
    }
    return result;
}
const processEditedSequence = (editingWindowSequence, direction, before, after) => {
    // 如果方向为负，则对before和after进行碱基互补替换
    if (direction === '-') {
        before = complementAndReverse(before);
        after = complementAndReverse(after);
    }

    // 在before序列中找到目标窗口位置
    const windowStart = before.indexOf(editingWindowSequence);
    const windowEnd = windowStart + editingWindowSequence.length;

    // 从after中截取对应位置的序列段
    const targetSegment = after.slice(
        Math.max(0, windowStart),
        Math.min(after.length, windowEnd)
    );

    // 对比并标记差异
    return editingWindowSequence.split('').map((char, index) => {
        // 当处理后的序列长度不足时用灰色显示
        if (index >= targetSegment.length) {
            return `<span style="color:#999">${char}</span>`;
        }

        // 标记不同碱基为红色
        return char === targetSegment[index]
            ? char
            : `<span style="color:red">${char}</span>`;
    }).join('');
};

// 辅助函数：对DNA序列进行碱基互补替换并反转
const complementAndReverse = (sequence) => {
    return sequence
        .split('')
        .reverse()
        .map((base) => {
            switch (base) {
                case 'A': return 'T';
                case 'T': return 'A';
                case 'C': return 'G';
                case 'G': return 'C';
                default: return base;
            }
        })
        .join('');
};

// 处理序列高亮
const handleSequenceHighlight = (record, sequence) => {
    const { crisprTarget, direction, position, editingWindowSequence } = record;

    // 处理反向序列
    let processedCrisprTarget = crisprTarget;
    let processedEditingWindow = editingWindowSequence;
    if (direction === '-') {
        processedCrisprTarget = complementAndReverse(crisprTarget);
        processedEditingWindow = complementAndReverse(editingWindowSequence);
    }

    // 获取crispr区域在原始序列中的位置
    const crisprStart = position - 1;
    const crisprEnd = crisprStart + processedCrisprTarget.length;

    // 划分不同区域
    const pamLength = 3;
    let pamStart, pamEnd;

    // 根据方向确定PAM位置
    if (direction === '+') {
        pamStart = crisprEnd - pamLength;
        pamEnd = crisprEnd;
    } else {
        pamStart = crisprStart;
        pamEnd = crisprStart + pamLength;
    }

    // 构建三个区域
    const beforePam = sequence.slice(crisprStart, pamStart);
    const pam = sequence.slice(pamStart, pamEnd);
    const afterPam = sequence.slice(pamEnd, crisprEnd);

    // 构造带样式的HTML字符串
    const styledCrispr = [
        `<span style="background:rgba(0,0,0,0.6); color:#fff">${beforePam}</span>`,
        `<span style="background:#ccc; color:#000">${pam}</span>`,
        `<span style="background:rgba(0,0,0,0.6); color:#fff">${afterPam}</span>`
    ].join('');

    // 在crispr区域中高亮editing window
    const finalHtml = styledCrispr.replace(
        processedEditingWindow,
        `<span style="color:#1890ff">${processedEditingWindow}</span>`
    );

    // 替换原始序列中的对应部分
    const highlightedSeq = [
        sequence.slice(0, crisprStart),
        finalHtml,
        sequence.slice(crisprEnd)
    ].join('');

    return highlightedSeq;
};

export {
    parameters,
    data,
    processMdAndSequence,
    processSequence,
    processAminoacid,
    processEditedSequence,
    complementAndReverse,
    handleSequenceHighlight,
};