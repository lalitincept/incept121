import {Easing, staticFile} from 'remotion';

export const W = 1920;
export const H = 1080;
export const FPS = 30;

export const C = {
  bg: '#221F20',
  blue: '#0072CE',
  blueLight: '#5AA9EA',
  blueSoft: '#9CCBF2',
  blueDeep: '#004C8C',
  white: '#FFFFFF',
  text: '#F4F6F9',
  muted: 'rgba(255,255,255,0.62)',
  faint: 'rgba(255,255,255,0.14)',
  line: 'rgba(255,255,255,0.22)',
  panel: 'rgba(255,255,255,0.045)',
  panelBorder: 'rgba(255,255,255,0.10)',
  danger: '#E46A6A',
  ok: '#5AC48A',
};

export const FONT = 'Inter, "Segoe UI", system-ui, sans-serif';

export const fontFace = `
@font-face {
  font-family: 'Inter';
  src: url('${staticFile('fonts/Inter-latin-var.woff2')}') format('woff2');
  font-weight: 100 900;
  font-style: normal;
}`;

// Easing vocabulary used everywhere so the whole film shares one motion feel.
export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo-ish out, for entrances
  inOut: Easing.bezier(0.65, 0, 0.35, 1), // camera moves
  in: Easing.bezier(0.7, 0, 0.84, 0), // exits
  soft: Easing.bezier(0.33, 1, 0.68, 1),
};

export const TEXT_GRADIENT = 'linear-gradient(92deg, #FFFFFF 0%, #CFE5FA 30%, #7DB9EE 65%, #2F8EE0 100%)';
export const BLUE_GRADIENT = 'linear-gradient(92deg, #A9D3F7 0%, #5AA9EA 45%, #1C82D9 100%)';
