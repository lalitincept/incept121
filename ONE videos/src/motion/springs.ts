import type {SpringConfig} from 'remotion';

// Spring presets for things that should feel physical rather than timed.
export const springs = {
  // Critically damped: no bounce, natural settle.
  smooth: {damping: 200} satisfies Partial<SpringConfig>,
  // Quick with a whisper of overshoot.
  snappy: {damping: 18, stiffness: 190, mass: 0.7} satisfies Partial<SpringConfig>,
  // Visible bounce for dots, badges and small accents.
  pop: {damping: 10, stiffness: 170, mass: 0.6} satisfies Partial<SpringConfig>,
};
