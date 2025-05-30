// import { Typography, Collapse} from 'antd';
// import  { useState } from 'react';
import { Tabs, Table, Space, Button, message } from 'antd';
import { DownloadOutlined, CopyOutlined, PrinterOutlined } from '@ant-design/icons';
import "./index.scss";
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PropTypes from 'prop-types';
import { utils, write } from 'xlsx';


// const { Title } = Typography;
// const { Panel } = Collapse;

function Result() {

    // const [parameters, setParameters] = useState({
    //     settings:[
    //         {label: "param1",value: "ABE"},
    //         {label: "param2",value: "NGG"},
    //         {label: "param3",value: "Gossypium_hirsutum_Jin668_HZAU"},
    //         {label: "param4",value: "-"},
    //         {label: "param5",value: "1"},
    //         {label: "param6",value: "100"},
    //         {label: "param7",value: "1000000"},
    //         {label: "param8",value: "1000000"},
    //         {label: "param9",value: "1000000"},
    //         {label: "param10",value: "1000000"},

    //     ]
    // });

    // const renderParameterItem = (item) => {
    //     if (item.type === "sequence") {
    //         return (
    //             <div className="sequence-item" key={item.label}>
    //                 <div className="label">{item.label}:</div>
    //                 <div className="sequence-container">
    //                     <div className="value">{item.value}</div>
    //                 </div>
    //             </div>
    //         );
    //     }

    //     return (
    //         <div className="sequence-item" key={item.label}>
    //             <div className="label">{item.label}:</div>
    //             <div className="value">{item.value}</div>
    //         </div>
    //     );
    // };
    const onChange = (key) => {
        console.log(key);
    };

    // 添加打印功能
    const handlePrint = (columns, data) => {
        // 创建打印内容
        const printContent = document.createElement('div');
        printContent.innerHTML = `
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            ${columns.map(col => `<th style="border: 1px solid #ddd; padding: 8px; background: #60BDB4; color: white;">
              ${col.children ? col.children.map(child => child.title).join('</th><th style="border: 1px solid #ddd; padding: 8px; background: #60BDB4; color: white;">') : col.title}
            </th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(item => `
            <tr>
              ${columns.map(col => `<td style="border: 1px solid #ddd; padding: 8px;">
                ${col.children ? col.children.map(child => item[child.dataIndex]).join('</td><td style="border: 1px solid #ddd; padding: 8px;">') : item[col.dataIndex]}
              </td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

        // 创建打印窗口
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
      <html>
        <head>
          <title>Print Table</title>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.print();
    };

    // 添加复制功能
    const copyToClipboard = async (columns, data) => {
        // 转换数据为表格格式
        const headers = columns.map(col =>
            col.children ? col.children.map(child => child.title).join('\t') : col.title
        ).join('\t');

        const rows = data.map(item =>
            columns.map(col =>
                col.children ? col.children.map(child => item[child.dataIndex]).join('\t') : item[col.dataIndex]
            ).join('\t')
        ).join('\n');

        const textToCopy = `${headers}\n${rows}`;

        try {
            await navigator.clipboard.writeText(textToCopy);
            message.success('Table data copied to clipboard');
        } catch (err) {
            message.error('Failed to copy table data', err);
        }
    };

    // 修改 PDF 下载函数
    const downloadPDF = (columns, data, filename) => {
        try {
            const doc = new jsPDF('l', 'mm', 'a4'); // 使用横向布局

            // 处理表头，支持多级表头
            const processHeaders = (cols) => {
                let headers = [];
                cols.forEach(col => {
                    if (col.children) {
                        headers = [...headers, ...col.children.map(child => child.title)];
                    } else {
                        headers.push(col.title);
                    }
                });
                return headers;
            };

            // 处理数据行
            const processData = (cols, rowData) => {
                let row = [];
                cols.forEach(col => {
                    if (col.children) {
                        col.children.forEach(child => {
                            const value = rowData[child.dataIndex];
                            row.push(value !== undefined ? value.toString() : '');
                        });
                    } else {
                        const value = rowData[col.dataIndex];
                        row.push(value !== undefined ? value.toString() : '');
                    }
                });
                return row;
            };

            const headers = processHeaders(columns);
            const tableData = data.map(item => processData(columns, item));

            // 计算列宽
            const columnWidths = headers.map(() => 'auto');

            // 设置表格样式和配置
            autoTable(doc, {
                head: [headers],
                body: tableData,
                startY: 20,
                styles: {
                    fontSize: 7,
                    cellPadding: 2,
                    overflow: 'linebreak',
                    halign: 'center',
                    valign: 'middle'
                },
                headStyles: {
                    fillColor: [96, 189, 180],
                    textColor: [255, 255, 255],
                    fontSize: 8,
                    fontStyle: 'bold',
                    halign: 'center'
                },
                columnStyles: columnWidths.reduce((acc, width, index) => {
                    acc[index] = { cellWidth: width };
                    return acc;
                }, {}),
                margin: { top: 10, right: 10, bottom: 10, left: 10 },
                theme: 'grid',
                tableWidth: 'auto',
                didDrawPage: (data) => {
                    // 添加页眉
                    doc.setFontSize(10);
                    doc.text(filename, data.settings.margin.left, 10);
                }
            });

            // 保存文件
            doc.save(`${filename}.pdf`);
        } catch (error) {
            console.error('PDF generation error:', error);
            message.error('Failed to generate PDF');
        }
    };

    // 通用的 CSV 下载函数
    const downloadCSV = (columns, data, filename) => {
        // 表头
        const headers = columns.map(col => {
            // 处理多级表头
            if (col.children) {
                return col.children.map(child => child.title).join(',');
            }
            return col.title;
        }).join(',');

        // 数据行
        const rows = data.map(item =>
            columns.map(col => {
                if (col.children) {
                    return col.children.map(child => item[child.dataIndex]).join(',');
                }
                return item[col.dataIndex];
            }).join(',')
        ).join('\n');

        // 组合 CSV 内容
        const csvContent = `${headers}\n${rows}`;

        // 创建 Blob 对象
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // 下载文件
        saveAs(blob, filename);
    };


    // 在现有下载函数后添加 Excel 下载函数
    const downloadEXL = (columns, data, filename) => {
        try {
            // 处理表头
            const processHeaders = (cols) => {
                let headers = [];
                cols.forEach(col => {
                    if (col.children) {
                        headers = [...headers, ...col.children.map(child => child.title)];
                    } else {
                        headers.push(col.title);
                    }
                });
                return headers;
            };

            // 处理数据行
            const processData = (cols, rowData) => {
                let row = [];
                cols.forEach(col => {
                    if (col.children) {
                        col.children.forEach(child => {
                            const value = rowData[child.dataIndex];
                            row.push(value !== undefined ? value.toString() : '');
                        });
                    } else {
                        const value = rowData[col.dataIndex];
                        row.push(value !== undefined ? value.toString() : '');
                    }
                });
                return row;
            };

            // 创建工作表
            const worksheet = utils.aoa_to_sheet([
                processHeaders(columns),
                ...data.map(item => processData(columns, item))
            ]);

            // 创建工作簿
            const workbook = utils.book_new();
            utils.book_append_sheet(workbook, worksheet, "Sheet1");

            // 生成 Excel 文件
            const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

            // 保存文件
            saveAs(blob, `${filename}.xlsx`);
        } catch (error) {
            console.error('Excel generation error:', error);
            message.error('Failed to generate Excel');
        }
    };

    // 修改表格标题部分
    const TableTitle = ({ columns, data, filename }) => (
        <div className="table-title">
            <Space className="table-actions">
                <Button
                    type="primary"
                    icon={<PrinterOutlined />}
                    onClick={() => handlePrint(columns, data)}
                >
                    Print
                </Button>
                <Button
                    type="primary"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(columns, data)}
                >
                    Copy
                </Button>
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => {
                        try {
                            downloadPDF(columns, data, filename);
                        } catch (error) {
                            console.error('PDF download error:', error);
                            message.error('Failed to download PDF');
                        }
                    }}
                >
                    PDF
                </Button>
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => downloadCSV(columns, data, `${filename}.csv`)}
                >
                    CSV
                </Button>
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => downloadEXL(columns, data, 'Your_Filename')}
                    >
                    Excel
                </Button>
            </Space>
        </div>
    );

    TableTitle.propTypes = {
        title: PropTypes.string.isRequired,
        columns: PropTypes.array.isRequired,
        data: PropTypes.array.isRequired,
        filename: PropTypes.string.isRequired,
    };

    const renderLongFormat = () => {
        const dataSource = [
            { key: '1', Primers: '12-F aatattcgaacg', Seq: 'aatattcgaacg123' },
            { key: '2', Primers: '12-R aatattcgaacg', Seq: 'cgttcgaatatt12' },
            { key: '3', Primers: '12-F _ccacttgacggg', Seq: 'ccacttgacggg123' },
            { key: '4', Primers: '12-R_ccacttgacggg', Seq: 'cccgtcaagtgg12' },
            { key: '5', Primers: '12-F_cggcttggaatt', Seq: 'cggcttggaatt123' },
            { key: '6', Primers: '12-R_cggcttggaatt', Seq: 'aattccaagccg12' },
            { key: '7', Primers: '12-F_ctccgaaccgtg', Seq: 'ctccgaaccgtg123' },
            { key: '8', Primers: '12-R ctccgaaccgtg', Seq: 'cacggttcggag12' },
            { key: '9', Primers: '12-F_ggggctcatgcg', Seq: 'ggggctcatgcg123' },
            { key: '10', Primers: '12-R_ggggctcatgcg', Seq: 'cgcatgagcccc12' },
        ];

        const columns = [
            {
                title: 'Barcode Primers (5\'to3\')',
                dataIndex: "Primers",
                key: 'Primers',
            },
            {
                title: 'Seq',
                dataIndex: 'Seq',
                key: 'Seq',
            },
        ];

        return (
            <>
                <TableTitle
                    columns={columns}
                    data={dataSource}
                    filename={'Long Format Table'}
                />
                <Table dataSource={dataSource} columns={columns} />
            </>
        );
    };
    const renderWideFormat = () => {
        const dataSource = [
            {
                Primers_f: "cgttcgaatatt12",
                seq_f: "12-R aatattcgaacg",
                Primers_r: "aatattcgaacg123",
                seq_r: "12-F aatattcgaacg"
            },
            {
                Primers_f: "cccgtcaagtgg12",
                seq_f: "12-R_ccacttgacggg",
                Primers_r: "ccacttgacggg123",
                seq_r: "12-F_ccacttgacggg"
            },
            {
                Primers_f: "aattccaagccg12",
                seq_f: "12-R_cggcttggaatt",
                Primers_r: "cggcttggaatt123",
                seq_r: "12-F_cggcttggaatt"
            },
            {
                Primers_f: "cacggttcggag12",
                seq_f: "12-R_ctccgaaccgtg",
                Primers_r: "ctccgaaccgtg123",
                seq_r: "12-F_ctccgaaccgtg"
            },
            {
                Primers_f: "cgcatgagcccc12",
                seq_f: "12-R_ggggctcatgcg",
                Primers_r: "ggggctcatgcg123",
                seq_r: "12-F_ggggctcatgcg"
            },
            {
                Primers_f: "agatgcgagacc12",
                seq_f: "12-R_ggtctcgcatct",
                Primers_r: "ggtctcgcatct123",
                seq_r: "12-F_ggtctcgcatct"
            },
            {
                Primers_f: "gcgatatcatac12",
                seq_f: "12-R_gtatgatatcgc",
                Primers_r: "gtatgatatcgc123",
                seq_r: "12-F_gtatgatatcgc"
            },
            {
                Primers_f: "gtcccacgtgac12",
                seq_f: "12-R_gtcacgtgggac",
                Primers_r: "gtcacgtgggac123",
                seq_r: "12-F_gtcacgtgggac"
            },
            {
                Primers_f: "cccaatccagac12",
                seq_f: "12-R_gtctggattggg",
                Primers_r: "gtctggattggg123",
                seq_r: "12-F_gtctggattggg"
            },
            {
                Primers_f: "gtgtctgttgta12",
                seq_f: "12-R tacaacagacac",
                Primers_r: "tacaacagacac123",
                seq_r: "12-F tacaacagacac"
            },
        ];

        const columns = [
            {
                title: "Primers F(5'to3')",
                dataIndex: 'Primers_f',
                key: "Primers_F"
            },
            {
                title: 'Seq_F',
                dataIndex: 'seq_f',
                key: 'Seq_F'
            },
            {
                title: "Primers R(5'to3')",
                dataIndex: 'Primers_r',
                key: "Primers_R"
            },
            {
                title: 'Seq_R',
                dataIndex: 'seq_r',
                key: 'Seq_R'
            }
        ];

        return (
            <>
                <TableTitle
                    columns={columns}
                    data={dataSource}
                    filename={'Wide Format Table'}
                />
                <Table dataSource={dataSource} columns={columns} />
            </>
        );
    };
    const renderCompanyFormat = () => {
        const dataSource = [
            {
                key: '1',
                Primers: "12-F aatattcgaacg",
                Seq: "aatattcgaacg123",
            },
            {
                key: '',
                Primers: '1_12-F aatattcgaacg',
                Seq: 'aatattcgaacg123'
            },
            {
                key: '',
                Primers: '1_12-R _aatattcgaacg',
                Seq: 'cgttcgaatatt12'
            },
            {
                key: '',
                Primers: '2 12-R ccacttgacggg',
                Seq: 'cccgtcaagtgg12'
            },
            {
                key: '',
                Primers: '2 12-F_ccacttgacggg',
                Seq: 'ccacttgacggg123'
            },
            {
                key: '',
                Primers: '3_12-F_cggcttggaatt',
                Seq: 'cggcttggaatt123'
            },
            {
                key: '',
                Primers: '3_12-R_cggcttggaatt',
                Seq: 'aattccaagccg12'
            },
            {
                key: '',
                Primers: '4_12-R_ctccgaaccgtg4',
                Seq: 'cacggttcggag12'
            },
            {
                key: '',
                Primers: '_12-F_ctccgaaccgtg',
                Seq: 'ctccgaaccgtg123'
            },
            {
                key: '',
                Primers: '5_12-F_ggggctcatgcg',
                Seq: 'ggggctcatgcg123'
            },
            {
                key: '',
                Primers: '5_12-R_ggggctcatgcg',
                Seq: 'cgcatgagcccc12'
            },
        ];

        const columns = [
            {
                title: "Primers (5'to3')",
                dataIndex: "Primers",
                key: 'Primers',
            },
            {
                title: "Seq",
                dataIndex: "Seq",
                key: 'Seq',
            },
        ];

        return (
            <>
                <TableTitle
                    columns={columns}
                    data={dataSource}
                    filename={'Company Format Table'}
                />
                <Table dataSource={dataSource} columns={columns} />
            </>
        );
    }
    const items = [
        {
            key: '1',
            label: 'Barcode Primers (Long Format)',
            children: renderLongFormat(),
        },
        {
            key: '2',
            label: 'Barcode Primers (Wide Format)',
            children: renderWideFormat(),
        },
        {
            key: '3',
            label: 'Barcode Primers (Company Format)',
            children: renderCompanyFormat(),
        },
    ];
    const note = [
        `These are the barcodes of length 6 with a distance of 3 bases.`,
        `All the orientation of primer in this files is 5' to 3'!!!`,
        `The total creat Primer Pairs: 10, which 10 pairs are good barcodes.`,
    ]
    return (
        <div className="result-container">
            {/* 参数部分 */}
            {/* <div className="result-section">
                <Title level={3}>Set Parameters</Title>
                <Collapse>
                    <Panel header="User Seted Parameters" key="1">
                        <div className="parameters-group">
                            {parameters?.settings.map(renderParameterItem)}
                        </div>
                    </Panel>
                </Collapse>
            </div> */}
            <>
                <div className="note">
                    {note.map((item, index) => (
                        <p key={index}>{item}</p>
                    ))}
                </div>
                {/* 可切换表格 */}
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </>
        </div>
    );
}

export default Result;
