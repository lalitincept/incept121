// Usage: node scripts/bench.mjs <gl|default> <scale> <seconds...>
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
const [gl, scaleArg, ...times] = process.argv.slice(2);
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public') });
const chromiumOptions = gl === 'default' ? {} : { gl };
const composition = await selectComposition({ serveUrl, id: 'CatalogSource', browserExecutable, chromiumOptions });
for (const s of times) {
  const frame = Math.round(parseFloat(s) * 30);
  const t0 = Date.now();
  await renderStill({ serveUrl, composition, frame, output: `out/bench_${gl}_${frame}.jpg`, scale: parseFloat(scaleArg), imageFormat: 'jpeg', jpegQuality: 90, browserExecutable, chromiumOptions });
  console.log(gl, s, ((Date.now() - t0) / 1000).toFixed(2) + 's');
}
