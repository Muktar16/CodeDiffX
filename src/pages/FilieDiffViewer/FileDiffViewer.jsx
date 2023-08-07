import React, { useState } from 'react';
import { Button, Typography, Upload, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { diffLines } from 'diff';

const FileDiffViewer = () => {
  const [oldFileContent, setOldFileContent] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [diffResult, setDiffResult] = useState([]);
  const [numAddedLines, setNumAddedLines] = useState(0);
  const [numDeletedLines, setNumDeletedLines] = useState(0);
  const [numModifiedLines, setNumModifiedLines] = useState(0);

  const handleFileUpload = (file, isOld) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      if (isOld) {
        setOldFileContent(content);
      } else {
        setNewFileContent(content);
      }
    };

    reader.readAsText(file);
  };

  const compareFiles = () => {
    const diff = diffLines(oldFileContent, newFileContent);
    setDiffResult(diff);

    let addedLines = 0;
    let deletedLines = 0;
    let modifiedLines = 0;

    diff.forEach((part) => {
      if (part.added) {
        addedLines += part.count;
      } else if (part.removed) {
        deletedLines += part.count;
      } else {
        modifiedLines += part.count;
      }
    });

    setNumAddedLines(addedLines);
    setNumDeletedLines(deletedLines);
    setNumModifiedLines(modifiedLines);
  };

  const beforeOldFileUpload = (file) => {
    handleFileUpload(file, true);
    return false; // Prevent default upload behavior
  };

  const beforeNewFileUpload = (file) => {
    handleFileUpload(file, false);
    return false; // Prevent default upload behavior
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
      <Row gutter={[16, 16]} align="middle">
        <Col span={12}>
          <Upload beforeUpload={beforeOldFileUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />} size="large">
              Upload Old Version
            </Button>
          </Upload>
        </Col>
        <Col span={12}>
          <Upload beforeUpload={beforeNewFileUpload} showUploadList={false}>
            <Button icon={<UploadOutlined />} size="large">
              Upload New Version
            </Button>
          </Upload>
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: '24px' }}>
        <Col>
          <Button type="primary" size="large" onClick={compareFiles}>
            Compare Versions
          </Button>
        </Col>
      </Row>
      {diffResult.length > 0 && (
        <Row justify="center" style={{ marginTop: '24px' }}>
          <Col>
            <Typography.Title level={4}>Number of Added Lines: {numAddedLines}</Typography.Title>
            <Typography.Title level={4}>Number of Deleted Lines: {numDeletedLines}</Typography.Title>
            <Typography.Title level={4}>Number of Modified Lines: {numModifiedLines}</Typography.Title>
            <Typography.Title level={4}>Differences:</Typography.Title>
            <div style={{ fontFamily: 'monospace' }}>
              {diffResult.map((part, index) => {
                const color =
                  part.added ? 'green' : part.removed ? 'red' : 'blue'; // Choose different colors for added, deleted, and modified lines
                return (
                  <span key={index} style={{ color }}>
                    {part.value}
                  </span>
                );
              })}
            </div>
          </Col>
        </Row>
      )}
      <Row justify="center" style={{ marginTop: '24px' }}>
        <Col>
          <Typography.Title level={4}>Color Key:</Typography.Title>
          <div>
            <span style={{ color: 'green' }}>Added Lines</span> - Lines added in the new version.
            <br />
            <span style={{ color: 'red' }}>Deleted Lines</span> - Lines removed in the new version.
            <br />
            <span style={{ color: 'blue' }}>Modified Lines</span> - Lines changed between the two versions.
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FileDiffViewer;
