// How a shot arrives from the one before it.
//   cut   hard cut on the beat
//   push  content lifts away out of focus, the next rises in (default)
//   wipe  a slanted panel sweeps across with an accent edge
//   zoom  fly through the old shot into the new one
//   iris  the new shot opens from the centre behind an accent ring
export type TransitionName = 'cut' | 'push' | 'wipe' | 'zoom' | 'iris';

// Scene templates. In any text field, *words* become the emphasis voice
// (italic serif, accent colour) and \n forces a line break.
export type SceneSpec =
  | {type: 'title'; kicker?: string; title: string; sub?: string}
  | {type: 'statement'; kicker?: string; text: string}
  | {
      type: 'stat';
      kicker?: string;
      value: number;
      decimals?: number;
      prefix?: string;
      suffix?: string;
      label: string;
      note?: string;
      // How much of the tick meter lights up, 0 to 1.
      fill?: number;
    }
  | {type: 'list'; kicker?: string; title: string; items: string[]}
  | {type: 'quote'; quote: string; author: string; role?: string}
  | {type: 'end'; title: string; line?: string; cta?: string};

export type Shot = SceneSpec & {
  // Shot length in seconds, including the transition into it.
  seconds: number;
  transition?: TransitionName;
};

export type Settings = {
  fps: number;
  // Small text in the top-left of the frame overlay.
  title: string;
  // Frame overlay: corner marks, shot counter, progress line.
  chrome: boolean;
  // Audio files inside public/, for example 'audio/music.mp3'.
  music?: string;
  voiceover?: string;
};
