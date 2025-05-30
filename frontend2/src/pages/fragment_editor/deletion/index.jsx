import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Modal, Slider, Row, Col, Input, Radio } from 'antd'
import { InfoCircleOutlined, MailOutlined, ForwardOutlined } from '@ant-design/icons';
import { fe_data as data } from '@/utils/datas/static-data';
import { fragment_PAM_Types, target_genome } from '@/utils/datas/options';
import { fragment_form_origin } from '@/utils/datas/form-origin';
import { PostTokenCas9, getConfigCas9 } from '@/utils/api/api';
import { initJBrowseState } from '@/components/editor/result/conf/jbrowseState.jsx';
import CustomizedPAM from '@/components/editor/customized_pam/customized';
import DesignModel from '@/components/editor/design_model/design_model';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import './index.scss';

const marks = {
    10: '10',
    14: '14',
    16: '16',
    20: '20',
};
const onChange = (value) => {
    console.log('onChange: ', value);
};
const onChangeComplete = (value) => {
    console.log('onChangeComplete: ', value);
};

function Deletion() {
    const [selectedValue, setSelectedValue] = useState(null);  // 添加状态管理
    
    const handleRadioChange = (e) => {
        setSelectedValue(e.target.value);
        handleExampleClick(e);
    };
    const handleClear = () => {
        setSelectedValue(null); // 清空选中的按钮
        handleExampleClick({target:{value:''}})
    }
    // 路由跳转,跳转到结果页面
    const navigate = useNavigate();
    // 状态管理
    const [PamType, setPamType] = useState('');
    // 创建表单实例
    const [form] = Form.useForm();
    const { TextArea } = Input;
    // 回填示例
    const handleExampleClick = (record) => {
        const type = record.target.value;
        let temp = '';
        switch (type) {
            case '':
                temp = {
                    left: '',
                    right: '',
                };
                break;
            case 'position':
                temp = data.example.position;
                break;
            case 'sequence':
                temp = data.example.sequence;
                break;
            default:
                temp = 'No example available';
        }
        form.setFieldsValue({
            left_flanking: temp.left,
            right_flanking: temp.right,
        });
    };
    // 添加表单提交确认弹窗状态
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tempFormData, setTempFormData] = useState(null);
    const [loading, setLoading] = useState(false); // 加载状态
    const [showResultsButton, setShowResultsButton] = useState(false); // 控制展示结果按钮

    const [designToken, setDesignToken] = useState('');
    // 表单提交处理逻辑
    const onFinish = (values) => {
        setTempFormData(values);
        setIsModalVisible(true);
    };
    // 确认提交处理
    const handleConfirm = () => {
        setLoading(false); // 停止加载
        setIsModalVisible(false);
        navigate('/crispr/result/fe_submit', {
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

        setLoading(false); // 停止加载
        setShowResultsButton(false); // 显示展示结果按钮
    };

    const handleStartDesign = async () => {
        setLoading(true); // 开始加载
        setShowResultsButton(false); // 确保展示结果按钮隐藏
        try {
            // 调用 PostTokenCas9 获取 token
            const data = await PostTokenCas9(tempFormData);
            const { token } = data;

            // 使用新的 API 方法获取配置
            const configResponse = await getConfigCas9(token);
            const configData = configResponse.data; // 假设响应数据结构包含 data 字段

            // 初始化 JBrowse 状态
            initJBrowseState(configData.JbrowseInfo);
            setDesignToken(token);
            localStorage.setItem('fe_design_params', JSON.stringify(tempFormData));
            localStorage.setItem('fe_design_token', token);

            setLoading(false);
            setShowResultsButton(true);

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

    const CustomButton = styled(Radio.Button)`
    margin-right: 30px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    color: #fff;
    background-color: ${props => props.color || '#fff'};
    position: relative;

    &.ant-radio-button-wrapper-checked {
        // 移除背景色设置
        border-color: ${props => props.color || '#40a9ff'};
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding-left: 30px;
        
        &::before {
            content: '✓';
            position: absolute;
            left: 10px;
            font-weight: bold;
        }
    }

    &:last-child {
        margin-right: 0;
    }
`;
    return (
        <div className="deletion">
            <div className="introduction">
                {/* 左边的图片 */}
                <img src={data.introductionProps.imgSrc} alt="" className={data.introductionProps.imgClassName} />
                {/* 右边的文字内容 */}
                <div className="text_content">
                    <div className="text_content_design">
                        <h3 className="design_title">{data.introductionProps.title}</h3>
                        <p className="design_content">
                            {data.introductionProps.content}
                            <a href="https://www.nature.com/articles/s41586-019-1711-4" target="_blank" rel="noopener noreferrer">
                                <InfoCircleOutlined />
                            </a>
                        </p>
                    </div>
                    <div className="text_content_componens">
                        <h3>Advantages:</h3>
                        <div className="components_ul">
                            <ul>
                                {data.introductionProps.components.map((component, index) => (
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
                    name="crispr_form"
                    layout='vertical'
                    initialValues={fragment_form_origin}
                >
                    {/* 一个图标和一句话 */}
                    <div className="email" style={{ color: '#758a70', display: 'flex', justifyContent: 'start' }}>
                        <p><MailOutlined />Note: N bp (500bp is recommended) sequence on the left and right of deletion site in the direction of 5&apos;-3&apos;.</p>
                    </div>
                    <Form.Item
                        // label="Input Sequences (Only One Id/Position/Sequence required; Design speed: Id = Position > Fasta Sequence)"
                        label={
                            <span>Input Left Flanking Sequence of Deletion Site</span>
                        }
                        name={'left_flanking'}
                        rules={[{
                            required: true,
                            message: 'Please input your DNA sequence!',
                        }]}
                    >
                        <TextArea
                            placeholder="Input Your  DNA Sequence or See a DEMO as show in example"
                            autoSize={{
                                minRows: 5,
                                maxRows: 20,
                            }}
                        />
                    </Form.Item>
                    {/* 一个图标和一句话 */}
                    <div className="email" style={{ color: '#758a70', display: 'flex', justifyContent: 'start' }}>
                        <p><MailOutlined />Note: N bp (500bp is recommended) sequence on the left and right of deletion site in the direction of 5&apos;-3&apos;.</p>
                    </div>
                    <Form.Item
                        // label="Input Sequences (Only One Id/Position/Sequence required; Design speed: Id = Position > Fasta Sequence)"
                        label={
                            <span>Input Right Flanking Sequence of Deletion Site</span>
                        }
                        name={'right_flanking'}
                        rules={[{
                            required: true,
                            message: 'Please input your DNA sequence!',
                        }]}
                    >
                        <TextArea
                            placeholder="Input Your  DNA Sequence or See a DEMO as show in example"
                            autoSize={{
                                minRows: 5,
                                maxRows: 20,
                            }}
                        />
                    </Form.Item>
                    <Row gutter={14}>
                        <Col span={1} />
                        <Col span={3}>
                            <b style={{ color: 'blue', fontSize: '20px' }}>Example of <ForwardOutlined /></b>
                        </Col>
                        <Col span={14}>
                            <Radio.Group value={selectedValue} onChange={handleRadioChange} buttonStyle="solid">
                                <CustomButton value="position" color="#FBA706"> Genome Position</CustomButton>
                                <CustomButton value="sequence" color="#B23CFD"> Genome Sequence</CustomButton>
                            </Radio.Group>
                        </Col>
                        <Col span={3}>
                            <Form.Item>
                                <Button
                                    color="danger"
                                    variant="solid"
                                    onClick={handleClear}
                                >
                                    Clear
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                    <CustomizedPAM
                        PamType={PamType}
                        setPamType={setPamType}
                        baseEditors={target_genome}
                        pamOptions={fragment_PAM_Types} // 从数据源获取特定页面的选项
                    />
                    <Form.Item label="Flanking Template Sequence Length (bp):" name={'flanking_template_length'} wrapperCol={{ span: 12 }}>
                        <Slider
                            range
                            step={1}
                            defaultValue={[14, 16]}
                            marks={marks}
                            onChange={onChange}
                            onChangeComplete={onChangeComplete}
                            max={20}
                            min={10}
                        />
                    </Form.Item>
                    {/* 提交按钮 */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Design Deletion sgRNAs 》
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            {/* 添加确认弹窗 */}
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

Deletion.propTypes = {
    // 定义属性类型
    color: PropTypes.string,
}

export default Deletion;