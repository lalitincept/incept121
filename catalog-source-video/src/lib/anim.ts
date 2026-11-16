import { Easing, spring } from 'remotion';
import { FPS } from './constants';

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo-like out
  outSoft: Easing.bezier(0.22, 1, 0.36, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  inOutSoft: Easing.bezier(0.45, 0, 0.25, 1),
  in: Easing.bezier(0.55, 0, 1, 0.45),
  linear: (x: number) => x,
};

/** 0→1 progress starting at t0 over dur seconds. */
export const ramp = (t: number, t0: number, dur: number, fn: (x: number) => number = ease.out) =>
  fn(clamp((t - t0) / Math.max(dur, 1e-6)));

/** Fade-in at a, hold, fade-out ending at b. */
export const window = (t: number, a: number, b: number, inDur = 0.5, outDur = 0.5) =>
  Math.min(ramp(t, a, inDur, ease.outSoft), 1 - ramp(t, b - outDur, outDur, ease.inOutSoft));

/** Spring progress (0→1 with natural overshoot) started at t0 (seconds). */
export const pop = (t: number, t0: number, damping = 14, stiffness = 120, mass = 0.9) =>
  t < t0
    ? 0
    : spring({ frame: (t - t0) * FPS, fps: FPS, config: { damping, stiffness, mass } });

/** Interpolate keyframes {t, ...numbers} with eased segments (holds when equal). */
export type Key = { t: number } & Record<string, number>;
export function keyframes<K extends Key>(
  t: number,
  keys: K[],
  fn: (x: number) => number = ease.inOut,
): Omit<K, 't'> {
  if (t <= keys[0].t) return { ...keys[0] };
  const last = keys[keys.length - 1];
  if (t >= last.t) return { ...last };
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1].t <= t) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const p = fn(clamp((t - a.t) / (b.t - a.t)));
  const out: Record<string, number> = {};
  for (const k of Object.keys(a)) {
    if (k === 't') continue;
    const av = a[k] as number;
    const bv = (b[k] ?? av) as number;
    // zoom-like keys interpolate in log space for perceptual smoothness
    if ((k === 'z' || k === 's') && av > 0 && bv > 0) {
      out[k] = Math.exp(lerp(Math.log(av), Math.log(bv), p));
    } else {
      out[k] = lerp(av, bv, p);
    }
  }
  return out as Omit<K, 't'>;
}

/** Piecewise-linear map (for time remapping). */
export function piecewise(x: number, pts: [number, number][]) {
  if (x <= pts[0][0]) return pts[0][1] + (x - pts[0][0]);
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  const [xl, yl] = pts[pts.length - 1];
  return yl + (x - xl);
}

/** Small deterministic noise for organic drift. */
export const drift = (t: number, seed = 0, amp = 1) =>
  amp * (Math.sin(t * 0.37 + seed * 1.7) * 0.6 + Math.sin(t * 0.61 + seed * 3.1) * 0.4);
