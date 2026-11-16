import React from 'react';
import { Freeze, OffthreadVideo, staticFile } from 'remotion';
import { C, FONT, FPS, useT } from '../lib/constants';
import { clamp, ease, keyframes, piecewise, pop, ramp, window as win } from '../lib/anim';

/** Recording (cropped app area) native coordinate space. */
export const RW = 1666;
export const RH = 826;
/** Card size at scale 1 inside the 3840×2160 frame. */
export const CW = 3400;
export const CH = (CW * RH) / RW;
const SRC_RATE = 1.5;

export type Rect = { x: number; y: number; w: number; h: number };
export type CamKey = { t: number; cx: number; cy: number; z: number };
export type CardKey = { t: number; x: number; y: number; s: number; rx?: number; ry?: number; o?: number };
export type Highlight = {
  from: number;
  to: number;
  r: Rect;
  label?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  spot?: number;
  radius?: number;
};
export type ClickFx = { t: number; x: number; y: number };
/** Remap segments: each is a list of [voTime, srcTime] points; segments are hard cuts. */
export type RemapSeg = [number, number][];

export type ScreenCardProps = {
  remap: RemapSeg[];
  cam: CamKey[];
  card: CardKey[];
  highlights?: Highlight[];
  clicks?: ClickFx[];
  from: number;
  to: number;
};

const srcTimeAt = (t: number, segs: RemapSeg[]) => {
  let seg = segs[0];
  for (const s of segs) if (t >= s[0][0]) seg = s;
  return piecewise(t, seg);
};

const camAt = (t: number, keys: CamKey[]) => {
  const k = keyframes(t, keys, ease.inOut);
  const z = Math.max(1, k.z);
  const hw = RW / (2 * z);
  const hh = RH / (2 * z);
  return { z, cx: clamp(k.cx, hw, RW - hw), cy: clamp(k.cy, hh, RH - hh) };
};

export const ScreenCard: React.FC<ScreenCardProps> = ({ remap, cam, card, highlights = [], clicks = [], from, to }) => {
  const t = useT();
  if (t < from || t > to) return null;

  const src = srcTimeAt(t, remap);
  const { z, cx, cy } = camAt(t, cam);
  const k = CW / RW;
  const tx = CW / 2 - cx * k * z;
  const ty = CH / 2 - cy * k * z;
  const map = (x: number, y: number) => ({ X: tx + x * k * z, Y: ty + y * k * z });

  const ck = keyframes(t, card as any, ease.inOut) as unknown as Required<Omit<CardKey, 't'>>;
  const rx = ck.rx ?? 0;
  const ry = ck.ry ?? 0;
  const o = ck.o ?? 1;

  // spotlight strength = strongest active highlight
  return (
    <div
      style={{
        position: 'absolute',
        left: ck.x - CW / 2,
        top: ck.y - CH / 2,
        width: CW,
        height: CH,
        transform: `perspective(7000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${ck.s})`,
        opacity: o,
        borderRadius: 44,
        boxShadow: '0 70px 180px rgba(0,0,0,0.6), 0 0 160px rgba(0,114,206,0.32), 0 0 0 3px rgba(120,180,240,0.28)',
        overflow: 'hidden',
        background: '#fff',
      }}
    >
      {/* zoomable layer in recording space */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: CW,
          height: CH,
          transformOrigin: '0 0',
          transform: `translate(${tx}px, ${ty}px) scale(${z})`,
        }}
      >
        {/* Freeze frames are clamped to the composition length, so address the source at
            SRC_RATE× (frame = src·fps / rate) to keep every source moment reachable. */}
        <Freeze frame={Math.max(0, Math.round((src * FPS) / SRC_RATE))}>
          <OffthreadVideo src={staticFile('rec.mp4')} muted playbackRate={SRC_RATE} style={{ width: CW, height: CH, display: 'block' }} />
        </Freeze>
        {highlights.map((h, i) => {
          const v = win(t, h.from, h.to, 0.45, 0.4);
          if (v <= 0.001) return null;
          const p = ramp(t, h.from, 0.7, ease.out);
          const pad = 6;
          const spot = (h.spot ?? 0.38) * v;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: (h.r.x - pad) * k,
                top: (h.r.y - pad) * k,
                width: (h.r.w + pad * 2) * k,
                height: (h.r.h + pad * 2) * k,
                borderRadius: (h.radius ?? 10) * k,
                border: `${(7 / z).toFixed(2)}px solid rgba(0,114,206,${v})`,
                boxShadow: `0 0 ${40 / z}px rgba(0,114,206,${0.65 * v}), 0 0 0 ${(18 / z) * (1 - p)}px rgba(0,114,206,${0.25 * v}), 0 0 0 9999px rgba(18,16,17,${spot})`,
                transform: `scale(${1 + (1 - p) * 0.06})`,
              }}
            />
          );
        })}
      </div>

      {/* click ripples (card space, constant size) */}
      {clicks.map((c, i) => {
        const p = clamp((t - c.t) / 0.75);
        if (t < c.t - 0.05 || p >= 1) return null;
        const { X, Y } = map(c.x, c.y);
        const r = 30 + ease.out(p) * 120;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                left: X - r,
                top: Y - r,
                width: r * 2,
                height: r * 2,
                borderRadius: '50%',
                border: `8px solid rgba(0,114,206,${1 - p})`,
                boxShadow: `0 0 40px rgba(0,114,206,${0.6 * (1 - p)})`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: X - 26,
                top: Y - 26,
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: `rgba(0,114,206,${0.55 * (1 - p)})`,
              }}
            />
          </React.Fragment>
        );
      })}

      {/* callout labels (card space) */}
      {highlights.map((h, i) => {
        if (!h.label) return null;
        const v = win(t, h.from + 0.15, h.to, 0.4, 0.35);
        if (v <= 0.001) return null;
        const pp = pop(t, h.from + 0.15, 13, 140);
        const side = h.side ?? 'bottom';
        const a = map(h.r.x, h.r.y);
        const b = map(h.r.x + h.r.w, h.r.y + h.r.h);
        const midX = (a.X + b.X) / 2;
        const midY = (a.Y + b.Y) / 2;
        const gap = 46;
        let style: React.CSSProperties = {};
        if (side === 'bottom') style = { left: midX, top: b.Y + gap, transform: `translate(-50%, 0) translateY(${(1 - pp) * 30}px) scale(${0.8 + 0.2 * pp})` };
        if (side === 'top') style = { left: midX, top: a.Y - gap, transform: `translate(-50%, -100%) translateY(${(1 - pp) * -30}px) scale(${0.8 + 0.2 * pp})` };
        if (side === 'right') style = { left: b.X + gap, top: midY, transform: `translate(0, -50%) translateX(${(1 - pp) * 30}px) scale(${0.8 + 0.2 * pp})` };
        if (side === 'left') style = { left: a.X - gap, top: midY, transform: `translate(-100%, -50%) translateX(${(1 - pp) * -30}px) scale(${0.8 + 0.2 * pp})` };
        return (
          <div
            key={`l${i}`}
            style={{
              position: 'absolute',
              ...style,
              opacity: v,
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 64,
              letterSpacing: '-0.01em',
              color: '#fff',
              background: `linear-gradient(135deg, #1A86DE 0%, ${C.blue} 100%)`,
              padding: '26px 46px',
              borderRadius: 28,
              whiteSpace: 'nowrap',
              boxShadow: '0 24px 60px rgba(0,40,90,0.45), 0 0 0 2px rgba(255,255,255,0.12) inset',
            }}
          >
            {h.label}
          </div>
        );
      })}
    </div>
  );
};
