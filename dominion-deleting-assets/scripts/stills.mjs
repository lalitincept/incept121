// Render review stills: node scripts/stills.mjs <scale> <outDir> <sec> [sec...]
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const [scaleArg, outDir, ...secs] = process.argv.slice(2);
const scale = Number(scaleArg || 0.5);
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || null;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'DeletingAssetsCorrectly', browserExecutable});
for (const s of secs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(s) * composition.fps));
  const output = path.join(outDir, `f_${String(frame).padStart(5, '0')}.jpg`);
  await renderStill({composition, serveUrl, output, frame, scale, imageFormat: 'jpeg', jpegQuality: 88, browserExecutable});
  console.log('wrote', output);
}
