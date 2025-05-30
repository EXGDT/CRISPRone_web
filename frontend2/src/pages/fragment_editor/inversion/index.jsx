import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Modal, Slider, Row, Col, Input,Radio } from 'antd'
import { InfoCircleOutlined, MailOutlined,ForwardOutlined } from '@ant-design/icons';
import { updateConfigUrls } from '@/components/editor/result/conf/config.jsx';
import { target_genome } from '@/utils/datas/options';
import { fragment_PAM_Types as PAM_Types } from '@/utils/datas/options';
import { fragment_form_origin as origin } from '@/utils/datas/form-origin';
import CustomizedPAM from '@/components/editor/customized_pam/customized';
import DesignModel from '@/components/editor/design_model/design_model';
import inversion from '@/assets/Image/inversion.png';
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
// 介绍部分属性
const introductionProps = {
    imgSrc: inversion, // 图片路径
    imgClassName: 'intro_img', // 图片样式
    title: 'Design of Fragment Inversion Editing guide RNAs', // 标题
    content: `Base editors (BE) have two principal components that are fused together to form a single protein: (i) a CRISPR protein, bound to a guide RNA, and (ii) a base editing enzyme, such as a deaminase, which carries out the desired chemical modification of the target DNA base. `, // 内容
    components: [
        'The creation of precise, predictable and efficient genetic outcomes at a targeted sequence',
        'High efficiency editing without need for template-based homology directed repair, and ',
        'Avoidance of the unwanted consequences of double-stranded DNA breaks.',
    ] // 组件列表
};
const example = {
    position: {
        left: 'Ghir_A01:80323913-80324566',
        right: 'Ghir_A01:80923900-80924588',
    },
    sequence: {
        left: `ATGTTGAAACAAGATGGAACTCTGTGTTCCTTCTCACCGTGCATGGAGCAAGTGCAACGTTCATGTGAAACTCTGAGATCTGACTTTATAGAGATATATGGACCTTTGAAATACTGCTCCGCATGTATGAAATCTGTGAATGGAAAATGGATCACTCGAAGGTCAATGATGGGAATTCCATTGCATGCTCTCCACACAAGAGGAGGCCGCCTTCAAGTGAAGCAAGTGTGGGGGACAATGCAAGTTCTCCGAGAATCATGGCTTGGCCATCTGCTGAAACTCGAGGGCATACTGGATATTTGA`,
        right: `ATGTTGAAACAAGATGGAACTCTGTGTTCCTTCTCACCGTGCATGGAGCAAGTGCAACGTTCATGTGAAACTCTGAGATCTGACTTTATAGAGATATATGGACCTTTGAAATACTGCTCCGCATGTATGAAATCTGTGAATGGAAAATGGATCACTCGAAGGTCAATGATGGGAATTCCATTGCATGCTCTCCACACAAGAGGAGGCCGCCTTCAAGTGAAGCAAGTGTGGGGGACAATGCAAGTTCTCCGAGAATCATGGCTTGGCCATCTGCTGAAACTCGAGGGCATACTGGATATTTGA`,
    },
};

function Inversion() {
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
                temp = example.position;
                break;
            case 'sequence':
                temp = example.sequence;
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
    const [urls, setFastaUrl] = useState({
        fasta: '',
        fai: '',
        gff3_gz: '',
        gff3_tbi: '',
        json: '',
        position: '',
        assembly_name: '',
        tracks_name: '',
    }); // 基因组fasta文件路径
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
        navigate('/crispr/result', {
            state: {
                formData: tempFormData,
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

    const handleStartDesign = () => {
        setLoading(true); // 开始加载
        setShowResultsButton(false); // 确保展示结果按钮隐藏
        try {
            // 把表单数据发送到后端，获取json文件
            // 1，发送请求，并加载json文件（后端需要分析）
            var apiUrl; // 定义请求的API地址
            switch (tempFormData.target_genome) {
                case 'Beta_vulgaris':
                    apiUrl = '/api/demo/Beta_vulgaris_TCAGTGTTTGCCATGAGGCAAAGGTTTGCTGTTTCTTCAGTTGGTTGTTCCT_Guide.json';
                    break;
                case 'Camelina_sativa':
                    apiUrl = '/api/demo/Camelina_sativa_gene.json';
                    break;
                case 'Phaseolus_vulgaris':
                    apiUrl = '/api/demo/Phaseolus_vulgaris_gene.json';
                    break;
                case 'Gossypium_hirsutum_Jin668_HZAU':
                    apiUrl = '/api/demo/cas9_result_cas9_list.json';
                    break;
                default:
                    Modal.error({
                        title: '未定义的请求类型',
                        content: '请检查配置是否正确',
                    });
                    return; // 结束执行
            }

            // 发送请求并处理返回的JSON
            fetch(apiUrl)
                // 2，解析json文件
                .then(response => {
                    if (!response.ok) {
                        throw new Error('网络响应失败');
                    }
                    return response.json(); // 解析JSON数据
                })
                .then(data => {
                    console.log('请求成功:', data); // 打印请求成功的JSON数据
                    setFastaUrl({
                        fasta: data.JbnowseInfo.assembly.fasta,
                        fai: data.JbnowseInfo.assembly.fai,
                        gff3_gz: data.JbnowseInfo.tracks.gff3_gz,
                        gff3_tbi: data.JbnowseInfo.tracks.gff3_tbi,
                        position: data.JbnowseInfo.position,
                        assembly_name: data.JbnowseInfo.assembly.name,
                        tracks_name: data.JbnowseInfo.tracks.name,
                    });
                    // 3，保存配置到本地存储
                    updateConfigUrls({
                        fasta: data.JbnowseInfo.assembly.fasta,
                        fai: data.JbnowseInfo.assembly.fai,
                        gff3_gz: data.JbnowseInfo.tracks.gff3_gz,
                        gff3_tbi: data.JbnowseInfo.tracks.gff3_tbi,
                        json: apiUrl,
                        position: data.JbnowseInfo.position,
                        assembly_name: data.JbnowseInfo.assembly.name,
                        tracks_name: data.JbnowseInfo.tracks.name,
                    });
                    console.log('fastaUrl:', urls); // 打印fastaUrl
                })
                .catch(error => {
                    console.error('请求失败:', error); // 捕获错误并打印
                });
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
        <div className="inversion">
            <div className="introduction">
                {/* 左边的图片 */}
                <img src={introductionProps.imgSrc} alt="" className={introductionProps.imgClassName} />
                {/* 右边的文字内容 */}
                <div className="text_content">
                    <div className="text_content_design">
                        <h3 className="design_title">{introductionProps.title}</h3>
                        <p className="design_content">
                            {introductionProps.content}
                            <a href="https://www.nature.com/articles/s41586-019-1711-4" target="_blank" rel="noopener noreferrer">
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
                    name="crispr_form"
                    layout='vertical'
                    initialValues={origin}
                >
                    {/* 一个图标和一句话 */}
                    <div className="email" style={{ color: '#758a70', display: 'flex', justifyContent: 'start' }}>
                        <p><MailOutlined />Note: N bp (500bp is recommended) sequence on the left and right of inversion site in the direction of 5&apos;-3&apos;.</p>
                    </div>
                    <Form.Item
                        // label="Input Sequences (Only One Id/Position/Sequence required; Design speed: Id = Position > Fasta Sequence)"
                        label={
                            <span>Input Left Flanking Sequence of Inversion Site</span>
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
                        <p><MailOutlined />Note: N bp (500bp is recommended) sequence on the left and right of inversion site in the direction of 5&apos;-3&apos;.</p>
                    </div>
                    <Form.Item
                        // label="Input Sequences (Only One Id/Position/Sequence required; Design speed: Id = Position > Fasta Sequence)"
                        label={
                            <span>Input Right Flanking Sequence of Inversion Site</span>
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
                        pamOptions={PAM_Types} // 从数据源获取特定页面的选项
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
                            Design Inversion sgRNAs 》
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

Inversion.propTypes = {
    // 属性校验
    introductionProps: PropTypes.object,
    example: PropTypes.object,
    color: PropTypes.string,
};

export default Inversion;