import React from 'react';
import {clamp01, ease, lerp} from '../lib/anim';
import {LOGO_VIEWBOX, MARK_STRIPES, MARK_VIEWBOX, WORDMARK} from './logoPaths';

const vb = (s: string) => s.split(' ').map(Number);

/**
 * Dominion Energy lockup.
 * draw: outline trace-on; fill: solid fill-in; stripes/word: staggered slide-in reveal; shine: light sweep.
 */
export const LogoLockup: React.FC<{
  id: string;
  height: number;
  draw?: number;
  fill?: number;
  stripes?: number;
  word?: number;
  shine?: number;
  glow?: number;
}> = ({id, height, draw = 1, fill = 1, stripes = 1, word = 1, shine = -1, glow = 0}) => {
  const [x, y, w, h] = vb(LOGO_VIEWBOX);
  const width = (height * w) / h;
  const sw = 2.4;
  const strokeOp = draw >= 1 ? clamp01(1 - fill) : 1;
  const stripeP = (i: number) => ease.out(clamp01((stripes - i * 0.12) / 0.64));
  const wordP = ease.out(clamp01(word));
  return (
    <svg
      width={width}
      height={height}
      viewBox={LOGO_VIEWBOX}
      style={{
        overflow: 'visible',
        display: 'block',
        filter: glow > 0.01 ? `drop-shadow(0 0 ${18 * glow}px rgba(80,160,235,${0.9 * glow}))` : undefined,
      }}
    >
      <defs>
        <clipPath id={`clip-${id}`}>
          {MARK_STRIPES.map((d, i) => (
            <path key={i} d={d} />
          ))}
          <path d={WORDMARK} fillRule="evenodd" />
        </clipPath>
        <linearGradient id={`shine-${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#4FA3EA" stopOpacity="0" />
          <stop offset="0.45" stopColor="#4FA3EA" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="0.55" stopColor="#4FA3EA" stopOpacity="0.85" />
          <stop offset="1" stopColor="#4FA3EA" stopOpacity="0" />
        </linearGradient>
      </defs>
      {MARK_STRIPES.map((d, i) => {
        const sp = stripeP(i);
        return (
          <g key={i} style={{opacity: sp, transform: `translateX(${(1 - sp) * -70}px)`}}>
            <path d={d} fill="#FFFFFF" opacity={fill} />
            {strokeOp > 0.01 ? (
              <path
                d={d}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={sw}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - ease.inOut(clamp01((draw - i * 0.08) / 0.7))}
                opacity={strokeOp}
              />
            ) : null}
          </g>
        );
      })}
      <g style={{opacity: wordP, transform: `translateY(${(1 - wordP) * 24}px)`}}>
        <path d={WORDMARK} fill="#FFFFFF" fillRule="evenodd" opacity={fill} />
        {strokeOp > 0.01 ? (
          <path
            d={WORDMARK}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={sw * 0.8}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - ease.inOut(clamp01((draw - 0.2) / 0.8))}
            opacity={strokeOp}
          />
        ) : null}
      </g>
      {shine > 0 && shine < 1 ? (
        <g clipPath={`url(#clip-${id})`}>
          <rect
            x={lerp(x - w * 0.6, x + w * 1.1, ease.inOut(shine))}
            y={y - 20}
            width={w * 0.5}
            height={h + 40}
            fill={`url(#shine-${id})`}
            transform={`skewX(-18)`}
            style={{mixBlendMode: 'multiply'}}
          />
        </g>
      ) : null}
    </svg>
  );
};

/** The "D" mark alone (used as the title-card watermark). */
export const LogoMark: React.FC<{height: number; color?: string; opacity?: number}> = ({height, color = '#FFFFFF', opacity = 1}) => {
  const [, , w, h] = vb(MARK_VIEWBOX);
  return (
    <svg width={(height * w) / h} height={height} viewBox={MARK_VIEWBOX} style={{display: 'block', opacity}}>
      {MARK_STRIPES.map((d, i) => (
        <path key={i} d={d} fill={color} />
      ))}
    </svg>
  );
};
