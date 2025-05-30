import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, Row, Col, message } from 'antd';
import { InfoCircleOutlined, ForwardOutlined } from '@ant-design/icons';
import { cas13_data } from '@/utils/datas/static-data';
import {target_genome} from '@/utils/datas/options';
import {cas13_form_origin as origin } from '@/utils/datas/form-origin';
import DesignModel from '@/components/editor/design_model/design_model';
import { PostTokenCas13 } from '@/utils/api/api';


function Cas13() {
    // 介绍部分属性
    const introductionProps = cas13_data.introductionProps;
    // 基因组序列、基因组位置、基因组ID（回填信息）
    const example = cas13_data.example;
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { TextArea } = Input;
    // 状态管理
    const [loading, setLoading] = useState(false);
    const [showResultsButton, setShowResultsButton] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tempFormData, setTempFormData] = useState(null);
    const [token, setToken] = useState(null);

    // 表单提交处理
    const onFinish = (values) => {
        setTempFormData(values);
        setIsModalVisible(true);
    };

    // 开始设计处理
    const handleStartDesign = async () => {
        try {
            setLoading(true);
            // 这里是模拟的POST请求，实际使用时替换为真实的API调用
            const response = await PostTokenCas13(tempFormData)
            // 这是实际的POST请求
            setToken(response.token);
            setShowResultsButton(true);
            message.success('Design completed successfully!');
        } catch (error) {
            message.error('Design failed, please try again.', error);
        } finally {
            setLoading(false);
        }
    };

    // 确认提交处理
    const handleConfirm = () => {
        // 保存表单数据和token到localStorage
        if (tempFormData && token) {
            localStorage.setItem('cas13_form_data', JSON.stringify(tempFormData));
            localStorage.setItem('cas13_token', token);
            
            // 跳转到结果页面
            navigate('/crispr/result/cas13_submit');
        }
        setIsModalVisible(false);
    };

    // 取消提交
    const handleCancel = () => {
        setTempFormData(null);
        setToken(null);
        setLoading(false);
        setShowResultsButton(false);
        setIsModalVisible(false);
    };

    // 检查配置
    useEffect(() => {
        const savedUrls = localStorage.getItem('crispr_urls');
        if (!savedUrls) {
            const currentPath = window.location.pathname;
            if (currentPath.includes('/result')) {
                navigate('/cas13');
            }
        }
    }, [navigate]);

    return (
        <div className="crispr_main">
            <div className="introduction">
                <img src={introductionProps.imgSrc} alt="" className="introduction_img" />
                <div className="introduction_text">
                    <div className="introduction_text_top">
                        <h3 className="introduction_title">{introductionProps.title}</h3>
                        <p className="introduction_content">
                            {introductionProps.content}
                            <a href="https://www.synthego.com/blog/crispr-knockin-tips-tricks" target="_blank">
                                <InfoCircleOutlined />
                            </a>
                        </p>
                    </div>
                    <div className="introduction_text_bottom">
                        <h3>
                            Advantages:
                        </h3>
                        <div className="introduction_ul">
                            <ul>
                                {introductionProps.components.map((component, index) => (
                                    <li key={index}>
                                        {component}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="design_form">
                <Form
                    form={form}
                    onFinish={onFinish}
                    name="cas13_form"
                    layout='vertical'
                    initialValues={origin}
                >
                    {/* 文本框 */}
                    <Form.Item
                        label="Input Sequences (Only One Id/Position/Sequence required; Design speed: Id = Position > Fasta Sequence)"
                        name={'input_sequences'}
                    >
                        <TextArea
                            placeholder="Autosize height with minimum and maximum number of lines"
                            autoSize={{
                                minRows: 5,
                                maxRows: 20,
                            }}
                        />
                    </Form.Item>
                    {/* 两个按钮 */}
                    <Row gutter={14}>
                        <Col span={1} />
                        <Col span={7}>
                            <div style={{ cursor: 'pointer', border: '1px solid #ccc', borderRadius: '5px', padding: '5px', backgroundColor: '#fff' }}
                                onClick={() => {
                                    form.setFieldsValue({
                                        input_sequences: example.Sequence ? example.Sequence : 'No example available'
                                    })
                                }}>
                                Example of <ForwardOutlined /> <span style={{ textDecoration: 'underline' }}>Genome Sequence (fasta format)</span>
                            </div>
                        </Col>
                        <Col span={8}></Col>
                        <Col span={3}>
                            <Form.Item>
                                <Button
                                    color='danger'
                                    variant='solid'
                                    onClick={() => {
                                        form.setFieldsValue({
                                            input_sequences: ''
                                        });
                                    }}
                                >
                                    Clear
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* 下拉框 */}
                    <Row>
                        <Col span={11}>
                            <Form.Item
                                label={<span>Target Genome
                                    <span onClick={() => {
                                        window.location.href = '/crispr/help#genomes';
                                    }} style={{ textDecoration: 'underline', color: '#1B2AE6' }}>
                                        More Information of Genomes Metadata
                                        <svg viewBox="0 0 1024 1024" width="15" height="15"><path d="M1009.777778 503.466667l-443.733334-455.111111c-5.688889-5.688889-11.377778 0-11.377777 5.688888v267.377778C8.533333 409.6 2.844444 918.755556 17.066667 932.977778c0 0 45.511111-48.355556 164.977777-113.777778 85.333333-48.355556 224.711111-85.333333 369.777778-102.4v261.688889c0 8.533333 11.377778 11.377778 14.222222 5.688889l443.733334-480.711111z m-398.222222 358.4v-199.111111l-36.977778-2.844445c-221.866667 8.533333-378.311111 73.955556-497.777778 156.444445 76.8-275.911111 267.377778-403.911111 466.488889-438.044445l68.266667-2.844444v-199.111111l312.888888 312.888888s8.533333 5.688889 8.533334 14.222223-8.533333 14.222222-8.533334 14.222222l-312.888888 344.177778z" fill="#1E2AE6"></path></svg></span></span>}
                                name={'target_genome'}
                            >
                                <Select placeholder="Select a base editor">
                                    {target_genome.map((editor, index) => {
                                        try {
                                            return (
                                                <Select.Option key={index} value={editor.value}>
                                                    {editor.label}
                                                </Select.Option>
                                            );
                                        } catch (error) {
                                            console.error(`Error rendering option for ${editor.label}:`, error);
                                            return null; // 如果出现错误，跳过该选项
                                        }
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={11}>
                            <Form.Item label='Spacer length of Customized PAM' name={'spacer_length'}>
                                <Input placeholder="Spacer length of Customized PAM"></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* 提交按钮 */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Design Cas13 sgRNAs 》
                        </Button>
                    </Form.Item>
                </Form>
                <DesignModel
                    loading={loading}
                    showResultsButton={showResultsButton}
                    isModalVisible={isModalVisible}
                    tempFormData={tempFormData}
                    handleConfirm={handleConfirm}
                    handleCancel={handleCancel}
                    handleStartDesign={handleStartDesign}
                />
            </div>
        </div>
    )
}

export default Cas13;