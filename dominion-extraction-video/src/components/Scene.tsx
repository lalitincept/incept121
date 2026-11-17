import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame } from 'remotion';
import { EASE_IN, EASE_OUT, tween, voTime } from '../theme';

/** Renders children only inside [from, to] on the VO clock. */
export const Window: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const t = voTime(useCurrentFrame());
  if (t < from || t > to) return null;
  return <>{children}</>;
};

/**
 * Scene "camera": a slow continuous push (keeps graphics alive), an eased entrance and a
 * push-through exit (scale up + blur + fade) so consecutive scenes flow into each other.
 */
export const Cam: React.FC<{
  from: number;
  to: number;
  push?: number;
  drift?: number;
  enter?: 'rise' | 'zoom' | 'none' | 'fromBelow';
  exit?: 'push' | 'up' | 'fade' | 'none' | 'down';
  originX?: number;
  originY?: number;
  children: React.ReactNode;
}> = ({ from, to, push = 0.04, drift = 0, enter = 'zoom', exit = 'push', originX = 1920, originY = 1080, children }) => {
  const t = voTime(useCurrentFrame());
  if (t < from - 0.02 || t > to + 0.02) return null;
  const life = tween(t, from, to, 0, 1, (n) => n);
  const pIn = enter === 'none' ? 1 : tween(t, from, from + 0.7, 0, 1, EASE_OUT);
  const pOut = exit === 'none' ? 0 : tween(t, to - 0.55, to, 0, 1, EASE_IN);
  let scale = 1 + push * life;
  let ty = drift * (life - 0.5);
  let blur = 0;
  let opacity = 1;
  if (enter === 'zoom') {
    scale *= 0.86 + 0.14 * pIn;
    blur += (1 - pIn) * 18;
    opacity *= pIn;
  } else if (enter === 'rise') {
    ty += (1 - pIn) * 160;
    blur += (1 - pIn) * 14;
    opacity *= pIn;
  } else if (enter === 'fromBelow') {
    ty += (1 - pIn) * 500;
    opacity *= pIn;
  }
  if (exit === 'push') {
    scale *= 1 + 0.35 * pOut;
    blur += pOut * 22;
    opacity *= 1 - pOut;
  } else if (exit === 'up') {
    ty -= pOut * 260;
    blur += pOut * 16;
    opacity *= 1 - pOut;
  } else if (exit === 'down') {
    ty += pOut * 260;
    blur += pOut * 16;
    opacity *= 1 - pOut;
  } else if (exit === 'fade') {
    opacity *= 1 - pOut;
  }
  if (opacity <= 0.001) return null;
  return (
    <AbsoluteFill
      style={{
        transformOrigin: `${originX}px ${originY}px`,
        transform: `translateY(${ty}px) scale(${scale})`,
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** White PNG (logo parts) rendered through a CSS mask so it can be any colour/gradient. */
export const MaskedImage: React.FC<{ src: string; w: number; h: number; background: string; style?: React.CSSProperties }> = ({ src, w, h, background, style }) => (
  <div
    style={{
      width: w,
      height: h,
      background,
      WebkitMaskImage: `url(${staticFile(src)})`,
      maskImage: `url(${staticFile(src)})`,
      WebkitMaskSize: '100% 100%',
      maskSize: '100% 100%',
      ...style,
    }}
  />
);

export const useT = () => voTime(useCurrentFrame());

export { EASE_IN, EASE_OUT };
