import React from 'react';
import { Space } from 'antd';
import { Link } from 'react-router-dom';

const Homepage = () => {
  const containerStyle = {
    textAlign: 'center',
    padding: '10px 20px', // Padding adjusted to 100px at the top and bottom, and 20px at the sides
    background: '#1a1a1a', // Dark-themed background color
    color: '#fff', // Text color
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%', // Full width for mobile screens
    maxWidth: '1000px', // Limit width to 600px for larger screens
    margin: '0 auto', // Center the container horizontally
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', // Add a subtle text shadow
  };

  const serviceStyle = {
    fontSize: '1.2rem',
    lineHeight: '1.6',
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Welcome to The CodeDiffX System</h1>
      <p style={serviceStyle}>
        The CodeDiffX System is a powerful tool that offers the following main services:
      </p>

      <Space size="large" direction="vertical">
        <div>
          <h2>1. Code Analysis</h2>
          <p style={serviceStyle}>
            Analyze your code files written in any programming language and get insights such as
            the total number of lines and the number of source lines. This helps you understand the
            size and complexity of your codebase.
          </p>
        </div>

        <div>
          <h2>2. File Version Differences</h2>
          <p style={serviceStyle}>
            Compare two versions of a file to see the changes made between them. Easily identify
            deleted lines, added lines, and modifications. This helps you track changes and
            collaborate efficiently with your team.
          </p>
        </div>

        <div>
          <h2>3. Repository Comparison</h2>
          <p style={serviceStyle}>
            Compare two versions of a repository and get detailed statistics like new files,
            deleted files, and changes in each individual file. This powerful feature helps you
            manage and understand the evolution of your codebase over time.
          </p>
        </div>
      </Space>
    </div>
  );
};

export default Homepage;
