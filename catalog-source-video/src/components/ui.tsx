import React, { CSSProperties } from 'react';
import { C, FONT, useT } from '../lib/constants';
import { clamp, ease, pop, ramp, window as win } from '../lib/anim';
import { Icon } from './Icon';
import { ICONS } from './icons';
import { hlStyle } from './KineticText';

/** Absolutely positions children centred on (x, y). */
export const At: React.FC<{ x: number; y: number; children: React.ReactNode; style?: CSSProperties; anchor?: 'center' | 'left' | 'right' | 'top' }> = ({
  x,
  y,
  children,
  style,
  anchor = 'center',
}) => {
  const tr = anchor === 'center' ? 'translate(-50%,-50%)' : anchor === 'left' ? 'translate(0,-50%)' : anchor === 'right' ? 'translate(-100%,-50%)' : 'translate(-50%,0)';
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: tr, width: 'max-content', ...style }}>
      <div>{children}</div>
    </div>
  );
};

/** Visibility helper: pop in at `at`, leave at `out`. */
export const usePresence = (at: number, out?: number, outDur = 0.45) => {
  const t = useT();
  const p = pop(t, at, 14, 130);
  const q = out !== undefined ? ramp(t, out, outDur, ease.inOutSoft) : 0;
  return { p, q, v: clamp(p) * (1 - q), t };
};

/** Glassy rounded tile with an icon and caption (reference-style icon tiles). */
export const IconTile: React.FC<{
  icon: keyof typeof ICONS;
  label?: string;
  at: number;
  out?: number;
  size?: number;
  labelSize?: number;
  tile?: boolean;
  glow?: boolean;
  labelColor?: string;
  sub?: string;
}> = ({ icon, label, at, out, size = 300, labelSize = 72, tile = true, glow = true, labelColor = C.text, sub }) => {
  const { p, q, v, t } = usePresence(at, out);
  if (v <= 0.001 && q > 0) return null;
  const box = size * 1.5;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: v,
        transform: `translateY(${(1 - p) * 60 - q * 40}px) scale(${0.85 + 0.15 * p})`,
      }}
    >
      <div
        style={{
          width: box,
          height: box,
          borderRadius: box * 0.24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: tile ? 'linear-gradient(160deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.025) 100%)' : undefined,
          boxShadow: tile ? '0 0 0 2px rgba(255,255,255,0.10) inset, 0 40px 90px rgba(0,0,0,0.35)' : undefined,
        }}
      >
        <Icon name={icon} size={size} at={at + 0.05} glow={glow} />
      </div>
      {label ? (
        <div
          style={{
            marginTop: size * 0.18,
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: labelSize,
            color: labelColor,
            letterSpacing: '-0.01em',
            textAlign: 'center',
            whiteSpace: 'pre',
            lineHeight: 1.15,
            opacity: ramp(t, at + 0.25, 0.5, ease.outSoft),
          }}
        >
          {label}
        </div>
      ) : null}
      {sub ? (
        <div style={{ marginTop: 14, fontFamily: FONT, fontWeight: 500, fontSize: labelSize * 0.7, color: C.muted, textAlign: 'center' }}>{sub}</div>
      ) : null}
    </div>
  );
};

/** Pill/chip with optional icon. */
export const Chip: React.FC<{
  text: string;
  at: number;
  out?: number;
  icon?: keyof typeof ICONS;
  size?: number;
  variant?: 'glass' | 'blue' | 'outline' | 'muted';
  style?: CSSProperties;
  strike?: number;
}> = ({ text, at, out, icon, size = 72, variant = 'glass', style, strike }) => {
  const { p, q, v, t } = usePresence(at, out);
  const bg =
    variant === 'blue'
      ? `linear-gradient(135deg, #1A86DE 0%, ${C.blue} 100%)`
      : variant === 'outline'
        ? 'rgba(0,114,206,0.10)'
        : variant === 'muted'
          ? 'rgba(255,255,255,0.05)'
          : 'linear-gradient(160deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 100%)';
  const border = variant === 'outline' ? `0 0 0 3px ${C.blue} inset` : '0 0 0 2px rgba(255,255,255,0.12) inset';
  const sp = strike !== undefined ? ramp(t, strike, 0.45, ease.out) : 0;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.4,
        padding: `${size * 0.36}px ${size * 0.62}px`,
        borderRadius: size * 0.5 + 30,
        background: bg,
        boxShadow: `${border}, 0 24px 60px rgba(0,0,0,0.3)`,
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: size,
        color: variant === 'muted' ? C.muted : C.text,
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
        opacity: v,
        transform: `translateY(${(1 - p) * 40 - q * 30}px) scale(${0.8 + 0.2 * p})`,
        position: 'relative',
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={size * 1.25} at={at} strokePx={Math.max(5, size * 0.09)} /> : null}
      <span>{text}</span>
      {strike !== undefined ? (
        <div
          style={{
            position: 'absolute',
            left: '6%',
            top: '50%',
            height: 8,
            width: `${88 * sp}%`,
            background: '#E0505A',
            borderRadius: 4,
            transform: 'rotate(-4deg)',
          }}
        />
      ) : null}
    </div>
  );
};

/** Title pill with a light-blue gradient sweep (reference title style). */
export const TitlePill: React.FC<{ text: string; at: number; out?: number; size?: number }> = ({ text, at, out, size = 120 }) => {
  const { p, q, v, t } = usePresence(at, out);
  const sweep = ramp(t, at, 1.4, ease.inOutSoft);
  return (
    <div
      style={{
        display: 'inline-block',
        padding: `${size * 0.22}px ${size * 0.55}px`,
        borderRadius: 999,
        background: `linear-gradient(90deg, #EAF4FD 0%, #BFE0FA ${30 + sweep * 30}%, #6FB5EE ${60 + sweep * 40}%, #3D97E4 140%)`,
        boxShadow: '0 30px 80px rgba(0,114,206,0.35)',
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: size,
        color: '#10263F',
        letterSpacing: '-0.02em',
        opacity: v,
        transform: `scale(${0.7 + 0.3 * p}) translateY(${-q * 30}px)`,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

/** Animated connector line (draws on, then carries glowing pulses). */
export const FlowLine: React.FC<{
  d: string;
  at: number;
  out?: number;
  dur?: number;
  width?: number;
  dashed?: boolean;
  pulses?: number;
  pulseSpeed?: number;
  color?: string;
  opacity?: number;
  length?: number;
}> = ({ d, at, out, dur = 0.9, width = 8, dashed = false, pulses = 2, pulseSpeed = 0.55, color = 'rgba(255,255,255,0.55)', opacity = 1, length = 1000 }) => {
  const t = useT();
  const p = ramp(t, at, dur, ease.inOutSoft);
  const q = out !== undefined ? ramp(t, out, 0.45, ease.inOutSoft) : 0;
  if (p <= 0 || q >= 1) return null;
  const vis = opacity * (1 - q);
  const pulseEls = [];
  if (pulses > 0 && p >= 1) {
    for (let i = 0; i < pulses; i++) {
      const ph = ((t - at - dur) * pulseSpeed + i / pulses) % 1;
      pulseEls.push(
        <path
          key={i}
          d={d}
          pathLength={1}
          fill="none"
          stroke="#7CC4FA"
          strokeWidth={width * 1.8}
          strokeLinecap="round"
          strokeDasharray={`0.06 0.94`}
          strokeDashoffset={-ph}
          style={{ filter: 'drop-shadow(0 0 14px rgba(0,140,255,0.95))' }}
          opacity={clamp(ph * 8) * clamp((1 - ph) * 8)}
        />,
      );
    }
  }
  return (
    <g opacity={vis}>
      {dashed ? (
        <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={`${length * 0.012} ${length * 0.018}`} style={{ clipPath: undefined }} opacity={p} />
      ) : (
        <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
      )}
      {pulseEls}
    </g>
  );
};

/** Full-frame SVG layer for lines. */
export const LineLayer: React.FC<{ children: React.ReactNode; style?: CSSProperties }> = ({ children, style }) => (
  <svg width={3840} height={2160} viewBox="0 0 3840 2160" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', ...style }}>
    {children}
  </svg>
);

/** Small caps label. */
export const Eyebrow: React.FC<{ text: string; at: number; out?: number; size?: number; color?: string }> = ({ text, at, out, size = 54, color = C.blueSoft }) => {
  const t = useT();
  const v = win(t, at, out ?? 9999, 0.6, 0.45);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: size,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color,
        opacity: v,
        transform: `translateY(${(1 - ramp(t, at, 0.7)) * 30}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const HL: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={hlStyle}>{children}</span>;
