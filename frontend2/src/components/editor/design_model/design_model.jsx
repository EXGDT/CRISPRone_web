import { Modal, Button } from 'antd';
import PropTypes from 'prop-types';

function DesignModel({ isModalVisible, handleCancel, tempFormData, handleStartDesign, loading, showResultsButton, handleConfirm }) {
    // 格式化字段名称
    // const getFieldName = (key) => {
    //     const fieldMap = {
    //         input_sequences: '输入序列',
    //         pam_type: 'PAM类型',
    //         target_genome: '目标基因组',
    //         customized_pam: '自定义PAM',
    //         sgRNA_module: 'sgRNA模块',
    //         spacer_length: '间隔长度',
    //         base_window: '碱基窗口',
    //         substitution_module: '替换模块',
    //         cut_distance_to_pam: '切割距离到PAM',
    //         pegRNA_spacer_gc_content: 'pegRNA间隔GC含量',
    //         pbs_length: 'PBS长度',
    //         pbs_gc_content: 'PBS GC含量',
    //         recommended_tm_of_pbs_sequence: 'PBS序列推荐Tm值',
    //         homologous_rt_template_length: '同源RT模板长度',
    //         exclude_first_c_in_rt_template: '排除同源RT模板第一个C',
    //         dual_pegRNA_model: '双pegRNA模型',
    //         ngRNA_spacers_same_pam_with_pegRNA: 'ngRNA间隔序列与pegRNA相同PAM',
    //         distance_of_secondary_nicking_sgRNAs_to_pegRNA: '二次切割sgRNA到pegRNA的距离',
    //         pegLIT: 'pegLIT',
    //         linker_pattern: 'linker pattern',
    //         incorporated_structured_rna_motifs: 'incorporated structured rna motifs',
    //         forward_primer: '前导引物',
    //         spacer_sequence: '间隔序列',
    //         reverse_primer: '反向引物',
    //         pbs_rt_template: 'PBS和RT模板序列',
    //         remember: '记住选择',
    //         flanking_template_length: 'flanking模版长度',
    //         left_flanking: '左flank',
    //         right_flanking: '右flank',
    //         flanking: 'flank序列',
    //     };
    //     return fieldMap[key] || key;
    // };

    // 格式化字段值
    const formatValue = (key, value) => {
        if (Array.isArray(value)) {
            return value.join(' - '); // 将数组格式化为以逗号分隔的字符串
        }
        if (typeof value === 'boolean') {
            return value ? '是' : '否';
        }
        if (value === '') {
            return 'Not Set';
        }
        return value;
    };

    return (
        <>
            {/* 添加确认弹窗 */}
            <Modal
                title="Confirm Design"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null} // 不使用默认的footer
                width={500}
            >
                <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>Please confirm the following design parameters:</p>
                {/* 展示表单数据 */}
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {tempFormData && Object.entries(tempFormData).map(([key, value]) => (
                        <div 
                            key={key} 
                            style={{
                                display: 'flex',
                                padding: '8px',
                                borderBottom: '1px solid #f0f0f0'
                            }}
                        >
                            <div style={{ 
                                minWidth: '180px', 
                                fontWeight: 'bold',
                                color: '#666'
                            }}>
                                {/* {getFieldName(key)}： */}
                                {key}:
                            </div>
                            <div style={{ flex: 1 , maxWidth: '220px', maxHeight: '200px', overflowY: 'auto'}}>
                                {formatValue(key, value)}
                            </div>
                        </div>
                    ))}
                </div>
                {/* 开始设计按钮和重新设计按钮 */}
                <div style={{ 
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px'
                }}>
                    <Button
                        type="primary"
                        onClick={handleStartDesign}
                        loading={loading} // 加载状态
                    >
                        Start Design
                    </Button>
                    <Button
                        onClick={handleCancel}
                    >
                        Re-design
                    </Button>
                </div>
                {showResultsButton && ( // 根据状态显示"展示结果"按钮
                    <div style={{ 
                        marginTop: '20px',
                        borderTop: '1px solid #f0f0f0',
                        paddingTop: '20px',
                        textAlign: 'center'
                    }}>
                        <Button
                            type="primary"
                            onClick={() => {
                                handleConfirm();
                                setTimeout(() => {
                                    handleConfirm();
                                }, 500);
                            }}
                        >
                            Show Results
                        </Button>
                    </div>
                )}
            </Modal>
        </>
    );
}

// 定义 PropTypes
DesignModel.propTypes = {
    isModalVisible: PropTypes.bool.isRequired,
    handleCancel: PropTypes.func.isRequired,
    tempFormData: PropTypes.object,  // 修改这里，允许为null或undefined
    handleStartDesign: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    showResultsButton: PropTypes.bool.isRequired,
    handleConfirm: PropTypes.func.isRequired,
};

export default DesignModel;