// Production build: copies the site to dist/ with minified HTML/CSS and obfuscated JavaScript.
// The readable source in the repo root is never modified. Netlify runs this (see netlify.toml).
import { readFile, writeFile, mkdir, rm, cp, readdir } from 'node:fs/promises';
import { minify as minifyHtml } from 'html-minifier-terser';
import CleanCSS from 'clean-css';
import JavaScriptObfuscator from 'javascript-obfuscator';

const OUT = 'dist';
const PAGES = (await readdir('.')).filter(f => f.endsWith('.html'));

// Moderate settings: hard to read and reuse, without slowing the animations down.
// renameGlobals stays off because page.js shares `window.BP` with each page's inline script.
const OBF = {
  compact: true,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  splitStrings: false,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  selfDefending: false,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
};
const obfuscate = code => JavaScriptObfuscator.obfuscate(code, OBF).getObfuscatedCode();

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await cp('assets', `${OUT}/assets`, { recursive: true });

// shared CSS and JS
const css = new CleanCSS({ level: 2 }).minify(await readFile('site.css', 'utf8'));
if (css.errors.length) throw new Error('site.css: ' + css.errors.join('; '));
await writeFile(`${OUT}/site.css`, css.styles);
await writeFile(`${OUT}/page.js`, obfuscate(await readFile('page.js', 'utf8')));

// pages: obfuscate every inline <script> (no src), then minify the HTML and its inline CSS
for (const page of PAGES) {
  let html = await readFile(page, 'utf8');
  html = html.replace(/<script>([\s\S]*?)<\/script>/g, (_, js) => `<script>${obfuscate(js)}</script>`);
  html = await minifyHtml(html, {
    collapseWhitespace: true,
    conservativeCollapse: true,      // keeps a single space between inline elements, so text never runs together
    removeComments: true,
    minifyCSS: { level: 2 },
    minifyJS: false,                 // already obfuscated above
    removeRedundantAttributes: true,
    sortAttributes: true,
  });
  await writeFile(`${OUT}/${page}`, html);
}

const kb = n => (n / 1024).toFixed(1) + ' KB';
for (const f of [...PAGES, 'site.css', 'page.js']) {
  const [a, b] = await Promise.all([readFile(f), readFile(`${OUT}/${f}`)]);
  console.log(f.padEnd(16), kb(a.length).padStart(9), '->', kb(b.length).padStart(9));
}
console.log(`Built ${PAGES.length} pages into ${OUT}/`);
