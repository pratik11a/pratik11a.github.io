const port = Number(process.env.PORT || 8000);
const root = process.cwd();

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

const normalizePath = (urlPath) => {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const safe = decoded.replace(/\.\./g, '');
  return safe === '/' ? '/index.html' : safe;
};

Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = normalizePath(url.pathname);
    const file = Bun.file(`${root}${pathname}`);

    if (!(await file.exists())) {
      return new Response('Not Found', { status: 404 });
    }

    const ext = pathname.includes('.') ? pathname.slice(pathname.lastIndexOf('.')) : '.txt';
    return new Response(file, {
      headers: {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      },
    });
  },
});

console.log(`Static server running at http://localhost:${port}`);
