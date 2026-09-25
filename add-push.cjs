const fs = require('fs');
let c = fs.readFileSync('backend/server.js', 'utf8');
if (!c.includes('/api/push-token')) {
  c = c.replace('app.listen(3001', 'app.post("/api/push-token", (req, res) => { console.log("Received Push Token:", req.body.token); res.json({success:true}); });\napp.listen(3001');
  fs.writeFileSync('backend/server.js', c);
}
