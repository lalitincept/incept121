// Render many stills from one bundle: node scripts/stills.mjs <scale> <frame> [frame...]
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [scaleArg, ...frames] = process.argv.slice(2);
const scale = Number(scaleArg || 0.5);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public') });
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell';
const composition = await selectComposition({ serveUrl, id: 'ExtractionResults', browserExecutable });
fs.mkdirSync(path.join(root, 'out/stills'), { recursive: true });
for (const f of frames) {
  const output = path.join(root, `out/stills/f${f}.jpg`);
  await renderStill({ serveUrl, composition, frame: Number(f), output, scale, imageFormat: 'jpeg', jpegQuality: 88, browserExecutable, chromiumOptions: { gl: 'swangle' } });
  console.log('rendered', f);
}
