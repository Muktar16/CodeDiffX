import React, { useState } from "react";
import { Button, Typography, Upload, Row, Col, message } from "antd";
import { UploadOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CSSTransition } from "react-transition-group";
import "./LineOfCode.css";

const LineOfCode = () => {
  const [fileContent, setFileContent] = useState("");
  const [loc, setLOC] = useState(0);
  const [sloc, setSLOC] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const validExtensions = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".java",
    ".py",
    ".cpp",
    ".h",
    ".php",
  ];

  const handleFileUpload = (file) => {
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      message.error(
        "Invalid file. Please upload a valid programming language file."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);
      const lines = content.split("\n");
      setLOC(lines.length);

      // Calculate SLOC by excluding comments and blank lines
      let slocCount = 0;
      let insideSingleLineComment = false;
      let insideMultiLineComment = false;

      for (const line of lines) {
        const trimmedLine = line.trim();

        // JavaScript, TypeScript, Java, C++, PHP: Single Line Comment starts with "//"
        if (
          !insideMultiLineComment &&
          (trimmedLine.startsWith("//") || trimmedLine === "//")
        ) {
          continue; // Skip single-line comments
        }

        // JavaScript, TypeScript, Java: Multi Line Comment starts with "/*" and ends with "*/"
        if (!insideSingleLineComment && trimmedLine.startsWith("/*")) {
          insideMultiLineComment = true;
        }

        if (!insideSingleLineComment && trimmedLine.endsWith("*/")) {
          insideMultiLineComment = false;
          continue; // Skip multi-line comments
        }

        // Python: Single Line Comment starts with "#"
        if (!insideMultiLineComment && trimmedLine.startsWith("#")) {
          continue; // Skip single-line comments
        }

        // Python: Multi Line Comment starts and ends with triple quotes ''' or """
        if (!insideSingleLineComment && trimmedLine.startsWith('"""')) {
          insideMultiLineComment = true;
        }

        if (!insideSingleLineComment && trimmedLine.endsWith('"""')) {
          insideMultiLineComment = false;
          continue; // Skip multi-line comments
        }

        if (!insideSingleLineComment && trimmedLine.startsWith("'''")) {
          insideMultiLineComment = true;
        }

        if (!insideSingleLineComment && trimmedLine.endsWith("'''")) {
          insideMultiLineComment = false;
          continue; // Skip multi-line comments
        }

        // Skip counting empty lines
        if (trimmedLine === "") {
          continue;
        }

        if (
          trimmedLine &&
          !insideSingleLineComment &&
          !insideMultiLineComment
        ) {
          slocCount++;
        }
      }
      setSLOC(slocCount);
    };

    reader.readAsText(file);
  };

  const beforeUpload = (file) => {
    handleFileUpload(file);
    return false; // Prevent default upload behavior
  };

  const handleShowContent = () => {
    setShowContent(!showContent);
  };

  return (
    <div style={{ padding: "24px", color: "#fff" }}>
      <Row justify="center" align="middle">
        <Col>
          <Upload beforeUpload={beforeUpload} showUploadList={false}>
            <Button type="primary" icon={<UploadOutlined />} size="large">
              Choose File
            </Button>
          </Upload>
        </Col>
      </Row>
      {fileContent && (
        <Row justify="center" align="middle" style={{ marginBottom: "24px" }}>
          <Col
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography.Title style={{ color: "red" }} level={4}>
              Total lines of code (LOC): {loc}
            </Typography.Title>
            <Typography.Title style={{ color: "green" }} level={4}>
              Total Source lines of code (SLOC): {sloc}
            </Typography.Title>
            <Button
              type="primary"
              icon={showContent ? <UpOutlined /> : <DownOutlined />}
              onClick={handleShowContent}
              size="large"
              style={{ marginTop: "10px" }}
            >
              {showContent ? <>Hide File Content</> : <>Show File Content</>}
            </Button>
          </Col>
        </Row>
      )}
      <CSSTransition
        in={showContent}
        timeout={300}
        classNames="file-content"
        unmountOnExit
      >
        <Row justify="center" align="middle">
          <Col>
            <div className="file-content-wrapper">
              <SyntaxHighlighter
                language="javascript"
                style={vs2015}
                showLineNumbers
                startingLineNumber={1}
              >
                {fileContent}
              </SyntaxHighlighter>
            </div>
          </Col>
        </Row>
      </CSSTransition>
    </div>
  );
};

export default LineOfCode;
