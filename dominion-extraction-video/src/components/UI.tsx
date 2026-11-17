import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, EASE_IN, EASE_OUT, FONT, pop, tween, voTime } from '../theme';
import { Icon, IconName } from './Icon';

/** Icon in a glowing circular badge with a label (reference-series style). */
export const IconBadge: React.FC<{
  icon: IconName;
  t0: number;
  out?: number;
  x: number;
  y: number;
  d?: number;
  label?: string;
  labelSize?: number;
  accent?: string;
  dim?: number;
  iconScale?: number;
  ring?: string;
  labelWidth?: number;
}> = ({ icon, t0, out, x, y, d = 440, label, labelSize = 74, accent = C.blue, dim = 0, iconScale = 0.5, ring, labelWidth = 900 }) => {
  const frame = useCurrentFrame();
  const t = voTime(frame);
  const s = pop(frame, t0, { damping: 14, stiffness: 110 });
  const ringP = tween(t, t0, t0 + 0.9, 0, 1, EASE_OUT);
  const iconP = tween(t, t0 + 0.12, t0 + 1.0, 0, 1, EASE_OUT);
  const labelP = tween(t, t0 + 0.25, t0 + 0.8, 0, 1, EASE_OUT);
  const o = out !== undefined ? tween(t, out, out + 0.4, 1, 0, EASE_IN) : 1;
  if (t < t0 - 0.05 || o <= 0) return null;
  const R = d / 2;
  const ringColor = ring ?? '#5AA9F2';
  return (
    <div style={{ position: 'absolute', left: x - R, top: y - R, width: d, height: d, opacity: o * Math.min(1, s * 1.4), transform: `scale(${0.55 + 0.45 * s})` }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at 50% 50%, rgba(18,20,26,${0.9 - dim * 0.3}) 0%, rgba(18,20,26,0.75) 46%, ${hexA(accent, 0.55)} 100%)`,
          boxShadow: `0 0 ${d * 0.18}px ${hexA(accent, 0.35)}`,
        }}
      />
      <svg width={d} height={d} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <circle cx={R} cy={R} r={R - 3} fill="none" stroke={ringColor} strokeWidth={6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ringP} transform={`rotate(-90 ${R} ${R})`} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1 - dim * 0.5 }}>
        <Icon name={icon} size={d * iconScale} progress={iconP} />
      </div>
      {label ? (
        <div
          style={{
            position: 'absolute',
            top: d + 48,
            left: R - labelWidth / 2,
            width: labelWidth,
            textAlign: 'center',
            fontFamily: FONT,
            fontSize: labelSize,
            fontWeight: 500,
            color: C.text,
            lineHeight: 1.15,
            opacity: labelP,
            transform: `translateY(${(1 - labelP) * 30}px)`,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

export const hexA = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** Dark glass panel with a brand-blue rim and glow. */
export const Glass: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; radius?: number; glow?: number }> = ({ style, children, radius = 56, glow = 1 }) => (
  <div
    style={{
      position: 'absolute',
      borderRadius: radius,
      background: 'linear-gradient(160deg, rgba(48,52,62,0.92) 0%, rgba(30,30,36,0.94) 100%)',
      border: '4px solid rgba(70,155,240,0.7)',
      boxShadow: `0 0 ${70 * glow}px rgba(0,114,206,${0.45 * glow}), inset 0 0 80px rgba(0,114,206,0.14), 0 40px 120px rgba(0,0,0,0.45)`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Gradient pill (white → brand blue) like the series title cards. */
export const Pill: React.FC<{ text: string; size?: number; style?: React.CSSProperties; dark?: boolean }> = ({ text, size = 120, style, dark = true }) => (
  <div
    style={{
      display: 'inline-block',
      fontFamily: FONT,
      fontSize: size,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: dark ? '#17191D' : C.white,
      padding: `${size * 0.16}px ${size * 0.42}px ${size * 0.2}px`,
      borderRadius: 999,
      background: 'linear-gradient(90deg, #EEF6FF 0%, #A9D2F7 42%, #3A8FE0 100%)',
      boxShadow: '0 0 60px rgba(0,114,206,0.45)',
      ...style,
    }}
  >
    {text}
  </div>
);

/** Small glass chip with optional icon. */
export const Chip: React.FC<{ text: string; icon?: IconName; size?: number; style?: React.CSSProperties; color?: string; border?: string; bg?: string }> = ({
  text,
  icon,
  size = 58,
  style,
  color = C.text,
  border = 'rgba(70,155,240,0.75)',
  bg = 'rgba(28,30,36,0.92)',
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.4,
      fontFamily: FONT,
      fontSize: size,
      fontWeight: 500,
      color,
      padding: `${size * 0.32}px ${size * 0.6}px`,
      borderRadius: 999,
      background: bg,
      border: `3px solid ${border}`,
      boxShadow: '0 0 30px rgba(0,114,206,0.35), 0 16px 40px rgba(0,0,0,0.35)',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {icon ? <Icon name={icon} size={size * 1.3} strokePx={7} /> : null}
    {text}
  </div>
);

/** Appear/disappear wrapper: rises and un-blurs in at t0, fades out at out. */
export const Reveal: React.FC<{ t0: number; out?: number; children: React.ReactNode; dy?: number; dx?: number; style?: React.CSSProperties; scaleFrom?: number; dur?: number }> = ({
  t0,
  out,
  children,
  dy = 60,
  dx = 0,
  style,
  scaleFrom = 1,
  dur = 0.6,
}) => {
  const t = voTime(useCurrentFrame());
  const p = tween(t, t0, t0 + dur, 0, 1, EASE_OUT);
  const o = out !== undefined ? tween(t, out, out + 0.4, 1, 0, EASE_IN) : 1;
  if (p <= 0 || o <= 0) return null;
  return (
    <div
      style={{
        opacity: p * o,
        transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) scale(${scaleFrom + (1 - scaleFrom) * p})`,
        filter: p < 1 ? `blur(${(1 - p) * 12}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Animated connector line between two points (draws on from t0 over dur). */
export const Connector: React.FC<{
  x1: number; y1: number; x2: number; y2: number; t0: number; dur?: number; out?: number;
  color?: string; width?: number; dashed?: boolean; arrow?: boolean; glow?: boolean; broken?: number;
}> = ({ x1, y1, x2, y2, t0, dur = 0.6, out, color = '#4FA3F0', width = 6, dashed = false, arrow = false, glow = true, broken = 0 }) => {
  const t = voTime(useCurrentFrame());
  const p = tween(t, t0, t0 + dur, 0, 1, EASE_OUT);
  const o = out !== undefined ? tween(t, out, out + 0.35, 1, 0, EASE_IN) : 1;
  if (p <= 0 || o <= 0) return null;
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const ex = x1 + (x2 - x1) * p;
  const ey = y1 + (y2 - y1) * p;
  const minX = Math.min(x1, x2) - 60, minY = Math.min(y1, y2) - 60;
  const gap = broken * len * 0.16;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const ux = Math.cos(ang), uy = Math.sin(ang);
  return (
    <svg style={{ position: 'absolute', left: minX, top: minY, overflow: 'visible', opacity: o }} width={Math.abs(x2 - x1) + 120} height={Math.abs(y2 - y1) + 120}>
      <g transform={`translate(${-minX} ${-minY})`} style={{ filter: glow ? `drop-shadow(0 0 12px ${color})` : undefined }}>
        {broken > 0 ? (
          <>
            <line x1={x1} y1={y1} x2={mx - ux * gap} y2={my - uy * gap + broken * 30} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? `${width * 3} ${width * 3}` : undefined} />
            <line x1={mx + ux * gap} y1={my + uy * gap + broken * 40} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? `${width * 3} ${width * 3}` : undefined} />
          </>
        ) : (
          <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dashed ? `${width * 3} ${width * 3}` : undefined} />
        )}
        {arrow && p > 0.95 ? (
          <path d={`M ${x2 - Math.cos(ang - 0.5) * 34} ${y2 - Math.sin(ang - 0.5) * 34} L ${x2} ${y2} L ${x2 - Math.cos(ang + 0.5) * 34} ${y2 - Math.sin(ang + 0.5) * 34}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
        ) : null}
      </g>
    </svg>
  );
};

/** Expanding click ripple. */
export const Ripple: React.FC<{ x: number; y: number; t0: number; size?: number; color?: string }> = ({ x, y, t0, size = 160, color = '#4FA3F0' }) => {
  const t = voTime(useCurrentFrame());
  if (t < t0 || t > t0 + 1.2) return null;
  const rings = [0, 0.22];
  return (
    <>
      {rings.map((d, i) => {
        const p = tween(t, t0 + d, t0 + d + 0.8, 0, 1, EASE_OUT);
        if (p <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - (size * p) / 2,
              top: y - (size * p) / 2,
              width: size * p,
              height: size * p,
              borderRadius: '50%',
              border: `${6 * (1 - p) + 2}px solid ${color}`,
              opacity: 1 - p,
              boxShadow: `0 0 30px ${color}`,
            }}
          />
        );
      })}
    </>
  );
};
