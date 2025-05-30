import { useEffect, useState, useRef } from "react";
import { state, URLS } from './conf/config.jsx';
import { calculate_locus } from './utils/utils.jsx';
import JBrowseView from './components/JBrowseView';
import SgRNATable from './components/SgRNATable';
import OffTargetInfo from './components/OffTargetInfo';
import "./result.scss";
import { useNavigate } from "react-router-dom";

function Result() {
  const navigate = useNavigate();
  const thRef = useRef(null);
  
  // 状态管理
  const [sgrnas, setSgrnas] = useState([]);
  const [filteredSgrnas, setFilteredSgrnas] = useState([]);
  const [selectVisible, setSelectVisible] = useState(false);
  const [selectPosition, setSelectPosition] = useState({ top: 0, left: 0 });
  const [selectedData, setSelectedData] = useState({
    id: null,
    sgRNA: null,
    position: URLS.position,
  });
  const [offtargets, setOfftargets] = useState([]);

  // 检查配置是否存在
  useEffect(() => {
    const savedUrls = localStorage.getItem('crispr_urls');
    if (!savedUrls) {
      // 如果没有配置，重定向到cas9页面
      navigate('/cas9');
      return;
    }
  }, [navigate]);

  // 数据加载
  useEffect(() => {
    if (URLS.json) {
      fetch(URLS.json)
        .then(response => response.json())
        .then(data => {
          setSgrnas(data.TableData.rows);
          setSelectedData({
            id: data.TableData.rows[0].sgRNA_id,
            sgRNA: data.TableData.rows[0],
            position: calculate_locus(data.TableData.rows[0].sgRNA_position, 32),
          });
          setOfftargets(data.TableData.rows[0].offtarget_json.rows);
        })
        .catch(error => console.error('加载数据失败:', error));
    }
  }, []);

  useEffect(() => {
    setFilteredSgrnas(sgrnas);
  }, [sgrnas]);

  // 事件处理函数
  const handleRowClick = (sgRNA) => {
    setSelectedData({
      id: sgRNA.sgRNA_id,
      sgRNA,
      position: calculate_locus(sgRNA.sgRNA_position, 32),
    });
    const click_offTarget = sgRNA?.offtarget_json?.rows || [];
    setOfftargets(click_offTarget);
    state.session.view.navToLocString(calculate_locus(sgRNA.sgRNA_position, 32));
  };

  const handleThClick = () => {
    if (thRef.current) {
      const rect = thRef.current.getBoundingClientRect();
      setSelectPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    setSelectVisible(true);
  };

  const handleThClickdown = () => {
    // 如果不是表头，则隐藏选择框
      setSelectVisible(false);
  };

  const handleChange = (newSelectedIds) => {
    setFilteredSgrnas(
      newSelectedIds.length === 0
        ? []
        : sgrnas.filter(sgRNA => newSelectedIds.includes(sgRNA.sgRNA_id))
    );
  };


  const handleRestore = () => {
    state.session.view.navToLocString(URLS.position);
  };

  const selectOptions = sgrnas.map(sgRNA => ({
    label: sgRNA.sgRNA_id,
    value: sgRNA.sgRNA_id,
  }));

  return (
    <div className="result-container">
      <JBrowseView state={state} />
      
      <div className="transcribe">
        <div className="table-container">
          <SgRNATable
            filteredSgrnas={filteredSgrnas}
            selectedData={selectedData}
            selectVisible={selectVisible}
            selectPosition={selectPosition}
            selectOptions={selectOptions}
            onRowClick={handleRowClick}
            onThClick={handleThClick}
            onThClickdown={handleThClickdown}
            onSelectChange={handleChange}
            onRestore={handleRestore}
            thRef={thRef}
            sgrnas={sgrnas}
          />
        </div>

        <div className="table-container">
          <OffTargetInfo
            selectedData={selectedData}
            offtargets={offtargets}
          />
        </div>
      </div>
    </div>
  );
}

export default Result;
