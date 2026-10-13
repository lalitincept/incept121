import React, { useContext } from 'react';
import { interpolateColors } from 'remotion';
import { C } from '../theme';
import { clamp, Cubic, cubicAt, cubicD, E, prog, SampleCtx, spring, useT } from '../lib/anim';
import { Icon, IconName } from './Icons';

// ── Layout helpers ─────────────────────────────────────────────────────────

/** Scene root: positioned at a world-space origin, mounted only inside its time window. */
export const Scene: React.FC<{ x: number; y: number; from: number; to: number; children?: React.ReactNode }> = ({
  x,
  y,
  from,
  to,
  children,
}) => {
  const t = useT();
  if (t < from || t > to) return null;
  return <div style={{ position: 'absolute', left: x, top: y }}>{children}</div>;
};

type Anchor = 'center' | 'left' | 'right' | 'top' | 'topleft';
const anchorT: Record<Anchor, string> = {
  center: 'translate(-50%,-50%)',
  left: 'translate(0,-50%)',
  right: 'translate(-100%,-50%)',
  top: 'translate(-50%,0)',
  topleft: '',
};
const anchorO: Record<Anchor, string> = {
  center: '50% 50%',
  left: '0% 50%',
  right: '100% 50%',
  top: '50% 0%',
  topleft: '0% 0%',
};

/** Absolutely place a child (scene-local coords) with optional opacity/scale/rotation. */
export const At: React.FC<{
  x: number;
  y: number;
  anchor?: Anchor;
  o?: number;
  s?: number;
  r?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ x, y, anchor = 'center', o = 1, s = 1, r = 0, style, children }) => {
  if (o <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `${anchorT[anchor]} rotate(${r}deg) scale(${s})`,
        transformOrigin: anchorO[anchor],
        opacity: o,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ── Kinetic typography ─────────────────────────────────────────────────────

export type Word = { w: string; at: number; hl?: 'box' | 'under' | 'strike' | 'blue' | 'dim' };

const KWord: React.FC<Word & { t: number; out?: number; last: boolean }> = ({ w, at, hl, t, out, last }) => {
  const pin = E.outExpo(prog(t, at, 0.75));
  const op = prog(t, at, 0.22);
  const pout = out !== undefined ? E.inQuad(prog(t, out, 0.3)) : 0;
  const ty = (1 - pin) * 108 - pout * 45;
  const hp = E.outQuart(prog(t, at + 0.12, 0.55)) * (1 - E.inQuad(prog(t, out ?? 1e9, 0.3)));
  const sp = E.outQuart(prog(t, at + 0.3, 0.4)) * (1 - pout);
  return (
    <span style={{ position: 'relative', display: 'inline-block', marginRight: last ? 0 : '0.26em' }}>
      {hl === 'box' && (
        <span
          style={{
            position: 'absolute',
            left: '-0.13em',
            right: '-0.13em',
            top: '0.1em',
            bottom: '0.02em',
            background: C.blue,
            borderRadius: '0.12em',
            transform: `scaleX(${hp})`,
            transformOrigin: out !== undefined && t > out ? '100% 50%' : '0% 50%',
          }}
        />
      )}
      <span
        style={{
          display: 'inline-block',
          overflow: 'hidden',
          verticalAlign: 'top',
          padding: '0.04em 0.06em 0.1em',
          margin: '-0.04em -0.06em -0.1em',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            transform: `translateY(${ty}%) rotate(${(1 - pin) * 6}deg)`,
            transformOrigin: '0% 100%',
            opacity: op * (1 - pout),
            filter: pout > 0.01 ? `blur(${pout * 0.06}em)` : undefined,
            color: hl === 'blue' ? C.blue : hl === 'dim' ? C.text2 : undefined,
          }}
        >
          {w}
        </span>
      </span>
      {hl === 'under' && (
        <span
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: '0.0em',
            height: '0.08em',
            background: C.blue,
            borderRadius: '0.04em',
            transform: `scaleX(${hp})`,
            transformOrigin: '0% 50%',
          }}
        />
      )}
      {hl === 'strike' && (
        <span
          style={{
            position: 'absolute',
            left: '-0.06em',
            right: '-0.06em',
            top: '0.62em',
            height: '0.075em',
            background: C.blue,
            borderRadius: '0.04em',
            transform: `scaleX(${sp})`,
            transformOrigin: '0% 50%',
          }}
        />
      )}
    </span>
  );
};

/** A single line of kinetic text: words rise through a mask exactly on their VO timestamp. */
export const KText: React.FC<{
  x: number;
  y: number;
  words: Word[];
  size: number;
  weight?: number;
  anchor?: 'left' | 'center' | 'right';
  out?: number;
  color?: string;
  tracking?: number;
  shadow?: boolean;
  dimAt?: number;
}> = ({ x, y, words, size, weight = 800, anchor = 'left', out, color = '#fff', tracking = -0.015, shadow = true, dimAt }) => {
  const t = useT();
  const dim = dimAt !== undefined ? E.inOutCubic(prog(t, dimAt, 0.5)) : 0;
  if (t < words[0].at - 0.02) return null;
  if (out !== undefined && t > out + 0.35 + words.length * 0.02) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: anchorT[anchor],
        whiteSpace: 'nowrap',
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.12,
        letterSpacing: `${tracking}em`,
        color,
        opacity: 1 - 0.55 * dim,
        textShadow: shadow ? '0 0.06em 0.3em rgba(0,0,0,0.35)' : undefined,
      }}
    >
      {words.map((wd, i) => (
        <KWord key={i} {...wd} t={t} out={out !== undefined ? out + i * 0.02 : undefined} last={i === words.length - 1} />
      ))}
    </div>
  );
};

/** Split a phrase into words that share one timestamp list. */
export const ws = (text: string, times: number[], hl: Record<number, Word['hl']> = {}): Word[] =>
  text.split(' ').map((w, i) => ({ w, at: times[Math.min(i, times.length - 1)], hl: hl[i] }));

/** Tracked label inside a pill that expands from its centre. */
export const Pill: React.FC<{
  x: number;
  y: number;
  text: string;
  at: number;
  out?: number;
  size?: number;
  solid?: boolean;
}> = ({ x, y, text, at, out, size = 52, solid = true }) => {
  const t = useT();
  if (t < at) return null;
  const p = E.outExpo(prog(t, at, 0.8));
  const tp = E.outCubic(prog(t, at + 0.12, 0.7));
  const po = out !== undefined ? E.inCubic(prog(t, out, 0.35)) : 0;
  if (po >= 1) return null;
  const ls = 0.24 + (1 - tp) * 0.3;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${1 - po * 0.15})`, opacity: 1 - po }}>
      <div style={{ position: 'relative', padding: `${size * 0.5}px ${size * 1.05}px` }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 999,
            background: solid ? C.blue : 'rgba(0,114,206,0.12)',
            border: solid ? undefined : `${Math.round(size * 0.08)}px solid ${C.blue}`,
            transform: `scaleX(${p})`,
            boxShadow: solid ? `0 0 ${size * 1.6}px rgba(0,114,206,0.45)` : undefined,
          }}
        />
        <div
          style={{
            position: 'relative',
            fontSize: size,
            fontWeight: 750,
            letterSpacing: `${ls}em`,
            marginRight: `-${ls}em`,
            opacity: tp,
            whiteSpace: 'nowrap',
            lineHeight: 1,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

/** Static (non-kinetic) text that fades/rises in. */
export const FadeText: React.FC<{
  x: number;
  y: number;
  text: string;
  at: number;
  out?: number;
  size: number;
  weight?: number;
  color?: string;
  anchor?: Anchor;
  tracking?: number;
}> = ({ x, y, text, at, out, size, weight = 600, color = '#fff', anchor = 'center', tracking = 0 }) => {
  const t = useT();
  const pi = E.outCubic(prog(t, at, 0.6));
  const po = out !== undefined ? E.inCubic(prog(t, out, 0.35)) : 0;
  const o = pi * (1 - po);
  if (o <= 0.001) return null;
  return (
    <At x={x} y={y} anchor={anchor} o={o} style={{ marginTop: (1 - pi) * size * 0.5 }}>
      <div style={{ fontSize: size, fontWeight: weight, color, whiteSpace: 'nowrap', letterSpacing: `${tracking}em`, lineHeight: 1.15 }}>
        {text}
      </div>
    </At>
  );
};

// ── Icons in motion ────────────────────────────────────────────────────────

/** Icon that springs in while its strokes draw on, with an optional soft blue glow. */
export const PopIcon: React.FC<{
  name: IconName;
  size: number;
  at: number;
  out?: number;
  glow?: boolean;
  draw?: number;
  tilt?: number;
}> = ({ name, size, at, out, glow = false, draw = 1.0, tilt = -10 }) => {
  const t = useT();
  if (t < at) return <div style={{ width: size, height: size }} />;
  const s = spring(t, at, 1.55, 0.5);
  const p = prog(t, at, draw);
  const po = out !== undefined ? E.inCubic(prog(t, out, 0.4)) : 0;
  const gl = E.outCubic(prog(t, at + 0.2, 0.8));
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        transform: `scale(${(0.5 + 0.5 * s) * (1 - po * 0.25)}) rotate(${(1 - s) * tilt}deg)`,
        opacity: clamp(prog(t, at, 0.12)) * (1 - po),
      }}
    >
      {glow && (
        <div
          style={{
            position: 'absolute',
            inset: -size * 0.45,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(0,114,206,${0.34 * gl}) 0%, rgba(0,114,206,${0.12 * gl}) 38%, rgba(0,114,206,0) 68%)`,
          }}
        />
      )}
      <div style={{ position: 'relative' }}>
        <Icon name={name} size={size} p={p} />
      </div>
    </div>
  );
};

/** Rounded glass-like panel; `active` (0..1) lights the border in brand blue. */
export const Panel: React.FC<{
  w: number;
  h: number;
  active?: number;
  radius?: number;
  dashed?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ w, h, active = 0, radius = 56, dashed = false, children, style }) => (
  <div
    style={{
      position: 'relative',
      width: w,
      height: h,
      borderRadius: radius,
      background: `linear-gradient(160deg, rgba(255,255,255,${0.05 + 0.02 * active}) 0%, rgba(255,255,255,0.02) 60%), rgba(0,114,206,${0.1 * active})`,
      border: `5px ${dashed ? 'dashed' : 'solid'} ${interpolateColors(active, [0, 1], ['rgba(255,255,255,0.16)', 'rgba(0,114,206,1)'])}`,
      boxShadow: `0 50px 140px rgba(0,0,0,0.38), 0 0 160px rgba(0,114,206,${0.28 * active})`,
      boxSizing: 'border-box',
      ...style,
    }}
  >
    {children}
  </div>
);

// ── Vector strokes in scene space ──────────────────────────────────────────

/**
 * A path (scene-local coordinates) that draws on over [at, at+dur], optionally
 * dashed and carrying travelling "data" pulses once drawn.
 */
export const FlowPath: React.FC<{
  id: string;
  c: Cubic;
  at: number;
  dur?: number;
  out?: number;
  width?: number;
  color?: string;
  dashed?: boolean;
  pulses?: number;
  pulseSpeed?: number;
  reverse?: boolean;
  arrow?: boolean;
  opacity?: number;
}> = ({
  id,
  c,
  at,
  dur = 0.6,
  out,
  width = 10,
  color = 'rgba(255,255,255,0.55)',
  dashed = true,
  pulses = 0,
  pulseSpeed = 0.45,
  reverse = false,
  arrow = false,
  opacity = 1,
}) => {
  const t = useT();
  const sample = useContext(SampleCtx);
  if (t < at) return null;
  const maskId = `${id}-s${sample}`;
  const p = E.inOutCubic(prog(t, at, dur));
  const po = out !== undefined ? E.inOutCubic(prog(t, out, 0.5)) : 0;
  if (po >= 1) return null;
  const d = cubicD(c);
  const pulseO = E.outCubic(prog(t, at + dur * 0.8, 0.4)) * (1 - po);
  const end = cubicAt(c, 1);
  const pre = cubicAt(c, 0.97);
  const ang = (Math.atan2(end[1] - pre[1], end[0] - pre[0]) * 180) / Math.PI;
  return (
    <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity }}>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x={-20000} y={-20000} width={40000} height={40000}>
          <path
            d={d}
            fill="none"
            stroke="#fff"
            strokeWidth={width * 4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={po > 0 ? -po : 1 - p}
          />
        </mask>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? `${width * 2.2} ${width * 2.6}` : undefined}
        strokeDashoffset={dashed ? -t * width * 9 : undefined}
        mask={`url(#${maskId})`}
      />
      {arrow && p > 0.98 && (
        <g transform={`translate(${end[0]} ${end[1]}) rotate(${ang})`} opacity={1 - po}>
          <path
            d={`M${-width * 3.2} ${-width * 2.6} L0 0 L${-width * 3.2} ${width * 2.6}`}
            fill="none"
            stroke={color}
            strokeWidth={width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
      {pulses > 0 &&
        pulseO > 0 &&
        Array.from({ length: pulses }).map((_, i) => {
          let u = (((t - at) * pulseSpeed + i / pulses) % 1 + 1) % 1;
          if (reverse) u = 1 - u;
          const [px, py] = cubicAt(c, u);
          const edge = Math.min(u, 1 - u) * 6;
          return (
            <g key={i} opacity={pulseO * clamp(edge)}>
              <circle cx={px} cy={py} r={width * 3.2} fill="rgba(0,114,206,0.35)" />
              <circle cx={px} cy={py} r={width * 1.3} fill="#fff" />
            </g>
          );
        })}
    </svg>
  );
};

/** Diagonal slash that strikes through an icon (scene-local centre + size). */
export const Slash: React.FC<{ x: number; y: number; size: number; at: number }> = ({ x, y, size, at }) => {
  const t = useT();
  if (t < at) return null;
  const p = E.outCubic(prog(t, at, 0.45));
  const h = size * 0.48;
  return (
    <svg width={1} height={1} style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}>
      <line x1={h} y1={-h} x2={h - 2 * h * p} y2={-h + 2 * h * p} stroke={C.bg} strokeWidth={34} strokeLinecap="round" />
      <line x1={h} y1={-h} x2={h - 2 * h * p} y2={-h + 2 * h * p} stroke="#fff" strokeWidth={14} strokeLinecap="round" />
    </svg>
  );
};

/** Little four-point sparkles bursting around a point. */
export const Sparkles: React.FC<{ x: number; y: number; at: number; r?: number; n?: number; out?: number }> = ({
  x,
  y,
  at,
  r = 260,
  n = 5,
  out,
}) => {
  const t = useT();
  if (t < at) return null;
  const po = out !== undefined ? E.inCubic(prog(t, out, 0.3)) : 0;
  return (
    <svg width={1} height={1} style={{ position: 'absolute', left: x, top: y, overflow: 'visible', opacity: 1 - po }}>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + 0.6;
        const p = E.outCubic(prog(t, at + i * 0.05, 0.7));
        const tw = 0.6 + 0.4 * Math.sin((t - at) * 5 + i * 1.7);
        const s = (i % 2 === 0 ? 34 : 22) * spring(t, at + i * 0.05, 2.2, 0.45) * tw;
        const cx = Math.cos(a) * r * (0.6 + 0.4 * p);
        const cy = Math.sin(a) * r * (0.6 + 0.4 * p);
        return (
          <path
            key={i}
            transform={`translate(${cx} ${cy}) scale(${s / 50})`}
            d="M0 -50 C4 -10 10 -4 50 0 C10 4 4 10 0 50 C-4 10 -10 4 -50 0 C-10 -4 -4 -10 0 -50 Z"
            fill={i % 2 === 0 ? '#fff' : C.blue}
          />
        );
      })}
    </svg>
  );
};
