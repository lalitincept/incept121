import { Easing, interpolate, spring } from 'remotion';

export const FPS = 30;
export const WIDTH = 3840;
export const HEIGHT = 2160;

/** Seconds of logo sting before the voiceover starts. */
export const VO_OFFSET = 2.5;
/** Voiceover-time (seconds) at which the video ends. */
export const VO_END = 146.6;
export const DURATION = Math.round((VO_END + VO_OFFSET) * FPS);

export const C = {
  bg: '#221F20',
  blue: '#0072CE',
  blueBright: '#2E95F0',
  blueLight: '#8CC6FF',
  blueSoft: '#BFE0FF',
  white: '#FFFFFF',
  text: '#F4F7FB',
  textDim: 'rgba(235,242,250,0.62)',
  glass: 'rgba(255,255,255,0.045)',
  glassBorder: 'rgba(90,170,255,0.55)',
  green: '#2FBF71',
  amber: '#F2A93B',
  red: '#E5484D',
};

export const FONT = "'Inter', 'Inter Display', system-ui, sans-serif";

/** Gradient used for highlighted words (light → brand blue, like the reference series). */
export const HIGHLIGHT_GRADIENT = 'linear-gradient(90deg, #B4DBFF 0%, #74BAFB 45%, #3A9BF2 100%)';

/** Absolute composition frame for a voiceover timestamp (seconds). */
export const at = (voSeconds: number) => Math.round((voSeconds + VO_OFFSET) * FPS);
/** Voiceover time in seconds for an absolute frame. */
export const voTime = (frame: number) => frame / FPS - VO_OFFSET;

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.55, 0, 1, 0.45);
export const EASE_SOFT = Easing.bezier(0.33, 0, 0.2, 1);

/** Interpolate on voiceover seconds with clamping. */
export const tween = (
  t: number,
  t0: number,
  t1: number,
  from = 0,
  to = 1,
  easing: (n: number) => number = EASE_OUT,
) =>
  interpolate(t, [t0, t1], [from, to], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Multi-keyframe interpolation on seconds with clamping and an easing per segment. */
export const keys = (
  t: number,
  times: number[],
  values: number[],
  easing: (n: number) => number = EASE_IN_OUT,
) =>
  interpolate(t, times, values, {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Spring (0→1) starting at a voiceover time. */
export const pop = (
  frame: number,
  voStart: number,
  config: { damping?: number; stiffness?: number; mass?: number } = {},
) =>
  spring({
    frame: frame - at(voStart),
    fps: FPS,
    config: { damping: 16, stiffness: 120, mass: 0.9, ...config },
  });

/** 0→1 in, then 1→0 out — handy for enter/exit envelopes. */
export const envelope = (t: number, tIn: number, tOut: number, inDur = 0.5, outDur = 0.45) =>
  Math.min(tween(t, tIn, tIn + inDur, 0, 1, EASE_OUT), tween(t, tOut, tOut + outDur, 1, 0, EASE_IN));
