import {Easing, interpolate} from 'remotion';

// A small, deliberate set of curves. Nothing in the system moves linearly.
export const ease = {
  // Fast start, long settle. The default for anything arriving on screen.
  out: Easing.bezier(0.16, 1, 0.3, 1),
  // Gentler arrival for large surfaces and body copy.
  outSoft: Easing.bezier(0.25, 1, 0.5, 1),
  // Slow start, fast finish. For things leaving.
  in: Easing.bezier(0.7, 0, 0.84, 0),
  // Hard in-out for transitions and wipes: the cut hides in the fast middle.
  inOut: Easing.bezier(0.83, 0, 0.17, 1),
  inOutSoft: Easing.bezier(0.65, 0, 0.35, 1),
  // Small overshoot for pops and accents.
  overshoot: Easing.bezier(0.34, 1.56, 0.64, 1),
};

// 0 → 1 progress of an animation that starts at `start` and lasts `duration` frames.
export const tween = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = ease.out,
) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// Map a 0 → 1 progress onto any range.
export const mix = (p: number, from: number, to: number) => from + (to - from) * p;
