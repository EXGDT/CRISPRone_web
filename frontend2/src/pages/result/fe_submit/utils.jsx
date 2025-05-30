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