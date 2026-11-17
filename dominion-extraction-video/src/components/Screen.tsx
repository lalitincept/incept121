import React from 'react';
import { Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { at, FPS } from '../theme';

/** Crop-space size of the recording (Informatica app window, before the 2x upscale). */
export const REC_W = 1664;
export const REC_H = 826;
export const REC_ASPECT = REC_H / REC_W;

/**
 * Edit-decision-list entry. VO times are seconds on the voiceover clock.
 * Video segment: plays recording time rec0→rec1 across vo0→vo1 (rate derived).
 * Still segment: holds a pre-extracted frame (public/stills/rec_<still>.png).
 */
export type Seg = { vo0: number; vo1: number; rec0?: number; rec1?: number; still?: string };

const XFADE = 5; // frames of cross-dissolve between consecutive cuts

export const ScreenMedia: React.FC<{ segs: Seg[]; w: number; h: number }> = ({ segs, w, h }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {segs.map((s, i) => {
        const from = at(s.vo0);
        const hasNext = i < segs.length - 1;
        const dur = at(s.vo1) - from + (hasNext ? XFADE : 0);
        const local = frame - from;
        const fadeIn = i === 0 ? 1 : Math.min(1, Math.max(0, local / XFADE));
        const style: React.CSSProperties = { position: 'absolute', left: 0, top: 0, width: w, height: h, opacity: fadeIn, objectFit: 'fill' };
        if (s.still) {
          return (
            <Sequence key={i} from={from} durationInFrames={dur} layout="none">
              <Img src={staticFile(`stills/rec_${s.still}.png`)} style={style} />
            </Sequence>
          );
        }
        const rate = ((s.rec1! - s.rec0!) / (s.vo1 - s.vo0));
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <OffthreadVideo src={staticFile('screen.mp4')} trimBefore={Math.round(s.rec0! * FPS)} playbackRate={rate} muted style={style} />
          </Sequence>
        );
      })}
    </>
  );
};

/**
 * Rounded, shadowed app window placed at centre (x, y) with width w.
 * `overlay(k)` renders clipped callouts in crop coordinates (multiply by k).
 * `outside(k)` renders unclipped elements in the same coordinate space.
 */
export const Screen: React.FC<{
  segs: Seg[];
  x: number;
  y: number;
  w: number;
  opacity?: number;
  rotX?: number;
  rotY?: number;
  radius?: number;
  overlay?: (k: number, w: number, h: number) => React.ReactNode;
  outside?: (k: number, w: number, h: number) => React.ReactNode;
  dim?: number;
}> = ({ segs, x, y, w, opacity = 1, rotX = 0, rotY = 0, radius = 44, overlay, outside, dim = 0 }) => {
  const h = w * REC_ASPECT;
  const k = w / REC_W;
  if (opacity <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        opacity,
        transform: rotX || rotY ? `perspective(5200px) rotateX(${rotX}deg) rotateY(${rotY}deg)` : undefined,
        transformOrigin: '50% 60%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -3,
          borderRadius: radius + 3,
          background: 'linear-gradient(180deg, rgba(120,180,255,0.55), rgba(0,114,206,0.25))',
          boxShadow: '0 50px 140px rgba(0,0,0,0.55), 0 0 90px rgba(0,114,206,0.35)',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, borderRadius: radius, overflow: 'hidden', background: '#FFFFFF' }}>
        <ScreenMedia segs={segs} w={w} h={h} />
        {dim > 0 ? <div style={{ position: 'absolute', inset: 0, background: `rgba(10,12,16,${dim})` }} /> : null}
        {overlay ? overlay(k, w, h) : null}
      </div>
      {outside ? outside(k, w, h) : null}
    </div>
  );
};

export type Rect = { x: number; y: number; w: number; h: number };

export const lerpRect = (a: Rect, b: Rect, p: number): Rect => ({
  x: a.x + (b.x - a.x) * p,
  y: a.y + (b.y - a.y) * p,
  w: a.w + (b.w - a.w) * p,
  h: a.h + (b.h - a.h) * p,
});

/** Dims everything except `rect` (crop coords) and draws a glowing ring around it. */
export const Spotlight: React.FC<{ rect: Rect; k: number; opacity: number; dim?: number; pad?: number; radius?: number; ring?: boolean }> = ({
  rect,
  k,
  opacity,
  dim = 0.62,
  pad = 8,
  radius = 14,
  ring = true,
}) => {
  if (opacity <= 0) return null;
  const x = (rect.x - pad) * k, y = (rect.y - pad) * k, w = (rect.w + pad * 2) * k, h = (rect.h + pad * 2) * k;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: radius * k,
        boxShadow: `0 0 0 8000px rgba(12,14,20,${dim * opacity})`,
        border: ring ? `${Math.max(4, 3 * k)}px solid rgba(46,149,240,${opacity})` : undefined,
        outline: ring ? `${10}px solid rgba(46,149,240,${0.18 * opacity})` : undefined,
        pointerEvents: 'none',
      }}
    />
  );
};

/** Glowing ring around a rect (no dimming) — for light emphasis. */
export const Ring: React.FC<{ rect: Rect; k: number; opacity: number; pad?: number; radius?: number; color?: string; pulse?: number }> = ({
  rect,
  k,
  opacity,
  pad = 6,
  radius = 12,
  color = '#2E95F0',
  pulse = 0,
}) => {
  if (opacity <= 0) return null;
  const grow = pulse * 10;
  return (
    <div
      style={{
        position: 'absolute',
        left: (rect.x - pad) * k - grow,
        top: (rect.y - pad) * k - grow,
        width: (rect.w + pad * 2) * k + grow * 2,
        height: (rect.h + pad * 2) * k + grow * 2,
        borderRadius: radius * k + grow,
        border: `${Math.max(5, 3 * k)}px solid ${color}`,
        boxShadow: `0 0 40px ${color}, inset 0 0 24px rgba(46,149,240,0.25)`,
        opacity,
        background: 'rgba(46,149,240,0.06)',
      }}
    />
  );
};
