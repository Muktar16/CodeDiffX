// // LessionPlans.js
// import React from 'react';
// import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons';
// import { Row, Col, Typography } from 'antd';
// import './NoPage.css';

// const { Title, Text } = Typography;

// const LessionPlans = () => {
//   return (
//     <div className="container">
//       <Row className="header">
//         <Col span={4}>
//           <ArrowLeftOutlined className="back-arrow" />
//         </Col>
//         <Col span={20}>
//           <Title level={2} style={{ color: 'white', textAlign:'center' }}>
//             Lession Plans
//           </Title>
//         </Col>
//       </Row>
//       <Row className="main-body" justify="center" >
//         <Col xs={12} sm={8} md={6} lg={6} xl={6}>
//           <div className="circle">
//             <CheckOutlined className="circle-icon" />
//           </div>
//           <Text strong style={{ textAlign: 'center' }}>
//             Definition
//           </Text>
//         </Col>
//         <Col xs={12} sm={8} md={6} lg={6} xl={6}>
//           <div className="circle">
//             <CheckOutlined className="circle-icon" />
//           </div>
//           <Text strong style={{ textAlign: 'center' }}>
//             Practice Definition
//           </Text>
//         </Col>
//         <Col xs={12} sm={8} md={6} lg={6} xl={6}>
//           <div className="circle">
//             <CheckOutlined className="circle-icon" />
//           </div>
//           <Text strong style={{ textAlign: 'center' }}>
//             Synonym/Antonym
//           </Text>
//         </Col>
//         <Col xs={12} sm={8} md={6} lg={6} xl={6}>
//           <div className="circle">
//             <CheckOutlined className="circle-icon" />
//           </div>
//           <Text strong style={{ textAlign: 'center' }}>
//             Practice Synonym/Antonym
//           </Text>
//         </Col>
//         <Col xs={12} sm={8} md={6} lg={6} xl={6}>
//           <div className="circle">
//             <CheckOutlined className="circle-icon" />
//           </div>
//           <Text strong style={{ textAlign: 'center' }}>
//             Others
//           </Text>
//         </Col>
//       </Row>
//       <Row className="footer" justify="center">
//         <Col span={24}>
//           <Text type="secondary">NB: *80% mark in practice is required to pass/unlock</Text>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default LessionPlans;




import React, { useState } from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './NoPage.css';

const NoPage = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  const handleCellClick = (index) => {
    if (board[index] === null && isPlayerTurn) {
      const updatedBoard = [...board];
      updatedBoard[index] = isPlayerTurn ? 'X' : 'O';
      setBoard(updatedBoard);
      setIsPlayerTurn(!isPlayerTurn);
    }
  };

  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const calculateWinner = () => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        return board[a];
      }
    }

    if (board.every((cell) => cell !== null)) {
      return 'Draw';
    }

    return null;
  };

  const gameWinner = calculateWinner();

  return (
    <div className="no-page-container">
      <Result
        status="404"
        title="Error!!! Page not Found"
        subTitle="Sorry, the page you visited does not exist."
        extra={[
          <Button key="go-back" type="primary" onClick={handleGoBack}>
            Go Back
          </Button>,
          <Button key="restart" onClick={handleRestart}>
            Restart
          </Button>,
        ]}
      />

      <div className="game-container">
        <h3>Tic-Tac-Toe</h3>
        <div className="board">
          {board.map((cell, index) => (
            <div
              key={index}
              className={`cell ${cell}`}
              onClick={() => handleCellClick(index)}
            >
              {cell || '-'}
            </div>
          ))}
        </div>

        {gameWinner && (
          <div className="winner-message">
            {gameWinner === 'Draw' ? "It's a draw!" : `Player ${gameWinner} wins!`}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoPage;

