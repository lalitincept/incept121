import React from 'react';
import { useCurrentFrame } from 'remotion';
import { E, prog } from '../anim';
import { C, FONT, PILL_GRADIENT } from '../theme';
import { Icon } from './Icons';
import { Logo } from './Logo';

/** Gradient title pill (series style: light ice-blue -> brand blue). */
export const Pill: React.FC<{
  text: string;
  at: number;
  size?: number;
  outAt?: number;
}> = ({ text, at, size = 150, outAt }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 34, E.outExpo);
  const tp = prog(f, at + 6, 30, E.outExpo);
  const o = outAt !== undefined ? prog(f, outAt, 16, E.inCubic) : 0;
  // sheen sweep
  const sheen = prog(f, at + 14, 50, E.inOut);
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        borderRadius: size,
        padding: `${size * 0.16}px ${size * 0.5}px ${size * 0.2}px`,
        background: PILL_GRADIENT,
        clipPath: `inset(0 ${(1 - p) * 50}% 0 ${(1 - p) * 50}% round ${size}px)`,
        opacity: 1 - o,
        transform: `scale(${0.94 + 0.06 * p - o * 0.04})`,
        filter: o > 0 ? `blur(${o * 14}px)` : undefined,
        boxShadow: `0 ${size * 0.15}px ${size * 0.6}px rgba(0,114,206,0.35)`,
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: size * 0.78,
          letterSpacing: '-0.025em',
          color: '#141A22',
          display: 'inline-block',
          opacity: tp,
          transform: `translateY(${(1 - tp) * 0.35}em)`,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${-40 + sheen * 160}%`,
          width: '30%',
          background:
            'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)',
          opacity: sheen > 0 && sheen < 1 ? 1 : 0,
        }}
      />
    </div>
  );
};

/** Dark navy glass card with a glowing brand-blue border. */
export const GlowCard: React.FC<{
  w: number;
  h: number;
  radius?: number;
  glow?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  border?: string;
}> = ({ w, h, radius = 56, glow = 1, style, children, border }) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: radius,
      background:
        'linear-gradient(160deg, rgba(25,52,86,0.92) 0%, rgba(14,30,52,0.94) 55%, rgba(10,22,40,0.96) 100%)',
      border: border ?? `4px solid rgba(64,158,245,${0.55 + 0.35 * glow})`,
      boxShadow: `0 0 ${90 * glow}px rgba(0,114,206,${0.45 * glow}), inset 0 0 ${60 * glow}px rgba(43,142,240,${0.22 * glow}), 0 40px 80px rgba(0,0,0,0.45)`,
      position: 'relative',
      boxSizing: 'border-box',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Round glowing badge with an icon (series style). */
export const IconBadge: React.FC<{
  icon: string;
  size: number;
  glow?: number;
  iconScale?: number;
  style?: React.CSSProperties;
}> = ({ icon, size, glow = 1, iconScale = 0.56, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background:
        'radial-gradient(circle at 50% 35%, rgba(26,64,108,0.95) 0%, rgba(12,30,54,0.98) 70%)',
      border: `5px solid rgba(64,158,245,${0.6 + 0.4 * glow})`,
      boxShadow: `0 0 ${size * 0.35 * glow}px rgba(0,114,206,${0.55 * glow}), inset 0 0 ${size * 0.18}px rgba(43,142,240,0.35)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      ...style,
    }}
  >
    <Icon name={icon} size={size * iconScale} />
  </div>
);

/** Navy chip with icon + label (series style: "Source / Ownership / Reliability"). */
export const Chip: React.FC<{
  icon?: string;
  label: string;
  size?: number; // font size
  style?: React.CSSProperties;
  active?: number;
}> = ({ icon, label, size = 72, style, active = 1 }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.45,
      padding: `${size * 0.32}px ${size * 0.62}px ${size * 0.32}px ${icon ? size * 0.38 : size * 0.62}px`,
      borderRadius: size * 0.42,
      background: 'linear-gradient(160deg, rgba(22,50,86,0.95), rgba(10,24,44,0.96))',
      border: `4px solid rgba(64,158,245,${0.45 + 0.5 * active})`,
      boxShadow: `0 0 ${50 * active}px rgba(0,114,206,${0.5 * active}), 0 20px 40px rgba(0,0,0,0.35)`,
      fontFamily: FONT,
      fontWeight: 500,
      fontSize: size,
      color: C.text,
      letterSpacing: '-0.015em',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {icon ? <Icon name={icon} size={size * 1.5} /> : null}
    <span>{label}</span>
  </div>
);

/** Blue caption bar used over screen recordings (series style). */
export const CaptionBar: React.FC<{
  text: React.ReactNode;
  at: number;
  outAt?: number;
  width?: number;
  size?: number;
}> = ({ text, at, outAt, width = 2300, size = 68 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 30, E.outExpo);
  const o = outAt !== undefined ? prog(f, outAt, 14, E.inCubic) : 0;
  return (
    <div
      style={{
        width,
        padding: `${size * 0.62}px ${size * 0.9}px`,
        borderRadius: size * 0.5,
        background: 'linear-gradient(180deg, #0B7FDE 0%, #0068BE 100%)',
        border: '3px solid rgba(140,200,255,0.55)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.45), 0 0 80px rgba(0,114,206,0.45)',
        fontFamily: FONT,
        fontSize: size,
        fontWeight: 500,
        lineHeight: 1.3,
        letterSpacing: '-0.012em',
        color: '#fff',
        textAlign: 'center',
        opacity: p * (1 - o),
        transform: `translateY(${(1 - p) * 90 + o * 30}px) scale(${0.97 + 0.03 * p})`,
        filter: (1 - p) * 10 + o * 10 > 0.05 ? `blur(${(1 - p) * 10 + o * 10}px)` : undefined,
        boxSizing: 'border-box',
      }}
    >
      {text}
    </div>
  );
};

/** Faint oversized D mark watermark (as behind the series' title cards). */
export const Watermark: React.FC<{ opacity?: number; width?: number; x?: number; y?: number }> = ({
  opacity = 0.035,
  width = 1500,
  x = 0,
  y = 0,
}) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      opacity,
    }}
  >
    <Logo width={width} markOnly markColor="#FFFFFF" />
  </div>
);

/** Number badge (step markers). */
export const StepDot: React.FC<{ n: string | number; size?: number; style?: React.CSSProperties }> = ({
  n,
  size = 110,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(160deg, #2B8EF0, #0062B4)',
      border: '4px solid rgba(255,255,255,0.85)',
      boxShadow: '0 0 40px rgba(0,114,206,0.6)',
      color: '#fff',
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: size * 0.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
  >
    {n}
  </div>
);
