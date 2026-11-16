import React from 'react';
import { useCurrentFrame } from 'remotion';
import { getLength, getPointAtLength } from '@remotion/paths';
import { E, prog } from '../anim';

/**
 * Animated SVG connector drawn in absolute (composition) coordinates.
 * Draws on from `at` over `dur` frames; optional flowing light pulses.
 */
export const Connector: React.FC<{
  d: string;
  at: number;
  dur?: number;
  color?: string;
  width?: number;
  dashed?: boolean;
  pulses?: number; // number of travelling dots
  pulseSpeed?: number; // frames per traverse
  pulseColor?: string;
  pulseSize?: number;
  outAt?: number;
  glow?: boolean;
  arrow?: boolean;
  opacity?: number;
}> = ({
  d,
  at,
  dur = 30,
  color = 'rgba(111,181,242,0.85)',
  width = 8,
  dashed = false,
  pulses = 0,
  pulseSpeed = 60,
  pulseColor = '#FFFFFF',
  pulseSize = 16,
  outAt,
  glow = true,
  arrow = false,
  opacity = 1,
}) => {
  const f = useCurrentFrame();
  const len = React.useMemo(() => getLength(d), [d]);
  const p = prog(f, at, dur, E.inOutSoft);
  const o = outAt !== undefined ? 1 - prog(f, outAt, 14, E.inCubic) : 1;
  if (p <= 0) return null;
  const drawn = len * p;
  const dots: React.ReactNode[] = [];
  if (pulses > 0 && p >= 1) {
    for (let i = 0; i < pulses; i++) {
      const tt = ((f - at - dur) / pulseSpeed + i / pulses) % 1;
      const pt = getPointAtLength(d, Math.max(0, tt) * len) ?? { x: 0, y: 0 };
      const fade = Math.sin(Math.max(0, tt) * Math.PI);
      dots.push(
        <circle
          key={i}
          cx={pt.x}
          cy={pt.y}
          r={pulseSize}
          fill={pulseColor}
          opacity={fade}
          style={{ filter: `drop-shadow(0 0 ${pulseSize}px rgba(43,142,240,1))` }}
        />,
      );
    }
  }
  let head: React.ReactNode = null;
  if (arrow && p > 0.02) {
    const a = getPointAtLength(d, Math.max(0, drawn - 2)) ?? { x: 0, y: 0 };
    const b = getPointAtLength(d, Math.max(0, drawn - 40)) ?? { x: 0, y: 0 };
    const ang = Math.atan2(a.y - b.y, a.x - b.x);
    const s = width * 4.2;
    const p1 = `${a.x + Math.cos(ang) * s * 0.4},${a.y + Math.sin(ang) * s * 0.4}`;
    const p2 = `${a.x + Math.cos(ang + 2.5) * s},${a.y + Math.sin(ang + 2.5) * s}`;
    const p3 = `${a.x + Math.cos(ang - 2.5) * s},${a.y + Math.sin(ang - 2.5) * s}`;
    head = <polygon points={`${p1} ${p2} ${p3}`} fill={color} />;
  }
  return (
    <svg
      width={3840}
      height={2160}
      style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: o * opacity, pointerEvents: 'none' }}
    >
      {glow && (
        <path
          d={d}
          stroke="rgba(0,114,206,0.55)"
          strokeWidth={width * 3.2}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${drawn} ${len}`}
          style={{ filter: `blur(${width * 1.6}px)` }}
        />
      )}
      <path
        d={d}
        stroke={color}
        strokeWidth={width}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={dashed ? undefined : `${drawn} ${len}`}
        style={dashed ? { strokeDasharray: `${width * 0.1} ${width * 2.6}` } : undefined}
        opacity={dashed ? p : 1}
      />
      {head}
      {dots}
    </svg>
  );
};

/** Count-up number. */
export const useCount = (from: number, to: number, at: number, dur: number) => {
  const f = useCurrentFrame();
  return Math.round(from + (to - from) * prog(f, at, dur, E.outQuint));
};
