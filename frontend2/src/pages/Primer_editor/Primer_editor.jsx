import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Select, Button, Input, Row, Col, Slider, Checkbox, Popover, Modal, Radio } from 'antd';
import { 
    InfoCircleOutlined, InfoCircleFilled, 
    LinkOutlined, ExportOutlined, MailOutlined,
     ForwardOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { primerEditor_data as data } from '@/utils/datas/static-data';
import { target_genome, primer_PAM_Types } from '@/utils/datas/options';
import { primer_form_origin } from '@/utils/datas/form-origin';
import { PostTokenPE } from '@/utils/api/api';
import DesignModel from '@/components/editor/design_model/design_model';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import './Primer_editor.scss'



function Primer_editor() {
    const [selectedValue, setSelectedValue] = useState(null);  // 添加状态管理
    
    const handleRadioChange = (e) => {
        setSelectedValue(e.target.value);
        handleExampleClick(e);
    };
    const handleClear = () => {
        setSelectedValue(null); // 清空选中的按钮
        handleExampleClick({target:{value:''}})
    }

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
    // 介绍
    const introductionProps = data.introductionProps;
    // 示例
    const example = data.example;
    // 无用
    const { TextArea } = Input;

    const [form] = Form.useForm();
    const [PamType, setPamType] = useState('');
    const [parameterSections, setParameterSections] = useState({
        mandatory: true,
        optional: false,
        bottom: false
    });
    // 添加切换函数
    const toggleSection = (section) => {
        setParameterSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // 提交表单
    const onFinish = (values) => {
        setTempFormData(values);
        setIsModalVisible(true);
    };
    // 路由跳转,跳转到结果页面
    const navigate = useNavigate();
    const [substitution_module_base, setSubstitutionModuleBase] = useState('');
    const [subShow, setSubShow] = useState(false);
    // 回填示例
    const handleExampleClick = (record) => {
        const type = record.target.value;
        let temp = '';
        switch (type) {
            case '':
                temp = '';
                setSubstitutionModuleBase('');
                setSubShow(false);
                break;
            case 'substitution':
                temp = example.substitution;
                setSubstitutionModuleBase('Substitution ');
                setSubShow(true);
                break;
            case 'insertion':
                temp = example.insertion;
                setSubstitutionModuleBase('Insertion ');
                setSubShow(true);
                break;
            case 'deletion':
                temp = example.deletion;
                setSubstitutionModuleBase('Deletion ');
                setSubShow(true);
                break;
            case 'all':
                temp = example.substitution_insertion_deletion;
                setSubstitutionModuleBase('Substitution + Insertion + Deletion');
                setSubShow(true);
                break;
            default:
                temp = 'No example available';
        }

        form.setFieldsValue({
            input_sequences: temp
        });
    };


    const [isModalVisible, setIsModalVisible] = useState(false);
    // 取消提交
    const handleCancel = () => {
        setIsModalVisible(false);
        setTempFormData(null);

        setLoading(false); // 停止加载
        setShowResultsButton(false); // 隐藏结果按钮
    };
    const [tempFormData, setTempFormData] = useState(null);
    const [token, setToken] = useState('');

    // 开始设计
    const handleStartDesign = async () => {
        setLoading(true); // 开始加载
        setShowResultsButton(false); // 确保展示结果按钮隐藏
        try {

            // 1，获取 token
            const token = await PostTokenPE(tempFormData);
            setToken(token);

            // 本地存储
            localStorage.setItem('PE_design_token', token);
            localStorage.setItem('PE_design_formData', JSON.stringify(tempFormData));

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

    const [loading, setLoading] = useState(false);
    const [showResultsButton, setShowResultsButton] = useState(false);

    // 确认提交处理
    const handleConfirm = () => {
        setLoading(false); // 停止加载
        setIsModalVisible(false);
        // 4，跳转到结果页面
        navigate('/crispr/result/pe_submit', {
            state: {
                formData: tempFormData,
                token: token,
            }
        });

    };

    const TextChange = (text)=>{
        const hasAB = /\([A-Z]\/[A-Z]\)/.test(text);
        const hasPlusABC = /\(\+[A-Z]{1,}\)/.test(text);
        const hasMinusABCD = /\(-[A-Z]{1,}\)/.test(text);
    
        if (hasAB && hasPlusABC && hasMinusABCD) {
            return {text: 'Substitution + Insertion + Deletion', value: true}
        } else if (hasAB && hasPlusABC) {
            return {text: 'Substitution + Insertion', value: true}
        } else if (hasAB && hasMinusABCD) {
            return {text: 'Substitution + Deletion', value: true}
        } else if (hasPlusABC && hasMinusABCD) {
            return {text: 'Insertion + Deletion', value: true}
        } else if (hasAB) {
            return {text: 'Substitution ', value: true}
        } else if (hasPlusABC) {
            return {text: 'Insertion ', value: true}
        } else if (hasMinusABCD) {
            return {text: 'Deletion ', value: true}
        }else{
            return {text: '', value: false}
        }
    }

    const handleTextChange = (event) => {
        const text = event.target.value;
        let result = '';
    
        result = TextChange(text);
    
        setSubstitutionModuleBase(result.text);
        setSubShow(result.value);
    };

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
                                {introductionProps.components.map((component, index) => (
                                    <li key={index}>{component}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="introduction_text_bottom">
                        <h3>
                            Note:
                        </h3>
                        <p className='introduction_text_bottom_content'>
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
                    initialValues={primer_form_origin}
                >
                    <Form.Item
                        // label="Input Sequences (Only One Id/Position/Sequence required; Design speed: Id = Position > Fasta Sequence)"
                        label={
                            <span>Input Sequences
                                <Popover
                                    content={data.input_sequences_popover_content}
                                    overlayStyle={{
                                        width: '300px'  // 设置固定宽度
                                    }}
                                    overlayInnerStyle={{
                                        textAlign: 'center'  // 文字居中对齐
                                    }}
                                >
                                    <InfoCircleFilled />
                                </Popover>
                            </span>
                        }
                        name={'input_sequences'}
                        onChange={handleTextChange}
                        required={true}
                        rules={[{
                            required: true, 
                            message: 'Please input a valid DNA Sequence.' 
                        }]}
                    >
                        <TextArea
                            placeholder="Input Your Gene ID / DNA Sequence or See a DEMO as show in example"
                            autoSize={{
                                minRows: 5,
                                maxRows: 20,
                            }}
                        />
                    </Form.Item>
                    <Row gutter={14}>
                        <Col span={1} />
                        <Col span={3}>
                            <b style={{ color: 'blue', fontSize: '20px' }}>
                                Example of  <ForwardOutlined />
                            </b>
                        </Col>
                        <Col span={14}>
                            <Radio.Group value={selectedValue} onChange={handleRadioChange} buttonStyle="solid">
                                <CustomButton value="substitution" color="#FBA706">Substitution (a/b)</CustomButton>
                                <CustomButton value="insertion" color="#B23CFD">Insertion (+ATCG)</CustomButton>
                                <CustomButton value="deletion" color="#39C0ED">Deletion (-ATCG)</CustomButton>
                                <CustomButton value="all" color="#00913B">Substitution + Insertion + Deletion</CustomButton>
                            </Radio.Group>
                        </Col>
                        <Col span={3}>
                            <Form.Item>
                                <Button
                                    color='danger'
                                    variant='solid'
                                    value={''}
                                    onClick={handleClear}
                                >
                                    Clear
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* An Substitution module is input for pegRNAs Design */}
                    {subShow && (
                        <div className="substitution_module_base">
                        <CheckCircleOutlined />
                        <h3>An {substitution_module_base} module is input for pegRNAs Design</h3>
                    </div>
                    )}
                    <>
                        <div className="parameters_top parameters"
                            onClick={() => toggleSection('mandatory')}>
                            <h3>Mandatory Parameters</h3>
                            <svg
                                viewBox="0 0 1024 1024"
                                width="25"
                                height="25"
                                id='parameters_top_icon'
                                className={parameterSections.mandatory ? 'icon-collapsed' : 'icon-expanded'}
                            >
                                <path d="M97 245.71m0-41.47l0 0q0-41.47000001 41.47-41.47l747.06 0q41.47000001 0 41.47 41.47l0 0q0 41.47000001-41.47 41.47l-747.06 0q-41.47000001 0-41.47-41.47Z" fill="#949DA6" />
                                <path d="M167.17 424.09L512 782.43999999 856.83 424.09a40.31 40.31 0 0 1 29-12.5c36.58000001 0 54.9 46 29 72.83l-344.77 358.36000001c-32.07 33.32-84.05 33.32-116.12 0L109.11 484.42c-25.87-26.87-7.55-72.83 29-72.83a40.31 40.31 0 0 1 29.06 12.5z" fill="#949DA6" />
                            </svg>
                        </div>
                        <div className={`section-content ${parameterSections.mandatory ? 'expanded' : 'collapsed'}`}>
                            {/* 下拉框 */}
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Form.Item
                                    label={<span>PAM Type
                                        <span onClick={() => {
                                            window.location.href = '/crispr/help#enzymes';
                                        }} style={{ textDecoration: 'underline', color: '#1B2AE6' }}>
                                            See notes on enzymes in the help
                                            <svg viewBox="0 0 1024 1024" width="15" height="15"><path d="M1009.777778 503.466667l-443.733334-455.111111c-5.688889-5.688889-11.377778 0-11.377777 5.688888v267.377778C8.533333 409.6 2.844444 918.755556 17.066667 932.977778c0 0 45.511111-48.355556 164.977777-113.777778 85.333333-48.355556 224.711111-85.333333 369.777778-102.4v261.688889c0 8.533333 11.377778 11.377778 14.222222 5.688889l443.733334-480.711111z m-398.222222 358.4v-199.111111l-36.977778-2.844445c-221.866667 8.533333-378.311111 73.955556-497.777778 156.444445 76.8-275.911111 267.377778-403.911111 466.488889-438.044445l68.266667-2.844444v-199.111111l312.888888 312.888888s8.533333 5.688889 8.533334 14.222223-8.533333 14.222222-8.533334 14.222222l-312.888888 344.177778z" fill="#1E2AE6"></path></svg>
                                        </span>
                                    </span>}
                                    name={'pam_type'}
                                    style={{ flex: 1, marginRight: '30px' }}
                                >
                                    <Select
                                        placeholder="Select a Cas protein"
                                        value={PamType}
                                        onChange={(value) => { setPamType(value) }}
                                    >
                                        {primer_PAM_Types.map((item, index) => (
                                            <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
                                        ))}
                                    </Select>

                                </Form.Item>
                                <Form.Item
                                    label={<span>Target Genome
                                        <span onClick={() => {
                                            window.location.href = '/crispr/help#genomes';
                                        }} style={{ textDecoration: 'underline', color: '#1B2AE6' }}>
                                            More Information of Genomes Metadata
                                            <svg viewBox="0 0 1024 1024" width="15" height="15"><path d="M1009.777778 503.466667l-443.733334-455.111111c-5.688889-5.688889-11.377778 0-11.377777 5.688888v267.377778C8.533333 409.6 2.844444 918.755556 17.066667 932.977778c0 0 45.511111-48.355556 164.977777-113.777778 85.333333-48.355556 224.711111-85.333333 369.777778-102.4v261.688889c0 8.533333 11.377778 11.377778 14.222222 5.688889l443.733334-480.711111z m-398.222222 358.4v-199.111111l-36.977778-2.844445c-221.866667 8.533333-378.311111 73.955556-497.777778 156.444445 76.8-275.911111 267.377778-403.911111 466.488889-438.044445l68.266667-2.844444v-199.111111l312.888888 312.888888s8.533333 5.688889 8.533334 14.222223-8.533333 14.222222-8.533334 14.222222l-312.888888 344.177778z" fill="#1E2AE6"></path></svg>
                                        </span>
                                    </span>}
                                    name={'target_genome'}
                                    style={{ flex: 1 }}
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
                            </div>
                            {/* 一个图标和一句话 */}
                            <div className="email" style={{ color: '#758a70', display: 'flex', justifyContent: 'start' }}>
                                <p><MailOutlined /> Note: For a Customized PAM select Customized PAM: 5&apos;-XXX-3&apos; in PAM Type  and then set sgRNA module , Cut distance to PAM  and Spacer length .</p>
                            </div>
                            {/* 输入框 */}
                            <Form.Item label="Customized PAM (Need to select Customized PAM in PAM Type )" name={'customized_pam'} wrapperCol={{ span: 12 }} style={{ marginRight: '30px' }}>
                                <Input placeholder="Enter customized PAM"
                                    disabled={PamType !== 'PAM'}
                                ></Input>
                            </Form.Item>
                            {/* 两个下拉框 */}
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Form.Item label='sgRNA module' name={'sgRNA_module'} style={{ flex: 1, marginRight: '30px' }}>
                                    <Select placeholder="Select"
                                        disabled={PamType !== 'PAM'}
                                    >
                                        <Select.Option value="spacerpam">5&apos;-Spacer+ PAM-3&apos;</Select.Option>
                                        <Select.Option value="pamspacer">5&apos;-PAM + Spacer-3&apos;</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label='Cut distance to PAM' name={'cut_distance_to_pam'} style={{ flex: 1, marginRight: '30px' }}>
                                    <Input placeholder="Cut distance to PAM"
                                        disabled={PamType !== 'PAM'}
                                    ></Input>
                                </Form.Item>
                                <Form.Item label='Spacer length of Customized PAM' name={'spacer_length'} style={{ flex: 1 }}>
                                    <Input placeholder="Spacer length of Customized PAM"
                                        disabled={PamType !== 'PAM'}
                                    ></Input>
                                </Form.Item>
                            </div>
                        </div>
                    </>
                    <>
                        <div className="parameters_middle parameters"
                            onClick={() => toggleSection('optional')}>
                            <h3>Optional Parameters</h3>
                            <svg
                                viewBox="0 0 1024 1024"
                                width="25"
                                height="25"
                                id='parameters_middle_icon'
                                className={parameterSections.optional ? 'icon-collapsed' : 'icon-expanded'}
                            >
                                <path d="M97 245.71m0-41.47l0 0q0-41.47000001 41.47-41.47l747.06 0q41.47000001 0 41.47 41.47l0 0q0 41.47000001-41.47 41.47l-747.06 0q-41.47000001 0-41.47-41.47Z" fill="#949DA6" />
                                <path d="M167.17 424.09L512 782.43999999 856.83 424.09a40.31 40.31 0 0 1 29-12.5c36.58000001 0 54.9 46 29 72.83l-344.77 358.36000001c-32.07 33.32-84.05 33.32-116.12 0L109.11 484.42c-25.87-26.87-7.55-72.83 29-72.83a40.31 40.31 0 0 1 29.06 12.5z" fill="#949DA6" />
                            </svg>
                        </div>
                        <div className={`section-content ${parameterSections.optional ? 'expanded' : 'collapsed'}`}>
                            <>
                                <Row>
                                    <Col span={5}>
                                        <Form.Item label="pegRNA Spacer GC content(%)" name={'pegRNA_spacer_gc_content'}>
                                            <Slider
                                                range
                                                marks={{
                                                    1: '1',
                                                    100: '100',
                                                }}
                                                tooltip={{
                                                    open: parameterSections.optional,
                                                }}
                                                max={100}
                                                min={1}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={1}></Col>
                                    <Col span={5}>
                                        <Form.Item label="PBS length (bp)" name={'pbs_length'}>
                                            <Slider
                                                range
                                                marks={{
                                                    1: '1',
                                                    50: '50',
                                                }}
                                                tooltip={{
                                                    open: parameterSections.optional,
                                                }}
                                                max={50}
                                                min={1}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={1}></Col>
                                    <Col span={5}>
                                        <Form.Item label="PBS GC content (%)" name={'pbs_gc_content'}>
                                            <Slider
                                                range
                                                marks={{
                                                    1: '1',
                                                    100: '100',
                                                }}
                                                tooltip={{
                                                    open: parameterSections.optional,
                                                }}
                                                max={100}
                                                min={1}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={1}></Col>
                                    <Col span={6}>
                                        <Form.Item label="Recommended Tm of PBS sequence (℃)" name={'recommended_tm_of_pbs_sequence'}>
                                            <Slider
                                                range
                                                marks={{
                                                    1: '1',
                                                    100: '100',
                                                }}
                                                tooltip={{
                                                    open: parameterSections.optional,
                                                }}
                                                max={100}
                                                min={1}
                                            />
                                        </Form.Item>
                                    </Col>
                                    {/* <Col span={1}></Col> */}
                                </Row>
                                <Form.Item label="Homologous RT template length (bp)" name={'homologous_rt_template_length'} wrapperCol={{ span: 12 }}>
                                    <Slider
                                        range
                                        marks={{
                                            1: '1',
                                            50: '50',
                                        }}
                                        tooltip={{
                                            open: parameterSections.optional,
                                        }}
                                        max={50}
                                        min={1}
                                    />
                                </Form.Item>
                                <Row>

                                    <Col span={5}>
                                        <Form.Item
                                            name="exclude_first_c_in_rt_template"
                                            valuePropName="checked"
                                            initialValue={true}
                                        >
                                            <Checkbox>Exclude first C in RT template</Checkbox>
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item
                                            name="dual_pegRNA_model"
                                            valuePropName="checked"
                                            initialValue={true}
                                        >
                                            <Checkbox>Dual-pegRNA model</Checkbox>
                                        </Form.Item>
                                    </Col>
                                    <Col span={14}></Col>
                                </Row>
                                <hr style={{ marginBottom: '20px' }} />
                                <Form.Item
                                    name="ngRNA_spacers_same_pam_with_pegRNA"
                                    valuePropName="checked"
                                    initialValue={true}
                                    wrapperCol={{ span: 6 }}
                                >
                                    <Checkbox>ngRNA spacers (same PAM with pegRNA)</Checkbox>
                                </Form.Item>
                                <Form.Item label="Distance of secondary nicking sgRNAs to pegRNA (bp)" name={'distance_of_secondary_nicking_sgRNAs_to_pegRNA'} wrapperCol={{ span: 12 }}>
                                    <Slider
                                        range
                                        marks={{
                                            1: '1',
                                            200: '200',
                                        }}
                                        tooltip={{
                                            open: parameterSections.optional,
                                        }}
                                        max={200}
                                        min={1}
                                    />
                                </Form.Item>
                                <hr style={{ marginBottom: '20px' }} />
                                <Form.Item
                                    name="pegLIT"
                                    valuePropName="checked"
                                    initialValue={true}
                                    wrapperCol={{ span: 3 }}
                                >
                                    <Checkbox>pegLIT
                                        <Popover
                                            content={data.pegLIT_content}
                                            overlayStyle={{
                                                width: '300px'  // 设置固定宽度
                                            }}
                                            overlayInnerStyle={{
                                                textAlign: 'center'  // 文字居中对齐
                                            }}
                                        >
                                            <InfoCircleFilled />
                                        </Popover>
                                    </Checkbox>
                                </Form.Item>
                                <Row>
                                    <Col span={5}>
                                        <Form.Item label={<span>Linker Pattern
                                            <Popover
                                                content={data.linker_pattern_content}
                                                overlayStyle={{
                                                    width: '300px'  // 设置固定宽度
                                                }}
                                                overlayInnerStyle={{
                                                    textAlign: 'center'  // 文字居中对齐
                                                }}
                                            >
                                                <InfoCircleFilled />
                                            </Popover>
                                        </span>} name="linker_pattern">
                                            <Input placeholder="Enter linker pattern"></Input>
                                        </Form.Item>
                                    </Col>
                                    <Col span={1}></Col>
                                    <Col span={17}>
                                        <Form.Item label={<span>Incorporated structured RNA motifs
                                            <Popover
                                                content={data.incorporated_structured_rna_motifs_content}
                                                overlayStyle={{
                                                    width: '300px'  // 设置固定宽度
                                                }}
                                                overlayInnerStyle={{
                                                    textAlign: 'center'  // 文字居中对齐
                                                }}
                                            >
                                                <InfoCircleFilled />
                                            </Popover>
                                            (Read of
                                            <a href="https://www.nature.com/articles/s41587-021-01039-7" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '5px' }}>
                                                article <ExportOutlined style={{ color: '#1B2AE6' }} />
                                            </a>
                                            or
                                            <a href="https://www.nature.com/articles/s41587-021-01039-7" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '5px' }}>
                                                Help <LinkOutlined style={{ color: '#1B2AE6' }} />
                                            </a>
                                            in this site.)</span>} name="incorporated_structured_rna_motifs">
                                            <Select placeholder="Select">
                                                <Select.Option value="tevopreQ1">tevopreQ1 (Trimmed evopreQ1): a modified prequeosine1-1 riboswitch aptamer (Recommend)</Select.Option>
                                                <Select.Option value="mpknot">mpknot: frameshifting pseudoknot from Moloney murine leukemia virus (MMLV)</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </>
                        </div>
                    </>
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

Primer_editor.propTypes = {
    color: PropTypes.string,
};

export default Primer_editor;