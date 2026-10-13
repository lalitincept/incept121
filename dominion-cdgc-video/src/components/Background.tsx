import React, { useMemo } from 'react';
import { AbsoluteFill, random, staticFile } from 'remotion';
import { C } from '../theme';
import { H, W } from '../timing';
import { Cam } from '../lib/camera';

const layerTransform = (cam: Cam, d: number) =>
  `translate(${W / 2}px, ${H / 2}px) scale(${1 + (cam.z - 1) * d}) rotate(${cam.r * d}deg) translate(${-cam.x * d}px, ${-cam.y * d}px)`;

// World extents travelled by the camera (with margin).
const WX0 = -4000;
const WX1 = 30500;
const WY0 = -3500;
const WY1 = 13500;

type Particle = { x: number; y: number; r: number; a: number; blue: boolean; ph: number; per: number; amp: number };

const makeParticles = (seed: string, n: number, d: number): Particle[] =>
  Array.from({ length: n }).map((_, i) => ({
    x: (WX0 + random(`${seed}x${i}`) * (WX1 - WX0)) * d,
    y: (WY0 + random(`${seed}y${i}`) * (WY1 - WY0)) * d,
    r: 3 + random(`${seed}r${i}`) * 7,
    a: 0.12 + random(`${seed}a${i}`) * 0.32,
    blue: random(`${seed}b${i}`) > 0.55,
    ph: random(`${seed}p${i}`) * Math.PI * 2,
    per: 7 + random(`${seed}t${i}`) * 9,
    amp: 20 + random(`${seed}m${i}`) * 60,
  }));

const Particles: React.FC<{ cam: Cam; t: number; d: number; seed: string; n: number; blur?: number }> = ({
  cam,
  t,
  d,
  seed,
  n,
  blur = 0,
}) => {
  const parts = useMemo(() => makeParticles(seed, n, d), [seed, n, d]);
  const s = 1 + (cam.z - 1) * d;
  const cx = cam.x * d;
  const cy = cam.y * d;
  const hw = W / 2 / s + 200;
  const hh = H / 2 / s + 200;
  return (
    <AbsoluteFill style={{ transform: layerTransform(cam, d), transformOrigin: '0 0', width: 0, height: 0 }}>
      <svg width={1} height={1} style={{ overflow: 'visible', position: 'absolute', filter: blur ? `blur(${blur}px)` : undefined }}>
        {parts.map((p, i) => {
          const px = p.x + Math.sin((2 * Math.PI * t) / p.per + p.ph) * p.amp;
          const py = p.y + Math.cos((2 * Math.PI * t) / (p.per * 1.3) + p.ph) * p.amp * 0.7;
          if (Math.abs(px - cx) > hw || Math.abs(py - cy) > hh) return null;
          const tw = 0.65 + 0.35 * Math.sin(t * 1.3 + p.ph * 3);
          return (
            <circle
              key={i}
              cx={px}
              cy={py}
              r={p.r}
              fill={p.blue ? C.blue : '#fff'}
              opacity={p.a * tw * (p.blue ? 1.6 : 1)}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Blobs: React.FC<{ cam: Cam; t: number }> = ({ cam, t }) => {
  const d = 0.22;
  const blobs = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        x: (WX0 + random(`bx${i}`) * (WX1 - WX0)) * d,
        y: (WY0 + random(`by${i}`) * (WY1 - WY0)) * d,
        r: 500 + random(`br${i}`) * 900,
        a: 0.05 + random(`ba${i}`) * 0.07,
        ph: random(`bp${i}`) * 6.28,
      })),
    [],
  );
  return (
    <AbsoluteFill style={{ transform: layerTransform(cam, d), transformOrigin: '0 0', width: 0, height: 0 }}>
      {blobs.map((b, i) => {
        const r = b.r * (1 + 0.06 * Math.sin(t * 0.4 + b.ph));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: b.x - r,
              top: b.y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(0,114,206,${b.a}) 0%, rgba(0,114,206,0) 70%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const DotGrid: React.FC<{ cam: Cam }> = ({ cam }) => {
  const d = 0.5;
  const gap = 120;
  return (
    <AbsoluteFill
      style={{
        maskImage: 'radial-gradient(ellipse 70% 75% at 50% 50%, #000 20%, transparent 95%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 75% at 50% 50%, #000 20%, transparent 95%)',
      }}
    >
      <AbsoluteFill style={{ transform: layerTransform(cam, d), transformOrigin: '0 0', width: 0, height: 0 }}>
        <div
          style={{
            position: 'absolute',
            left: WX0 * d - 3000,
            top: WY0 * d - 3000,
            width: (WX1 - WX0) * d + 6000,
            height: (WY1 - WY0) * d + 6000,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.075) 0px, rgba(255,255,255,0.075) 3px, rgba(255,255,255,0) 4px)',
            backgroundSize: `${gap}px ${gap}px`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Background: React.FC<{ cam: Cam; t: number }> = ({ cam, t }) => {
  const b1 = 0.4 + 0.04 * Math.sin(t * 0.5);
  const b2 = 0.36 + 0.04 * Math.sin(t * 0.43 + 2);
  const p1x = -6 + 3 * Math.sin(t * 0.21);
  const p1y = -8 + 3 * Math.cos(t * 0.17);
  const p2x = 106 + 3 * Math.sin(t * 0.19 + 1);
  const p2y = 108 + 3 * Math.cos(t * 0.23 + 2);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: C.bg }} />
      <AbsoluteFill
        style={{ background: 'radial-gradient(ellipse 90% 90% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.3) 100%)' }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 85% at ${p1x}% ${p1y}%, rgba(0,114,206,${b1}) 0%, rgba(0,114,206,${b1 * 0.42}) 30%, rgba(0,114,206,${b1 * 0.12}) 55%, rgba(0,114,206,0) 78%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 85% at ${p2x}% ${p2y}%, rgba(0,114,206,${b2}) 0%, rgba(0,114,206,${b2 * 0.42}) 30%, rgba(0,114,206,${b2 * 0.12}) 55%, rgba(0,114,206,0) 78%)`,
        }}
      />
      <Blobs cam={cam} t={t} />
      <DotGrid cam={cam} />
      <Particles cam={cam} t={t} d={0.35} seed="far" n={420} blur={3} />
      <Particles cam={cam} t={t} d={0.7} seed="mid" n={760} />
      {/* static fine grain — dithers the dark gradients so they don't band after encoding */}
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile('noise.png')})`,
          backgroundSize: '256px 256px',
          opacity: 0.03,
        }}
      />
    </AbsoluteFill>
  );
};

export const World: React.FC<{ cam: Cam; children?: React.ReactNode }> = ({ cam, children }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      transformOrigin: '0 0',
      transform: layerTransform(cam, 1),
    }}
  >
    {children}
  </div>
);

/** Soft out-of-focus bokeh *in front of* the content: it travels faster than the world, selling depth on camera moves. */
export const Foreground: React.FC<{ cam: Cam; t: number }> = ({ cam, t }) => {
  const d = 1.35;
  const parts = useMemo(
    () =>
      Array.from({ length: 300 }).map((_, i) => ({
        x: (WX0 + random(`fx${i}`) * (WX1 - WX0)) * d,
        y: (WY0 + random(`fy${i}`) * (WY1 - WY0)) * d,
        r: 40 + random(`fr${i}`) * 90,
        a: 0.05 + random(`fa${i}`) * 0.07,
        blue: random(`fb${i}`) > 0.4,
        ph: random(`fp${i}`) * 6.28,
      })),
    [],
  );
  const s = 1 + (cam.z - 1) * d;
  const hw = W / 2 / s + 300;
  const hh = H / 2 / s + 300;
  return (
    <AbsoluteFill style={{ transform: layerTransform(cam, d), transformOrigin: '0 0', width: 0, height: 0, pointerEvents: 'none' }}>
      {parts.map((p, i) => {
        const px = p.x + Math.sin(t * 0.25 + p.ph) * 60;
        const py = p.y + Math.cos(t * 0.21 + p.ph) * 45;
        if (Math.abs(px - cam.x * d) > hw || Math.abs(py - cam.y * d) > hh) return null;
        const c = p.blue ? '0,114,206' : '255,255,255';
        const a = p.a * (p.blue ? 1.6 : 1);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px - p.r,
              top: py - p.r,
              width: p.r * 2,
              height: p.r * 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(${c},${a}) 0%, rgba(${c},${a * 0.6}) 45%, rgba(${c},0) 70%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
