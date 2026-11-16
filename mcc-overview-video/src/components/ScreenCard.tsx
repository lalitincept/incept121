import React from 'react';
import {
  AbsoluteFill,
  Freeze,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { E, Key, keyed, prog } from '../anim';
import { C, FONT } from '../theme';
import { Icon } from './Icons';

// Source (cropped app viewport) dimensions in recording pixels.
export const SRC_W = 1666;
export const SRC_H = 826;
const SRC_FPS = 30; // trimBefore is expressed in composition frames

export type Clip = {
  from: number; // local frame (card timeline)
  to: number;
  src: number; // source seconds at clip start
  rate?: number; // playback speed (ignored when freeze)
  freeze?: boolean;
  fade?: number; // cross-fade in frames
};

export type Highlight = {
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  outAt?: number;
  dim?: number; // 0..1 dim outside
  radius?: number;
  label?: string;
  labelIcon?: string;
  labelSide?: 'right' | 'left' | 'top' | 'bottom';
  labelSize?: number;
  labelOffset?: number;
  color?: string;
};

export type Ripple = { x: number; y: number; at: number; end?: number };

export type ZoomKey = Key & { x: number; y: number; s: number };

const clampFocus = (x: number, y: number, s: number) => {
  const hx = SRC_W / (2 * s);
  const hy = SRC_H / (2 * s);
  return {
    x: Math.min(Math.max(x, hx), SRC_W - hx),
    y: Math.min(Math.max(y, hy), SRC_H - hy),
  };
};

export const ScreenCard: React.FC<{
  width: number;
  clips: Clip[];
  zoom?: ZoomKey[];
  highlights?: Highlight[];
  ripples?: Ripple[];
  overlays?: (s: number, k: number) => React.ReactNode; // extra layers in source space
  style?: React.CSSProperties;
  radius?: number;
  glow?: number;
}> = ({
  width,
  clips,
  zoom = [{ f: 0, x: SRC_W / 2, y: SRC_H / 2, s: 1 }],
  highlights = [],
  ripples = [],
  overlays,
  style,
  radius = 44,
  glow = 1,
}) => {
  const f = useCurrentFrame();
  const k = width / SRC_W;
  const height = SRC_H * k;
  const s = keyed(f, zoom, 's', E.inOut);
  const fx = keyed(f, zoom, 'x', E.inOut);
  const fy = keyed(f, zoom, 'y', E.inOut);
  const c = clampFocus(fx, fy, s);
  const tx = width / 2 - c.x * k * s;
  const ty = height / 2 - c.y * k * s;
  const src = staticFile('media/mcc-app.mp4');

  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        overflow: 'hidden',
        position: 'relative',
        background: '#fff',
        boxShadow: `0 70px 140px rgba(0,0,0,0.55), 0 0 ${160 * glow}px rgba(0,114,206,${0.38 * glow}), 0 0 0 4px rgba(255,255,255,0.10)`,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width,
          height,
          transformOrigin: '0 0',
          transform: `translate(${tx}px, ${ty}px) scale(${s})`,
        }}
      >
        {clips.map((cl, i) => {
          const dur = cl.to - cl.from;
          const fade = cl.fade ?? 0;
          const op = fade > 0 ? prog(f, cl.from, fade, E.inOut) : 1;
          const trim = Math.round(cl.src * SRC_FPS);
          const vid = (
            <OffthreadVideo
              src={src}
              muted
              trimBefore={trim}
              playbackRate={cl.freeze ? 1 : cl.rate ?? 1}
              style={{ width, height, display: 'block' }}
            />
          );
          return (
            <Sequence key={i} from={cl.from} durationInFrames={dur} layout="none">
              <AbsoluteFill style={{ opacity: op }}>
                {cl.freeze ? <Freeze frame={0}>{vid}</Freeze> : vid}
              </AbsoluteFill>
            </Sequence>
          );
        })}

        {overlays ? overlays(s, k) : null}

        {highlights.map((h, i) => (
          <HighlightBox key={i} h={h} k={k} s={s} />
        ))}

        {ripples.map((r, i) => {
          const p = prog(f, r.at, 26, E.outCubic);
          if (f < r.at || f > r.at + 30) return null;
          if (r.end !== undefined && f >= r.end) return null;
          const R = (18 + p * 46) * k;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: r.x * k - R,
                top: r.y * k - R,
                width: R * 2,
                height: R * 2,
                borderRadius: '50%',
                border: `${6 / s}px solid rgba(0,114,206,${1 - p})`,
                background: `rgba(43,142,240,${0.28 * (1 - p)})`,
                boxShadow: `0 0 ${30 / s}px rgba(0,114,206,${0.8 * (1 - p)})`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const HighlightBox: React.FC<{ h: Highlight; k: number; s: number }> = ({ h, k, s }) => {
  const f = useCurrentFrame();
  const p = prog(f, h.at, 26, E.outExpo);
  const o = h.outAt !== undefined ? prog(f, h.outAt, 14, E.inCubic) : 0;
  const vis = p * (1 - o);
  if (vis <= 0.001) return null;
  const pad = (1 - p) * 30;
  const x = (h.x - pad) * k;
  const y = (h.y - pad) * k;
  const w = (h.w + pad * 2) * k;
  const hh = (h.h + pad * 2) * k;
  const dim = (h.dim ?? 0.55) * vis;
  const color = h.color ?? C.blueBright;
  const ls = h.labelSize ?? 64;
  const side = h.labelSide ?? 'right';
  const off = (h.labelOffset ?? 40) / s;
  const lp = prog(f, h.at + 8, 26, E.outExpo) * (1 - o);
  let labelStyle: React.CSSProperties = {};
  if (side === 'right') labelStyle = { left: x + w + off, top: y + hh / 2, transform: `translate(${(1 - lp) * -30}px,-50%) scale(${1 / s})`, transformOrigin: '0 50%' };
  if (side === 'left') labelStyle = { left: x - off, top: y + hh / 2, transform: `translate(calc(-100% + ${(1 - lp) * 30}px),-50%) scale(${1 / s})`, transformOrigin: '100% 50%' };
  if (side === 'top') labelStyle = { left: x + w / 2, top: y - off, transform: `translate(-50%, calc(-100% + ${(1 - lp) * 30}px)) scale(${1 / s})`, transformOrigin: '50% 100%' };
  if (side === 'bottom') labelStyle = { left: x + w / 2, top: y + hh + off, transform: `translate(-50%, ${(1 - lp) * -30}px) scale(${1 / s})`, transformOrigin: '50% 0' };
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: hh,
          borderRadius: (h.radius ?? 12) * k,
          boxShadow: `0 0 0 9000px rgba(12,14,20,${dim})`,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: hh,
          borderRadius: (h.radius ?? 12) * k,
          border: `${7 / s}px solid ${color}`,
          boxShadow: `0 0 ${40 / s}px rgba(0,114,206,0.9), inset 0 0 ${24 / s}px rgba(0,114,206,0.35)`,
          opacity: vis,
          boxSizing: 'border-box',
        }}
      />
      {h.label ? (
        <div
          style={{
            position: 'absolute',
            ...labelStyle,
            opacity: lp,
            whiteSpace: 'nowrap',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: ls * 0.4,
              padding: `${ls * 0.3}px ${ls * 0.6}px ${ls * 0.3}px ${h.labelIcon ? ls * 0.36 : ls * 0.6}px`,
              borderRadius: ls * 0.42,
              background: 'linear-gradient(160deg, rgba(22,50,86,0.97), rgba(10,24,44,0.97))',
              border: '4px solid rgba(64,158,245,0.95)',
              boxShadow: '0 0 50px rgba(0,114,206,0.6), 0 24px 50px rgba(0,0,0,0.45)',
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: ls,
              color: '#fff',
              letterSpacing: '-0.015em',
            }}
          >
            {h.labelIcon ? <Icon name={h.labelIcon} size={ls * 1.45} /> : null}
            {h.label}
          </div>
        </div>
      ) : null}
    </>
  );
};
