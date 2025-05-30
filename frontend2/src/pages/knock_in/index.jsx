import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form,  Button, Modal } from 'antd';
import { InfoCircleOutlined  } from '@ant-design/icons';
import { initJBrowseState } from '@/components/editor/result/conf/jbrowseState.jsx';
import { crispr_knock_in_data as data } from '@/utils/datas/static-data';
import {target_genome, knockin_PAM_Types as PAM_Types} from '@/utils/datas/options';
import {knockin_form_origin as origin} from '@/utils/datas/form-origin';
import { PostTokenCas9,getConfigCas9 } from '@/utils/api/api';
import SequenceInput from '@/components/editor/SequenceInput/SequenceInput';
import CustomizedPAM from '@/components/editor/customized_pam/customized';
import DesignModel from '@/components/editor/design_model/design_model';

// Cas9组件
function KnockIn() {
    // 介绍
    const introductionProps = data.introductionProps;
    // 示例
    const example = data.example;
    // 路由跳转,跳转到结果页面
    const navigate = useNavigate();
    // 创建表单实例
    const [form] = Form.useForm();
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
    // 添加表单提交确认弹窗状态
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tempFormData, setTempFormData] = useState(null);
    // 表单提交处理逻辑
    const onFinish = (values) => {
        setTempFormData(values);
        setIsModalVisible(true);
    };
    // 确认提交处理
    const handleConfirm = () => {
        setIsModalVisible(false);
        navigate('/crispr/result/cas9_12_knock_in_submit', {
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

    // 状态管理
    const [PamType, setPamType] = useState('');
    const [loading, setLoading] = useState(false); // 加载状态
    const [showResultsButton, setShowResultsButton] = useState(false); // 控制展示结果按钮
    const [designToken, setDesignToken] = useState('');
    // 开始设计
    const handleStartDesign = async () => {
        setLoading(true);
        try {
            // 调用 PostTokenCas9 获取 token
            const  data  = await PostTokenCas9(tempFormData);
            const { token } = data; 
            
            // 使用新的 API 方法获取配置
            const configResponse = await getConfigCas9(token);
            const configData = configResponse.data; // 假设响应数据结构包含 data 字段

            // 初始化 JBrowse 状态
            initJBrowseState(configData.JbrowseInfo);

            setDesignToken(token);
            localStorage.setItem('cas9_design_params', JSON.stringify(tempFormData));
            localStorage.setItem('cas9_design_token', token);
            
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


    // 检查是否有保存的配置
    useEffect(() => {
        const savedUrls = localStorage.getItem('crispr_urls');
        if (!savedUrls) {
            // 如果直接访问结果页面且没有配置，重定向到cas9页面
            const currentPath = window.location.pathname;
            if (currentPath.includes('/result')) {
                navigate('/cas9');
            }
        }
    }, [navigate]);

    return (
        <div className="crispr_main">
            <div className="introduction">
                {/* 左边的图片 */}
                <img src={introductionProps.imgSrc} alt="" className='introduction_img' />
                {/* 右边的文字内容 */}
                <div className="introduction_text">
                    <div className="introduction_text_top">
                        <h3 className="introduction_title">{introductionProps.title}</h3>
                        <p className="introduction_content">
                            {introductionProps.content}
                            <a href="https://www.synthego.com/blog/crispr-knockin-tips-tricks" target="_blank" rel="noopener noreferrer">
                                <InfoCircleOutlined />
                            </a>
                        </p>
                    </div>
                    <div className="introduction_text_bottom">
                        <h3>Optimizing Success With CRISPR Knock-in Experiments:</h3>
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
                    <SequenceInput onExampleClick={handleExampleClick} />
                    <CustomizedPAM 
                        PamType={PamType} 
                        setPamType={setPamType} 
                        baseEditors={target_genome}
                        pamOptions={PAM_Types} // 从数据源获取特定页面的选项
                    />                    {/* 提交按钮 */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Design Knock-in sgRNAs 》
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
    );
}

// 导出Cas9组件
export default KnockIn;