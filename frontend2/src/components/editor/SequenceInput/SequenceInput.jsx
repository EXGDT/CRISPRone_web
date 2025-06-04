import { useState } from "react";
import { Form, Input, Row, Col, Button, Popover, Radio } from "antd";
import {
  InfoCircleFilled,
  ForwardOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import styled from "styled-components";
import "./index.scss";

const content = (
  <div>
    <p>Recommended input Gene Id or Genome Position</p>
  </div>
);

const LoadingIcon = styled(SyncOutlined)`
  @keyframes loadingSpin {
    100% {
      transform: rotate(360deg);
    }
  }
  animation: loadingSpin 1s infinite linear;
`;

const CustomButton = styled(Radio.Button)`
  margin-right: 30px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: #fff;
  background-color: ${(props) => props.color || "#fff"};
  position: relative;
  transition: all 0.3s;

  &.ant-radio-button-wrapper-checked {
    border-color: ${(props) => props.color || "#40a9ff"};
    color: white;
    box-shadow: 0 2px 4px rgba(187, 126, 126, 0.1);
    padding-left: 30px;

    &::before {
      content: ${(props) =>
        props.$isSelected && !props.disableRandom ? "'✓'" : ""};
      position: absolute;
      left: 10px;
      font-weight: bold;
      color: ${(props) => (props.disableRandom ? "transparent" : "inherit")};
    }

    ${(props) =>
      props.disableRandom &&
      `
                    &::after {
                        content: '';
                        position: absolute;
                        left: 10px;
                        width: 14px;
                        height: 14px;
                        border: 2px solid #fff;
                        border-top-color: transparent;
                        border-radius: 50%;
                        animation: loadingSpin 1s linear infinite; 
                    }
                `}
  }

  &:last-child {
    margin-right: 0;
  }

  @keyframes loadingSpin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

function SequenceInput({ onExampleClick, disableRandom }) {
  const { TextArea } = Input;
  const [selectedValue, setSelectedValue] = useState(null);

  const handleRadioChange = (e) => {
    setSelectedValue(e.target.value);
    onExampleClick(e);
  };

  const handleClear = () => {
    setSelectedValue(null);
    onExampleClick({ target: { value: "" } });
  };

  return (
    <>
      <Form.Item
        label={
          <span>
            Input Sequences (Only Id/Position/Sequence required; Design speed:
            Id = Position &gt; Fasta Sequence)
            <Popover
              content={content}
              autoAdjustOverflow={true}
              overlayStyle={{ color: "red" }}
            >
              <InfoCircleFilled />
            </Popover>
          </span>
        }
        name={"input_sequences"}
        rules={[
          {
            required: true,
            message:
              "Please enter a Gene ID, Genomic position, or DNA sequence",
          },
        ]}
      >
        <TextArea
          placeholder="Input Your Gene ID / DNA Sequence or See a DEMO as shown in the example"
          autoSize={{
            minRows: 5,
            maxRows: 20,
          }}
        />
      </Form.Item>
      <Row gutter={14}>
        <Col span={1} />
        <Col span={3}>
          <b style={{ color: "blue", fontSize: "20px" }}>
            Example of <ForwardOutlined />
          </b>
        </Col>
        <Col span={14}>
          <Radio.Group
            value={selectedValue}
            onChange={handleRadioChange}
            buttonStyle="solid"
          >
            <CustomButton value="id" color="#FBA706">
              Gene ID (Recommended)
            </CustomButton>
            <CustomButton value="position" color="#B23CFD">
              Genome Position (Recommended)
            </CustomButton>
            <CustomButton value="sequence" color="#39C0ED">
              Genome Sequence (fasta format)
            </CustomButton>
            <CustomButton
              value="random"
              color="#1FCC1F"
              $isSelected={selectedValue === "random"}
              $disableRandom={disableRandom}
              disabled={disableRandom}
              onClick={() => onExampleClick({ target: { value: "random" } })}
            >
              {disableRandom ? <LoadingIcon /> : "Random"}
            </CustomButton>
          </Radio.Group>
        </Col>
        <Col span={3}>
          <Form.Item>
            <Button color="danger" variant="solid" onClick={handleClear}>
              Clear
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

SequenceInput.propTypes = {
  onExampleClick: PropTypes.func.isRequired,
  color: PropTypes.string,
  disableRandom: PropTypes.bool,
};

export default SequenceInput;
