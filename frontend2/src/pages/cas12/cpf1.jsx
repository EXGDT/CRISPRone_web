import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Modal } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import SequenceInput from '@/components/editor/SequenceInput/SequenceInput';
import CustomizedPAM from '@/components/editor/customized_pam/customized_cpf1';
import DesignModel from '@/components/editor/design_model/design_model';
import { cas12_data } from '@/utils/datas/static-data';
import { cpf1_form_origin as origin } from '@/utils/datas/form-origin';
import { cpf1_PAM_Types as PAM_Types, target_genome } from '@/utils/datas/options';
import { initJBrowseState } from '@/components/editor/result/conf/jbrowseState.jsx';
import { PostTokenCas9,getConfigCas9 } from '@/utils/api/api';

function Cpf1() {
    const introductionProps = cas12_data.cpf1_introductionProps;
    const example = cas12_data.example;
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [PamType, setPamType] = useState('TTTR');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tempFormData, setTempFormData] = useState(null);
    const [randomExample, setRandomExample] = useState(null);
    const [randomLoading, setRandomLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showResultsButton, setShowResultsButton] = useState(false);
    const [designToken, setDesignToken] = useState('');

    const handleExampleClick = (record) => {
        let type = record.target.value;
        let temp = '';
        switch (type) {
            case 'id':
                temp = example.ID;
                break;
            case 'position':
                temp = example.Position;
                break;
            case 'sequence':
                temp = example.Sequence;
                break;
            case 'random':
                console.log('Random example:', randomExample);
                temp = randomExample.inputSequence;
                form.setFieldsValue({
                    input_sequences: temp,
                    pam_type: randomExample.pam,
                    target_genome: randomExample.name_db,
                });
                fetchRandomExample();
                break;
            default:
                temp = '';
        }

        form.setFieldsValue({
            input_sequences: temp
        });
    };

    const fetchRandomExample = async () => {
        setRandomLoading(true);
        console.log('Fetching random example...');
        try {
            const response = await fetch('http://211.69.141.134:8866/cas12b_fill_example');
            const data = await response.json();
            setRandomExample(data);
        }
        finally {
            setRandomLoading(false);
        }
    };

    const onFinish = (values) => {
        setTempFormData(values);
        setIsModalVisible(true);
    };

    const handleConfirm = () => {
        setIsModalVisible(false);
        navigate('/crispr/result/cas9_12_knock_in_submit', {
            state: {
                token: designToken,
                formData: tempFormData
            }
        });
    };

    const handleCancel = () => {
        setTempFormData(null);
        setLoading(false);
        setShowResultsButton(true);
        setIsModalVisible(false);
    };

    const handleStartDesign = async () => {
        setLoading(true);
        try {
            const data = await PostTokenCas9(tempFormData);
            const { token } = data; 
            const configResponse = await getConfigCas9(token);
            const configData = configResponse.data;
            initJBrowseState(configData.JbrowseInfo);
            setDesignToken(token);
            localStorage.setItem('cas9_design_params', JSON.stringify(tempFormData));
            localStorage.setItem('cas9_design_token', token);
            setLoading(false);
            setShowResultsButton(true);
        } catch (error) {
            setLoading(false);
          if (error.message.startsWith("TASK_FAILED")) {
              const reason = error.message.split(":")[1] || "";
              Modal.error({ title: '任务失败', content: `服务器返回错误: ${reason}` });
            }
          console.error('设计失败:', error);
        }
    };

    useEffect(() => {
        const savedUrls = localStorage.getItem('crispr_urls');
        if (!savedUrls) {
            const currentPath = window.location.pathname;
            if (currentPath.includes('/result')) {
                navigate('/cfp1');
            }
        }
    }, [navigate]);

    useEffect(() => {
        fetchRandomExample();
    }, []);

    return (
        <div className="crispr_main">
            <div className="introduction">
                <img src={introductionProps.imgSrc} alt="" className="introduction_img" />
                <div className="introduction_text">
                    <div className="introduction_text_top">
                        <h3 className="introduction_title">{introductionProps.title}</h3>
                        <p className="introduction_content">
                            {introductionProps.content}
                            <a href="https://www.nature.com/articles/s41586-019-1711-4" target='_blank'>
                                <InfoCircleOutlined />
                            </a>
                        </p>
                    </div>
                    <div className="introduction_text_bottom">
                        <h3>Advantages:</h3>
                        <div className="introduction_ul">
                            <ul>
                                {introductionProps.components.map((component, index) => (
                                    <li key={index}>{component}</li>
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
                    name="crispr_form"
                    layout='vertical'
                    initialValues={origin}
                >
                    <SequenceInput onExampleClick={handleExampleClick} disableRandom={randomLoading} />
                    
                    <CustomizedPAM 
                        PamType={PamType} 
                        setPamType={setPamType} 
                        baseEditors={target_genome}
                        pamOptions={PAM_Types}
                    />
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Design Cas12a/Cpf1 sgRNAs 》
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
    );
}

export default Cpf1;
