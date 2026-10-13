import { bump, E, Ease, prog } from './anim';
import { ti, tc, O, END_AT, TOTAL, W, H } from '../timing';

export type Cam = { x: number; y: number; z: number; r: number };

type Move = { t0: number; t1: number; x?: number; y?: number; z?: number; r?: number; e?: Ease };
type Bump = { t0: number; t1: number; z?: number; r?: number; x?: number; y?: number };

const START: Cam = { x: O.title[0], y: O.title[1], z: 0.9, r: 0 };

// Absolute targets per channel; each move eases from the previous target of that channel.
const MOVES: Move[] = [
  // Title: slow push in, then glide to S1
  { t0: 0, t1: 3.2, z: 1.0, e: E.outCubic },
  { t0: 2.5, t1: 4.0, x: O.s1[0], y: O.s1[1], e: E.inOutCubic },
  { t0: ti(0.4), t1: ti(4.5), z: 1.05, e: E.inOutSine },
  // S1 beat C — pull back to reveal the enterprise landscape
  { t0: ti(4.75), t1: ti(6.7), x: O.s1[0] + 900, y: O.s1[1], z: 0.62, e: E.inOutCubic },
  // → S2
  { t0: ti(7.45), t1: ti(8.95), x: O.s2[0], y: O.s2[1], z: 1.0, e: E.inOutCubic },
  { t0: ti(8.9), t1: ti(15.9), z: 1.06, e: E.inOutSine },
  { t0: ti(10.2), t1: ti(11.9), r: -1.3, e: E.inOutSine },
  { t0: ti(12.6), t1: ti(13.9), r: 0, e: E.inOutSine },
  // → S3, then "step outside" the glossary into Business Data
  { t0: ti(15.95), t1: ti(17.4), x: O.s3[0], y: O.s3[1], z: 0.95, e: E.inOutCubic },
  { t0: ti(18.3), t1: ti(20.1), x: O.s3[0] + 900, z: 1.12, e: E.inOutCubic },
  { t0: ti(20.6), t1: ti(24.3), z: 1.2, e: E.inOutSine },
  // → S4 (learning cards), follow the active card
  { t0: ti(24.3), t1: ti(25.85), x: O.s4[0] - 150, y: O.s4[1], z: 0.96, e: E.inOutCubic },
  { t0: ti(30.25), t1: ti(31.3), x: O.s4[0], e: E.inOutCubic },
  { t0: ti(31.95), t1: ti(33.0), x: O.s4[0] + 150, e: E.inOutCubic },
  { t0: ti(34.1), t1: ti(35.7), x: O.s4[0], y: O.s4[1] - 60, z: 0.92, e: E.inOutCubic },
  // Bridge → S5 (conclusion)
  { t0: ti(35.75), t1: tc(187.45), x: O.s5[0], y: O.s5[1], z: 1.0, e: E.inOutQuart },
  { t0: tc(187.45), t1: tc(193.2), z: 1.04, e: E.inOutSine },
  { t0: tc(193.25), t1: tc(194.5), x: O.s5[0] + 220, e: E.inOutCubic },
  { t0: tc(194.5), t1: tc(198.7), z: 1.08, e: E.inOutSine },
  // → S6
  { t0: tc(198.6), t1: tc(200.0), x: O.s6[0], y: O.s6[1], z: 1.0, e: E.inOutCubic },
  { t0: tc(200.0), t1: tc(205.9), z: 1.045, e: E.inOutSine },
  // → End card
  { t0: END_AT - 0.35, t1: END_AT + 1.55, x: O.end[0], y: O.end[1], z: 1.0, e: E.inOutCubic },
  { t0: END_AT + 1.55, t1: TOTAL, z: 1.05, e: E.inOutSine },
];

// Zoom "lifts" and rolls layered on top of moves — returns to zero, so they never drift.
const BUMPS: Bump[] = [
  { t0: 2.5, t1: 4.0, z: 0.9, r: 0.8 },
  { t0: ti(7.45), t1: ti(8.95), z: 0.85, r: -0.9 },
  { t0: ti(15.95), t1: ti(17.4), z: 0.9, r: 1.0 },
  { t0: ti(24.3), t1: ti(25.85), z: 0.78, r: -1.2 },
  { t0: ti(35.75), t1: tc(187.45), z: 0.5, r: 1.6 },
  { t0: tc(198.6), t1: tc(200.0), z: 0.9, r: -0.8 },
  { t0: END_AT - 0.35, t1: END_AT + 1.55, z: 0.66, r: 1.0 },
];

export const cameraAt = (t: number): Cam => {
  let x = START.x;
  let y = START.y;
  let lz = Math.log(START.z);
  let r = START.r;
  const last = { x: START.x, y: START.y, z: Math.log(START.z), r: START.r };
  for (const m of MOVES) {
    const k = (m.e ?? E.inOutCubic)(prog(t, m.t0, m.t1 - m.t0));
    if (m.x !== undefined) {
      x += (m.x - last.x) * k;
      last.x = m.x;
    }
    if (m.y !== undefined) {
      y += (m.y - last.y) * k;
      last.y = m.y;
    }
    if (m.z !== undefined) {
      const lzt = Math.log(m.z);
      lz += (lzt - last.z) * k;
      last.z = lzt;
    }
    if (m.r !== undefined) {
      r += (m.r - last.r) * k;
      last.r = m.r;
    }
  }
  for (const b of BUMPS) {
    const k = bump(t, b.t0, b.t1);
    if (b.z !== undefined) lz += Math.log(b.z) * k;
    if (b.r !== undefined) r += b.r * k;
    if (b.x !== undefined) x += b.x * k;
    if (b.y !== undefined) y += b.y * k;
  }
  // Gentle hand-held float so holds never feel frozen.
  x += 9 * Math.sin((2 * Math.PI * t) / 9.5);
  y += 7 * Math.sin((2 * Math.PI * t) / 12.3 + 1.1);
  r += 0.1 * Math.sin((2 * Math.PI * t) / 14.7 + 0.4);
  return { x, y, z: Math.exp(lz), r };
};

/** Approximate on-screen motion (px per frame) caused by the camera around time t. */
export const cameraSpeedPx = (t: number, fps: number) => {
  const a = cameraAt(t - 0.5 / fps);
  const b = cameraAt(t + 0.5 / fps);
  const z = (a.z + b.z) / 2;
  const half = Math.hypot(W, H) / 2;
  const pan = Math.hypot(b.x - a.x, b.y - a.y) * z;
  const zoom = Math.abs(Math.log(b.z / a.z)) * half;
  const rot = ((Math.abs(b.r - a.r) * Math.PI) / 180) * half;
  return pan + zoom + rot;
};
