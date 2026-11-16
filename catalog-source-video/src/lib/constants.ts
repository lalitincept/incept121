import { useCurrentFrame } from 'remotion';

export const FPS = 30;
export const W = 3840;
export const H = 2160;

/** Seconds of logo sting before the voiceover starts. */
export const VO_OFFSET = 2.5;
/** Voiceover length (seconds). */
export const VO_LENGTH = 155.8;
/** Total composition length in seconds. */
export const TOTAL_SECONDS = 162;
export const TOTAL_FRAMES = Math.round(TOTAL_SECONDS * FPS);

export const C = {
  bg: '#221F20',
  blue: '#0072CE',
  blueLight: '#4BA6EC',
  blueSoft: '#8FC8F5',
  white: '#FFFFFF',
  text: '#F4F6F8',
  muted: 'rgba(244,246,248,0.62)',
  dim: 'rgba(244,246,248,0.38)',
  card: '#2B2829',
  line: 'rgba(255,255,255,0.14)',
};

export const FONT = "'Inter', 'Helvetica Neue', Arial, sans-serif";

/** Frame index for a voiceover timestamp. */
export const vf = (voSeconds: number) => Math.round((voSeconds + VO_OFFSET) * FPS);

/** Current voiceover time in seconds (negative during the logo sting). */
export const useT = () => {
  const frame = useCurrentFrame();
  return frame / FPS - VO_OFFSET;
};
