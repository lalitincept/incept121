import { Easing, interpolate } from 'remotion';

export const E = {
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  outQuint: Easing.bezier(0.22, 1, 0.36, 1),
  outCubic: Easing.bezier(0.33, 1, 0.68, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  inOutSoft: Easing.bezier(0.45, 0, 0.25, 1),
  inCubic: Easing.bezier(0.32, 0, 0.67, 0),
  inExpo: Easing.bezier(0.7, 0, 0.84, 0),
  outBack: Easing.bezier(0.34, 1.45, 0.64, 1),
  linear: (t: number) => t,
};

/** 0..1 progress between [start, start+dur] with easing (clamped). */
export const prog = (
  frame: number,
  start: number,
  dur: number,
  ease: (t: number) => number = E.outExpo,
): number => {
  if (dur <= 0) return frame >= start ? 1 : 0;
  return interpolate(frame, [start, start + dur], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Smooth keyframe interpolation over arbitrary numeric keys. */
export type Key = { f: number; [k: string]: number };

export const keyed = (
  frame: number,
  keys: Key[],
  prop: string,
  ease: (t: number) => number = E.inOut,
): number => {
  if (keys.length === 0) return 0;
  if (frame <= keys[0].f) return keys[0][prop];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame >= a.f && frame <= b.f) {
      const t = b.f === a.f ? 1 : (frame - a.f) / (b.f - a.f);
      return lerp(a[prop], b[prop], ease(t));
    }
  }
  return keys[keys.length - 1][prop];
};

/** In/out envelope: 0 -> 1 (in) ... 1 -> 0 (out). */
export const envelope = (
  frame: number,
  inStart: number,
  inDur: number,
  outStart: number,
  outDur: number,
  easeIn = E.outExpo,
  easeOut = E.inCubic,
) => {
  const a = prog(frame, inStart, inDur, easeIn);
  const b = 1 - prog(frame, outStart, outDur, easeOut);
  return Math.min(a, b);
};

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
