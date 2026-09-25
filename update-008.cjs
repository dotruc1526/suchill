const fs = require('fs');

// 2. Update CONTENT-008
let c008 = fs.readFileSync('docs/tasks/active/CONTENT-008.md', 'utf8');
c008 = c008.replace('> Status: BLOCKED', '> Status: READY').replace('Last updated: 2026-09-23', 'Last updated: 2026-09-25');
fs.writeFileSync('docs/tasks/active/CONTENT-008.md', c008);

console.log("Tasks updated successfully");
