import React, { useState } from 'react';
import { Button, Typography, Upload, Row, Col, message } from 'antd';
import { UploadOutlined,DownOutlined } from '@ant-design/icons';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const LineOfCode = () => {
  const [fileContent, setFileContent] = useState('');
  const [loc, setLOC] = useState(0);
  const [sloc, setSLOC] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const validExtensions = [
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
    '.java',
    '.py',
    '.cpp',
    '.h',
    '.php',
  ];

  const handleFileUpload = (file) => {
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      message.error('Invalid file. Please upload a valid programming language file.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);
      const lines = content.split('\n');
      setLOC(lines.length);

      // Calculate SLOC by excluding comments and blank lines
      let slocCount = 0;
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('//')) {
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
    setShowContent(true);
  };

  return (
    <div style={{ padding: '24px',  color: '#fff' }}>
      <Row justify="center" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Upload beforeUpload={beforeUpload} showUploadList={false}>
            <Button type='primary' icon={<UploadOutlined />} size="large">
              Choose File
            </Button>
          </Upload>
        </Col>
      </Row>
      {fileContent && (
        <Row justify="center" align="middle" style={{ marginBottom: '24px' }}>
          <Col style={{display:'flex',alignItems:'center',flexDirection:'column',justifyContent:'center'}}>
            <Typography.Title style={{color:'red'}} level={4}>Total lines of code (LOC): {loc}</Typography.Title>
            <Typography.Title style={{color:'green'}}  level={4}>Source lines of code (SLOC): {sloc}</Typography.Title>
            <Button type='primary' icon={<DownOutlined />} onClick={handleShowContent} size="large" style={{marginTop:'10px'}}>
              Show File Content
            </Button>
          </Col>
        </Row>
      )}
      {showContent && (
        <Row justify="center" align="middle">
          <Col>
            <Typography.Title style={{color:'white'}} level={4}>File Content:</Typography.Title>
            <SyntaxHighlighter language="javascript" style={vs2015}>
              {fileContent}
            </SyntaxHighlighter>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default LineOfCode;
