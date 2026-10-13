// Renders index.html frame by frame with headless Chromium and pipes PNGs into ffmpeg.
// Usage: node scripts/render.mjs [out.mp4] [fps] [--stills t1,t2,...]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const dir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const stillsArg = args.indexOf('--stills');
const out = args[0] && !args[0].startsWith('--') ? args[0] : path.join(dir, 'incept-motion-reel.mp4');
const fps = Number(args[1]) || 60;
const audio = path.join(dir, 'audio.wav');

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('file://' + path.join(dir, 'index.html') + '?render');
await page.evaluate(async () => { await document.fonts.load('800 100px Inter'); await document.fonts.load('500 20px "JetBrains Mono"'); await document.fonts.ready; });

const grab = t => page.evaluate(t => { render(t); return document.getElementById('c').toDataURL('image/png').split(',')[1]; }, t);

if (stillsArg >= 0) {
  for (const t of args[stillsArg + 1].split(',').map(Number)) {
    fs.writeFileSync(path.join(path.dirname(out), `still-${t.toFixed(2)}.png`), Buffer.from(await grab(t), 'base64'));
  }
} else {
  const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
    ...(fs.existsSync(audio) ? ['-i', audio, '-c:a', 'aac', '-b:a', '192k', '-shortest'] : []),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const frames = Math.round(15 * fps);
  for (let f = 0; f < frames; f++) {
    const buf = Buffer.from(await grab(f / fps), 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 60 === 0) process.stderr.write(`frame ${f}/${frames}\n`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
}
await browser.close();
