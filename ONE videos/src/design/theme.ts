// One place for the look. Swap these values to re-skin every scene.

export const color = {
  bg: '#0B0B0C',
  bgRaised: '#17171A',
  fg: '#F3F0E8',
  fgMuted: 'rgba(243, 240, 232, 0.58)',
  fgFaint: 'rgba(243, 240, 232, 0.16)',
  fgGhost: 'rgba(243, 240, 232, 0.06)',
  accent: '#FF5B22',
  // Text that sits on top of the accent colour.
  onAccent: '#0B0B0C',
  // The two light pools that drift behind everything.
  glowWarm: 'rgba(255, 91, 34, 0.20)',
  glowCool: 'rgba(84, 96, 255, 0.16)',
};

export const font = {
  display: '"Inter Tight", system-ui, sans-serif',
  serif: '"Instrument Serif", Georgia, serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};

// Sizes in px at 1080p. Multiply by `u` from useLayout() so other sizes scale.
export const type = {
  hero: 188,
  h1: 132,
  h2: 92,
  h3: 60,
  body: 40,
  label: 21,
};

// Tight tracking for big display type, open tracking for small caps labels.
export const tracking = {
  display: '-0.045em',
  heading: '-0.03em',
  label: '0.22em',
};
