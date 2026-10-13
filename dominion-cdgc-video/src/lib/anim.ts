import { createContext, useContext } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const prog = (t: number, start: number, dur: number) =>
  dur <= 0 ? (t >= start ? 1 : 0) : clamp((t - start) / dur);

export type Ease = (x: number) => number;
export const E = {
  linear: (x: number) => x,
  inQuad: (x: number) => x * x,
  outQuad: (x: number) => 1 - (1 - x) * (1 - x),
  inCubic: (x: number) => x * x * x,
  outCubic: (x: number) => 1 - Math.pow(1 - x, 3),
  inOutCubic: (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  outQuart: (x: number) => 1 - Math.pow(1 - x, 4),
  inOutQuart: (x: number) => (x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2),
  inOutQuint: (x: number) => (x < 0.5 ? 16 * Math.pow(x, 5) : 1 - Math.pow(-2 * x + 2, 5) / 2),
  outExpo: (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  inOutExpo: (x: number) =>
    x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
  inOutSine: (x: number) => -(Math.cos(Math.PI * x) - 1) / 2,
  outBack: (x: number) => {
    const c1 = 1.5;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  },
};

/** Damped spring step response (0 → 1) in seconds. */
export const spring = (t: number, start: number, freq = 1.7, zeta = 0.52) => {
  const x = t - start;
  if (x <= 0) return 0;
  const w = 2 * Math.PI * freq;
  const wd = w * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * w * x) * (Math.cos(wd * x) + ((zeta * w) / wd) * Math.sin(wd * x));
};

/** In / out envelope (0..1). */
export const env = (
  t: number,
  inAt: number,
  outAt = Infinity,
  dIn = 0.5,
  dOut = 0.45,
  eIn: Ease = E.outCubic,
  eOut: Ease = E.inCubic,
) => Math.min(eIn(prog(t, inAt, dIn)), 1 - eOut(prog(t, outAt, dOut)));

/** Smooth 0→1→0 bump with zero velocity at both ends. */
export const bump = (t: number, t0: number, t1: number) => {
  const p = prog(t, t0, t1 - t0);
  return (1 - Math.cos(2 * Math.PI * p)) / 2;
};

/** Overrides the clock for motion-blur sub-frame samples; null = use the current frame. */
export const TimeCtx = createContext<number | null>(null);
/** Index of the motion-blur sample being rendered (keeps SVG ids unique per sample). */
export const SampleCtx = createContext(0);

export const useT = () => {
  const override = useContext(TimeCtx);
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return override ?? f / fps;
};

// Cubic bezier helpers so paths can be both drawn and sampled.
export type Pt = [number, number];
export type Cubic = [Pt, Pt, Pt, Pt];
export const cubicD = (c: Cubic) =>
  `M${c[0][0]} ${c[0][1]} C${c[1][0]} ${c[1][1]} ${c[2][0]} ${c[2][1]} ${c[3][0]} ${c[3][1]}`;
export const cubicAt = (c: Cubic, u: number): Pt => {
  const v = 1 - u;
  const a = v * v * v;
  const b = 3 * v * v * u;
  const d = 3 * v * u * u;
  const e = u * u * u;
  return [
    a * c[0][0] + b * c[1][0] + d * c[2][0] + e * c[3][0],
    a * c[0][1] + b * c[1][1] + d * c[2][1] + e * c[3][1],
  ];
};
export const line = (a: Pt, b: Pt): Cubic => [
  a,
  [lerp(a[0], b[0], 1 / 3), lerp(a[1], b[1], 1 / 3)],
  [lerp(a[0], b[0], 2 / 3), lerp(a[1], b[1], 2 / 3)],
  b,
];
