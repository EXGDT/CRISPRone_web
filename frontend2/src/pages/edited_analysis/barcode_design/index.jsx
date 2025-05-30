import { useState } from 'react';
import barcode from '@/assets/Image/barcode_design.png'
import { InfoCircleOutlined } from '@ant-design/icons';
import './index.scss'

// 介绍部分属性
const introductionProps = {
    imgSrc: barcode, // 图片路径
    title: 'What is editing analysis?', // 标题
    content: `When CRISPR plasmids is delivered to infected plants through agrobacterium tumefaciens to complete genetic transformation, we need to know whether the target gene in transgenic offspring is mutated and the type of mutation. There are generally two detection methods: 1) traditional Sanger sequencing, which is usually time-consuming and laborious. 2) Illumina high throughput sequencing.`, // 内容
    components: [
        'Primrt and Barcode design;',
        'PCR amplification and product mixing;',
        'Illumina sequence;',
        'Analysis and plot;',
    ],
};

function BarcodeDesign() {
    const [formValues, setFormValues] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault(); // 阻止默认刷新行为
        
        
        // 获取所有输入框的值
        formValues.projectName = event.target.projectName.value;
        formValues.forwardPrimer = event.target.forwardPrimer.value;
        formValues.reversePrimer = event.target.reversePrimer.value;
        formValues.barcodeLength = event.target.barcodeLength.value;
        formValues.barcodeNumber = event.target.barcodeNumber.value;
        formValues.minDistance = event.target.minDistance.value;
        formValues.minGC = event.target.minGC.value;
        formValues.maxGC = event.target.maxGC.value;
        formValues.attempts = event.target.attempts.value;
        formValues.prepareForCompany = event.target.prepareForCompany.checked;

        // 更新状态
        setFormValues(formValues);
        
        // 输出到控制台
        console.log('表单提交的值：', formValues);
        
        // 可以添加提交成功的提示
        alert("表单已提交");
    };

    return (
        <div className="barcode_design">
            <div className="introduction">
                {/* 左边的图片 */}
                <img src={introductionProps.imgSrc} alt="" className="introduction_img" />
                {/* 右边的文字内容 */}
                <div className="introduction_text">
                    <div className="introduction_text_top">
                        <h3 className="introduction_title">{introductionProps.title}</h3>
                        <p className="introduction_content">
                            {introductionProps.content}
                            <a href="https://bmcbiol.biomedcentral.com/articles/10.1186/s12915-022-01232-3" target="_blank" rel="noopener noreferrer">
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
            <div className="form">
                <div className="title">
                    <span>Barcode Primers Design</span>
                </div>
                <hr />
                <div className="content">
                    <h3>This program generates barcodes of a desired length, distance, and GC content. First, your need the base primer paired end primers.</h3>
                </div>
                <form onSubmit={handleSubmit} className="floating-form">
                    <div className="form-row">
                        <div className="form-column">
                            <div className="column-header">
                                <span className="required-text">Required</span>
                            </div>
                            <div className="form-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="projectName" 
                                    placeholder="GhPEBP"
                                    required
                                />
                                <label htmlFor="projectName" className="form-label" title="1. What is the project name? Usually is gene id">
                                    1. What is the project name?Usually is gene id
                                </label>
                            </div>

                            <div className="form-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="forwardPrimer" 
                                    placeholder="AATTTTTTTCCATCTGCAGTTACT"
                                    required 
                                />
                                <label htmlFor="forwardPrimer" className="form-label">
                                    2. The base primer of Forward from 5&apos; to 3&apos;
                                </label>
                            </div>

                            <div className="form-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="reversePrimer" 
                                    placeholder="CTGTCACTATCCAGTGTAAGTGC"
                                    required 
                                />
                                <label htmlFor="reversePrimer" className="form-label">
                                    3. The base primer of Reverse from 5&apos; to 3&apos;
                                </label>
                            </div>

                            <div className="form-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="barcodeLength" 
                                    placeholder="LENGTH"
                                    required 
                                />
                                <label htmlFor="barcodeLength" className="form-label" title="4. Barcode length; Enter LENGTH as an integer (i.e. 4)">
                                    4. Barcode length; Enter LENGTH as an integer (i.e. 4)
                                </label>
                            </div>

                            <div className="form-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="barcodeNumber" 
                                    placeholder="LENGTH x 5"
                                    required 
                                />
                                <label htmlFor="barcodeNumber" className="form-label" title="5. Total number of barcodes (Primer Pairs) (default is LENGTH x 5)">
                                    5. Total number of barcodes (Primer Pairs) (default is LENGTH x 5)
                                </label>
                            </div>
                        </div>

                        <div className="form-column">
                            <div className="column-header">
                                <span className="optional-text">Optional:</span>
                            </div>
                            <div className="form-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="minDistance" 
                                    placeholder="LENGTH/2, i.e. 7->3, 4->2"
                                />
                                <label htmlFor="minDistance" className="form-label" title="6. The minimum number of different bases between barcodes (default is LENGTH/2, i.e. 7->3, 4->2)">
                                    6. The minimum number of different bases between barcodes (default is LENGTH/2, i.e. 7-&gt;3, 4-&gt;2)
                                </label>
                            </div>

                            <div className="form-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="minGC" 
                                    placeholder="0"
                                />
                                <label htmlFor="minGC" className="form-label" title="7. Desired GC content minimum range in percentages (i.e. 50 ->50%) (default is 0)">
                                    7. Desired GC content minimum range in percentages (i.e. 50 -&gt;50%%) (default is 0)
                                </label>
                            </div>

                            <div className="form-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="maxGC" 
                                    placeholder="100"
                                />
                                <label htmlFor="maxGC" className="form-label" title="8. Desired GC content maximum range in percentages (i.e. 50 ->50%) (default is 100)">
                                    8. Desired GC content maximum range in percentages (i.e. 50 -&gt;50%%) (default is 100)
                                </label>
                            </div>

                            <div className="form-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="attempts" 
                                    placeholder="10000"
                                />
                                <label htmlFor="attempts" className="form-label" title="9. How many attempts? The default number of random codes to test is 10000">
                                    9. How many attempts? The default number of random codes to test is 10000.
                                </label>
                            </div>

                            <div className="form-group checkbox-group">
                                <input 
                                    type="checkbox" 
                                    id="prepareForCompany" 
                                    className="form-checkbox"
                                />
                                <label htmlFor="prepareForCompany">
                                    10. Prepare for sent to company?
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group submit-group">
                        <button 
                            type="submit" 
                            className="submit-button"
                        >
                            Barcode Generator
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BarcodeDesign;