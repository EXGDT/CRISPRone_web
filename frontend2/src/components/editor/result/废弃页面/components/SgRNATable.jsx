import { Table } from "react-bootstrap";
import { Select, Button, Divider } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import PropTypes from 'prop-types';

function SgRNATable({
  filteredSgrnas,
  selectedData,
  selectVisible,
  selectPosition,
  selectOptions,
  onRowClick,
  onThClick,
  onThClickdown,
  onSelectChange,
  onRestore,
  thRef,
  sgrnas,
}) {


  const handleSelectAll = () => {
    onSelectChange(sgrnas.map(sgRNA => sgRNA.sgRNA_id));
  };

  const handleSelectNone = () => {
    onSelectChange([]);
  };

  return (
    <div className="sgRNA-table">
      <div style={{ display: "flex", alignItems: "center" }}>
        <h5 className="sgRNA-table-title">sgRNAs list</h5>
        <div className="icon-withdraw" onClick={onRestore}>
          <svg viewBox="0 0 1024 1024" width="25" height="25">
            <path d="M501 221.1h-1.8v-81.7c0-22.4-25.1-35.7-43.6-23.1L162.1 315.7c-12.8 8.7-16.1 26-7.4 38.8 2 2.9 4.5 5.4 7.4 7.4l293.5 199.3c18.5 12.6 43.6-0.7 43.6-23.1v-82.7h0.1v-0.1c137.5 2.3 250.4 99.6 256 224.6 4.4 97.9-58.4 184.7-151.5 224.8-1.7 0.7-3.5 2.2-3.3 5.1 0.1 2.4 2.5 3.1 4.7 2.4 149-43.8 258.7-172.6 262.8-327.5 5.3-195.2-159-358-367-363.6z"></path>
          </svg>
          <span>还原</span>
        </div>
      </div>

      {selectVisible && (
        <Select
          style={{
            position: "absolute",
            top: `${selectPosition.top}px`,
            left: `${selectPosition.left - 70}px`,
            zIndex: 10,
            width: "300px",
          }}
          mode="multiple"
          onChange={onSelectChange}
          options={selectOptions}
          maxTagCount="responsive"
          tokenSeparators={[","]}
          value={filteredSgrnas.map(sgRNA => sgRNA.sgRNA_id)}
          dropdownRender={(menu) => (
            <div>
              <div style={{ padding: 8 }}>
                <Button
                  type='link'
                  onClick={handleSelectAll}
                  style={{ padding: 0, margin: "0 10px" }}
                >
                  Select All
                </Button>
                <Button
                  type='link'
                  onClick={handleSelectNone}
                  style={{ padding: 0, margin: "0 10px" }}
                >
                  Deselect All
                </Button>
                <Button
                  type='link'
                  onClick={onThClickdown}
                  style={{ padding: 0, margin: "0 10px" }}
                >
                  Close
                </Button>
              </div>
              <Divider style={{ margin: 0 }} />
              {menu}
            </div>
          )}
        />
      )}

      <Table striped bordered hover size="sm" className="custom-table">
        <thead>
          <tr>
            {/* <th colSpan={1}></th> */}
            <th colSpan={3}>ID</th>
            <th colSpan={1} ref={thRef} onClick={onThClick}>
              <FilterOutlined style={{ cursor: 'pointer' }} className="filter-icon" />
            </th>
            <th colSpan={5}>Position</th>
            <th colSpan={3}>Strand</th>
            <th colSpan={7}>Seq</th>
            <th colSpan={2}>GC</th>
          </tr>
        </thead>
        <tbody>
          {filteredSgrnas.map((sgRNA) => (
            <tr
              key={sgRNA.sgRNA_id}
              onClick={() => onRowClick(sgRNA)}
              style={{
                cursor: "pointer",
                backgroundColor: selectedData.id === sgRNA.sgRNA_id ? "#f0f0f0" : "transparent",
              }}
            >
              <td colSpan={4}>{sgRNA.sgRNA_id}</td>
              <td colSpan={5}>{sgRNA.sgRNA_position}</td>
              <td colSpan={3}>{sgRNA.sgRNA_strand}</td>
              <td colSpan={7}>{sgRNA.sgRNA_seq}</td>
              <td colSpan={2}>{sgRNA.sgRNA_GC}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

SgRNATable.propTypes = {
  filteredSgrnas: PropTypes.array.isRequired,
  selectedData: PropTypes.object.isRequired,
  selectVisible: PropTypes.bool.isRequired,
  selectPosition: PropTypes.object.isRequired,
  selectOptions: PropTypes.array.isRequired,
  onRowClick: PropTypes.func.isRequired,
  onThClick: PropTypes.func.isRequired,
  onThClickdown: PropTypes.func.isRequired,
  onSelectChange: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired,
  thRef: PropTypes.object.isRequired,
  sgrnas: PropTypes.array.isRequired
};

export default SgRNATable; 