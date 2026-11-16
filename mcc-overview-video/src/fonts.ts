import { continueRender, delayRender, staticFile } from 'remotion';

const WEIGHTS = [300, 400, 500, 600, 700, 800];

let loaded = false;

export const loadFonts = () => {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  const handle = delayRender('Loading Inter');
  Promise.all(
    WEIGHTS.map((w) => {
      const face = new FontFace(
        'Inter',
        `url(${staticFile(`fonts/inter-latin-${w}-normal.woff2`)}) format('woff2')`,
        { weight: String(w), style: 'normal' },
      );
      return face.load().then((f) => {
        (document.fonts as unknown as { add: (f: FontFace) => void }).add(f);
      });
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};
