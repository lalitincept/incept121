import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { E, Key, keyed, prog } from '../anim';

export type EnterType = 'fade' | 'zoom' | 'rise' | 'push' | 'none' | 'zoomOut';
export type ExitType = 'fade' | 'recede' | 'through' | 'push' | 'none' | 'up';

/**
 * Wraps a scene with entrance / exit transitions over the overlap windows
 * between neighbouring scenes. Lives inside a <Sequence>, so frame is local.
 */
export const SceneShell: React.FC<{
  enter?: EnterType;
  exit?: ExitType;
  inDur?: number;
  outDur?: number;
  children: React.ReactNode;
}> = ({ enter = 'zoom', exit = 'through', inDur = 20, outDur = 18, children }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pi = enter === 'none' ? 1 : prog(f, 0, inDur, E.outQuint);
  const po = exit === 'none' ? 0 : prog(f, durationInFrames - outDur, outDur, E.inCubic);

  let tx = 0;
  let ty = 0;
  let sc = 1;
  let blur = 0;
  let op = 1;

  // entrance
  if (enter === 'fade') op *= pi;
  if (enter === 'zoom') {
    sc *= 0.9 + 0.1 * pi;
    blur += (1 - pi) * 22;
    op *= Math.min(1, pi * 1.4);
  }
  if (enter === 'zoomOut') {
    sc *= 1.12 - 0.12 * pi;
    blur += (1 - pi) * 22;
    op *= Math.min(1, pi * 1.4);
  }
  if (enter === 'rise') {
    ty += (1 - pi) * 180;
    blur += (1 - pi) * 18;
    op *= pi;
  }
  if (enter === 'push') {
    tx += (1 - pi) * 900;
    blur += (1 - pi) * 24;
    op *= Math.min(1, pi * 1.5);
  }

  // exit
  if (exit === 'fade') op *= 1 - po;
  if (exit === 'recede') {
    sc *= 1 - 0.1 * po;
    blur += po * 22;
    op *= 1 - po;
  }
  if (exit === 'through') {
    sc *= 1 + 0.22 * po;
    blur += po * 26;
    op *= 1 - po;
  }
  if (exit === 'push') {
    tx -= po * 900;
    blur += po * 24;
    op *= 1 - po;
  }
  if (exit === 'up') {
    ty -= po * 220;
    blur += po * 20;
    op *= 1 - po;
  }

  return (
    <AbsoluteFill
      style={{
        opacity: op,
        transform: `translate(${tx}px, ${ty}px) scale(${sc})`,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Smooth virtual camera (pan / zoom / roll) over keyframes in local frames. */
export const Cam: React.FC<{
  keys: Array<Key & { x?: number; y?: number; s?: number; r?: number }>;
  children: React.ReactNode;
  ease?: (t: number) => number;
}> = ({ keys, children, ease = E.inOutSoft }) => {
  const f = useCurrentFrame();
  const full = keys.map((k) => ({ x: 0, y: 0, s: 1, r: 0, ...k }));
  const x = keyed(f, full, 'x', ease);
  const y = keyed(f, full, 'y', ease);
  const s = keyed(f, full, 's', ease);
  const r = keyed(f, full, 'r', ease);
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${-x}px, ${-y}px) scale(${s}) rotate(${r}deg)`,
        transformOrigin: '50% 50%',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Absolute positioned helper centred on (x, y). */
export const At: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  anchor?: 'center' | 'left' | 'right' | 'top';
}> = ({ x, y, children, style, anchor = 'center' }) => {
  const tr =
    anchor === 'center'
      ? 'translate(-50%,-50%)'
      : anchor === 'left'
        ? 'translate(0,-50%)'
        : anchor === 'right'
          ? 'translate(-100%,-50%)'
          : 'translate(-50%,0)';
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: tr, width: 'max-content', ...style }}>
      {children}
    </div>
  );
};
