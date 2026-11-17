import timeline from '../data/timeline.json';
import {FPS} from './theme';

export type Piece = {type: 'play' | 'freeze'; srcA: number; srcB: number; from: number; to: number; speed: number};
export type Shot = {
  id: string;
  crop: 'web' | 'xl';
  src: string;
  from: number;
  to: number;
  srcW: number;
  srcH: number;
  cropX: number;
  width: number;
  height: number;
  pieces: Piece[];
};

export const TL = timeline as unknown as {
  fps: number;
  durationInFrames: number;
  lead: number;
  cuts: {at: number; gap: number}[];
  shots: Shot[];
};

/** seconds -> frames */
export const f = (s: number) => Math.round(s * FPS);

/** original voiceover time (seconds) -> final timeline time (seconds) */
export const V = (t: number) => {
  let off = TL.lead;
  for (const c of TL.cuts) if (t >= c.at) off += c.gap;
  return t + off;
};

/** original voiceover time -> final frame */
export const VF = (t: number) => f(V(t));

export const shotById = (id: string) => {
  const s = TL.shots.find((x) => x.id === id);
  if (!s) throw new Error('missing shot ' + id);
  return s;
};

/** global frame at which a given source-recording moment appears in a shot */
export const srcFrame = (shotId: string, srcT: number) => {
  const s = shotById(shotId);
  for (const p of s.pieces) {
    if (p.type === 'play' && srcT >= p.srcA - 1e-6 && srcT <= p.srcB + 1e-6) {
      return p.from + (srcT - p.srcA) / p.speed * FPS;
    }
    if (p.type === 'freeze' && Math.abs(srcT - p.srcA) < 1e-3) return p.from;
  }
  throw new Error(`src time ${srcT} not in shot ${shotId}`);
};
