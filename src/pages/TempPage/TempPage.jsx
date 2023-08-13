import axios from 'axios';
import React, { useState } from 'react';

const CodeAnalyzer = () => {
  const [phpCode, setPhpCode] = useState('');
  const [predicateCount, setPredicateCount] = useState(0);

  const analyzeCode = async () => {
    console.log(phpCode)
    try {
      const response = await axios.post('http://localhost:3001/analyze',{phpCode});
      console.log("response: " + response)
      const data = await response.json();
      setPredicateCount(data.predicateCount);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <div>
      <textarea
        rows={20}
        cols={50}
        value={phpCode}
        onChange={(e) => setPhpCode(e.target.value)}
      />
      <br />
      <button onClick={analyzeCode}>Analyze</button>
      <br />
      <p>P: {predicateCount}</p>
    </div>
  );
};

export default CodeAnalyzer;

