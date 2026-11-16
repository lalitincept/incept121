// Usage: node scripts/stills.mjs <outDir> <scale> <seconds...>  (seconds are composition time)
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [outDir, scaleArg, ...times] = process.argv.slice(2);
const scale = parseFloat(scaleArg || '0.5');
fs.mkdirSync(outDir, { recursive: true });
const browserExecutable =
  process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public') });
const composition = await selectComposition({ serveUrl, id: 'CatalogSource', browserExecutable });
for (const s of times) {
  const frame = Math.round(parseFloat(s) * composition.fps);
  const output = path.join(outDir, `f_${String(frame).padStart(5, '0')}.jpg`);
  await renderStill({ serveUrl, composition, frame, output, scale, imageFormat: 'jpeg', jpegQuality: 85, browserExecutable, chromiumOptions: { gl: 'swangle' } });
  console.log('wrote', output);
}
