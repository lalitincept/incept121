import {interpolate, spring} from 'remotion';
import {E, FPS} from './theme';

type EaseFn = (t: number) => number;

/** clamp-interpolate frame between [a,b] -> [from,to] with easing */
export const tween = (frame: number, a: number, b: number, from = 0, to = 1, ease: EaseFn = E.out) =>
  interpolate(frame, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

/** in/out envelope: 0 before a, ramps to 1 over inDur, holds, ramps to 0 ending at b */
export const env = (frame: number, a: number, b: number, inDur = 12, outDur = 10, easeIn: EaseFn = E.out, easeOut: EaseFn = E.in) => {
  if (frame < a || frame > b) return 0;
  const i = tween(frame, a, a + inDur, 0, 1, easeIn);
  const o = 1 - tween(frame, b - outDur, b, 0, 1, easeOut);
  return Math.min(i, o);
};

export const pop = (frame: number, start: number, damping = 14, mass = 0.7, stiffness = 120) =>
  spring({frame: frame - start, fps: FPS, config: {damping, mass, stiffness}});

/** keyframed value with per-segment easing. keys: [frame, value][] */
export const keys = (frame: number, ks: [number, number][], ease: EaseFn = E.inOut) => {
  if (frame <= ks[0][0]) return ks[0][1];
  for (let i = 0; i < ks.length - 1; i++) {
    const [fa, va] = ks[i];
    const [fb, vb] = ks[i + 1];
    if (frame <= fb) return interpolate(frame, [fa, fb], [va, vb], {easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  }
  return ks[ks.length - 1][1];
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** deterministic pseudo random */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
