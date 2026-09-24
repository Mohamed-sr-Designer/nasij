// Local dev server for NASIJ (no caching, so edits show immediately).
// /dist/ also answers cross-origin requests so the in-browser WordPress Playground can install the built theme zip.
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = __dirname, PORT = +process.env.PORT || 4905;
const MT = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain', '.woff2': 'font/woff2', '.zip': 'application/zip' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html';
  const cors = p.indexOf('/dist/') === 0 ? { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Private-Network': 'true' } : {};
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
  const fp = path.join(ROOT, p);
  if (!fp.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(fp, (e, d) => {
    if (e) { res.writeHead(404, Object.assign({ 'Content-Type': 'text/plain; charset=utf-8' }, cors)); res.end('404'); return; }
    res.writeHead(200, Object.assign({ 'Content-Type': MT[path.extname(fp).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' }, cors));
    res.end(d);
  });
}).listen(PORT, () => console.log('NASIJ on http://localhost:' + PORT));
