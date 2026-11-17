import React from 'react';
import {Freeze, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {env, pop, tween} from '../lib/anim';
import {C, E, FONT} from '../lib/theme';
import {Shot, f} from '../lib/time';
import {Icon} from './Icons';

/* ------------------------------------------------------------------ types */
export type Rect = [number, number, number, number]; // x0,y0,x1,y1 in source-crop px

export type Overlay =
  | {kind: 'spot'; shot: string; rect: Rect; from: number; to: number; tag?: string; tagPos?: 'top' | 'bottom' | 'left' | 'right'; morph?: boolean}
  | {kind: 'box'; shot: string; rect: Rect; from: number; to: number; tag?: string; tagPos?: 'top' | 'bottom' | 'left' | 'right'}
  | {kind: 'ripple'; shot: string; x: number; y: number; at: number}
  | {kind: 'lens'; shot: string; rect: Rect; from: number; to: number; at: [number, number]; zoom: number};

/** Plays one shot clip inside the card, holding its last frame for `hold` extra frames. */
const ShotVideo: React.FC<{shot: Shot; w: number; h: number; hold: number}> = ({shot, w, h, hold}) => {
  const len = shot.to - shot.from;
  return (
    <Sequence from={shot.from} durationInFrames={len + hold} layout="none">
      <ShotInner shot={shot} w={w} h={h} len={len} />
    </Sequence>
  );
};

const ShotInner: React.FC<{shot: Shot; w: number; h: number; len: number}> = ({shot, w, h, len}) => {
  const fr = useCurrentFrame();
  const vid = <OffthreadVideo src={staticFile(shot.src)} muted style={{width: w, height: h, display: 'block'}} />;
  if (fr >= len) return <Freeze frame={len - 1}>{vid}</Freeze>;
  return vid;
};

/* ------------------------------------------------------------------ overlays */
const TagPill: React.FC<{text: string; p: number; style: React.CSSProperties}> = ({text, p, style}) => (
  <div
    style={{
      position: 'absolute',
      whiteSpace: 'nowrap',
      background: C.blue,
      color: '#fff',
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: 17,
      padding: '7px 14px',
      borderRadius: 10,
      boxShadow: '0 8px 24px rgba(0,0,0,0.35), 0 0 18px rgba(0,114,206,0.55)',
      opacity: p,
      ...style,
    }}
  >
    {text}
  </div>
);

const tagStyle = (pos: string, p: number): React.CSSProperties => {
  const d = (1 - p) * 10;
  switch (pos) {
    case 'bottom':
      return {top: '100%', left: '50%', transform: `translate(-50%, ${12 + d}px)`};
    case 'left':
      return {right: '100%', top: '50%', transform: `translate(${-14 - d}px, -50%)`};
    case 'right':
      return {left: '100%', top: '50%', transform: `translate(${14 + d}px, -50%)`};
    default:
      return {bottom: '100%', left: '50%', transform: `translate(-50%, ${-12 - d}px)`};
  }
};

const OverlayLayer: React.FC<{shot: Shot; k: number; overlays: Overlay[]; w: number; h: number}> = ({shot, k, overlays, w, h}) => {
  const fr = useCurrentFrame();
  const mine = overlays.filter((o) => o.shot === shot.id);
  const pad = 6;
  const ox = shot.cropX ?? 0;
  const R = (r: Rect) => ({left: (r[0] - ox) * k - pad, top: r[1] * k - pad, width: (r[2] - r[0]) * k + pad * 2, height: (r[3] - r[1]) * k + pad * 2});

  // Spotlights morph from one rect to the next when they are adjacent in time
  const spots = mine.filter((o) => o.kind === 'spot') as Extract<Overlay, {kind: 'spot'}>[];
  spots.sort((a, b) => a.from - b.from);
  let spotEl: React.ReactNode = null;
  const activeIdx = spots.findIndex((s) => fr >= s.from && fr <= s.to);
  if (activeIdx >= 0) {
    const s = spots[activeIdx];
    const prev = spots[activeIdx - 1];
    const next = spots[activeIdx + 1];
    const chainedIn = prev && s.from - prev.to <= 2;
    const chainedOut = next && next.from - s.to <= 2;
    const dimIn = chainedIn ? 1 : tween(fr, s.from, s.from + 12, 0, 1, E.out);
    const dimOut = chainedOut ? 1 : 1 - tween(fr, s.to - 10, s.to, 0, 1, E.in);
    const dim = Math.min(dimIn, dimOut);
    let r = R(s.rect);
    if (chainedIn) {
      const m = tween(fr, s.from, s.from + 14, 0, 1, E.inOut);
      const pr = R(prev.rect);
      r = {left: pr.left + (r.left - pr.left) * m, top: pr.top + (r.top - pr.top) * m, width: pr.width + (r.width - pr.width) * m, height: pr.height + (r.height - pr.height) * m};
    }
    const tp = s.tag ? tween(fr, s.from + 6, s.from + 18) * dimOut : 0;
    spotEl = (
      <div
        style={{
          position: 'absolute',
          ...r,
          borderRadius: 12,
          boxShadow: `0 0 18px 2px rgba(0,114,206,${0.85 * dim}), 0 0 0 4000px rgba(14,13,14,${0.6 * dim})`,
          border: `3px solid rgba(0,114,206,${dim})`,
        }}
      >
        {s.tag ? <TagPill text={s.tag} p={tp} style={tagStyle(s.tagPos ?? 'top', tp)} /> : null}
      </div>
    );
  }

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {spotEl}
      {mine.map((o, i) => {
        if (o.kind === 'box') {
          if (fr < o.from || fr > o.to) return null;
          const p = env(fr, o.from, o.to, 10, 8);
          const s = pop(fr, o.from, 12, 0.6, 160);
          const r = R(o.rect);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                ...r,
                borderRadius: 10,
                border: `3px solid rgba(0,114,206,${p})`,
                background: `rgba(0,114,206,${0.10 * p})`,
                boxShadow: `0 0 ${22 * p}px rgba(0,114,206,${0.85 * p}), inset 0 0 ${12 * p}px rgba(0,114,206,${0.35 * p})`,
                transform: `scale(${1.12 - 0.12 * s})`,
              }}
            >
              {o.tag ? <TagPill text={o.tag} p={p} style={tagStyle(o.tagPos ?? 'top', p)} /> : null}
            </div>
          );
        }
        if (o.kind === 'ripple') {
          const t = fr - o.at;
          if (t < -2 || t > 26) return null;
          const rings = [0, 7];
          return (
            <React.Fragment key={i}>
              {rings.map((d) => {
                const q = tween(fr, o.at + d, o.at + d + 18, 0, 1, E.out);
                if (fr < o.at + d) return null;
                const size = 16 + q * 70;
                return (
                  <div
                    key={d}
                    style={{
                      position: 'absolute',
                      left: (o.x - ox) * k - size / 2,
                      top: o.y * k - size / 2,
                      width: size,
                      height: size,
                      borderRadius: '50%',
                      border: `3px solid rgba(0,114,206,${1 - q})`,
                      background: `rgba(90,169,234,${0.25 * (1 - q)})`,
                      boxShadow: `0 0 16px rgba(0,114,206,${0.8 * (1 - q)})`,
                    }}
                  />
                );
              })}
            </React.Fragment>
          );
        }
        if (o.kind === 'lens') {
          if (fr < o.from || fr > o.to) return null;
          const p = env(fr, o.from, o.to, 14, 10);
          const s = pop(fr, o.from, 13, 0.7, 120);
          const [rx0, y0, rx1, y1] = o.rect;
          const x0 = rx0 - ox;
          const x1 = rx1 - ox;
          const lw = (x1 - x0) * k * o.zoom;
          const lh = (y1 - y0) * k * o.zoom;
          const [acx, cy] = o.at;
          const cx = acx - ox;
          const left = cx * k - lw / 2;
          const top = cy * k - lh / 2;
          const srcCx = ((x0 + x1) / 2) * k;
          const srcCy = ((y0 + y1) / 2) * k;
          return (
            <React.Fragment key={i}>
              <svg style={{position: 'absolute', inset: 0, overflow: 'visible'}} width={w} height={h}>
                <line x1={srcCx} y1={srcCy} x2={cx * k} y2={cy * k} stroke={`rgba(90,169,234,${0.9 * p})`} strokeWidth={2.5} strokeDasharray="6 7" />
                <circle cx={srcCx} cy={srcCy} r={6} fill={C.blue} opacity={p} />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  left,
                  top,
                  width: lw,
                  height: lh,
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: '3px solid #fff',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.55), 0 0 0 6px rgba(0,114,206,0.55), 0 0 40px rgba(0,114,206,0.6)',
                  opacity: Math.min(1, p * 1.3),
                  transform: `scale(${0.6 + 0.4 * s})`,
                  background: '#fff',
                }}
              >
                <div style={{position: 'absolute', left: -x0 * k * o.zoom, top: -y0 * k * o.zoom, width: w * o.zoom, height: h * o.zoom}}>
                  <ShotVideo shot={shot} w={w * o.zoom} h={h * o.zoom} hold={0} />
                </div>
              </div>
            </React.Fragment>
          );
        }
        return null;
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ card */
export type CardLayout = {cx: number; cy: number; scale: number; opacity: number; rotX?: number; rotY?: number; tile?: number};

export const CARD_W: Record<string, number> = {web: 1520, xl: 1440};

export const cardDims = (shot: Shot) => {
  const w = CARD_W[shot.crop];
  const h = Math.round((w * shot.srcH) / shot.srcW);
  return {w, h};
};

/**
 * Renders the screen card for the given set of contiguous shots, with a crossfade
 * and size morph at shot boundaries.
 */
export const ScreenCard: React.FC<{shots: Shot[]; overlays: Overlay[]; layout: CardLayout; children?: React.ReactNode}> = ({shots, overlays, layout, children}) => {
  const fr = useCurrentFrame();
  const XF = 8; // crossfade frames
  // active + previous shots
  const idx = Math.max(0, shots.findIndex((s) => fr >= s.from && fr < s.to + (s === shots[shots.length - 1] ? 999 : 0)));
  const cur = shots[idx];
  const prev = idx > 0 ? shots[idx - 1] : null;
  const dCur = cardDims(cur);
  let w = dCur.w;
  let h = dCur.h;
  let prevOpacity = 0;
  if (prev && fr < cur.from + XF) {
    const m = tween(fr, cur.from - 2, cur.from + XF, 0, 1, E.inOut);
    const dp = cardDims(prev);
    w = dp.w + (dCur.w - dp.w) * m;
    h = dp.h + (dCur.h - dp.h) * m;
    prevOpacity = 1 - tween(fr, cur.from, cur.from + XF, 0, 1, E.soft);
  }
  const {cx, cy, scale, opacity, rotX = 0, rotY = 0} = layout;
  if (opacity <= 0.001) return null;
  const renderShot = (s: Shot, op: number, hold: number) => {
    const d = cardDims(s);
    const k = w / s.srcW;
    const hh = (w * s.srcH) / s.srcW;
    return (
      <div key={s.id} style={{position: 'absolute', left: 0, top: (h - hh) / 2, width: w, height: hh, opacity: op}}>
        <ShotVideo shot={s} w={w} h={hh} hold={hold} />
        <OverlayLayer shot={s} k={k} overlays={overlays} w={w} h={hh} />
        <span style={{display: 'none'}}>{d.w}</span>
      </div>
    );
  };
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        transform: `perspective(2400px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: 22,
          background: 'linear-gradient(140deg, rgba(120,185,240,0.55), rgba(255,255,255,0.10) 35%, rgba(255,255,255,0.06) 65%, rgba(0,114,206,0.6))',
          boxShadow: '0 40px 90px rgba(0,0,0,0.55), 0 0 70px rgba(0,114,206,0.18)',
        }}
      />
      <div style={{position: 'absolute', inset: 0, borderRadius: 20, overflow: 'hidden', background: '#f4f4f6'}}>
        {prev && prevOpacity > 0 ? renderShot(prev, 1, XF + 2) : null}
        {renderShot(cur, prev && prevOpacity > 0 ? 1 - prevOpacity : 1, 90)}
        {layout.tile ? (
          <div style={{position: 'absolute', inset: 0, background: '#2c292a', opacity: layout.tile, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon name="table" size={h * 0.8} strokePx={1.8 / 0.0513} />
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ captions */
export type CaptionDef = {from: number; to: number; icon: string; text: string};

import {KText} from './UI';

export const Caption: React.FC<{c: CaptionDef; y: number; x?: number; maxWidth?: number}> = ({c, y, x = 960, maxWidth = 1500}) => {
  const fr = useCurrentFrame();
  if (fr < c.from - 1 || fr > c.to + 1) return null;
  const pIn = tween(fr, c.from, c.from + 14, 0, 1, E.out);
  const pOut = tween(fr, c.to - 9, c.to, 0, 1, E.in);
  const op = pIn * (1 - pOut);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) translateY(${(1 - pIn) * 22 - pOut * 14}px) scale(${0.96 + 0.04 * pIn})`,
        opacity: op,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '16px 34px 16px 18px',
        borderRadius: 999,
        background: 'linear-gradient(100deg, rgba(0,114,206,0.30), rgba(30,28,29,0.75) 38%, rgba(30,28,29,0.75))',
        border: '1.5px solid rgba(90,169,234,0.45)',
        boxShadow: '0 18px 50px rgba(0,0,0,0.35), 0 0 40px rgba(0,114,206,0.18)',
        maxWidth,
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,114,206,0.15) 50%, rgba(0,114,206,0.45))',
          border: '2px solid #0072CE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={c.icon} size={38} strokePx={3.2} progress={tween(fr, c.from + 2, c.from + 26)} />
      </div>
      <KText text={c.text} start={c.from + 3} stagger={2} size={33} weight={500} align="left" dur={14} />
    </div>
  );
};

export {f};
