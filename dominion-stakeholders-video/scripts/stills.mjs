// Render preview stills: node scripts/stills.mjs <outDir> <scale> <frame> [frame...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [outDir, scaleStr, ...frames] = process.argv.slice(2);
const scale = Number(scaleStr || '0.5');
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public')});
const composition = await selectComposition({serveUrl, id: 'StakeholdersVideo'});
for (const fr of frames) {
  const output = path.join(outDir, `f${String(fr).padStart(5, '0')}.jpg`);
  await renderStill({composition, serveUrl, frame: Number(fr), output, scale, imageFormat: 'jpeg', jpegQuality: 85, chromiumOptions: {gl: 'angle'}});
  console.log('rendered', output);
}
