import { Form, Input , Row , Col , Button , Select } from 'antd';
import plasmids from '@/assets/Image/plasmids.png';
import './index.scss';

function GetPlasmids() {
    const [form] = Form.useForm();
    const TextArea = Input.TextArea;
    const onFinish = (values) => {
        console.log(values);
    }
    
    return (
        <div className="get_plasmids">
            <div className="introduction">
                {/* 左边的图片 */}
                <img src={plasmids} alt="" className="intro_img" />
                {/* 右边的文字内容 */}
                <div className="text_content">
                    <div className="text_content_design">
                        <h3 className="design_title">Want to edit in my species?</h3>
                        <p className="design_content">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis consequatur eligendi quisquam doloremque vero ex debitis veritatis placeat unde animi laborum sapiente illo possimus, commodi dignissimos obcaecati illum maiores corporis.
                        </p>
                    </div>
                    <div className="text_content_componens">
                        <h3>How to do?</h3>
                        <p className="design_content">
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod itaque voluptate nesciunt laborum incidunt. Officia, quam consectetur. Earum eligendi aliquam illum alias, unde optio accusantium soluta, iusto molestiae adipisci et?
                        </p>
                    </div>
                </div>
            </div>
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
                            <Form.Item label="First Name" name="first_name">
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
                            <Form.Item label="E-mail" name="email">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item label="Request" name="request">
                                <Select>
                                    <Select.Option value="Request_CRISPR_Plasmids">Request CRISPR Plasmids</Select.Option>
                                    <Select.Option value="Other">Other</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item 
                                label="Message" 
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
        </div>
    )
}

export default GetPlasmids;