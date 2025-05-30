import React from 'react';
import { SearchOutlined, DownloadOutlined, PrinterOutlined, CopyOutlined } from '@ant-design/icons';
import { useState, useRef } from 'react';
import { Space, Table, Input, Button, Collapse, Typography, message } from 'antd';
import { dataSource, pegRNA_extensions_dataSource, ngRNA_sequence_dataSource, parameters, PBS_and_RT_RowRender } from './data';
import styled from 'styled-components';
import Highlighter from 'react-highlight-words';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PropTypes from 'prop-types';
import './index.scss';

const { Panel } = Collapse;
const { Title, Paragraph } = Typography;

// 使用 styled-components 创建自定义表格组件
const StyledTable = styled(Table)`
  // PBS/RT/pegLIT 表格样式
  background: rgba(230, 238, 246, 0.95); // 更深的蓝色背景
  margin: 0 0 30px 40px; // 添加左边距实现缩进
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;

  // 添加左边的竖线装饰
  &::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #1890ff;
    border-radius: 3px;
  }

  .ant-table-thead {
    tr {
      th {
        // PBS 分组相关样式
        &[class*="pbs-column"],
        &.ant-table-cell[colspan]:has(~ .pbs-column) {
          background-color: rgba(0, 0, 255, 0.1) !important;
        }

        // RT 分组相关样式
        &[class*="rt-column"],
        &.ant-table-cell[colspan]:has(~ .rt-column) {
          background-color: rgba(255, 0, 0, 0.1) !important;
        }

        // pegLIT 分组相关样式
        &[class*="peglit-column"],
        &.ant-table-cell[colspan]:has(~ .peglit-column) {
          background-color: rgba(0, 255, 0, 0.1) !important;
        }
      }
    }
  }

  // 表格行样式
  .ant-table-tbody {
    tr {
      td {
        background: rgba(230, 238, 246, 0.5) !important;
      }
      &:hover td {
        background: rgba(230, 238, 246, 0.8) !important;
      }
    }
  }
`;

const StyledNgRNATable = styled(Table)`
  // ngRNA 表格样式
  background: rgba(255, 243, 230, 0.95); // 更深的橙色背景
  margin-left: 40px; // 与上面的表格保持一致的缩进
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;

  // 添加左边的竖线装饰，使用不同的颜色
  &::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #fa8c16;
    border-radius: 3px;
  }

  .ant-table-thead {
    tr {
      th {
        background-color: rgba(250, 140, 22, 0.1) !important;
      }
    }
  }

  // 表格行样式
  .ant-table-tbody {
    tr {
      td {
        background: rgba(255, 243, 230, 0.5) !important;
      }
      &:hover td {
        background: rgba(255, 243, 230, 0.8) !important;
      }
    }
  }
`;

function PESubmit() {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
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
            onClick={() => clearFilters && handleReset(clearFilters)}
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
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()) ?? false,
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
  const columns = [
    {
      title: 'spacer sequence',
      dataIndex: 'spacer_sequence',
      key: 'spacer_sequence',
      ...getColumnSearchProps('spacer_sequence'),
      sorter: (a, b) => a.spacer_sequence.localeCompare(b.spacer_sequence),
    },
    {
      title: 'Pam',
      dataIndex: 'pam',
      key: 'pam',
      sorter: (a, b) => a.pam.localeCompare(b.pam),
    },
    {
      title: 'strand',
      dataIndex: 'strand',
      key: 'strand',
      sorter: (a, b) => a.strand.localeCompare(b.strand),
    },
    {
      title: 'start',
      dataIndex: 'start',
      key: 'start',
      sorter: (a, b) => a.start.localeCompare(b.start),
    },
    {
      title: 'peg-to-edit distance',
      dataIndex: 'peg_to_edit_distance',
      key: 'peg_to_edit_distance',
      sorter: (a, b) => a.peg_to_edit_distance.localeCompare(b.peg_to_edit_distance),
    },
    {
      title: 'spacer GC content',
      dataIndex: 'spacer_gc_content',
      key: 'spacer_gc_content',
      sorter: (a, b) => a.spacer_gc_content.localeCompare(b.spacer_gc_content),
    },
    {
      title: 'Off Target',
      dataIndex: 'off_target',
      key: 'off_target',
    }
  ];
  const pegRNA_extensions_columns = [
    {
      title: 'PBS',
      className: 'pbs-column',
      children: [
        {
          title: 'PBS length',
          dataIndex: 'pbs_length',
          key: 'pbs_length',
          className: 'pbs-column',
          sorter: (a, b) => a.pbs_length.localeCompare(b.pbs_length),
          ...getColumnSearchProps('pbs_length'),
        },
        {
          title: 'PBS seq',
          dataIndex: 'pbs_seq',
          key: 'pbs_seq',
          className: 'pbs-column',
          sorter: (a, b) => a.pbs_seq.localeCompare(b.pbs_seq),
        },
        {
          title: 'PBS GC content',
          dataIndex: 'pbs_gc_content',
          key: 'pbs_gc_content',
          className: 'pbs-column',
          sorter: (a, b) => a.pbs_gc_content.localeCompare(b.pbs_gc_content),
        },
        {
          title: 'PBS Tm',
          dataIndex: 'pbs_tm',
          key: 'pbs_tm',
          className: 'pbs-column',
          sorter: (a, b) => a.pbs_tm.localeCompare(b.pbs_tm),
        },
        {
          title: 'PBS Level',
          dataIndex: 'pbs_level',
          key: 'pbs_level',
          className: 'pbs-column',
          sorter: (a, b) => a.pbs_level.localeCompare(b.pbs_level),
        }
      ]
    },
    {
      title: 'RT',
      className: 'rt-column',
      children: [
        {
          title: 'PTT length',
          dataIndex: 'ptt_length',
          key: 'ptt_length',
          className: 'rt-column',
          sorter: (a, b) => a.ptt_length.localeCompare(b.ptt_length),
        },
        {
          title: 'PTT seq',
          dataIndex: 'ptt_seq',
          key: 'ptt_seq',
          className: 'rt-column',
          sorter: (a, b) => a.ptt_seq.localeCompare(b.ptt_seq),
        },
        {
          title: 'PTT GC content',
          dataIndex: 'ptt_gc_content',
          key: 'ptt_gc_content',
          className: 'rt-column',
          sorter: (a, b) => a.ptt_gc_content.localeCompare(b.ptt_gc_content),
        }
      ]
    },
    {
      title: 'pegLIT',
      className: 'peglit-column',
      children: [
        {
          title: 'pegLIT linker',
          dataIndex: 'pegLIT_linker',
          key: 'pegLIT_linker',
          className: 'peglit-column',
          sorter: (a, b) => a.pegLIT_linker.localeCompare(b.pegLIT_linker),
        },
        {
          title: 'pegLIT linker score',
          dataIndex: 'pegLIT_linker_score',
          key: 'pegLIT_linker_score',
          className: 'peglit-column',
          sorter: (a, b) => a.pegLIT_linker_score.localeCompare(b.pegLIT_linker_score),
        },
        {
          title: 'pegLIT motifs_RNA',
          dataIndex: 'pegLIT_motifs_RNA',
          key: 'pegLIT_motifs_RNA',
          className: 'peglit-column',
          sorter: (a, b) => a.pegLIT_motifs_RNA.localeCompare(b.pegLIT_motifs_RNA),
        }
      ]
    }
  ];
  const ngRNA_sequence_columns = [
    {
      title: 'spacer sequence',
      dataIndex: 'spacer_sequence',
      key: 'spacer_sequence',
      sorter: (a, b) => a.spacer_sequence.localeCompare(b.spacer_sequence),
      ...getColumnSearchProps('spacer_sequence'),
    },
    {
      title: 'Pam',
      dataIndex: 'pam',
      key: 'pam',
      sorter: (a, b) => a.pam.localeCompare(b.pam),
    },
    {
      title: 'Strand',
      dataIndex: 'strand',
      key: 'strand',
      sorter: (a, b) => a.strand.localeCompare(b.strand),
    },
    {
      title: 'Start',
      dataIndex: 'start',
      key: 'start',
      sorter: (a, b) => a.start.localeCompare(b.start),
    },
    {
      title: 'nick-to-peg distance',
      dataIndex: 'nick_to_peg_distance',
      key: 'nick_to_peg_distance',
      sorter: (a, b) => a.nick_to_peg_distance.localeCompare(b.nick_to_peg_distance),
    },
    {
      title: 'spacer GC content',
      dataIndex: 'spacer_gc_content',
      key: 'spacer_gc_content',
      sorter: (a, b) => a.spacer_gc_content.localeCompare(b.spacer_gc_content),
    },
    {
      title: 'Off Target',
      dataIndex: 'off_target',
      key: 'off_target',
      sorter: (a, b) => a.off_target.localeCompare(b.off_target),
    },
  ];
  const expandedRowRender = () => (
    <>
      <div className="sub-table-section">
        <TableTitle 
          title="pegRNA extensions(PBS and RT sequences)"
          columns={pegRNA_extensions_columns}
          data={pegRNA_extensions_dataSource}
          filename="pegrna_extensions"
        />
        <StyledTable
          bordered
          columns={pegRNA_extensions_columns}
          expandable={{
            expandedRowRender: PBS_and_RT_RowRender,
          }}
          dataSource={pegRNA_extensions_dataSource}
        />
      </div>
      <div className='table-divider'></div>
      <div className="sub-table-section">
        <TableTitle 
          title="ngRNA sequence"
          columns={ngRNA_sequence_columns}
          data={ngRNA_sequence_dataSource}
          filename="ngrna_sequence"
        />
        <StyledNgRNATable
          bordered
          columns={ngRNA_sequence_columns}
          dataSource={ngRNA_sequence_dataSource}
        />
      </div>
    </>
  );

  const renderSequenceNote = (note) => (
    <>
      <hr className='sequence-divider' />
      <div className="note">
        {note.items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && " | "}
            <span className={item.type}>{item.text}</span>
          </React.Fragment>
        ))}
      </div>
    </>
  );

  const renderParameterItem = (item) => {
    if (item.type === "sequence") {
      return (
        <div className="sequence-item" key={item.label}>
          <div className="label">{item.label}:</div>
          <div className="sequence-container">
            <div className="value">{item.value}</div>
            {item.note && renderSequenceNote(item.note)}
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
      autoTable(doc,{
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

  // 修改表格标题部分
  const TableTitle = ({ title, columns, data, filename }) => (
    <div className="table-title">
      <h3 className="table-h3">{title}</h3>
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
      </Space>
    </div>
  );

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
  
  // 添加 prop 类型验证
  TableTitle.propTypes = {
    title: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    filename: PropTypes.string.isRequired,
  };

  return (
    <div className='result-page-container'>
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

      {/* Introduction Section */}
      <div className='result-table-section'>
        <Title level={3}>pegRNA Designer</Title>
        <Paragraph type="warning">
          Note: In column of Off Target (k: n) show stat of off target for a Spacer sgRNA in k mismatch
          have total of n off target site in genome.
        </Paragraph>
      </div>

      {/* Results Table Section */}
      <div className='result-table-section'>
        <TableTitle 
          title="PE Result Table"
          columns={columns}
          data={dataSource}
          filename="pe_result_table"
        />
        <Table
          bordered
          columns={columns}
          expandable={{
            expandedRowRender,
          }}
          dataSource={dataSource}
        />
      </div>
    </div>
  )
  
}



export default PESubmit;