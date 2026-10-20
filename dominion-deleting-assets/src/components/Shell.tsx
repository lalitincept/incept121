import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, ease, lerp} from '../lib/anim';

export type Move = 'fade' | 'zoomIn' | 'zoomThrough' | 'zoomOut' | 'fromBig' | 'slideLeft' | 'up';

type Props = {
  t: number;
  /** Scene window [a, b] in the scene's own time base. */
  a: number;
  b: number;
  enter?: Move;
  exit?: Move;
  enterDur?: number;
  exitDur?: number;
  children: React.ReactNode;
};

const pose = (move: Move, k: number, entering: boolean) => {
  // k: 0 = fully on screen, 1 = fully off.
  switch (move) {
    case 'fade':
      return {s: 1, x: 0, y: 0, blur: k * 6};
    case 'zoomIn':
      return {s: lerp(1, 0.84, k), x: 0, y: 0, blur: k * 16};
    case 'zoomThrough':
      return entering ? {s: lerp(1, 0.84, k), x: 0, y: 0, blur: k * 16} : {s: lerp(1, 1.4, k), x: 0, y: 0, blur: k * 18};
    case 'zoomOut':
      return {s: lerp(1, 0.82, k), x: 0, y: 0, blur: k * 14};
    case 'fromBig':
      return {s: lerp(1, 1.22, k), x: 0, y: 0, blur: k * 14};
    case 'slideLeft':
      return {s: 1, x: entering ? lerp(0, 900, k) : lerp(0, -900, k), y: 0, blur: k * 10};
    case 'up':
      return {s: 1, x: 0, y: entering ? lerp(0, 700, k) : lerp(0, -700, k), blur: k * 12};
  }
};

/** Scene wrapper handling enter/exit transitions inside the scene window. */
export const Shell: React.FC<Props> = ({t, a, b, enter = 'fade', exit = 'fade', enterDur = 0.7, exitDur = 0.6, children}) => {
  const kin = 1 - ease.out(clamp01((t - a) / enterDur));
  const kout = ease.in(clamp01((t - (b - exitDur)) / exitDur));
  const entering = kin > 0 && kout === 0;
  const k = entering ? kin : kout;
  const pz = pose(entering ? enter : exit, k, entering);
  const opacity = entering ? 1 - kin : 1 - kout;
  if (opacity <= 0.001) return null;
  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translate(${pz.x}px, ${pz.y}px) scale(${pz.s})`,
        filter: pz.blur > 0.3 ? `blur(${pz.blur.toFixed(2)}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
