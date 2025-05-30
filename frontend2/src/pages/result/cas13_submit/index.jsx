import { Typography, Collapse, Table, Input, Button, Space, message } from 'antd';
import { useState, useRef, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import "../cas9_submit/index.scss";
import { useNavigate } from 'react-router-dom';
import { getConfigCas13 } from '@/utils/api/api';

const { Title } = Typography;
const { Panel } = Collapse;

function Result() {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [tableData, setTableData] = useState([]);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);

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
            ...getColumnSearchProps('sgRNA_id'),
            sorter: (a, b) => a.sgRNA_id.localeCompare(b.sgRNA_id),
        },
        {
            title: 'Position',
            dataIndex: 'sgRNA_position',
            key: 'sgRNA_position',
        },
        {
            title: 'Seq',
            dataIndex: 'sgRNA_seq',
            key: 'sgRNA_seq',
        },
        {
            title: 'Off-target num',
            dataIndex: 'offtarget_num',
            key: 'offtarget_num',
        }
    ];

    useEffect(() => {
        // 从localStorage获取数据
        const storedFormData = localStorage.getItem('cas13_form_data');
        const token = localStorage.getItem('cas13_token');

        if (!storedFormData || !token) {
            message.error('No design parameters found');
            navigate('/cas13');
            return;
        }

        // 解析存储的表单数据，如果解析失败则设置为默认值
        try {
            const parsedFormData = JSON.parse(storedFormData);
            setFormData(parsedFormData);
        } catch (error) {
            console.error('Failed to parse form data:', error);
            setFormData({
                input_sequences: 'No data',
                target_genome: 'No data',
                pam_type: 'No data',
                customized_pam: 'No data',
                sgrna_module: 'No data',
                spacer_length: 'No data'
            });
        }

        // 获取表格数据
        const fetchData = async () => {
            try {
                // 测试数据
                const response = await getConfigCas13(token);
                setTableData(response.data.TableData.json_data.rows);
            } catch (error) {
                message.error('Failed to fetch results');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    return (
        <div className="result-container">
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
                            {formData ? (
                                Object.entries(formData).map(([key, value]) => (
                                    <div className="sequence-item" key={key}>
                                        <div className="label">{key}:</div>
                                        <div className="value">{value || 'No data'}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="sequence-item">
                                    <div className="value">No design parameters available</div>
                                </div>
                            )}
                        </div>
                    </Panel>
                </Collapse>
            </div>
            <div className="tables-container">
                <div className="table-section left">
                    <div className="table-title">
                        <h3 className="table-h3">sgRNA list</h3>
                    </div>
                    <div className="table-content">
                        <Table
                            loading={loading}
                            columns={columns}
                            dataSource={tableData}
                            pagination={false}
                            rowKey="sgRNA_id"
                            scroll={{ y: 400 }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Result;
