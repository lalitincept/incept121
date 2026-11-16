// Renders review stills for a list of output-seconds: node scripts/stills.mjs 12.5 30 ...
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const secs = process.argv.slice(2).map(Number);
const scale = Number(process.env.SCALE ?? 0.5);
const outDir = path.resolve('out/stills');
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const composition = await selectComposition({ serveUrl, id: 'MCCOverview' });
for (const s of secs) {
  const frame = Math.round(s * 30);
  const output = path.join(outDir, `t${String(s.toFixed(2)).padStart(7, '0')}.jpg`);
  await renderStill({ composition, serveUrl, output, frame, scale, imageFormat: 'jpeg', jpegQuality: 85 });
  console.log('rendered', s, output);
}
