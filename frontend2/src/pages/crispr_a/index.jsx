import { InfoCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { crispr_ra_data as data } from '@/utils/datas/static-data';
import { target_genome, crispra_PAM_Types as PAM_Types } from '@/utils/datas/options';
import { crispra_form_origin as origin } from '@/utils/datas/form-origin';
import { initJBrowseState } from '@/components/editor/result/conf/jbrowseState.jsx';
import SequenceInput from '@/components/editor/SequenceInput/SequenceInput';
import CustomizedPAM from '@/components/editor/customized_pam/customized';
import DesignModel from '@/components/editor/design_model/design_model';
import './index.scss';

function Crispera() {
    // 介绍
    const introductionProps = data.introductionProps;
    // 示例
    const example = data.example;
    // 创建表单实例
    const [form] = Form.useForm();
    // 状态管理
    const [PamType, setPamType] = useState('');// PAM类型
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showResultsButton, setShowResultsButton] = useState(false);
    const [designToken, setDesignToken] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tempFormData, setTempFormData] = useState(null);

    // 表单提交
    const onFinish = (values) => {
        setTempFormData(values);
        setIsModalVisible(true);
    };

    // 回填示例
    const handleExampleClick = (record) => {
        let type = record.target.value;
        let temp = '';
        switch (type) {
            case '':
                temp = '';
                break;
            case 'id':
                temp = example.ID;
                break;
            case 'position':
                temp = example.Position;
                break;
            case 'sequence':
                temp = example.Sequence;
                break;
            default:
                temp = 'No example available';
        }
        form.setFieldsValue({
            input_sequences: temp
        });
    };

    // 确认提交处理
    const handleConfirm = () => {
        setIsModalVisible(false);
        navigate('/crispr/result/crispra_submit', {
            state: {
                token: designToken,
                formData: tempFormData
            }
        });
    };

    // 取消提交
    const handleCancel = () => {
        setIsModalVisible(false);
        setTempFormData(null);
        setLoading(false);
        setShowResultsButton(false);
    };

    // 开始设计
    const handleStartDesign = async () => {
        setLoading(true);
        try {
            // 获取 token
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    let token;
                    switch (tempFormData.target_genome) {
                        case 'Beta_vulgaris':
                            token = '001';
                            break;
                        case 'Camelina_sativa':
                            token = '002';
                            break;
                        case 'Phaseolus_vulgaris':
                            token = '003';
                            break;
                        case 'Gossypium_hirsutum_Jin668_HZAU':
                            token = '004';
                            break;
                        case 'Brassica_napus':
                            token = '005';
                            break;
                        default:
                            token = '006';
                    }
                    resolve({ token });
                }, 2000);
            });

            // 获取结果数据并初始化 JBrowse
            let resultFile;
            switch (response.token) {
                case '001':
                    resultFile = 'Beta_vulgaris_TCAGTGTTTGCCATGAGGCAAAGGTTTGCTGTTTCTTCAGTTGGTTGTTCCT_Guide.json';
                    break;
                case '002':
                    resultFile = 'Camelina_sativa_gene.json';
                    break;
                case '003':
                    resultFile = 'Phaseolus_vulgaris_gene.json';
                    break;
                case '004':
                    resultFile = 'cas9_result_cas9_list.json';
                    break;
                case '005':
                    resultFile = 'Bruassica_napus_LK033659_27681_27736_Guide.json';
                    break;
            }

            const configResponse = await fetch(`/api/demo/${resultFile}`);
            if (!configResponse.ok) {
                throw new Error('获取配置失败');
            }
            const configData = await configResponse.json();

            // 初始化 JBrowse 状态
            initJBrowseState(configData.JbrowseInfo);

            setDesignToken(response.token);
            localStorage.setItem('cas9_design_params', JSON.stringify(tempFormData));
            localStorage.setItem('cas9_design_token', response.token);

            setLoading(false);
            setShowResultsButton(true);
        } catch (error) {
            console.error('设计失败:', error);
            setLoading(false);
            Modal.error({
                title: '设计失败',
                content: '请稍后重试'
            });
        }
    };

    return (
        <div className="crisper_a">
            <div className="introduction">
                {/* 左边的图片 */}
                <img src={introductionProps.imgSrc} alt="" className={introductionProps.imgClassName} />
                {/* 右边的文字内容 */}
                <div className="text_content">
                    <div className="text_content_design">
                        <h3 className="design_title">{introductionProps.title}</h3>
                        <p className="design_content">
                            {introductionProps.content}
                            <a href="https://horizondiscovery.com/en/applications/crisprmod/crispra" target="_blank" rel="noopener noreferrer">
                                <InfoCircleOutlined />
                            </a>
                        </p>
                    </div>
                    <div className="text_content_componens">
                        <h3>Advantages:</h3>
                        <div className="components_ul">
                            <ul>
                                {introductionProps.components.map((component, index) => (
                                    <li key={index}>{component}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="form">
                <Form
                    form={form}
                    onFinish={onFinish}
                    name="crisper_a_form"
                    layout='vertical'
                    initialValues={origin}
                >
                    <SequenceInput onExampleClick={handleExampleClick} />
                    <div className="substitution">
                        <p>When inputting the gene ID, the 2000bp sequence upstream of the gene is selected by default for sgRNA design.</p>
                        <p>Or you can modify the parameter 5&apos; flanking sequence length (upstream) to specify the length.</p>
                    </div>

                    <CustomizedPAM
                        PamType={PamType}
                        setPamType={setPamType}
                        baseEditors={target_genome}
                        pamOptions={PAM_Types} // 从数据源获取特定页面的选项
                    />
                    <Form.Item label="5' flanking sequence length (upstream):" name="flanking_length" wrapperCol={{ span: 11 }}>
                        <Input placeholder="2000" />
                    </Form.Item>
                    {/* 提交按钮 */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Design CRISPRa sgRNAs 》
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <DesignModel
                isModalVisible={isModalVisible}
                handleCancel={handleCancel}
                tempFormData={tempFormData}
                handleStartDesign={handleStartDesign}
                loading={loading}
                showResultsButton={showResultsButton}
                handleConfirm={handleConfirm}
            />
        </div>
    )
}

export default Crispera;