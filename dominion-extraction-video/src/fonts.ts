import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import { continueRender, delayRender } from 'remotion';

// Block rendering until every Inter weight is loaded so no frame renders with a fallback font.
const handle = delayRender('Loading Inter');
const weights = [300, 400, 500, 600, 700, 800];
Promise.all(weights.map((w) => document.fonts.load(`${w} 100px Inter`)))
  .then(() => document.fonts.ready)
  .then(() => continueRender(handle))
  .catch(() => continueRender(handle));
