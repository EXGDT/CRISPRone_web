import { Form, Input, Select, Row, Col } from "antd";
import { useEffect, useState } from "react";
import { MailOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const pamDict = {
  TTTR: ["pamspacer", 23],
  TTR: ["pamspacer", 23],
  TTTRIDT: ["pamspacer", 21],
  TTTN: ["pamspacer", 23],
  NGTN: ["pamspacer", 23],
  TRCR: ["pamspacer", 23],
  TATR: ["pamspacer", 23],
  TTTA: ["pamspacer", 23],
  TCTA: ["pamspacer", 23],
  TCCA: ["pamspacer", 23],
  CCCA: ["pamspacer", 23],
  GGTT: ["pamspacer", 23],
  TTYN: ["pamspacer", 23],
};

function CustomizedPAM({ PamType, setPamType, baseEditors, pamOptions }) {
  const [sgRNAmodule, setSgRNAmodule] = useState("");
  const [spacerLength, setSpacerLength] = useState("");
  const form = Form.useFormInstance();

  useEffect(() => {
    if (PamType in pamDict) {
      const [module, length] = pamDict[PamType];
      setSgRNAmodule(module);
      setSpacerLength(length);
      form.setFieldsValue({
        sgRNA_module: module,
        spacer_length: length,
      });
    }
    form.setFieldsValue({
      pam_type: PamType,
      customized_pam: PamType,
    });
  }, [PamType, form]);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Form.Item
          label={
            <span>
              PAM Type
              <span
                onClick={() => {
                  window.location.href = "/crispr/help#enzymes";
                }}
                style={{
                  textDecoration: "underline",
                  color: "#1B2AE6",
                  marginLeft: "10px",
                }}
              >
                See notes on enzymes in the help
              </span>
            </span>
          }
          name="pam_type"
          style={{ flex: 1, marginRight: "30px" }}
        >
          <Select
            placeholder="Select a Cas protein"
            value={PamType}
            onChange={(value) => setPamType(value)}
            showSearch
            filterOption={(input, option) =>
              option?.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {pamOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
            {!(PamType in pamDict) && PamType && (
              <Select.Option key={PamType} value={PamType}>
                {`Customized PAM: 3'-${PamType}-5'`}
              </Select.Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item
          label={
            <span>
              Target Genome
              <span
                onClick={() => {
                  window.location.href = "/crispr/help#genomes";
                }}
                style={{ textDecoration: "underline", color: "#1B2AE6" }}
              >
                More Information of Genomes Metadata
              </span>
            </span>
          }
          name={"target_genome"}
          style={{ flex: 1 }}
        >
          <Select placeholder="Select a base editor">
            {baseEditors.map((editor, index) => {
              try {
                return (
                  <Select.Option key={index} value={editor.value}>
                    {editor.label}
                  </Select.Option>
                );
              } catch (error) {
                console.error(
                  `Error rendering option for ${editor.label}:`,
                  error
                );
                return null;
              }
            })}
          </Select>
        </Form.Item>
      </div>

      <div
        className="email"
        style={{ color: "#758a70", display: "flex", justifyContent: "start" }}
      >
        <p>
          <MailOutlined /> Note: For a Customized PAM select Customized PAM:
          5&apos;-XXX-3&apos; in PAM Type and then set sgRNA module and Spacer
          length .
        </p>
      </div>

      <Row gutter={24}>
        <Col span={8}>
          {/* 输入框 */}
          <Form.Item
            label="Customized PAM (Need to select Customized PAM in PAM Type )"
            name={"customized_pam"}
            style={{ marginRight: "30px" }}
          >
            <Input
              placeholder="Enter customized PAM"
              value={PamType}
              onChange={(e) => setPamType(e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="sgRNA module of Customized PAM"
            name={"sgRNA_module"}
            style={{ flex: 1, marginRight: "30px" }}
          >
            <Select
              placeholder="Select"
              value={sgRNAmodule}
              disabled={PamType in pamDict}
            >
              <Select.Option value="spacerpam">
                5&apos;-Spacer+ PAM-3&apos;
              </Select.Option>
              <Select.Option value="pamspacer">
                5&apos;-PAM + Spacer-3&apos;
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Spacer length of Customized PAM"
            name={"spacer_length"}
            style={{ flex: 1 }}
          >
            <Input
              placeholder="Spacer length of Customized PAM"
              value={spacerLength}
              disabled={PamType in pamDict}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

CustomizedPAM.propTypes = {
  PamType: PropTypes.string.isRequired,
  setPamType: PropTypes.func.isRequired,
  baseEditors: PropTypes.array.isRequired,
  pamOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CustomizedPAM;
