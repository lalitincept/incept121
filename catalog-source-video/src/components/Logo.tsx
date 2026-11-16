import React from 'react';
import { LOGO_STRIPES, LOGO_VIEWBOX, LOGO_WORD } from '../data/logoPaths';
import { clamp, ease, ramp } from '../lib/anim';
import { useT } from '../lib/constants';

type Props = {
  width: number;
  /** VO time at which the build starts */
  at: number;
  /** blue gradient mark (intro) vs. flat white (end card) */
  blueMark?: boolean;
  /** show wordmark */
  word?: boolean;
  /** seconds over which the build plays */
  speed?: number;
};

/** Dominion Energy logo with a stripe-by-stripe build and wordmark wipe. */
export const Logo: React.FC<Props> = ({ width, at, blueMark = false, word = true, speed = 1 }) => {
  const t = useT();
  const vb = LOGO_VIEWBOX;
  const height = (width * vb.h) / vb.w;
  const wordP = ramp(t, at + 0.55 * speed, 0.9 * speed, ease.out);
  return (
    <svg width={width} height={height} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="markGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6FB9F2" />
          <stop offset="0.5" stopColor="#2C8FE0" />
          <stop offset="1" stopColor="#0B5FB0" />
        </linearGradient>
        <clipPath id="wordClip">
          <rect x={370} y={0} width={clamp(wordP) * 640} height={400} />
        </clipPath>
      </defs>
      {LOGO_STRIPES.map((d, i) => {
        const p = ramp(t, at + i * 0.09 * speed, 0.75 * speed, ease.out);
        return (
          <path
            key={i}
            d={d}
            fill={blueMark ? 'url(#markGrad)' : '#fff'}
            style={{
              opacity: clamp(p * 1.6),
              transform: `translate(${(1 - p) * -120}px, ${(1 - p) * 36}px)`,
            }}
          />
        );
      })}
      {word ? (
        <g clipPath="url(#wordClip)">
          <path d={LOGO_WORD} fill="#fff" style={{ transform: `translateX(${(1 - wordP) * -60}px)`, opacity: clamp(wordP * 2) }} />
        </g>
      ) : null}
    </svg>
  );
};
