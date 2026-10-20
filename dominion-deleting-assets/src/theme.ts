import {continueRender, delayRender, staticFile} from 'remotion';

// Fonts ship with the project (OFL-licensed Inter + JetBrains Mono, latin variable files)
// so renders never depend on network access.
export const FONT = 'Inter';
export const MONO = 'JetBrains Mono';

const faces: [string, string, string][] = [
  [FONT, 'fonts/Inter-latin-var.woff2', '100 900'],
  [MONO, 'fonts/JetBrainsMono-latin-var.woff2', '100 800'],
];

if (typeof document !== 'undefined') {
  const handle = delayRender('Loading fonts');
  Promise.all(
    faces.map(([family, file, weight]) => {
      const face = new FontFace(family, `url(${staticFile(file)}) format('woff2')`, {weight});
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}

export const C = {
  bg: '#221F20',
  blue: '#0072CE',
  ring: '#8CC3F0',
  line: 'rgba(140,195,240,0.55)',
  white: '#FFFFFF',
  text: '#F4F6F8',
  dim: '#AEB8C2',
  eyebrow: '#7DB9EE',
};

// Highlight gradient for kinetic text: brand blue easing into a pale tint.
export const HL = ['#2A8AE2', '#78B6EE', '#D6EBFB'];
