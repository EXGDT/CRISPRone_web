import { Row, Col, Table } from "react-bootstrap";
import { processMdAndSequence } from '../utils/utils';
import PropTypes from 'prop-types';

function OffTargetInfo({ selectedData, offtargets }) {
  return (
    <div className="off-target-table-container">
      <Row>
        <Col>
          <h5 className="off-target-table-title">
            Detailed information and off target sites of sgRNAs
          </h5>
          <ul style={{ fontSize: "16px" }}>
            <li>
              <span style={{ backgroundColor: 'blue', color: 'white', width: '100%' }}>
                <strong>sgRNA:</strong> {selectedData.sgRNA?.sgRNA_id}
              </span>
            </li>
            <li><strong>Position:</strong> {selectedData.sgRNA?.sgRNA_position}</li>
            <li><strong>Strand:</strong> {selectedData.sgRNA?.sgRNA_strand}</li>
            <li><strong>sgRNA_seq:</strong> {selectedData.sgRNA?.sgRNA_seq}</li>
            <li>{selectedData.sgRNA?.sgRNA_type}</li>
            <li><strong>offtarget_num:</strong> {selectedData.sgRNA?.offtarget_num}</li>
          </ul>
        </Col>
      </Row>

      <Row>
        <Col>
          <Table striped bordered hover size="sm" className="off-target-table">
            <thead style={{ fontSize: "12px" }}>
              <tr>
                <th colSpan={3}>Family</th>
                <th colSpan={2}>Seq_id</th>
                <th colSpan={2}>Start</th>
                <th colSpan={2}>End</th>
                <th colSpan={1}>NM</th>
                <th colSpan={2}>Position Start</th>
                <th colSpan={2}>Position End</th>
                <th colSpan={1}>Strand</th>
                <th colSpan={5}>Sequence</th>
                <th colSpan={2}>Types</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "11px" }}>
              {offtargets.map((offTarget, index) => (
                <tr key={index} style={{ cursor: "pointer" }}>
                  <td colSpan={3}>{offTarget.family}</td>
                  <td colSpan={2}>{offTarget.seqid}</td>
                  <td colSpan={2}>{offTarget.sgRNA_start}</td>
                  <td colSpan={2}>{offTarget.sgRNA_end}</td>
                  <td colSpan={1}>{offTarget.NM}</td>
                  <td colSpan={2}>{offTarget.pos}</td>
                  <td colSpan={2}>{offTarget.pos_end}</td>
                  <td colSpan={1}>{offTarget.strand}</td>
                  <td 
                    colSpan={5}
                    dangerouslySetInnerHTML={{
                      __html: processMdAndSequence(offTarget.MD, offTarget.rseq)
                    }}
                  />
                  <td colSpan={2}>{offTarget.types}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
}

OffTargetInfo.propTypes = {
  selectedData: PropTypes.shape({
    sgRNA: PropTypes.shape({
      sgRNA_id: PropTypes.string,
      sgRNA_position: PropTypes.string,
      sgRNA_strand: PropTypes.string,
      sgRNA_seq: PropTypes.string,
      sgRNA_type: PropTypes.string,
      offtarget_num: PropTypes.number,
    }),
  }),
  offtargets: PropTypes.arrayOf(PropTypes.shape({
    family: PropTypes.string,
    seqid: PropTypes.string,
    sgRNA_start: PropTypes.number,
    sgRNA_end: PropTypes.number,
    NM: PropTypes.number,
    pos: PropTypes.number,
    pos_end: PropTypes.number,
    strand: PropTypes.string,
    MD: PropTypes.string,
    rseq: PropTypes.string,
    types: PropTypes.string,
  })).isRequired,
};

OffTargetInfo.defaultProps = {
  selectedData: {
    sgRNA: null,
  },
  offtargets: [],
};

export default OffTargetInfo; 