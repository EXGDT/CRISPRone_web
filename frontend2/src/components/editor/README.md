# CRISPR/Cas9 结果展示模块说明文档

## 目录结构

result/
├── components/ # 子组件
│ ├── JBrowseView.jsx # 基因组浏览器组件
│ ├── SgRNATable.jsx # sgRNA 列表表格组件
│ └── OffTargetInfo.jsx # 脱靶信息组件
├── conf/
│ └── config.jsx # 配置文件
├── utils/
│ └── utils.jsx # 工具函数
├── result.jsx # 主结果页面
├── result.scss # 样式文件
└── README.md # 本文档

## 数据流动

### 1. 配置文件 (conf/config.jsx)

javascript
// 核心数据结构
CONFIG = {
    POSITIONS: {...}, // 基因组位置配置
    OPTIONS: [...], // 选项列表
    URLS: { // 文件 URL 配置
        GFF3_TBI: {...},
        GFF3_GZ: {...},
        JSON: {...},
        FASTA: {...},
        FAI: {...}
    }
}
// 动态 URL 存储
URLS = {
    fasta: '', // FASTA 文件路径
    fai: '', // FAI 索引文件路径
    gff3_gz: '', // GFF3 压缩文件路径
    gff3_tbi: '', // GFF3 索引文件路径
    json: '', // sgRNA 数据文件路径
    position: '' // 基因组位置
}

### 2. 主页面 (result.jsx)

javascript:src/components/Cas/result/README.md
// 状态管理
const [sgrnas, setSgrnas] = useState([]); // 原始 sgRNA 数据
const [filteredSgrnas, setFilteredSgrnas] = useState([]); // 过滤后的 sgRNA 数据
const [selectedData, setSelectedData] = useState({...}); // 当前选中的 sgRNA
const [offtargets, setOfftargets] = useState([]); // 脱靶信息
// 主要功能
数据加载：从 URLS.json 加载 sgRNA 数据
数据过滤：支持 sgRNA 列表筛选
位置导航：支持在基因组中定位
数据选择：处理 sgRNA 选择和脱靶信息显示

### 3. 子组件功能

#### JBrowseView 组件

- 功能：显示基因组浏览器界面
- 输入：`state` (JBrowse 配置状态)
- 交互：支持基因组浏览和定位

#### SgRNATable 组件

- 功能：显示 sgRNA 列表表格
- 输入：
  ```javascript
  {
    filteredSgrnas, // 过滤后的sgRNA列表
    selectedData, // 当前选中的数据
    selectVisible, // 筛选框是否可见
    selectPosition, // 筛选框位置
    selectOptions, // 筛选选项
    onRowClick, // 行点击回调
    onThClick, // 表头点击回调
    onSelectChange, // 选择变更回调
    onRestore, // 还原回调
    thRef; // 表头引用
  }
  ```

#### OffTargetInfo 组件

- 功能：显示脱靶信息
- 输入：
  ```javascript
  {
    selectedData, // 当前选中的sgRNA数据
    offtargets; // 脱靶位点数据
  }
  ```

## 配置更新流程

### 1. 从 Cas9 页面更新配置

javascript
// 1. 表单提交时选择配置
const option = getOptionFromForm(formData); // 根据 customized_pam 选择配置
// 2. 更新 URLs
updateConfigUrls({
fasta: CONFIG.URLS.FASTA[option],
fai: CONFIG.URLS.FAI[option],
gff3_gz: CONFIG.URLS.GFF3_GZ[option],
gff3_tbi: CONFIG.URLS.GFF3_TBI[option],
json: CONFIG.URLS.JSON[option],
position: CONFIG.POSITIONS[option]
});

### 2. 配置更新后的影响

1. JBrowse 状态会重新创建
2. Result 页面会重新加载数据
3. 视图会更新到新的位置

## 样式结构 (result.scss)

### 主要样式类

scss
.result-container {
// 整体容器样式
}
.transcribe {
// 下半部分布局
.table-container {
// 表格容器样式
}
}
.icon-withdraw {
// 还原按钮样式
}

## 注意事项

### 1. 配置相关

- 确保 CONFIG 中的所有 URL 配置正确
- 文件路径必须可访问
- 配置更新后需要重新创建 state

### 2. 数据加载

- 需要处理数据加载失败的情况
- JSON 数据格式必须符合预期
- 大数据量时需要考虑性能优化

### 3. 组件通信

- 保持状态提升，避免状态混乱
- 正确处理回调函数的绑定
- 注意 props 的类型检查

### 4. 性能优化

- 使用 useMemo/useCallback 优化回调函数
- 大列表考虑虚拟滚动
- 避免不必要的重渲染

## 开发建议

1. 新功能开发

- 遵循现有的数据流模式
- 保持组件的独立性
- 添加适当的错误处理

2. 代码维护

- 保持配置文件的整洁
- 及时更新文档
- 添加必要的注释

3. 测试要点

- URL 配置的正确性
- 数据加载的完整性
- 交互功能的可用性
- 错误处理的有效性
