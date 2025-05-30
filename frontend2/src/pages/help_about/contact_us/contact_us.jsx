import { Form, Input , Row , Col , Button , Select } from 'antd';
import username from '@/assets/icon/username.svg'
import email from '@/assets/icon/email.svg'
import message from '@/assets/icon/message.svg'
import './contact_us.scss'

function ContactUs() {
    const [form] = Form.useForm();
    const TextArea = Input.TextArea;
    const onFinish = (values) => {
        console.log(values);
    }
    return (
        <div className='contact_us'>
            <h1>Contact Us</h1>
            <hr style={{width: '90%'}}/>
            <div className='form'>
                <Form
                    form={form}
                    onFinish={onFinish}
                    name="crispr_form"
                    layout='horizontal'
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={origin}
                    style={{width: '80%' , margin: '0 auto'}}
                >
                    <Row>
                        <Col span={12}>
                            <Form.Item label={<><img src={username} alt="username" width={18} style={{marginRight: '10px'}}/>First Name</>} name="first_name">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item label="Last Name" name="last_name">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label={<><img src={email} alt="email" width={18} style={{marginRight: '10px'}}/>E-mail</>} name="email">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item label="Request" name="request">
                                <Select>
                                    <Select.Option value="Request_Question">Request Question</Select.Option>
                                    <Select.Option value="Upload_New_Genomic_Data">Upload New Genomic Data</Select.Option>
                                    <Select.Option value="Other">Other</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item 
                                label={<><img src={message} alt="message" width={18} style={{marginRight: '10px'}}/>Message</>} 
                                name="message"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                            >
                                <TextArea
                                    rows={4}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item 
                                wrapperCol={{ 
                                    offset: 4,  // 对应Message的labelCol.span
                                    span: 16
                                }}
                                style={{ 
                                    textAlign: 'center',
                                    marginTop: '20px'
                                }}
                            >
                                <Button type="primary" htmlType="submit" className='send_message'>Send Message</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6877.245198544719!2d114.34350779357908!3d30.475126000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x342eba8c0e6e102d%3A0x9cdee9c2f051347!2z5Y2O5Lit5Yac5Lia5aSn5a2m!5e0!3m2!1szh-CN!2ssg!4v1741743962449!5m2!1szh-CN!2ssg" 
                style={{ border: '0', width: '90%', height: '400px', margin: '0 auto' }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
    );
}

export default ContactUs;