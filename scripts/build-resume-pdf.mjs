/**
 * Generates the downloadable resume PDF.
 *
 * Astro has no server, so a real PDF file is produced at build time from the
 * site's own print stylesheet, then served as a static asset. Run this
 * whenever `src/data/resume.json` changes, or run it before deploying:
 *
 *   npm run resume:pdf
 *
 * Requires a local Chrome/Chromium/Edge install. No npm dependencies are
 * added; the browser is driven through its command line interface.
 */
import { createServer } from 'node:http';
import { spawn, spawnSync } from 'node:child_process';
import { readFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';

const ROOT = resolve(process.cwd());
const DIST = join(ROOT, 'dist');
const OUT = join(ROOT, 'public', 'dinesh-karki-resume.pdf');
const PORT = 4322;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

function findBrowser() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  const candidates =
    process.platform === 'win32'
      ? [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
          'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        ]
      : process.platform === 'darwin'
        ? [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
            '/Applications/Chromium.app/Contents/MacOS/Chromium',
          ]
        : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge'];

  return candidates.find((p) => existsSync(p)) ?? null;
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) {
    throw new Error(`${command} exited with code ${result.status}`);
  }
}

/** Minimal static server for the dist/ folder. The site uses absolute
 *  /_astro/ paths, so printing over file:// would drop all styling. */
function serveDist() {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://localhost:${PORT}`);
      let pathname = decodeURIComponent(url.pathname);
      if (pathname === '/' || pathname.endsWith('/')) pathname += 'index.html';

      const filePath = join(DIST, pathname);
      if (!filePath.startsWith(DIST + sep) && filePath !== join(DIST, 'index.html')) {
        res.writeHead(403).end('Forbidden');
        return;
      }
      if (!existsSync(filePath) || !(await stat(filePath)).isFile()) {
        res.writeHead(404).end('Not found');
        return;
      }

      res.writeHead(200, { 'Content-Type': MIME[extname(filePath).toLowerCase()] ?? 'application/octet-stream' });
      res.end(await readFile(filePath));
    } catch (error) {
      res.writeHead(500).end(String(error));
    }
  });

  return new Promise((resolveServer) => server.listen(PORT, () => resolveServer(server)));
}

async function main() {
  const browser = findBrowser();
  if (!browser) {
    console.error('No Chrome, Chromium or Edge found. Set CHROME_PATH to your browser executable.');
    process.exit(1);
  }

  console.log('1/3  Building the site…');
  run('npm', ['run', 'build']);

  console.log(`2/3  Printing dist/ to a PDF via ${browser}`);
  const server = await serveDist();
  try {
    await mkdir(join(ROOT, 'public'), { recursive: true });

    await new Promise((resolvePrint, rejectPrint) => {
      const child = spawn(
        browser,
        [
          '--headless=new',
          '--disable-gpu',
          '--no-sandbox',
          '--no-pdf-header-footer',
          '--virtual-time-budget=10000',
          `--print-to-pdf=${OUT}`,
          `http://localhost:${PORT}/`,
        ],
        { stdio: 'ignore' }
      );
      child.on('error', rejectPrint);
      child.on('exit', (code) => (code === 0 ? resolvePrint() : rejectPrint(new Error(`browser exited with ${code}`))));
    });
  } finally {
    server.close();
  }

  if (!existsSync(OUT)) {
    throw new Error('The browser reported success but no PDF was written.');
  }
  const { size } = await stat(OUT);

  console.log('3/3  Rebuilding so the PDF is copied into dist/…');
  run('npm', ['run', 'build']);

  console.log(`\nDone: public/dinesh-karki-resume.pdf (${(size / 1024).toFixed(0)} KB)`);
}

main().catch((error) => {
  console.error(`\nFailed: ${error.message}`);
  process.exit(1);
});
