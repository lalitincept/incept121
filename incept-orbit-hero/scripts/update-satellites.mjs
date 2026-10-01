// Refreshes data/satellites.txt from CelesTrak.
// Run every 4 to 6 hours (cron, GitHub Action, or a serverless scheduled job).
// Requires Node 18+ (built-in fetch). Usage: node scripts/update-satellites.mjs
//
// CelesTrak asks users not to request the same data more often than it changes
// (about every 2 hours) and blocks IPs that do. Never call CelesTrak from the browser.

import { writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// category index must match CATS in index.html
const GROUPS = [
  ['stations', 0],
  ['science', 1], ['weather', 1], ['resource', 1], ['military', 1],
  ['gnss', 2],
  ['geo', 3],
  ['starlink', 4], ['oneweb', 4],
  ['fengyun-1c-debris', 5], ['cosmos-2251-debris', 5], ['iridium-33-debris', 5]
];
const KEEP_NAMES = new Set([0]);   // only station names are needed for labels

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, '..', 'data', 'satellites.txt');
const sleep = ms => new Promise(r => setTimeout(r, ms));

const seen = new Set();
const lines = [];
for (const [group, cat] of GROUPS) {
  const url = `https://celestrak.org/NORAD/elements/gp.php?GROUP=${group}&FORMAT=tle`;
  const res = await fetch(url, { headers: { 'User-Agent': 'incept-orbit-hero/1.0' } });
  if (!res.ok) throw new Error(`${group}: HTTP ${res.status}`);
  const rows = (await res.text()).split(/\r?\n/).filter(l => l.trim());
  if (rows.length % 3 !== 0) throw new Error(`${group}: unexpected format`);
  for (let i = 0; i < rows.length; i += 3) {
    const [name, l1, l2] = [rows[i].trim(), rows[i + 1], rows[i + 2]];
    if (!l1.startsWith('1 ') || !l2.startsWith('2 ')) continue;
    const id = l1.slice(2, 7);
    if (seen.has(id)) continue;
    seen.add(id);
    lines.push(`${cat}|${KEEP_NAMES.has(cat) ? name : ''}|${l1}|${l2}`);
  }
  console.log(`${group}: ${rows.length / 3}`);
  await sleep(1500);   // be polite between requests
}

if (lines.length < 5000) throw new Error(`Only ${lines.length} objects, keeping the old file`);
const tmp = out + '.tmp';
await writeFile(tmp, lines.join('\n') + '\n');
await rename(tmp, out);   // swap in atomically so visitors never get a half-written file
console.log(`Wrote ${lines.length} objects to ${out}`);
