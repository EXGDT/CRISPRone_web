import { Table } from 'antd';
import './index.scss';

function editing_analysis() {
  // 表格列配置
  const columns = [
    {
      title: '样本名称',
      dataIndex: 'col1',
      render: (_, record, index) => ({
        children: index === 0 ? 'sample1' : null,
        props: { rowSpan: index === 0 ? 4 : 0 }
      })
    },
    { title: '突变类型', dataIndex: 'col2' },
    { title: '编辑效率', dataIndex: 'col3' },
    { title: '总reads数', dataIndex: 'col4' },
    { title: '对应占比reads数', dataIndex: 'col5' },
    {
      title: '详细结果',
      dataIndex: 'col6',
      render: (_, record, index) => ({
        children: index === 0 ? 'figure9' : null,
        props: { rowSpan: index === 0 ? 4 : 0 }
      })
    },
  ];

  // 表格数据（4行）
  const dataSource = [
    { col2: '2-1', col3: '3-1', col4: '4-1', col5: '5-1', key: '1' },
    { col2: '2-2', col3: '3-2', col4: '4-2', col5: '5-2', key: '2' },
    { col2: '2-3', col3: '3-3', col4: '4-3', col5: '5-3', key: '3' },
    { col2: '2-4', col3: '3-4', col4: '4-4', col5: '5-4', key: '4' },
  ];

  return (
    <div className="App">
      <h1>Editing Analysis</h1>
      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        pagination={false}
      />
    </div>
  )
}

export default editing_analysis;