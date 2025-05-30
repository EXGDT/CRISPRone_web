import {
    InfoCircleOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { Form, message, Input, Radio, Upload, Button, Row, Col } from 'antd';
import DesignModel from '@/components/editor/design_model/design_model.jsx';
import editing from '@/assets/Image/editing_anal.png'
import './index.scss'
import styled from 'styled-components';

// 介绍部分属性
const introductionProps = {
    imgSrc: editing, // 图片路径
    title: 'What is editing analysis?', // 标题
    content: `When CRISPR plasmids is delivered to infected plants through agrobacterium tumefaciens to complete genetic transformation, we need to know whether the target gene in transgenic offspring is mutated and the type of mutation. There are generally two detection methods: 1) traditional Sanger sequencing, which is usually time-consuming and laborious. 2) Illumina high throughput sequencing.`, // 内容
    components: [
        'Primrt and Barcode design;',
        'PCR amplification and product mixing;',
        'Illumina sequence;',
        'Analysis and plot;',
    ],
};
const origin = {
    prefix: '111',
    skipFlash: 1,
    subgenome: 1,
    editingType: 'cas9',
    extra: 'none',
}

const CustomButton = styled(Radio.Button)`
    width: 180px;
    height: 50px;
    font-size: 16px;
    line-height: 50px;
    text-align: center;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    margin-right: 10px;
    transition: all 0.3s ease;
    color: #666;
    background-color: #f5f5f5;

    &:hover {
        border-color: #40a9ff;
        color: #40a9ff;
    }

    &.ant-radio-button-wrapper-checked {
        background-color: #40a9ff;
        border-color: #40a9ff;
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    &:last-child {
        margin-right: 0;
    }
`;

function EditingAnaly() {

    const [form] = Form.useForm();
    const {TextArea} = Input;
    const [loading, setLoading] = useState(false);
    const [showResultsButton, setShowResultsButton] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tempFormData, setTempFormData] = useState(null);
    const [token, setToken] = useState(null);
    const onFinish = (values) => {
        console.log(values);
    }

    // 确认提交处理
    const handleConfirm = () => {
        // 保存表单数据和token到localStorage
        if (tempFormData && token) {
            console.log('表单数据', tempFormData);
            console.log('token', token);
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

    // 开始设计处理
    const handleStartDesign = async () => {
        try {
            setLoading(true);
            setToken('200');
            setShowResultsButton(true);
            message.success('Design completed successfully!');
        } catch (error) {
            message.error('Design failed, please try again.', error);
        } finally {
            setLoading(false);
        }
    };

    const [value, setValue] = useState(1);
    const onChange = (e) => {
        setValue(e.target.value);
        console.log(`radio checked:${e.target.value}`);
    };

    return (
        <div className="crispr_main">
            <div className="introduction">
                {/* 左边的图片 */}
                <img src={introductionProps.imgSrc} alt="" className="introduction_img" />
                {/* 右边的文字内容 */}
                <div className="introduction_text">
                    <div className="introduction_text_top">
                        <h3 className="introduction_title">{introductionProps.title}</h3>
                        <p className="introduction_content">
                            {introductionProps.content}
                            <a href="https://www.nature.com/articles/s41586-019-1711-4" target="_blank" rel="noopener noreferrer">
                                <InfoCircleOutlined />
                            </a>
                        </p>
                    </div>
                    <div className="introduction_text_bottom">
                        <h3>How to do?</h3>
                        <div className="introduction_ul">
                            <ol>
                                {introductionProps.components.map((component, index) => (
                                    <li key={index}>{component}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <div className='home_title' style={{ maxWidth: 1300 }}>
                <span>How to cite us?</span>
            </div>
            <div className="design_form">
                <Form
                    form={form}
                    onFinish={onFinish}
                    name="editing_analy_form"
                    layout="horizontal"
                    initialValues={origin}
                >
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item label="Prefix:" name="prefix">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={4}></Col>
                        <Col span={4}>
                            <Form.Item label='Skip Flash:' name='skipFlash'>
                                <Radio.Group
                                    onChange={onChange}
                                    value={value}
                                    options={[
                                        {
                                            value: 1,
                                            label: 'Yes'
                                        },
                                        {
                                            value: 2,
                                            label: 'No'
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label='Subgenome:' name='subgenome'>
                                <Radio.Group
                                    onChange={onChange}
                                    value={value}
                                    options={[
                                        {
                                            value: 1,
                                            label: 'Yes'
                                        },
                                        {
                                            value: 2,
                                            label: 'No'
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={2}></Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={5}>
                            <Form.Item label='Sequencing fastq_R1:' name='fastq_R1'>
                                <Upload
                                    action=""
                                    listType=""
                                    maxCount={1}
                                >
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label='Sequencing fastq_R2:' name='fastq_R2'>
                                <Upload
                                    action=""
                                    listType=""
                                    maxCount={1}
                                >
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                        </Col>
                        <Col span={5}>
                            <Form.Item label='Barcode primer file:' name={'barcode'}>
                                <Upload
                                    action=""
                                    listType=""
                                    maxCount={1}
                                >
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label='Amplification sequence file:' name='amplification'>
                                <Upload
                                    action=""
                                    listType=""
                                    maxCount={1}
                                >
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={22}>
                            <Form.Item label='Editing type:' name='editingType'>
                                <Radio.Group onChange={onChange} defaultValue="cas9">
                                    <CustomButton value={'cas9'}>CRISPR/Cas9</CustomButton>
                                    <CustomButton value={'cpf1'}>Cas12a/cpf1</CustomButton>
                                    <CustomButton value={'ABE'}>ABE</CustomButton>
                                    <CustomButton value={'CBE'}>CBE</CustomButton>
                                    <CustomButton value={'PE'}>PE</CustomButton>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={2}></Col>
                    </Row>
                    <Form.Item label="Additional parameters" name="extra">
                        <TextArea 
                        autoSize={{
                            minRows: 5,
                            maxRows: 20,
                        }}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
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

export default EditingAnaly;