import pkg from 'php-parser';
const { Parser } = pkg;

const calculateCyclomaticComplexity = (ast) => {
  let complexity = 1; // Initialize complexity to 1 (default path)

  const visitNode = (node) => {
    if (node.kind === 'if' || node.kind === 'elseif' || node.kind === 'else') {
      complexity++;
    } else if (
      node.kind === 'for' ||
      node.kind === 'while' ||
      node.kind === 'do' ||
      node.kind === 'foreach'
    ) {
      complexity++;
    } else if (node.kind === 'switch') {
      complexity += node.cases.length || 1; // Cases increase complexity
    } else if (node.kind === 'binary' && (node.operator === '&&' || node.operator === '||')) {
      complexity++;
    }

    for (const key in node) {
      if (key === 'stmts') {
        node[key].forEach(statement => visitNode(statement));
      } else if (typeof node[key] === 'object') {
        visitNode(node[key]);
      }
    }
  };

  visitNode(ast);
  return complexity;
};

const phpCode = `
<?php
if ($a > 5) {
  echo "Greater than 5";
} elseif ($a < 5) {
  echo "Less than 5";
} else {
  echo "Equal to 5";
}
for ($i = 0; $i < 10; $i++) {
  // Loop code
}
switch ($value) {
  case 1:
    echo "Value is 1";
    break;
  case 2:
    echo "Value is 2";
    break;
  default:
    echo "Value is not 1 or 2";
}
?>
`;

const parser = new Parser();
const ast = parser.parseCode(phpCode);
const complexity = calculateCyclomaticComplexity(ast);

console.log('Cyclomatic Complexity:', complexity);
