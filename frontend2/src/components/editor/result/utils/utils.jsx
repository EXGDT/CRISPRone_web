// 工具函数
// 计算位置
export const calculate_locus = (input, n) => {
    const numberPart = parseInt(input.split(":")[1]) - 5;
    const formattedStartNumber = numberPart.toLocaleString("en-US");
    const endNumber = numberPart + n;
    const formattedEndNumber = endNumber.toLocaleString("en-US");
    return `${input.split(":")[0]}:${formattedStartNumber}..${formattedEndNumber}`;
};
// 处理MD和序列,高亮显示错误碱基
export const processMdAndSequence = (md, sequence) => {
    let processedSeq = '';
    let seqIndex = 0;
    let i = 0;

    while (i < md?.length && seqIndex < sequence?.length) {
        let num = '';
        while (i < md.length && /\d/.test(md[i])) {
            num += md[i];
            i++;
        }
        if (num) {
            const segmentLength = parseInt(num, 10);
            processedSeq += sequence.slice(seqIndex, seqIndex + segmentLength);
            seqIndex += segmentLength;
        }
        if (i < md.length && /[A-Z]/.test(md[i])) {
            if (seqIndex < sequence.length) {
                processedSeq += `<span style="color:red;">${sequence[seqIndex]}</span>`;
                seqIndex++;
            }
            i++;
        }
    }

    return processedSeq;
};

export const Sequence_to_Amino_acid = (sequence, n) => {
    // 密码子表 (U 和 T 是等价的)
    const codonTable = {
        // A - 丙氨酸
        'GCT': 'A', 'GCC': 'A', 'GCA': 'A', 'GCG': 'A',
        // R - 精氨酸
        'CGT': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG': 'R', 'AGA': 'R', 'AGG': 'R',
        // N - 天冬酰胺
        'AAT': 'N', 'AAC': 'N',
        // D - 天冬氨酸
        'GAT': 'D', 'GAC': 'D',
        // E - 谷氨酸
        'GAA': 'E', 'GAG': 'E',
        // Q - 谷氨酰胺
        'CAA': 'Q', 'CAG': 'Q',
        // G - 甘氨酸
        'GGT': 'G', 'GGC': 'G', 'GGA': 'G', 'GGG': 'G',
        // S - 丝氨酸
        'TCT': 'S', 'TCC': 'S', 'TCA': 'S', 'TCG': 'S', 'AGT': 'S', 'AGC': 'S',
        // H - 组氨酸
        'CAT': 'H', 'CAC': 'H',
        // I - 异亮氨酸
        'ATT': 'I', 'ATC': 'I', 'ATA': 'I',
        // L - 亮氨酸
        'TTA': 'L', 'TTG': 'L', 'CTT': 'L', 'CTC': 'L', 'CTA': 'L', 'CTG': 'L',
        // K - 赖氨酸
        'AAA': 'K', 'AAG': 'K',
        // M - 甲硫氨酸（起始密码子）
        'ATG': 'M',
        // F - 苯丙氨酸
        'TTT': 'F', 'TTC': 'F',
        // P - 脯氨酸
        'CCT': 'P', 'CCC': 'P', 'CCA': 'P', 'CCG': 'P',
        // T - 苏氨酸
        'ACT': 'T', 'ACC': 'T', 'ACA': 'T', 'ACG': 'T',
        // V - 缬氨酸
        'GTT': 'V', 'GTC': 'V', 'GTA': 'V', 'GTG': 'V',
        // W - 色氨酸
        'TGG': 'W',
        // Y - 酪氨酸
        'TAT': 'Y', 'TAC': 'Y',
        // 终止密码子
        'TAA': 'Ter', 'TAG': 'Ter', 'TGA': 'Ter'
    };
    // 检查输入
    if (!sequence || typeof n !== 'number' || n < 0 || n > 2) {
        return '';
    }

    // 转换为大写并去除空格
    sequence = sequence.toUpperCase().replace(/\s/g, '');

    // 从指定位置开始，每三个碱基转换为一个氨基酸
    let amino = ' '.repeat(n); // 添加初始空格以对齐
    for (let i = n; i < sequence.length - 2; i += 3) {
        const codon = sequence.slice(i, i + 3);
        if (codon.length === 3) {
            const aa = codonTable[codon] || 'X';
            amino += (aa + '|');
        }
    }

    return amino;
};