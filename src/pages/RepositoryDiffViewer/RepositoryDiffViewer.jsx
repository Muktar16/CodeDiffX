import React, { useState } from "react";
import { Button, Row, Col,Typography } from "antd";
import { diffLines } from "diff";
import { UploadOutlined } from "@ant-design/icons";

const RepositoryDiffViewer = () => {
  const [oldFiles, setOldFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [diffResult, setDiffResult] = useState([]);
  //without considering new files and deleted fiels
  const [numAddedLines, setNumAddedLines] = useState(0);
  const [numDeletedLines, setNumDeletedLines] = useState(0);
  const [totalChange, setTotalChange] = useState(0);
  //considering new files and deleted files
  const [numAddedLinesWithNew, setNumAddedLinesWithNew] = useState(0);
  const [numDeletedLinesWithDeleted, setNumDeletedLinesWithDeleted] = useState(0);
  const [totalChangeWithNewAndDeleted, setTotalChangeWithNewAndDeleted] = useState(0);
  const [createdFiles, setCreatedFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [filesWithNewLines, setFilesWithNewLines] = useState([]);
  const [filesWithDeletedLines, setFilesWithDeletedLines] = useState([]);

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
    // Filter out files that are not PHP or JS files
    const filteredOldFiles = oldFiles.filter(
      (file) => file.name.endsWith(".php") || file.name.endsWith(".js")
    );
    const filteredNewFiles = newFiles.filter(
      (file) => file.name.endsWith(".php") || file.name.endsWith(".js")
    );

    const oldFileContents = await readFilesContent(filteredOldFiles);
    const newFileContents = await readFilesContent(filteredNewFiles);

    const diff = await diffRepositories(oldFileContents, newFileContents);
    setDiffResult(diff);

    let addedLines = 0;
    let deletedLines = 0;
    let newFileLines = 0;
    let deletedFileLines = 0;

    diff.forEach((fileDiff) => {
      addedLines += fileDiff.addedLines;
      deletedLines += fileDiff.deletedLines;

      if (fileDiff.addedLines > 0) {
        setFilesWithNewLines((prevItems) => [...prevItems, fileDiff.fileName]);
      }

      if (fileDiff.deletedLines > 0) {
        setFilesWithDeletedLines((prevItems) => [...prevItems, fileDiff.fileName]);
      }
    });

    // Check if there are any files missing in the new repository
    const missingFiles = oldFileContents.filter(
      (oldFile) =>
        !newFileContents.some((newFile) => newFile.name === oldFile.name)
    );
    setDeletedFiles(missingFiles);
    missingFiles?.forEach((file) => {
      const linesInFile = file.content.split("\n").length;
      deletedFileLines += linesInFile;
    });

    // Check if there are any files missing in the old repository
    const addedFiles = newFileContents.filter(
      (newFile) =>
        !oldFileContents.some((oldFile) => oldFile.name === newFile.name)
    );
    setCreatedFiles(addedFiles)
    addedFiles?.forEach((file) => {
      const linesInFile = file.content.split("\n").length;
      newFileLines += linesInFile; // Also update the addedLines count for the display
    });

    setNumAddedLines(addedLines);
    setNumDeletedLines(deletedLines);
    setTotalChange(addedLines+deletedLines);

    setNumAddedLinesWithNew(addedLines+newFileLines);
    setNumDeletedLinesWithDeleted(deletedLines+deletedFileLines);
    setTotalChangeWithNewAndDeleted(addedLines+newFileLines+deletedLines+deletedFileLines);
  };

  const readFilesContent = (files) => {
    const promises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({ name: file.name, content: reader.result });
        };
        reader.readAsText(file);
        // reader.readAsTypography.Text(file);
      });
    });
    return Promise.all(promises);
  };

  const diffRepositories = async (oldFiles, newFiles) => {
    const diffs = [];

    for (const oldFile of oldFiles) {
      for (const newFile of newFiles) {
        if (oldFile.name === newFile.name) {
          const diffResult = diffLines(oldFile.content, newFile.content);

          let addedLines = 0;
          let deletedLines = 0;

          diffResult.forEach((part) => {
            if (part.added) {
              addedLines += 1;
            } else if (part.removed) {
              deletedLines += 1;
            }
          });

          diffs.push({
            fileName: oldFile.name,
            addedLines,
            deletedLines,
          });
          break;
        }
      }
    }

    return diffs;
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "#f0f2f5", display:'flex', flexDirection:'column', alignItems:'center' }}>
      <Row gutter={[16, 16]} align="middle">
        <Col span={12}>
          <label htmlFor="oldFolderInput">
            <input
              type="file"
              id="oldFolderInput"
              webkitdirectory="true"
              onChange={(e) => handleFolderChange(e, true)}
              style={{ display: "none" }}
            />
            <Button
              onClick={() => document.getElementById("oldFolderInput").click()}
              icon={<UploadOutlined/>}
            >
              Upload Old Repository
            </Button>
          </label>
        </Col>
        <Col span={12}>
          <label htmlFor="newFolderInput">
            <input
              type="file"
              id="newFolderInput"
              webkitdirectory="true"
              onChange={(e) => handleFolderChange(e, false)}
              style={{ display: "none" }}
            />
            <Button
              icon={<UploadOutlined/>}
              onClick={() => document.getElementById("newFolderInput").click()}
            >
              Upload New Repository
            </Button>
          </label>
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: "24px" }}>
        <Col>
          <Button type="primary" size="large" onClick={compareFiles}>
            Compare Repositories
          </Button>
        </Col>
      </Row>
      {diffResult.length > 0 && (
        <Row justify="center" style={{ marginTop: "24px",display:'flex',flexDirection:'column',alignItems:'center' }}>
          <Col>
            <Typography.Title level={4} style={{ color: "#1890ff" }}>
              Repository Comparison without considering deleted and created files
            </Typography.Title>
            <Typography.Text style={{ color: "#52c41a" }}>Number of Added Lines: {numAddedLines}</Typography.Text><br/>
            <Typography.Text style={{ color: "#f5222d" }}>Number of Deleted Lines: {numDeletedLines}</Typography.Text><br/>
            <Typography style={{ color: "#faad14" }}>Total Change: {totalChange}</Typography><br/>
            <hr />
            <Typography.Title level={4}  style={{ color: "#1890ff" }}>
              Repository Comparison considering deleted and created files
            </Typography.Title><br />
            <Typography.Text style={{ color: "#52c41a" }}>Number of Added Lines: {numAddedLinesWithNew}</Typography.Text><br />
            <Typography.Text style={{ color: "#f5222d" }}>Number of Deleted Lines: {numDeletedLinesWithDeleted}</Typography.Text><br />
            <Typography.Text style={{ color: "#faad14" }}>Total Change: {totalChangeWithNewAndDeleted}</Typography.Text><br />
            {/* Display the created and deleted files */}
            <hr />
            <Typography.Title level={4}  style={{ color: "#1890ff" }}>Files with new lines:</Typography.Title>
            <ul>
              {filesWithNewLines?.map((fileName, index) => (
                <li key={index}>{fileName}</li>
              ))}
            </ul>
            <Typography.Title level={4}  style={{ color: "#f5222d" }}>Files with Deleted lines:</Typography.Title>
            <ul>
              {filesWithDeletedLines?.map((fileName, index) => (
                <li key={index}>{fileName}</li>
              ))}
            </ul>
            <hr />
            <Typography.Title  level={4}  style={{ color: "#52c41a" }}>Created files:</Typography.Title>
            <ul>
              {createdFiles?.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
            <Typography.Title level={4}  style={{ color: "#f5222d" }}>Deleted files:</Typography.Title>
            <ul>
              {deletedFiles?.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default RepositoryDiffViewer;

// import React, { useState } from 'react';
// import { Button, Typography.Text, Row, Col } from 'antd';
// import { diffLines } from 'diff';

// const RepositoryDiffViewer = () => {
//   const [oldFiles, setOldFiles] = useState([]);
//   const [newFiles, setNewFiles] = useState([]);
//   const [diffResult, setDiffResult] = useState([]);
//   const [numAddedLines, setNumAddedLines] = useState(0);
//   const [numDeletedLines, setNumDeletedLines] = useState(0);
//   const [totalChange, setTotalChange] = useState(0);
//   const [createdFiles, setCreatedFiles] = useState([]);
//   const [deletedFiles, setDeletedFiles] = useState([]);

//   const handleFolderChange = (event, isOld) => {
//     const files = event.target.files;
//     const fileArray = Array.from(files);
//     if (isOld) {
//       setOldFiles(fileArray);
//     } else {
//       setNewFiles(fileArray);
//     }
//   };

//   const compareFiles = async () => {
//     // Filter out files that are not PHP or JS files
//     const filteredOldFiles = oldFiles.filter(file => file.name.endsWith('.php') || file.name.endsWith('.js'));
//     const filteredNewFiles = newFiles.filter(file => file.name.endsWith('.php') || file.name.endsWith('.js'));

//     const diff = await diffRepositories(filteredOldFiles, filteredNewFiles);
//     setDiffResult(diff);

//     let addedLines = 0;
//     let deletedLines = 0;
//     let totalChange = 0;
//     const created = [];
//     const deleted = [];

//     diff.forEach((fileDiff) => {
//       addedLines += fileDiff.addedLines;
//       deletedLines += fileDiff.deletedLines;
//       totalChange = addedLines - deletedLines;

//       if (fileDiff.addedLines > 0) {
//         created.push(fileDiff.fileName);
//       }

//       if (fileDiff.deletedLines > 0) {
//         deleted.push(fileDiff.fileName);
//       }
//     });

//     setNumAddedLines(addedLines);
//     setNumDeletedLines(deletedLines);
//     setTotalChange(totalChange);
//     setCreatedFiles(created);
//     setDeletedFiles(deleted);
//   };

//   const readFileContents = (file) => {
//     return new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         resolve(reader.result);
//       };
//       reader.readAsTypography.Text(file);
//     });
//   };

//   const diffRepositories = async (oldFiles, newFiles) => {
//     const diffs = [];

//     for (const oldFile of oldFiles) {
//       for (const newFile of newFiles) {
//         if (oldFile.name === newFile.name) {
//           try {
//             const oldFileContent = await readFileContents(oldFile);
//             const newFileContent = await readFileContents(newFile);

//             const diffResult = diffLines(oldFileContent, newFileContent);

//             let addedLines = 0;
//             let deletedLines = 0;

//             diffResult.forEach((part) => {
//               if (part.added) {
//                 addedLines += 1;
//               } else if (part.removed) {
//                 deletedLines += 1;
//               }
//             });

//             diffs.push({
//               fileName: oldFile.name,
//               addedLines,
//               deletedLines,
//             });
//           } catch (error) {
//             console.error(`Error reading file: ${oldFile.name}`, error);
//           }
//           break;
//         }
//       }
//     }

//     return diffs;
//   };

//   return (
//     <div style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
//       <Row gutter={[16, 16]} align="middle">
//         <Col span={12}>
//           <label htmlFor="oldFolderInput">
//             <p>Choose the folder for the Old Repository:</p>
//             <input
//               type="file"
//               id="oldFolderInput"
//               webkitdirectory="true"
//               onChange={(e) => handleFolderChange(e, true)}
//               style={{ display: 'none' }}
//             />
//             <Button type="primary" onClick={() => document.getElementById('oldFolderInput').click()}>
//               Browse Folder
//             </Button>
//           </label>
//         </Col>
//         <Col span={12}>
//           <label htmlFor="newFolderInput">
//             <p>Choose the folder for the New Repository:</p>
//             <input
//               type="file"
//               id="newFolderInput"
//               webkitdirectory="true"
//               onChange={(e) => handleFolderChange(e, false)}
//               style={{ display: 'none' }}
//             />
//             <Button type="primary" onClick={() => document.getElementById('newFolderInput').click()}>
//               Browse Folder
//             </Button>
//           </label>
//         </Col>
//       </Row>
//       <Row justify="center" style={{ marginTop: '24px' }}>
//         <Col>
//           <Button type="primary" size="large" onClick={compareFiles}>
//             Compare Repositories
//           </Button>
//         </Col>
//       </Row>
//       {diffResult.length > 0 && (
//         <Row justify="center" style={{ marginTop: '24px' }}>
//           <Col>
//             <Typography.Text.Title level={4}>Number of Added Lines: {numAddedLines}</Typography.Text.Title>
//             <Typography.Text.Title level={4}>Number of Deleted Lines: {numDeletedLines}</Typography.Text.Title>
//             <Typography.Text.Title level={4}>Total Change: {totalChange}</Typography.Text.Title>
//             {/* Display the created and deleted files */}
//             <Typography.Text.Title level={4}>Created Files:</Typography.Text.Title>
//             <ul>
//               {createdFiles.map((fileName, index) => (
//                 <li key={index}>{fileName}</li>
//               ))}
//             </ul>
//             <Typography.Text.Title level={4}>Deleted Files:</Typography.Text.Title>
//             <ul>
//               {deletedFiles.map((fileName, index) => (
//                 <li key={index}>{fileName}</li>
//               ))}
//             </ul>
//           </Col>
//         </Row>
//       )}
//     </div>
//   );
// };

// export default RepositoryDiffViewer;
