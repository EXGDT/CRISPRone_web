import { Typography, Collapse, Table, Button } from 'antd';
import { useState } from 'react';
import { parameters, data, processSequence, processAminoacid, processEditedSequence, handleSequenceHighlight } from './data';
import "../cas9_submit/index.scss";
import "./index.scss";

const { Title } = Typography;
const { Panel } = Collapse;

function Be_submit() {
    const [selectedRowKey, setSelectedRowKey] = useState(null);

    const renderParameterItem = (item) => {
        if (item.type === "sequence") {
            return (
                <div className="sequence-item" key={item.label}>
                    <div className="label">{item.label}:</div>
                    <div className="sequence-container">
                        <div className="value">{item.value}</div>
                    </div>
                </div>
            );
        }

        return (
            <div className="sequence-item" key={item.label}>
                <div className="label">{item.label}:</div>
                <div className="value">{item.value}</div>
            </div>
        );
    };
    const columns = [
        {
            title: "CRISPR Target (5' to 3')",
            key: 'crisprTarget',
            render: (text, record) => {
                if (btn === 'with PAM') {
                    return (
                        <div>
                            {record.crisprTarget}
                        </div>
                    );
                } else {
                    return (
                        <div>
                            {record.crisprTarget.slice(0, -3)}
                        </div>
                    );
                }
            }
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.position - b.position,
        },
        {
            title: 'Editing Window Sequence',
            key: 'editingWindowSequence',
            render: (text, record) => {

                const processedHtml = processEditedSequence(record.editingWindowSequence, record.direction, record.seq_info.before, record.seq_info.after)

                return (
                    <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
                );
            }
        },
        {
            title: 'Aminoacid Sequence',
            key: 'aminoacid_sequence',
            render: (text, record) => {

                const processedHtml = processSequence(
                    record.editingWindowSequence,
                    record.seq_info.before,
                    record.seq_info.after,
                    record.direction
                );
                const processedHtml2 = processAminoacid(
                    record.amino_acid_info.before,
                    record.amino_acid_info.after
                );

                return (
                    <>
                        <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
                        <div dangerouslySetInnerHTML={{ __html: processedHtml2 }} />
                    </>
                );
            },
        },
        {
            title: '突变前后氨基酸酸碱性变化',
            key: 'acid_change',
            filters: [
                {
                    text: '酸变碱',
                    value: '酸变碱',
                },
                {
                    text: '碱变酸',
                    value: '碱变酸',
                },
                {
                    text: '没有变化',
                    value: '没有变化',
                },
            ],
            onFilter: (value, record) => record.acid_change.indexOf(value) === 0,
        },
        {
            title: 'Direction',
            dataIndex: 'direction',
            key: 'direction',
            filters: [
                {
                    text: '+',
                    value: '+',
                },
                {
                    text: '-',
                    value: '-',
                }
            ],
            onFilter: (value, record) => record.direction.indexOf(value) === 0,
        },
        {
            title: 'GC Contents(%, w/o PAM)',
            dataIndex: 'gcContents',
            key: 'gcContents',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.gcContents - b.gcContents,
        },
        {
            title: '脱靶信息',
            key: 'off_target',
        },
        {
            title: 'Mismatches',
            dataIndex: 'mismatches',
            key: 'mismatches',
            children: [
                {
                    title: '0',
                    dataIndex: '0',
                    key: '0',
                },
                {
                    title: '1',
                    dataIndex: '1',
                    key: '1',
                },
                {
                    title: '2',
                    dataIndex: '2',
                    key: '2',
                },
            ]
        },
    ];
    const [btn, setBtn] = useState('with PAM');
    const [highlightedSequence, setHighlightedSequence] = useState(null);

    const onWindow = (record) => {
        console.log(record);
        const highlightedSeq = handleSequenceHighlight(record, data.Sequence_Info.sequence_info.sequence);
        setHighlightedSequence(highlightedSeq);
    }


    return (
        <div className="result-container" style={{ minHeight: '150vh' }}>
            {/* 参数部分 */}
            <div className="result-section">
                <Title level={3}>Set Parameters</Title>
                <Collapse>
                    <Panel header="User Seted Parameters" key="1">
                        <div className="parameters-group">
                            <div className="sequence-title">
                                <div className="sequence-title-item">
                                    <div className="sequence-title-item-label">Parameters</div>
                                    <div className="sequence-title-item-value">Set Values</div>
                                </div>
                            </div>

                            {/* 渲染序列参数 */}
                            {parameters.sequences.map(renderParameterItem)}

                            {/* 渲染其他设置参数 */}
                            {parameters.settings.map(renderParameterItem)}
                        </div>
                    </Panel>
                </Collapse>
            </div>
            <>
                <div className="sequence-container">
                    <div className="sequence-display">
                        <div className="nucleotide-sequence">
                            {highlightedSequence ? (
                                <div dangerouslySetInnerHTML={{ __html: highlightedSequence }} />
                            ) : (
                                data.Sequence_Info.sequence_info.sequence
                            )}
                        </div>
                        <div className="amino-sequence">
                            {data.Sequence_Info.amino_acid_info.aminoacid}
                        </div>
                    </div>
                </div>
            </>
            <>
                <Button onClick={() => {
                    if (btn === 'with PAM') {
                        setBtn('without PAM');
                    } else {
                        setBtn('with PAM');
                    }
                }}>{btn}</Button>
                <br />
                <br />
                <Table
                    columns={columns}
                    dataSource={data.Table_data}
                    bordered
                    rowKey="crisprTarget" // 添加这行，使用position作为唯一标识
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [selectedRowKey],
                        onChange: (selectedKeys) => setSelectedRowKey(selectedKeys[0])
                    }}
                    onRow={(record) => ({
                        onClick: () => {
                            onWindow(record);
                            setSelectedRowKey(record.crisprTarget); // 使用position而不是key
                        }
                    })}
                />
            </>
        </div>
    )
}

export default Be_submit;