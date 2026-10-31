// Hostinger Node.js Application Startup File
// Used by Hostinger hPanel Node.js Selector & PM2
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .once('error', (err) => {
      console.error('Hostinger server error:', err);
      process.exit(1);
    })
    .listen(port, '0.0.0.0', () => {
      console.log(`> Srinoos Blog live on Hostinger & Local: http://localhost:${port} & http://127.0.0.1:${port} (Domain: https://sricospace.com)`);
    });
});

