// Lightweight Local Web Server for DRISHTI-SETU
// Correctly handles query parameters, MIME types, and clean paths

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webm': 'video/webm',
    '.mp4': 'video/mp4',
    '.wav': 'audio/wav'
};

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/client-log')) {
        console.log(`[BROWSER LOG] ${decodeURIComponent(req.url.replace('/client-log?', ''))}`);
        res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
        res.end('ok');
        return;
    }

    console.log(`[REQ] ${req.method} ${req.url}`);

    // Handle demo video upload endpoint
    if (req.method === 'POST' && req.url === '/save-demo-video') {
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const savePath = path.join(__dirname, 'DRISHTI_SETU_Demo_Video.webm');
            fs.writeFileSync(savePath, buffer);
            console.log(`🎬 Demo Video Saved Successfully! Size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB -> ${savePath}`);
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ success: true, path: savePath, size: buffer.length }));
        });
        return;
    }

    // Strip query string (e.g. ?v=3.0) to find the actual physical file
    const requestUrl = req.url.split('?')[0];
    const cleanPath = requestUrl === '/' ? 'index.html' : requestUrl.replace(/^\//, '');
    const filePath = path.join(__dirname, cleanPath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`<h1>404 Not Found: ${cleanPath}</h1>`);
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Set Cache-Control to no-cache during development
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`👁️ DRISHTI-SETU Server Running with Full Video & Audio Support!`);
    console.log(`🌐 Open in your browser: http://localhost:${PORT}`);
    console.log(`=======================================================`);
});
