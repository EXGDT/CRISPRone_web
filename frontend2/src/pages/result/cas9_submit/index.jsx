import { Typography, Collapse, Table, Input, Button, Space, Spin, Modal } from 'antd';
import { useState, useRef, useEffect} from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { calculate_locus, processMdAndSequence } from './utils';
import { getConfigCas9 } from '@/utils/api/api';
import {
    getJBrowseState,
    createJBrowseStateFromResult,
} from '@/components/editor/result/conf/jbrowseState.jsx';
import {
updateConfigUrls
} from '@/components/editor/result/conf/config.jsx';
import JBrowseView from '@/components/editor/result/components/JBrowseView.jsx';
import Highlighter from 'react-highlight-words';
import "./index.scss";

const { Title } = Typography;
const { Panel } = Collapse;

function Result() {
    const [loading, setLoading] = useState(true);
    const [resultData, setResultData] = useState(null);
    const [error, setError] = useState(null);
    const [parameters, setParameters] = useState(null);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0] || '');
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        setSearchText('');
        confirm();
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters, confirm)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => {
            const fieldValue = record[dataIndex];
            return fieldValue
                ? fieldValue.toString().toLowerCase().includes(value.toLowerCase())
                : '';
        },
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    // 表格列
    const columns = [
        {
            title: 'Id',
            dataIndex: 'sgRNA_id',
            key: 'sgRNA_id',
            width: '16%',
            ...getColumnSearchProps('sgRNA_id'),
            sorter: (a, b) => a.sgRNA_id.localeCompare(b.sgRNA_id),
        },
        {
            title: 'Position',
            dataIndex: 'sgRNA_position',
            key: 'sgRNA_position',
            width: '25%'
        },
        {
            title: 'Strand',
            dataIndex: 'sgRNA_strand',
            key: 'sgRNA_strand',
            width: '13%',
        },
        {
            title: 'Seq',
            dataIndex: 'sgRNA_seq',
            key: 'sgRNA_seq',
            width: '33%',
        },
        {
            title: 'GC Content',
            dataIndex: 'sgRNA_GC',
            key: 'sgRNA_GC',
            width: '13%',
        }
    ];
    const sgRNA_table_columns = [
        {
            title: 'Family',
            dataIndex: 'family',
            key: 'family',
            width: '15%',
        },
        {
            title: 'Seq_id',
            dataIndex: 'seqid',
            key: 'seqid',
            width: '11%',
        },
        {
            title: 'Start',
            dataIndex: 'sgRNA_start',
            key: 'sgRNA_start',
            width: '10%',
        },
        {
            title: 'End',
            dataIndex: 'sgRNA_end',
            key: 'sgRNA_end',
            width: '10%',
        },
        {
            title: 'Position Start',
            dataIndex: 'sgRNA_start',
            key: 'sgRNA_start',
            width: '10%',
        },
        {
            title: 'Position End',
            dataIndex: 'sgRNA_end',
            key: 'sgRNA_end',
            width: '10%',
        },
        {
            title: 'Strand',
            dataIndex: 'strand',
            key: 'strand',
        },
        {
            title: 'Sequence',
            dataIndex: 'rseq',
            key: 'rseq',
            width: '21%',
            render: (text, record) => {
                const processedHtml = processMdAndSequence(record.MD, record.rseq);
                return (
                    <div
                        className="sequence-cell"
                        dangerouslySetInnerHTML={{ __html: processedHtml }}
                    />
                );
            }
        },
        {
            title: 'Types',
            dataIndex: 'types',
            key: 'types',
        }
    ]
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
    const [selectedRowKeys, setSelectedRowKeys] = useState(['Guide_0']);
    const [selectedRow, setSelectedRow] = useState(null);
    const [offTargetData, setOffTargetData] = useState(null);

    const [jbrowseState, setJbrowseState] = useState(getJBrowseState());

    // 移动到组件内部
    const handleClick = (position) => {
        if (jbrowseState) {
            jbrowseState.session.view.navToLocString(position);
        }
    };

    const handleRestore = () => {
        if (jbrowseState) {
            jbrowseState.session.view.navToLocString(resultData.JbrowseInfo.position);
        }
    };

    const onSelectedRowKeysChange = (newSelectedRowKeys, selectedRows) => {
        setSelectedRowKeys(newSelectedRowKeys);
        if (selectedRows && selectedRows.length > 0) {
            const newSelectedRow = selectedRows[0];
            setSelectedRow(newSelectedRow);
            setOffTargetData(newSelectedRow.offtarget_json.rows);
            console.log('Selected Row:', newSelectedRow);
            const position = newSelectedRow.sgRNA_position;
            if (position) {
                handleClick(calculate_locus(position, 20));
            }
        }
    };

    const onRow = (record) => ({
        onClick: () => {
            const newSelectedKeys = [record.sgRNA_id];
            setSelectedRowKeys(newSelectedKeys);
            setSelectedRow(record);
            setOffTargetData(record.offtarget_json.rows);
            console.log('Clicked Row:', record);
            if (record.sgRNA_position) {
                handleClick(calculate_locus(record.sgRNA_position, 20));
            }
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 获取存储的参数
                const formData = JSON.parse(localStorage.getItem('cas9_design_params'));
                const token = localStorage.getItem('cas9_design_token');

                if (!formData || !token) {
                    throw new Error('缺少必要参数');
                }

                // 设置参数显示
                setParameters({
                    sequences: [
                        {
                            label: "Input Sequence",
                            value: formData.input_sequences,
                            type: "plain"
                        }
                    ],
                    settings: [
                        { label: "PAM Type", value: formData.pam_type || "Not Set" },
                        { label: "Target Genome", value: formData.target_genome || "Not Set" },
                        { label: "Customized PAM", value: formData.customized_pam || "Not Set" },
                        { label: "sgRNA Module", value: formData.sgRNA_module || "Not Set" },
                        { label: "Spacer Length", value: formData.spacer_length || "Not Set" }
                    ]
                });

                // 使用新的 API 方法获取配置
                const response = await getConfigCas9(token);
                const data = response.data; // 假设响应数据结构包含 data 字段

                setResultData(data);

                // 初始化选中行数据
                if (data.TableData.json_data && data.TableData.json_data.rows && data.TableData.json_data.rows.length > 0) {
                    setSelectedRow(data.TableData.json_data.rows[0]);
                    setOffTargetData(data.TableData.json_data.rows[0].offtarget_json.rows);
                }

                // 如果没有 JBrowse 状态，从结果数据创建
                if (!jbrowseState && data.JbrowseInfo) {
                    const newState = createJBrowseStateFromResult(data);
                    setJbrowseState(newState);
                }

                // 更新 JBrowse 配置
                if (data.JbrowseInfo) {
                    updateConfigUrls({
                        fasta: data.JbrowseInfo.assembly.fasta,
                        fai: data.JbrowseInfo.assembly.fai,
                        gff3_gz: data.JbrowseInfo.tracks.gff3_gz,
                        gff3_tbi: data.JbrowseInfo.tracks.gff3_tbi,
                        json: data.JbrowseInfo.tracks.json,
                        position: data.JbrowseInfo.position,
                        assembly_name: data.JbrowseInfo.assembly.name,
                        tracks_name: data.JbrowseInfo.tracks.name,
                    });
                }

            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                Modal.error({
                    title: '加载失败',
                    content: err.message
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [jbrowseState]);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="result-container">
            {/* 参数部分 */}
            <div className="result-section">
                <Title level={3}>Set Parameters</Title>
                <Collapse>
                    <Panel header="User Seted Parameters" key="1">
                        <div className="parameters-group">
                            {/* 使用动态参数 */}
                            {parameters?.sequences.map(renderParameterItem)}
                            {parameters?.settings.map(renderParameterItem)}
                        </div>
                    </Panel>
                </Collapse>
            </div>

            {/* JBrowse 视图 */}
            {jbrowseState && (
                <div className="browser-container">
                    <JBrowseView state={jbrowseState} />
                </div>
            )}

            <div className="tables-container">
                <div className="table-section left">
                    <div className="table-title">
                        <h3 className="table-h3">sgRNA list</h3>
                        <div className="icon-withdraw" onClick={handleRestore}>
                            <svg viewBox="0 0 1024 1024" width="25" height="25">
                                <path d="M501 221.1h-1.8v-81.7c0-22.4-25.1-35.7-43.6-23.1L162.1 315.7c-12.8 8.7-16.1 26-7.4 38.8 2 2.9 4.5 5.4 7.4 7.4l293.5 199.3c18.5 12.6 43.6-0.7 43.6-23.1v-82.7h0.1v-0.1c137.5 2.3 250.4 99.6 256 224.6 4.4 97.9-58.4 184.7-151.5 224.8-1.7 0.7-3.5 2.2-3.3 5.1 0.1 2.4 2.5 3.1 4.7 2.4 149-43.8 258.7-172.6 262.8-327.5 5.3-195.2-159-358-367-363.6z"></path>
                            </svg>
                            <span>还原</span>
                        </div>
                    </div>
                    <div className="table-content">
                        <Table
                            columns={columns}
                            dataSource={resultData?.TableData?.json_data.rows || []}
                            pagination={false}
                            rowSelection={{
                                type: 'radio',
                                selectedRowKeys,
                                onChange: onSelectedRowKeysChange,
                            }}
                            onRow={onRow}
                            rowKey="sgRNA_id"
                            scroll={{ y: 400 }}
                        />
                    </div>
                </div>

                <div className="table-section right">
                    <div className="table-title">
                        <h3 className="table-h3">Detailed information and off target sites of sgRNAs</h3>
                    </div>
                    <div className="table-content">
                        {selectedRow ? (
                            <>
                                <div className="sgrna-details">
                                    <div className="detail-item highlight">
                                        <span className="value">{selectedRow.sgRNA_id}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Position:</span>
                                        <span className="value">{selectedRow.sgRNA_position}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Strand:</span>
                                        <span className="value">{selectedRow.sgRNA_strand}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">sgRNA_seq:</span>
                                        <span className="value">{selectedRow.sgRNA_seq}</span>
                                    </div>
                                    <div className="detail-item type">
                                        <span className="value">{selectedRow.sgRNA_type}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">offtarget_num:</span>
                                        <span className="value">{selectedRow.offtarget_json.total}</span>
                                    </div>
                                </div>
                                <Table
                                    columns={sgRNA_table_columns}
                                    dataSource={offTargetData || []}
                                    pagination={false}
                                    scroll={{ y: 400, x: 1200 }}
                                />
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                No data selected
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Result;
