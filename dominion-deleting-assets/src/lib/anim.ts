import {Easing} from 'remotion';

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export const ease = {
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  // Long, soft camera glide.
  glide: Easing.bezier(0.45, 0, 0.15, 1),
  out: Easing.bezier(0.16, 1, 0.3, 1),
  outSoft: Easing.bezier(0.33, 1, 0.68, 1),
  in: Easing.bezier(0.55, 0, 0.9, 0.4),
  outBack: Easing.bezier(0.34, 1.45, 0.64, 1),
};

/** Eased 0..1 progress of a segment starting at `start` lasting `dur` seconds. */
export const prog = (t: number, start: number, dur: number, e: (x: number) => number = ease.out) =>
  e(clamp01((t - start) / dur));

/** Piecewise keyframes [time, value]; each segment eased independently. */
export function kf(t: number, keys: [number, number][], e: (x: number) => number = ease.inOut) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i];
    const [t1, v1] = keys[i + 1];
    if (t <= t1) return lerp(v0, v1, e(clamp01((t - t0) / (t1 - t0))));
  }
  return keys[keys.length - 1][1];
}

export type Cam = {x: number; y: number; s: number; r?: number};
export type CamKey = {t: number; x: number; y: number; s: number; r?: number; e?: (x: number) => number};

/** Camera keyframes. Each key's easing controls the move arriving at that key. */
export function camAt(t: number, keys: CamKey[]): Cam {
  if (t <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t <= b.t) {
      const p = (b.e ?? ease.glide)(clamp01((t - a.t) / (b.t - a.t)));
      return {x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), s: lerp(a.s, b.s, p), r: lerp(a.r ?? 0, b.r ?? 0, p)};
    }
  }
  return keys[keys.length - 1];
}

/** Numeric camera speed (world px per second at screen scale) for motion-blur amounts. */
export function camSpeed(t: number, keys: CamKey[]) {
  const dt = 1 / 30;
  const a = camAt(t - dt, keys);
  const b = camAt(t + dt, keys);
  return {
    vx: ((b.x - a.x) / (2 * dt)) * b.s,
    vy: ((b.y - a.y) / (2 * dt)) * b.s,
    vs: (b.s - a.s) / (2 * dt),
  };
}

const hexToRgb = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Sample a multi-stop hex gradient at f in 0..1. */
export function sampleGradient(stops: string[], f: number) {
  const x = clamp01(f) * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(x));
  const p = x - i;
  const a = hexToRgb(stops[i]);
  const b = hexToRgb(stops[i + 1]);
  const c = a.map((v, k) => Math.round(lerp(v, b[k], p)));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

/** Deterministic pseudo-random in 0..1 from an integer seed. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
