import { continueRender, delayRender, staticFile } from 'remotion';

const WEIGHTS = [400, 500, 600, 700, 800];
let started = false;

export function loadFonts() {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('Loading Inter');
  Promise.all(
    WEIGHTS.map((w) => {
      const face = new FontFace('Inter', `url(${staticFile(`fonts/inter-latin-${w}-normal.woff2`)}) format('woff2')`, {
        weight: String(w),
        style: 'normal',
      });
      return face.load().then((f) => {
        document.fonts.add(f);
      });
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
}
