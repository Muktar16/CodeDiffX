const express = require('express');
const parser = require('php-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.post('/analyze', (req, res) => {
  const { phpCode } = req.body;
//   console.log(phpCode);

  const ast = parser.parseCode(phpCode, { ast: { withPositions: true } });
//   console.log(ast);

const countPredicates = (node) => {
    let predicateCount = 0;
  
    if (
      node.kind === 'if' ||
      node.kind === 'elseif' ||
      node.kind === 'foreach' ||
      node.kind === 'while' ||
      node.kind === 'do' ||
      node.kind === 'for'
    ) {
      predicateCount++;
    }
  
    for (const prop in node) {
      if (node[prop] && typeof node[prop] === 'object') {
        if (Array.isArray(node[prop])) {
          node[prop].forEach((childNode) => {
            predicateCount += countPredicates(childNode);
          });
        } else {
          predicateCount += countPredicates(node[prop]);
        }
      }
    }
  
    return predicateCount;
  };
  

  const predicateCount = countPredicates(ast);

  res.json({ predicateCount });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// const express = require('express');
// const cors = require('cors');

// const app = express();
// const port = 3001;

// app.use(express.json());
// app.use(cors());

// app.post('/analyze', (req, res) => {
//   const { phpCode } = req.body;

//   const predicateCount = countPredicates(phpCode);

//   res.json({ predicateCount });
// });

// function countPredicates(phpCode) {
//     const ifPattern = /if\s*\([^)]+\)\s*{/g;
//     const elseifPattern = /else\s*if\s*\([^)]+\)\s*{/g;
//     const forPattern = /for\s*\([^)]+\)\s*{/g;
//     const whilePattern = /while\s*\([^)]+\)\s*{/g;
//     // const doWhilePattern = /do\s*{\s*[^}]*}\s*while\s*\([^)]+\)\s*;/g;
//     const foreachPattern = /foreach\s*\([^)]+\)\s*{/g;
  
//     const ifMatches = (phpCode.match(ifPattern) || []).length;
//     const elseifMatches = (phpCode.match(elseifPattern) || []).length;
//     const forMatches = (phpCode.match(forPattern) || []).length;
//     const whileMatches = (phpCode.match(whilePattern) || []).length;
//     // const doWhileMatches = (phpCode.match(doWhilePattern) || []).length;
//     const foreachMatches = (phpCode.match(foreachPattern) || []).length;
  
//     const predicateCount = ifMatches + elseifMatches + forMatches + whileMatches  + foreachMatches;
  
//     return predicateCount;
//   }
  

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
