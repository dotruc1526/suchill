const fs = require('fs');
let c = fs.readFileSync('src/AppV2.tsx', 'utf8');

// The file contains literal `\` before backticks and dollar signs
// We want to replace it.
c = c.replace(/\\`/g, '`');
c = c.replace(/\\\$/g, '$');

fs.writeFileSync('src/AppV2.tsx', c);
console.log('Cleaned backslashes');
