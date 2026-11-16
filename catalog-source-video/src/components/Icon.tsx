import React, { CSSProperties } from 'react';
import { C, useT } from '../lib/constants';
import { clamp, ease, pop, ramp } from '../lib/anim';
import { ICONS } from './icons';

export type IconProps = {
  name: keyof typeof ICONS;
  size?: number;
  /** VO time the icon starts drawing */
  at: number;
  /** seconds to draw the strokes */
  dur?: number;
  /** VO time it starts leaving (optional) */
  out?: number;
  strokePx?: number;
  stroke?: string;
  fill?: string;
  style?: CSSProperties;
  /** soft blue glow behind the icon */
  glow?: boolean;
};

/** Lineal-colour icon: white strokes draw on, #0072CE shapes pop in behind them. */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 300,
  at,
  dur = 0.9,
  out,
  strokePx = 10,
  stroke = C.white,
  fill = C.blue,
  style,
  glow = false,
}) => {
  const t = useT();
  const def = ICONS[name];
  const sw = (strokePx * 512) / size;
  const n = def.strokes.length;
  const fillP = pop(t, at + dur * 0.25, 13, 110);
  const exitP = out !== undefined ? ramp(t, out, 0.45, ease.inOutSoft) : 0;
  const appear = ramp(t, at, 0.3, ease.outSoft);
  const opacity = appear * (1 - exitP);
  if (opacity <= 0.001) return <div style={{ width: size, height: size, ...style }} />;
  return (
    <div style={{ width: size, height: size, position: 'relative', opacity, transform: `scale(${1 - exitP * 0.15})`, ...style }}>
      {glow ? (
        <div
          style={{
            position: 'absolute',
            inset: -size * 0.35,
            background: `radial-gradient(circle, rgba(0,114,206,${0.35 * fillP}) 0%, rgba(0,114,206,0) 62%)`,
          }}
        />
      ) : null}
      <svg viewBox="0 0 512 512" width={size} height={size} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <g
          fill={fill}
          stroke="none"
          style={{
            transformOrigin: '256px 256px',
            transform: `scale(${0.55 + 0.45 * fillP})`,
            opacity: clamp(fillP * 1.4),
          }}
        >
          {def.fills.map((el, i) => React.cloneElement(el, { key: i }))}
        </g>
        <g fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          {def.strokes.map((el, i) => {
            const p = ramp(t, at + (i / Math.max(1, n)) * dur * 0.45, dur * 0.7, ease.outSoft);
            return React.cloneElement(el as React.ReactElement<any>, {
              key: i,
              pathLength: 1,
              strokeDasharray: '1 1',
              strokeDashoffset: 1 - p,
              opacity: p > 0 ? 1 : 0,
            });
          })}
        </g>
      </svg>
    </div>
  );
};
