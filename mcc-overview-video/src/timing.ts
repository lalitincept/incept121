// Timeline + voiceover sync.
//
// The voiceover is split (at true digital silence) into chunks so that
// breathing room can be inserted for the title and the chapter cards.
// Every visual beat is keyed to the ORIGINAL voiceover word time and
// converted with `vo()` so the picture always lands on the spoken word.

export const FPS = 30;
export const WIDTH = 3840;
export const HEIGHT = 2160;

export type VoChunk = {
  id: string;
  from: number; // original VO seconds (inclusive)
  to: number; // original VO seconds (exclusive)
  offset: number; // seconds added on the output timeline
};

export const VO_CHUNKS: VoChunk[] = [
  { id: 'title', from: 0.0, to: 5.85, offset: 3.4 },
  { id: 'intro', from: 5.85, to: 41.9, offset: 4.2 },
  { id: 'part1', from: 41.9, to: 86.6, offset: 6.1 },
  { id: 'part2', from: 86.6, to: 124.1, offset: 8.0 },
  { id: 'part3', from: 124.1, to: 152.0, offset: 9.9 },
  { id: 'conclusion', from: 152.0, to: 166.4, offset: 10.9 },
  { id: 'tagline', from: 166.4, to: 171.65, offset: 11.6 },
];

/** Original VO time (s) -> output time (s). */
export const vo = (orig: number): number => {
  for (const c of VO_CHUNKS) {
    if (orig >= c.from && orig < c.to) return orig + c.offset;
  }
  const last = VO_CHUNKS[VO_CHUNKS.length - 1];
  return orig + last.offset;
};

/** Original VO time (s) -> output frame. */
export const voF = (orig: number): number => Math.round(vo(orig) * FPS);

/** Output seconds -> frames. */
export const s2f = (sec: number): number => Math.round(sec * FPS);

export const TOTAL_SECONDS = 187.5;
export const DURATION = s2f(TOTAL_SECONDS);

// Scene windows on the OUTPUT timeline (seconds). Adjacent scenes overlap
// so that exits and entrances can cross-dissolve / push through each other.
export const SCENES = {
  logo: [0, 4.0],
  title: [3.2, 10.6],
  question: [10.0, 16.3],
  engine: [15.9, 29.4],
  metaDef: [28.9, 34.1],
  billAmount: [33.6, 42.2],
  scale: [41.7, 46.4],
  ch1: [45.8, 48.9],
  dataStays: [48.3, 57.9],
  explore: [57.5, 80.0],
  sources: [79.5, 93.0],
  ch2: [92.4, 95.3],
  access: [94.6, 121.2],
  missing: [120.8, 132.6],
  ch3: [131.9, 134.7],
  steward: [134.1, 144.2],
  trace: [143.8, 152.4],
  jobs: [151.9, 162.8],
  conclusion: [162.3, 178.2],
  tagline: [177.7, 187.5],
} as const;

export type SceneId = keyof typeof SCENES;

export const sceneStart = (id: SceneId): number => s2f(SCENES[id][0]);
export const sceneDur = (id: SceneId): number =>
  s2f(SCENES[id][1]) - s2f(SCENES[id][0]);

/**
 * Local-frame helper for a scene: converts an ORIGINAL VO time (s) into a
 * frame number relative to the scene start.
 */
export const at = (id: SceneId) => (orig: number): number =>
  voF(orig) - sceneStart(id);

/** Local-frame helper for OUTPUT seconds relative to a scene. */
export const atOut = (id: SceneId) => (sec: number): number =>
  s2f(sec) - sceneStart(id);
