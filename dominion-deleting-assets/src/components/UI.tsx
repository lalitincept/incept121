import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT, MONO} from '../theme';
import {Cam, clamp01, ease, lerp, rand} from '../lib/anim';
import {Icon, IconName} from './Icons';

/** Circular icon badge: dark core, glowing blue rim, light ring that draws on. */
export const Badge: React.FC<{
  size: number;
  icon: IconName;
  p: number;
  glow?: number;
  iconScale?: number;
  ring?: string;
  style?: React.CSSProperties;
}> = ({size, icon, p, glow = 1, iconScale = 0.5, ring = C.ring, style}) => {
  const pop = ease.outBack(clamp01(p / 0.5));
  const vis = clamp01(p / 0.2);
  const ringP = ease.inOut(clamp01((p - 0.04) / 0.6));
  const iconP = clamp01((p - 0.18) / 0.82);
  const r = size / 2 - 4;
  const iconSize = size * iconScale;
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        transform: `scale(${lerp(0.55, 1, pop)})`,
        opacity: vis,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at 50% 50%, ${C.bg} 0%, ${C.bg} 50%, rgba(0,114,206,0.26) 80%, rgba(0,114,206,0.58) 100%)`,
          boxShadow: `0 0 ${size * 0.2}px rgba(0,114,206,${0.42 * glow}), 0 ${size * 0.08}px ${size * 0.25}px rgba(0,0,0,0.35)`,
        }}
      />
      <svg width={size} height={size} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={ring}
          strokeWidth={5}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - ringP}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          opacity={ringP > 0.001 ? 0.95 : 0}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: (size - iconSize) / 2,
          top: (size - iconSize) / 2,
        }}
      >
        <Icon name={icon} size={iconSize} p={iconP} />
      </div>
    </div>
  );
};

/** Frosted glass panel with a fine light-blue rim. */
export const Glass: React.FC<{
  w: number;
  h: number;
  r?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  glow?: number;
}> = ({w, h, r = 56, children, style, glow = 0}) => (
  <div
    style={{
      position: 'relative',
      width: w,
      height: h,
      borderRadius: r,
      background:
        'linear-gradient(155deg, rgba(255,255,255,0.085) 0%, rgba(255,255,255,0.03) 45%, rgba(0,114,206,0.10) 100%)',
      border: `3px solid rgba(125,185,238,${0.4 + 0.45 * glow})`,
      boxShadow: `0 50px 140px rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.06), 0 0 ${
        90 * glow
      }px rgba(0,114,206,${0.55 * glow})`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Gradient title pill: pops in as a circle, stretches open into the full capsule, then catches a light sweep. */
export const Pill: React.FC<{
  text: string;
  t: number;
  at: number;
  size: number;
  dur?: number;
  shineAt?: number;
}> = ({text, t, at, size, dur = 0.8, shineAt}) => {
  const height = size * 1.39; // line box + vertical padding
  const pop = ease.outBack(clamp01((t - at) / (dur * 0.35)));
  const open = ease.inOut(clamp01((t - at - dur * 0.2) / (dur * 0.8)));
  const side = `calc((50% - ${height / 2}px) * ${(1 - open).toFixed(4)})`;
  const tp = ease.out(clamp01((t - at - dur * 0.45) / dur));
  const sh = shineAt === undefined ? -1 : clamp01((t - shineAt) / 0.9);
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: `${size * 0.1}px ${size * 0.42}px ${size * 0.14}px`,
        borderRadius: size,
        overflow: 'hidden',
        background: 'linear-gradient(90deg, #EEF6FD 0%, #BFDDF5 40%, #72B2EA 76%, #348ADB 100%)',
        clipPath: `inset(0 ${side} 0 ${side} round ${size}px)`,
        boxShadow: `0 0 ${size * 0.5}px rgba(0,114,206,0.35)`,
        opacity: clamp01((t - at) / (dur * 0.15)),
        transform: `scale(${lerp(0.4, 1, pop)})`,
      }}
    >
      <div
        style={{
          fontSize: size,
          fontWeight: 600,
          letterSpacing: '-0.025em',
          lineHeight: 1.15,
          color: '#1A1718',
          whiteSpace: 'nowrap',
          opacity: tp,
          transform: `scale(${lerp(0.94, 1, tp)})`,
        }}
      >
        {text}
      </div>
      {sh > 0 && sh < 1 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(105deg, rgba(255,255,255,0) 35%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0) 65%)',
            transform: `translateX(${lerp(-110, 110, ease.inOut(sh))}%)`,
            mixBlendMode: 'screen',
          }}
        />
      ) : null}
    </div>
  );
};

/** Pointer in the icon style: blue body, white outline. `press` 0..1 squashes it on click. */
export const Cursor: React.FC<{x: number; y: number; press?: number; size?: number; opacity?: number}> = ({
  x,
  y,
  press = 0,
  size = 120,
  opacity = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: size,
      height: size,
      opacity,
      transformOrigin: '10% 6%',
      transform: `scale(${1 - 0.16 * press})`,
      filter: 'drop-shadow(0 14px 22px rgba(0,0,0,0.45))',
    }}
  >
    <svg width={size} height={size} viewBox="0 0 120 120" style={{overflow: 'visible'}}>
      <path
        d="M12 6 L12 98 L36 76 L53 112 L71 104 L54 69 L88 69 Z"
        fill={C.blue}
        stroke={C.white}
        strokeWidth={7}
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

/** Expanding ring for clicks and impacts. */
export const Ripple: React.FC<{x: number; y: number; t: number; at: number; r0?: number; r1?: number; dur?: number; width?: number}> = ({
  x,
  y,
  t,
  at,
  r0 = 20,
  r1 = 120,
  dur = 0.6,
  width = 5,
}) => {
  const p = clamp01((t - at) / dur);
  if (p <= 0 || p >= 1) return null;
  const r = lerp(r0, r1, ease.out(p));
  return (
    <svg style={{position: 'absolute', left: x - r1 - 10, top: y - r1 - 10, overflow: 'visible'}} width={(r1 + 10) * 2} height={(r1 + 10) * 2}>
      <circle cx={r1 + 10} cy={r1 + 10} r={r} fill="none" stroke={C.ring} strokeWidth={width} opacity={(1 - p) * 0.9} />
    </svg>
  );
};

/** World container: camera looks at (x, y) with zoom s, rotation r (deg). */
export const Camera: React.FC<{cam: Cam; children: React.ReactNode; blurX?: number; blurY?: number; id?: string}> = ({
  cam,
  children,
  blurX = 0,
  blurY = 0,
  id = 'cam',
}) => {
  const useBlur = blurX > 0.4 || blurY > 0.4;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {useBlur ? (
        <svg width={0} height={0} style={{position: 'absolute'}}>
          <filter id={`mb-${id}`} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation={`${blurX.toFixed(2)} ${blurY.toFixed(2)}`} />
          </filter>
        </svg>
      ) : null}
      <AbsoluteFill style={{filter: useBlur ? `url(#mb-${id})` : undefined}}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 3840,
            height: 2160,
            transformOrigin: '0 0',
            transform: `translate(1920px, 1080px) rotate(${cam.r ?? 0}deg) scale(${cam.s}) translate(${-cam.x}px, ${-cam.y}px)`,
          }}
        >
          {children}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Drifting specks behind the content; parallax against the scene camera adds depth. */
export const Particles: React.FC<{g: number; cam: Cam; seed?: number; count?: number; depth?: number; opacity?: number}> = ({
  g,
  cam,
  seed = 1,
  count = 46,
  depth = 0.45,
  opacity = 1,
}) => {
  const s = 1 + (cam.s - 1) * depth;
  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      {new Array(count).fill(0).map((_, i) => {
        const r1 = rand(seed * 100 + i);
        const r2 = rand(seed * 200 + i * 3);
        const r3 = rand(seed * 300 + i * 7);
        const wx = r1 * 7600 - 1900;
        const wy = r2 * 4400 - 1100 - g * (12 + r3 * 26);
        const sx = 1920 + (wx - cam.x * depth - 1920 * (1 - depth)) * s;
        const syRaw = 1080 + (wy - cam.y * depth - 1080 * (1 - depth)) * s;
        const sy = ((syRaw % 2600) + 2600) % 2600 - 220;
        const size = 3 + r3 * 7;
        const tw = 0.55 + 0.45 * Math.sin(g * (0.8 + r1) + i);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: sx,
              top: sy,
              width: size,
              height: size,
              borderRadius: '50%',
              background: r2 > 0.6 ? '#9CCBF2' : '#4C9DE3',
              opacity: (0.12 + r1 * 0.28) * tw,
              boxShadow: `0 0 ${size * 3}px rgba(76,157,227,0.6)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Monospace column chip used to suggest physical/technical columns. */
export const ColumnChip: React.FC<{label: string; p: number; w?: number; stack?: number}> = ({label, p, w = 560, stack = 2}) => {
  const e = ease.out(clamp01(p));
  return (
    <div style={{position: 'relative', width: w, height: 124, opacity: clamp01(p * 1.6), transform: `translateX(${(1 - e) * 60}px) scale(${lerp(0.9, 1, e)})`}}>
      {new Array(stack).fill(0).map((_, k) => (
        <div
          key={k}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 28,
            border: '2px solid rgba(125,185,238,0.22)',
            background: 'rgba(255,255,255,0.025)',
            transform: `translate(${(stack - k) * 18 * e}px, ${(stack - k) * -16 * e}px)`,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 28,
          border: '3px solid rgba(125,185,238,0.55)',
          background: 'linear-gradient(120deg, rgba(37,61,86,0.95), rgba(30,36,44,0.95))',
          display: 'flex',
          alignItems: 'center',
          gap: 26,
          padding: '0 34px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
        }}
      >
        <svg width={52} height={52} viewBox="0 0 46 46">
          <rect x={4} y={6} width={38} height={34} rx={6} fill={C.blue} stroke={C.white} strokeWidth={4} />
          <line x1={4} y1={17} x2={42} y2={17} stroke={C.white} strokeWidth={4} />
          <line x1={23} y1={17} x2={23} y2={40} stroke={C.white} strokeWidth={4} />
        </svg>
        <div style={{fontFamily: MONO, fontSize: 52, fontWeight: 600, color: '#E3EEF8', letterSpacing: '0.02em'}}>{label}</div>
      </div>
    </div>
  );
};

/** Small "!" alert badge (on-brand: blue with white outline). */
export const AlertDot: React.FC<{p: number; size?: number; pulse?: number}> = ({p, size = 84, pulse = 0}) => {
  const e = ease.outBack(clamp01(p));
  return (
    <div style={{position: 'relative', width: size, height: size, transform: `scale(${e})`, opacity: clamp01(p * 2)}}>
      <div
        style={{
          position: 'absolute',
          inset: -size * 0.35 * pulse,
          borderRadius: '50%',
          border: `4px solid rgba(140,195,240,${0.7 * (1 - pulse)})`,
        }}
      />
      <svg width={size} height={size} viewBox="0 0 84 84">
        <circle cx={42} cy={42} r={36} fill={C.blue} stroke={C.white} strokeWidth={6} />
        <line x1={42} y1={24} x2={42} y2={48} stroke={C.white} strokeWidth={8} strokeLinecap="round" />
        <circle cx={42} cy={61} r={5} fill={C.white} />
      </svg>
    </div>
  );
};

/** Text label helper with the house font settings. */
export const Label: React.FC<{children: React.ReactNode; size?: number; weight?: number; color?: string; style?: React.CSSProperties}> = ({
  children,
  size = 64,
  weight = 600,
  color = C.text,
  style,
}) => (
  <div style={{fontFamily: FONT, fontSize: size, fontWeight: weight, color, letterSpacing: '-0.015em', whiteSpace: 'nowrap', ...style}}>
    {children}
  </div>
);
