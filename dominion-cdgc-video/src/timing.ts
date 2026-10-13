// All times are in seconds on the final (edited) timeline unless noted.
export const FPS = 30;
export const W = 3840;
export const H = 2160;

// Voiceover edit — only the Intro and Conclusion of the script are used.
// Intro  = source 0.00s → 35.95s
// Conclusion = source 186.98s → 206.40s (tagline that follows is excluded)
export const INTRO_VO_AT = 3.2;
export const INTRO_VO_DUR = 35.95;
export const GAP = 1.95;
export const CONC_SRC0 = 186.98;
export const CONC_VO_AT = INTRO_VO_AT + INTRO_VO_DUR + GAP; // 41.10
export const CONC_VO_DUR = 19.42;
export const END_AT = CONC_VO_AT + CONC_VO_DUR; // 60.52
export const TOTAL = END_AT + 5.0;

/** Intro source time (word timestamp in the original VO) → timeline time */
export const ti = (src: number) => INTRO_VO_AT + src;
/** Conclusion source time (word timestamp in the original VO) → timeline time */
export const tc = (src: number) => CONC_VO_AT + (src - CONC_SRC0);

// World-space origins of each scene (px, 4K canvas units).
export const O = {
  title: [0, 0],
  s1: [4800, 0],
  s2: [5700, 3500],
  s3: [10500, 3500],
  s4: [12400, 7400],
  s5: [17400, 9400],
  s6: [21800, 9400],
  end: [26400, 9400],
} as const;
