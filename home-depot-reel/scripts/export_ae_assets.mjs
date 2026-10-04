// Export the composition's vector illustrations as transparent PNGs for the
// After Effects build (ae/build_home_depot_reel.jsx imports them from ae/assets).
//
//   npm i puppeteer-core
//   CHROME=/path/to/chrome node scripts/export_ae_assets.mjs
//
// Each SVG is taken from index.html *after* its deterministic builder scripts
// have run, then rasterised alone on a transparent page at 1:1 composition size.
import puppeteer from "puppeteer-core";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "ae", "assets");
fs.mkdirSync(out, { recursive: true });

// [file name, selector, width, height, selectors to hide inside the svg]
const JOBS = [
  ["host_silhouette.png", "#s1-frame .host-fig", 800, 1000, []],
  ["s2_storefront.png", "#s2-store", 440, 300, []],
  ["s2_computer.png", "#s2-comp", 440, 300, []],
  ["s4_storefronts_strip.png", "#s4-stores", 3200, 220, []],
  ["s6_guilloche.png", "#s6-guil", 1920, 1920, []],
  ["s7_founder_silhouette.png", "#ph-1 .img svg", 384, 472, []],
  ["s8_warehouse.png", "#s8-cam svg", 1000, 760, ["#s8-store", "#s8-l1", "#s8-cells"]],
  ["s8_small_store.png", "#s8-cam svg", 1000, 760, ["#s8-wh"]],
  ["s8_aisles.png", "#s8-aisle", 1080, 1920, []],
];

const browser = await puppeteer.launch({ executablePath: process.env.CHROME, args: ["--no-sandbox", "--allow-file-access-from-files"] });
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1920 });
await page.goto(pathToFileURL(path.join(root, "index.html")).href, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);

const fontCss = fs
  .readFileSync(path.join(root, "index.html"), "utf8")
  .match(/@font-face[^}]+}/g)
  .join("\n")
  // inline the fonts: a setContent() page cannot read file:// URLs
  .replace(/url\("(assets\/fonts\/[^"]+)"\)/g, (_, f) => `url("data:font/ttf;base64,${fs.readFileSync(path.join(root, f)).toString("base64")}")`);

for (const [file, sel, w, h, hide] of JOBS) {
  const svg = await page.evaluate(
    (sel, hide, w, h) => {
      const el = document.querySelector(sel).cloneNode(true);
      hide.forEach((s) => el.querySelectorAll(s).forEach((n) => n.remove()));
      el.removeAttribute("class");
      el.removeAttribute("id");
      el.setAttribute("style", `position:absolute;left:0;top:0;width:${w}px;height:${h}px;opacity:1`);
      el.querySelectorAll("[style]").forEach((n) => n.removeAttribute("style")); // drop animation state
      el.querySelectorAll(".cell").forEach((n) => n.remove());
      return el.outerHTML;
    },
    sel, hide, w, h,
  );
  const p = await browser.newPage();
  await p.setViewport({ width: w, height: h });
  await p.setContent(`<!doctype html><html><head><style>${fontCss} html,body{margin:0;background:transparent}</style></head><body>${svg}</body></html>`, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(out, file), omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } });
  await p.close();
  console.log("wrote", file);
}
await browser.close();
