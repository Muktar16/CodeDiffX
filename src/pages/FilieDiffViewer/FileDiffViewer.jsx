import React, { useState } from 'react';
import { Typography, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { diffLines } from 'diff';
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";

const { Text } = Typography;

const acceptedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.java', '.py', '.c', '.cpp', '.php'];

const FileDiffViewer = () => {
  const [oldFile, setOldFile] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [addedLines, setAddedLines] = useState(0);
  const [deletedLines, setDeletedLines] = useState(0);
  const [showFileContents, setShowFileContents] = useState(false);

  const handleFileUpload = (file, isOld) => {
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!acceptedExtensions.includes(fileExtension)) {
      message.error('Invalid file type. Only programming files are allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      if (isOld) {
        setOldFile({ file, content });
      } else {
        setNewFile({ file, content });
      }
    };

    reader.readAsText(file);
  };

  const compareFiles = () => {
    if (!oldFile || !newFile) {
      message.error('Please upload both Version 1 and Version 2 files.');
      return;
    }

    if (oldFile.file.type !== newFile.file.type) {
      message.error('Both files should be of the same type.');
      return;
    }

    const diff = diffLines(oldFile.content, newFile.content);

    let addedLinesCount = 0;
    let deletedLinesCount = 0;

    diff.forEach((part, index) => {
      if (part.added) {
        addedLinesCount += part.count;
      } else if (part.removed) {
        deletedLinesCount += part.count;
      }
    });

    setAddedLines(addedLinesCount);
    setDeletedLines(deletedLinesCount);
    setShowFileContents(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', color: 'white' }}>
      <div style={{ marginBottom: 16 }}>
        <Upload beforeUpload={(file) => handleFileUpload(file, true)} showUploadList={false}>
          <Button icon={<UploadOutlined />} size="large">
            Upload Version 1
          </Button>
        </Upload>
        <Upload beforeUpload={(file) => handleFileUpload(file, false)} showUploadList={false}>
          <Button icon={<UploadOutlined />} size="large" style={{ marginLeft: 16 }}>
            Upload Version 2
          </Button>
        </Upload>
        <Button type="primary" size="large" onClick={compareFiles} style={{ marginLeft: 16 }}>
          Compare Versions
        </Button>
      </div>
      {showFileContents && (
        <div style={{ marginTop: 16 }}>
          <Text strong>Comparison:</Text>
          <br />
          <Text type="success">Added Lines: {addedLines}</Text>
          <br />
          <Text type="danger">Deleted Lines: {deletedLines}</Text>
          <br />
          <Text>Total Changes: {addedLines + deletedLines}</Text>
        </div>
      )}
      <br />
      <br />
      {showFileContents && (
        <div style={{ display: 'flex', flex: 1, width: '100%', maxWidth: '1400px',background: '#1e1e1e', }}>
          <div style={{ flex: 1, padding: '16px', borderRight: '1px solid #383838' ,maxWidth:'50%'}}>
            <Text strong style={{fontSize:"1.3rem", color:'blue'}}>Old Version</Text>
            <br />
            <SyntaxHighlighter
                language="javascript"
                style={vs2015}
                showLineNumbers
                startingLineNumber={1}
              >
                {oldFile.content}
              </SyntaxHighlighter>
          </div>
          <div style={{ flex: 1, padding: '16px',maxWidth:'50%' }}>
            <Text strong style={{fontSize:"1.3rem", color:'blue'}}>New Version</Text>
            <br />
            <SyntaxHighlighter
                language="javascript"
                style={vs2015}
                showLineNumbers
                startingLineNumber={1}
              >
                {newFile.content}
              </SyntaxHighlighter>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default FileDiffViewer;












// import React, { useState } from 'react';
// import { Button, Typography, Upload, Row, Col } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import { diffLines } from 'diff';

// const FileDiffViewer = () => {
//   const [oldFileContent, setOldFileContent] = useState('');
//   const [newFileContent, setNewFileContent] = useState('');
//   const [diffResult, setDiffResult] = useState([]);
//   const [numAddedLines, setNumAddedLines] = useState(0);
//   const [numDeletedLines, setNumDeletedLines] = useState(0);

//   const handleFileUpload = (file, isOld) => {
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       const content = e.target.result;
//       if (isOld) {
//         setOldFileContent(content);
//       } else {
//         setNewFileContent(content);
//       }
//     };

//     reader.readAsText(file);
//   };

//   const compareFiles = () => {
//     // Remove whitespace and comments from old and new file contents
//     const oldFileContentWithoutComments = oldFileContent.replace(/\/\/.*|\/\*[^]*?\*\//g, '').replace(/\s+/g, '');
//     const newFileContentWithoutComments = newFileContent.replace(/\/\/.*|\/\*[^]*?\*\//g, '').replace(/\s+/g, '');

//     const diff = diffLines(oldFileContentWithoutComments, newFileContentWithoutComments);
//     setDiffResult(diff);

//     let addedLines = 0;
//     let deletedLines = 0;

//     diff.forEach((part) => {
//       if (part.added) {
//         addedLines += part.count;
//       } else if (part.removed) {
//         deletedLines += part.count;
//       }
//     });

//     setNumAddedLines(addedLines);
//     setNumDeletedLines(deletedLines);
//   };

//   const beforeFileUpload = (file) => {
//     // Define accepted file extensions for different programming languages
//     const acceptedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.java', '.py', '.c', '.cpp', '.php'];

//     const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
//     if (!acceptedExtensions.includes(fileExtension)) {
//       // Show an error message or notification for invalid file type
//       console.log('Invalid file type. Only files with extensions', acceptedExtensions.join(', '), 'are allowed.');
//       return false;
//     }

//     handleFileUpload(file);
//     return false; // Prevent default upload behavior
//   };

//   return (
//     <div style={{ padding: '24px', backgroundColor: '#f0f2f5', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
//       <Row gutter={[16, 16]} align="middle">
//         <Col span={12}>
//           <Upload beforeUpload={beforeFileUpload} showUploadList={false}>
//             <Button icon={<UploadOutlined />} size="large">
//               Upload Old Version
//             </Button>
//           </Upload>
//         </Col>
//         <Col span={12}>
//           <Upload beforeUpload={beforeFileUpload} showUploadList={false}>
//             <Button icon={<UploadOutlined />} size="large">
//               Upload New Version
//             </Button>
//           </Upload>
//         </Col>
//       </Row>
//       <Row justify="center" style={{ marginTop: '24px' }}>
//         <Col>
//           <Button type="primary" size="large" onClick={compareFiles}>
//             Compare Versions
//           </Button>
//         </Col>
//       </Row>
//       <Row justify="center" style={{ marginTop: '24px' }}>
//         <Col>
//           <Typography.Title level={4}>Color Key:</Typography.Title>
//           <div>
//             <span style={{ color: 'green' }}>Added Lines</span> - Lines added in the new version.
//             <br />
//             <span style={{ color: 'red' }}>Deleted Lines</span> - Lines removed in the new version.
//           </div>
//         </Col>
//       </Row>
//       {diffResult.length > 0 && (
//         <Row justify="center" style={{ marginTop: '24px' }}>
//           <Col>
//             <Typography.Title level={4}>Total Changes: {numAddedLines + numDeletedLines}</Typography.Title>
//             <Typography.Title level={4}>Number of Added Lines: {numAddedLines}</Typography.Title>
//             <Typography.Title level={4}>Number of Deleted Lines: {numDeletedLines}</Typography.Title>
//             <Typography.Title level={4}>Differences:</Typography.Title>
//             <div style={{ fontFamily: 'monospace' }}>
//               {diffResult.map((part, index) => {
//                 const color = part.added ? 'green' : part.removed ? 'red' : 'blue'; // Choose different colors for added, deleted, and modified lines
//                 const lines = part.value.split('\n');
//                 return (
//                   <div key={index} style={{ color }}>
//                     {lines.map((line, lineNumber) => (
//                       <span key={lineNumber}>
//                         {part.added ? '+' : part.removed ? '-' : ''}{lineNumber + 1} {line}
//                         <br />
//                       </span>
//                     ))}
//                   </div>
//                 );
//               })}
//             </div>
//           </Col>
//         </Row>
//       )}
//     </div>
//   );
// };

// export default FileDiffViewer;
