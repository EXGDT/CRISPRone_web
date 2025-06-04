import { Form, Input, Select, Row, Col } from "antd";
import { useEffect, useState } from "react";
import { MailOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const pamDict = {
  NGG: ["spacerpam", 20],
  NG: ["spacerpam", 20],
  NNG: ["spacerpam", 20],
  NGN: ["spacerpam", 20],
  NNGT: ["spacerpam", 20],
  NAA: ["spacerpam", 20],
  NNGRRT: ["spacerpam", 21],
  "NNGRRT-20": ["spacerpam", 20],
  NGK: ["spacerpam", 20],
  NNNRRT: ["spacerpam", 21],
  "NNNRRT-20": ["spacerpam", 20],
  NGA: ["spacerpam", 20],
  NNNNCC: ["spacerpam", 24],
  NGCG: ["spacerpam", 20],
  NNAGAA: ["spacerpam", 20],
  NGGNG: ["spacerpam", 20],
  NNNNGMTT: ["spacerpam", 20],
  NNNNACA: ["spacerpam", 20],
  NNNNRYAC: ["spacerpam", 22],
  NNNVRYAC: ["spacerpam", 22],
  TTCN: ["pamspacer", 20],
  YTTV: ["pamspacer", 20],
  NNNNCNAA: ["spacerpam", 20],
  NNN: ["spacerpam", 20],
  NRN: ["spacerpam", 20],
  NYN: ["spacerpam", 20],
};

function CustomizedPAM({ baseEditors, pamOptions }) {
  const [sgRNAmodule, setSgRNAmodule] = useState("");
  const [spacerLength, setSpacerLength] = useState("");
  const form = Form.useFormInstance();
  const pamType = Form.useWatch("pam_type", form);

  useEffect(() => {
    if (pamType in pamDict) {
      const [module, length] = pamDict[pamType];
      setSgRNAmodule(module);
      setSpacerLength(length);
      form.setFieldsValue({
        sgRNA_module: module,
        spacer_length: length,
      });
    }
    form.setFieldsValue({
      customized_pam: pamType,
    });
  }, [pamType, form]);

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
            {!(pamType in pamDict) && pamType && (
              <Select.Option key={pamType} value={pamType}>
                {`Customized PAM: 5'-${pamType}-3'`}
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
          <Form.Item
            label="Customized PAM (Need to select Customized PAM in PAM Type )"
            name={"customized_pam"}
            style={{ marginRight: "30px" }}
          >
            <Input
              placeholder="Enter customized PAM"
              onChange={(e) => form.setFieldValue( "pam_type", e.target.value )}
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
            //   disabled={PamType in pamDict}
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
            //   disabled={PamType in pamDict}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

CustomizedPAM.propTypes = {
  baseEditors: PropTypes.array.isRequired,
  pamOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CustomizedPAM;
