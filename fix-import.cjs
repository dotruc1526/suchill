const fs = require('fs');
let c1 = fs.readFileSync('src/AppV1.tsx', 'utf8');
c1 = c1.replace(/from 'react':import/g, "from 'react';import");
fs.writeFileSync('src/AppV1.tsx', c1);
let c2 = fs.readFileSync('src/AppV2.tsx', 'utf8');
c2 = c2.replace(/from 'react':import/g, "from 'react';import");
fs.writeFileSync('src/AppV2.tsx', c2);
console.log('Fixed syntax');
