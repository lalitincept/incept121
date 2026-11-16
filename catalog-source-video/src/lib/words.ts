import { VO_WORDS } from '../data/voWords';

export type TimedWord = { text: string; s: number; hl: boolean; br?: boolean };

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9*]/g, '');

/**
 * Turns display text into words timed against the voiceover.
 *  - `*like this*` marks highlighted (blue) words
 *  - `word@12.3` forces a timestamp
 *  - `/` on its own forces a line break
 * Each word is matched to the next spoken occurrence after `hint` seconds.
 */
export function timedWords(text: string, hint: number): TimedWord[] {
  const raw = text.split(/\s+/).filter(Boolean);
  let ptr = VO_WORDS.findIndex((w) => w.s >= hint - 0.45);
  if (ptr < 0) ptr = VO_WORDS.length;
  let hl = false;
  let last = hint;
  const out: TimedWord[] = [];
  for (let token of raw) {
    if (token === '/') {
      if (out.length) out[out.length - 1].br = true;
      continue;
    }
    let forced: number | undefined;
    const at = token.match(/^(.*)@(-?[0-9.]+)$/);
    if (at) {
      token = at[1];
      forced = parseFloat(at[2]);
    }
    let startHl = false;
    let endHl = false;
    if (token.startsWith('*')) {
      startHl = true;
      token = token.slice(1);
    }
    if (token.endsWith('*')) {
      endHl = true;
      token = token.slice(0, -1);
    }
    if (startHl) hl = true;
    const n = norm(token);
    let s = forced;
    if (s === undefined) {
      for (let k = ptr; k < Math.min(ptr + 5, VO_WORDS.length); k++) {
        const vw = norm(VO_WORDS[k].w);
        if (vw && n && (vw === n || vw.startsWith(n) || n.startsWith(vw))) {
          s = VO_WORDS[k].s;
          ptr = k + 1;
          break;
        }
      }
    }
    if (s === undefined) s = last + 0.12;
    last = s;
    out.push({ text: token, s, hl });
    if (endHl) hl = false;
  }
  return out;
}

/** Spoken time of the first occurrence of `word` after `hint`. */
export function wordTime(word: string, hint: number) {
  const n = norm(word);
  const w = VO_WORDS.find((x) => x.s >= hint - 0.3 && norm(x.w).startsWith(n));
  return w ? w.s : hint;
}
