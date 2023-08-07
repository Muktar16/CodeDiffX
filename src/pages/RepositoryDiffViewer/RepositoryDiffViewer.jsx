import React, { useState } from 'react';
import { Button, Typography, Row, Col } from 'antd';
import { diffLines } from 'diff';

const RepositoryDiffViewer = () => {
  const [oldFiles, setOldFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [diffResult, setDiffResult] = useState([]);
  const [numAddedLines, setNumAddedLines] = useState(0);
  const [numDeletedLines, setNumDeletedLines] = useState(0);
  const [numModifiedLines, setNumModifiedLines] = useState(0);
  const [createdFiles, setCreatedFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);

  const handleFolderChange = (event, isOld) => {
    const files = event.target.files;
    const fileArray = Array.from(files);
    if (isOld) {
      setOldFiles(fileArray);
    } else {
      setNewFiles(fileArray);
    }
  };

  const compareFiles = async () => {
    const diff = await diffRepositories(oldFiles, newFiles);
    setDiffResult(diff);

    let addedLines = 0;
    let deletedLines = 0;
    let modifiedLines = 0;
    const created = [];
    const deleted = [];

    diff.forEach((fileDiff) => {
      addedLines += fileDiff.addedLines;
      deletedLines += fileDiff.deletedLines;
      modifiedLines += fileDiff.modifiedLines;

      if (fileDiff.addedLines > 0) {
        created.push(fileDiff.fileName);
      }

      if (fileDiff.deletedLines > 0) {
        deleted.push(fileDiff.fileName);
      }
    });

    setNumAddedLines(addedLines);
    setNumDeletedLines(deletedLines);
    setNumModifiedLines(modifiedLines);
    setCreatedFiles(created);
    setDeletedFiles(deleted);
  };

  const readFileContents = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsText(file);
    });
  };

  const diffRepositories = async (oldFiles, newFiles) => {
    const diffs = [];

    for (const oldFile of oldFiles) {
      for (const newFile of newFiles) {
        if (oldFile.name === newFile.name) {
          try {
            const oldFileContent = await readFileContents(oldFile);
            const newFileContent = await readFileContents(newFile);

            const diffResult = diffLines(oldFileContent, newFileContent);

            let addedLines = 0;
            let deletedLines = 0;
            let modifiedLines = 0;
            const diffLinesResult = [];

            diffResult.forEach((part) => {
              if (part.added) {
                addedLines += 1;
                diffLinesResult.push({ type: 'added', content: part.value });
              } else if (part.removed) {
                deletedLines += 1;
                diffLinesResult.push({ type: 'deleted', content: part.value });
              } else {
                modifiedLines += 1;
                diffLinesResult.push({ type: 'modified', content: part.value });
              }
            });

            diffs.push({
              fileName: oldFile.name,
              addedLines,
              deletedLines,
              modifiedLines,
              diff: diffLinesResult,
            });
          } catch (error) {
            console.error(`Error reading file: ${oldFile.name}`, error);
          }
          break;
        }
      }
    }

    return diffs;
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
      <Row gutter={[16, 16]} align="middle">
        <Col span={12}>
          <label htmlFor="oldFolderInput">
            <p>Choose the folder for the Old Repository:</p>
            <input
              type="file"
              id="oldFolderInput"
              webkitdirectory="true"
              onChange={(e) => handleFolderChange(e, true)}
              style={{ display: 'none' }}
            />
            <Button type="primary" onClick={() => document.getElementById('oldFolderInput').click()}>
              Browse Folder
            </Button>
          </label>
        </Col>
        <Col span={12}>
          <label htmlFor="newFolderInput">
            <p>Choose the folder for the New Repository:</p>
            <input
              type="file"
              id="newFolderInput"
              webkitdirectory="true"
              onChange={(e) => handleFolderChange(e, false)}
              style={{ display: 'none' }}
            />
            <Button type="primary" onClick={() => document.getElementById('newFolderInput').click()}>
              Browse Folder
            </Button>
          </label>
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: '24px' }}>
        <Col>
          <Button type="primary" size="large" onClick={compareFiles}>
            Compare Repositories
          </Button>
        </Col>
      </Row>
      {diffResult.length > 0 && (
        <Row justify="center" style={{ marginTop: '24px' }}>
          <Col>
            <Typography.Title level={4}>Number of Added Lines: {numAddedLines}</Typography.Title>
            <Typography.Title level={4}>Number of Deleted Lines: {numDeletedLines}</Typography.Title>
            <Typography.Title level={4}>Number of Modified Lines: {numModifiedLines}</Typography.Title>
            {/* Display the created and deleted files */}
            <Typography.Title level={4}>Created Files:</Typography.Title>
            <ul>
              {createdFiles.map((fileName, index) => (
                <li key={index}>{fileName}</li>
              ))}
            </ul>
            <Typography.Title level={4}>Deleted Files:</Typography.Title>
            <ul>
              {deletedFiles.map((fileName, index) => (
                <li key={index}>{fileName}</li>
              ))}
            </ul>
            {/* Display the differences for each file */}
            <Typography.Title level={4}>Differences:</Typography.Title>
            <ul>
              {diffResult.map((fileDiff, index) => (
                <li key={index}>
                  <h3>{fileDiff.fileName}</h3>
                  <h4>Added Lines: {fileDiff.addedLines}</h4>
                  <h4>Deleted Lines: {fileDiff.deletedLines}</h4>
                  <h4>Modified Lines: {fileDiff.modifiedLines}</h4>
                  {/* Display the diff content */}
                  <pre>
                    {fileDiff.diff.map((part, i) => (
                      <span key={i} style={{ color: part.type === 'added' ? 'green' : part.type === 'deleted' ? 'red' : 'blue' }}>
                        {part.content}
                      </span>
                    ))}
                  </pre>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default RepositoryDiffViewer;
