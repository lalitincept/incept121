import { Easing, interpolate } from "remotion";

// ── Canvas ────────────────────────────────────────────────────────────────
export const W = 3840;
export const H = 2160;
export const FPS = 30;

// Voice-over starts after the logo sting. All scene timing is authored in
// voice-over seconds (taken from word-level timestamps) and converted here.
export const VO_OFFSET = 2.0;
export const VO_DURATION = 147.644;
export const TOTAL_SECONDS = 153.7;
export const TOTAL_FRAMES = Math.round(TOTAL_SECONDS * FPS);

/** Absolute composition frame for a voice-over timestamp (seconds). */
export const F = (voSec: number) => Math.round((voSec + VO_OFFSET) * FPS);
/** Voice-over seconds for an absolute composition frame. */
export const voAt = (frame: number) => frame / FPS - VO_OFFSET;

// ── Brand ─────────────────────────────────────────────────────────────────
export const C = {
  bg: "#221F20",
  bgDeep: "#1A1819",
  blue: "#0072CE",
  blueBright: "#1B8AE6",
  blueLight: "#6FB4F2",
  blueIce: "#C9E4FB",
  white: "#FFFFFF",
  text: "#F4F6F8",
  muted: "#A9AEB5",
  glass: "rgba(34, 31, 32, 0.72)",
  glassBorder: "rgba(255,255,255,0.14)",
  // MCC status badge palette (as seen in the product UI)
  starting: "#4FB0BC",
  running: "#2C8FB8",
  completed: "#4E9A3A",
  failed: "#C8282E",
};

export const FONT = "Inter";

// Gradient used for emphasised words (white → ice blue → brand blue)
export const HL_GRADIENT =
  "linear-gradient(92deg, #D6ECFF 0%, #7DBDF4 45%, #2E93E8 100%)";

// ── Easing ────────────────────────────────────────────────────────────────
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeSoft = Easing.bezier(0.45, 0, 0.25, 1);

/** 0→1 progress between two frames with easing, clamped. */
export const prog = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = easeOut,
) =>
  interpolate(frame, [start, start + Math.max(1, duration)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Enter/exit envelope: rises over `inDur` from `a`, falls over `outDur` ending at `b`. */
export const envelope = (
  frame: number,
  a: number,
  b: number,
  inDur = 16,
  outDur = 14,
) => {
  const i = prog(frame, a, inDur, easeOut);
  const o = prog(frame, b - outDur, outDur, easeIn);
  return { i, o, v: i * (1 - o) };
};
