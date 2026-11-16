// Usage: node scripts/stills.mjs <scale> <outDir> <frame> [frame...]
// Renders review stills with a single bundle.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "fs";
import path from "path";

const [scale, outDir, ...frames] = process.argv.slice(2);
const browser = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const opts = { serveUrl, browserExecutable: fs.existsSync(browser) ? browser : undefined };
const composition = await selectComposition({ ...opts, id: "CatalogJobs" });
fs.mkdirSync(outDir, { recursive: true });
for (const f of frames) {
  const out = path.join(outDir, `f${String(f).padStart(5, "0")}.png`);
  await renderStill({ ...opts, composition, frame: Number(f), output: out, scale: Number(scale) });
  process.stdout.write(`${f} `);
}
console.log("done");
