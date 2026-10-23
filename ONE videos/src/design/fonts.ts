import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fonts ship in public/fonts so renders look identical on every machine.
// loadFont() holds the render until each face is ready.
const faces = [
  {family: 'Inter Tight', file: 'inter-tight-latin-400-normal.woff2', weight: '400'},
  {family: 'Inter Tight', file: 'inter-tight-latin-500-normal.woff2', weight: '500'},
  {family: 'Inter Tight', file: 'inter-tight-latin-600-normal.woff2', weight: '600'},
  {family: 'Inter Tight', file: 'inter-tight-latin-700-normal.woff2', weight: '700'},
  {family: 'Instrument Serif', file: 'instrument-serif-latin-400-normal.woff2', weight: '400'},
  {family: 'Instrument Serif', file: 'instrument-serif-latin-400-italic.woff2', weight: '400', style: 'italic'},
  {family: 'JetBrains Mono', file: 'jetbrains-mono-latin-400-normal.woff2', weight: '400'},
  {family: 'JetBrains Mono', file: 'jetbrains-mono-latin-500-normal.woff2', weight: '500'},
];

export const loadFonts = () =>
  Promise.all(
    faces.map((f) =>
      loadFont({
        family: f.family,
        url: staticFile(`fonts/${f.file}`),
        weight: f.weight,
        style: f.style ?? 'normal',
      }),
    ),
  );
