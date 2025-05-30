import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Slider, Modal, Radio } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { baseEditor_data } from '@/utils/datas/static-data';
import { target_genome, baseEditors_PAM_Types as PAM_Types } from '@/utils/datas/options';
import { baseEditors_form_origin as origin } from '@/utils/datas/form-origin';
import CustomizedPAM from '@/components/editor/customized_pam/customized';
import DesignModel from '@/components/editor/design_model/design_model';
import SequenceInput from '@/components/editor/SequenceInput/SequenceInput';
import { PostTokenBE } from '@/utils/api/api';
import './index.scss';

function Base_editer() {
    const navigate = useNavigate();
    // 介绍部分属性
    const introductionProps = baseEditor_data.introductionProps;
    // 基因组序列、基因组位置、基因组ID（回填信息）
    const example = baseEditor_data.example;
    const [form] = Form.useForm();
    const [PamType, setPamType] = useState('');
    const [loading, setLoading] = useState(false);
    const [showResultsButton, setShowResultsButton] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tempFormData, setTempFormData] = useState(null);
    const [token, setToken] = useState('');

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
    // 表单提交处理逻辑
    const onFinish = (values) => {
        setTempFormData(values);
        setIsModalVisible(true);
    };
    // 确认提交处理
    const handleConfirm = () => {
        setLoading(false); // 停止加载
        setIsModalVisible(false);
        // 4，跳转到结果页面
        navigate('/crispr/result/be_submit', {
            state: {
                formData: tempFormData,
                token: token,
            }
        });

    };
    // 取消提交
    const handleCancel = () => {
        setIsModalVisible(false);
        setTempFormData(null);
        setLoading(false); // 停止加载
        setShowResultsButton(false); // 隐藏结果按钮
    };
    // 开始设计
    const handleStartDesign = async () => {
        setLoading(true); // 开始加载
        setShowResultsButton(false); // 确保展示结果按钮隐藏
        try {
            // 1，获取 token
            const data = await PostTokenBE(tempFormData);
            const { token } = data;

            // 2，保存token
            setToken(token);
            localStorage.setItem('BE_design_params', JSON.stringify(tempFormData));
            localStorage.setItem('BE_design_token', token);

            setLoading(false); // 停止加载
            setShowResultsButton(true); // 显示展示结果按钮

        } catch (error) {
            console.error('配置更新失败:', error);
            setLoading(false); // 停止加载
            setShowResultsButton(true); // 显示展示结果按钮
            Modal.error({
                title: '配置更新失败',
                content: '请稍后重试',
            });
        }
    };

    // 检查是否有保存的配置
    useEffect(() => {
        const savedUrls = localStorage.getItem('crispr_urls');
        if (!savedUrls) {
            // 如果直接访问结果页面且没有配置，重定向到cas9页面
            const currentPath = window.location.pathname;
            if (currentPath.includes('/result')) {
                navigate('/base_editer');
            }
        }
    }, [navigate]);

    return (
        <div className="crispr_main">
            <div className="introduction">
                <img src={introductionProps.imgSrc} alt="" className="introduction_img" />
                <div className="introduction_text">
                    <div className="introduction_text_top">
                        <h3 className="introduction_title">
                            {introductionProps.title}
                        </h3>
                        <p className="introduction_content">
                            {introductionProps.content}
                            <a href="https://www.nature.com/articles/s41586-019-1711-4" target="_blank" rel="noopener noreferrer">
                                <InfoCircleOutlined />
                            </a>
                        </p>
                    </div>
                    <div className="introduction_text_middle">
                        <h3>
                            Advantages:
                        </h3>
                        <div className="introduction_ul">
                            <ul>
                                {introductionProps.advantages.map((advantage, index) => (
                                    <li key={index}>{advantage}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="introduction_text_bottom">
                        <h3>
                            Note:
                        </h3>
                        <p className="introduction_text_bottom_content">
                            {introductionProps.note}
                        </p>
                    </div>
                </div>
            </div>
            <div className="design_form">
                <Form
                    form={form}
                    onFinish={onFinish}
                    name="crispr_form"
                    layout='vertical'
                    initialValues={origin}
                >
                    <SequenceInput onExampleClick={handleExampleClick} />
                    {/* ABE (A to G)     CBE (C to T)    GBE (C to G)     ABE + CBE */}
                    <Form.Item 
                        name={'substitution_module'}
                        rules={[{ required: true, message: 'Please select a base editing module' }]}
                    >
                        <Radio.Group className="custom-radio-group">
                            <Radio.Button value="ABE" className="custom-radio-button">ABE (A to G)</Radio.Button>
                            <Radio.Button value="CBE" className="custom-radio-button">CBE (C to T)</Radio.Button>
                            <Radio.Button value="GBE" className="custom-radio-button">GBE (C to G)</Radio.Button>
                            <Radio.Button value="ABE + CBE" className="custom-radio-button">ABE + CBE</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <CustomizedPAM
                        PamType={PamType}
                        setPamType={setPamType}
                        baseEditors={target_genome}
                        pamOptions={PAM_Types} // 从数据源获取特定页面的选项
                    />
                    <Form.Item 
                        label="Base editing window" 
                        name={'base_window'}
                        rules={[{ required: true, message: '请设置碱基编辑窗口' }]}
                    >
                        <Slider
                            range
                            max={20}
                            min={10}
                            marks={{
                                10: '10',
                                20: '20',
                            }}
                            tooltip={{
                                open: true,
                            }}
                        />
                    </Form.Item>
                    {/* 提交按钮 */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Design basgRNAs 》
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

export default Base_editer;