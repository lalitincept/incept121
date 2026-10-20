// Master timeline (seconds). Scene choreography inside each scene is keyed to
// voiceover-relative time, taken from word-level timestamps of the VO.
export const FPS = 30;
export const WIDTH = 3840;
export const HEIGHT = 2160;

// Opening logo + title card run before the VO.
export const LOGO_START = 0;
export const TITLE_START = 3.2;

// Intro VO: source 0.00s - 45.20s of the master voiceover.
export const INTRO = 8.6;
export const INTRO_LEN = 45.2;

// Conclusion VO: source 148.45s - 162.45s of the master voiceover (tagline excluded).
export const CONC = 54.4;
export const CONC_LEN = 14.0;

export const OUTRO = 68.2;
export const TOTAL = 74.0;
export const TOTAL_FRAMES = Math.round(TOTAL * FPS);

export const sec = (s: number) => Math.round(s * FPS);
