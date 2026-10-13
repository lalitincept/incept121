// Dev helper: render preview stills at given seconds.
// Usage (from the project root): node scripts/stills.mjs <outDir> <scale> t1 t2 ...
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition, openBrowser } from '@remotion/renderer';
import path from 'node:path';

const [outDir, scaleStr, ...times] = process.argv.slice(2);
const scale = Number(scaleStr);
const browserExecutable = process.env.REMOTION_BROWSER;
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const browser = await openBrowser('chrome', { browserExecutable });
const comp = await selectComposition({ serveUrl, id: 'CDGCSystemDataSet', puppeteerInstance: browser, browserExecutable });
for (const ts of times) {
  const frame = Math.min(comp.durationInFrames - 1, Math.round(Number(ts) * comp.fps));
  const out = path.join(outDir, `t${Number(ts).toFixed(2).padStart(6, '0')}.png`);
  const t0 = Date.now();
  await renderStill({ composition: comp, serveUrl, output: out, frame, scale, puppeteerInstance: browser, browserExecutable });
  console.log(out, `${Date.now() - t0}ms`);
}
await browser.close({ silent: true });
