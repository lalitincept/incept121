import React from 'react';
import {staticFile, useCurrentFrame} from 'remotion';
import {tween} from '../lib/anim';
import {C, E} from '../lib/theme';

const LW = 970;
const LH = 348;

const Masked: React.FC<{src: string; color: string; style?: React.CSSProperties}> = ({src, color, style}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: color,
      WebkitMaskImage: `url(${staticFile(src)})`,
      maskImage: `url(${staticFile(src)})`,
      WebkitMaskSize: '100% 100%',
      maskSize: '100% 100%',
      ...style,
    }}
  />
);

/**
 * Dominion Energy logo with an animated build: the four stripes of the "D" slide
 * in one after another, the wordmark wipes on, then a light sweep passes over it.
 */
export const Logo: React.FC<{start: number; width: number; markColor?: string; wordColor?: string; sweep?: boolean; style?: React.CSSProperties}> = ({
  start,
  width,
  markColor = C.blue,
  wordColor = '#fff',
  sweep = true,
  style,
}) => {
  const fr = useCurrentFrame();
  const sc = width / LW;
  const t = fr - start;
  const wordP = tween(t, 14, 36, 0, 1, E.out);
  const sweepP = tween(t, 30, 62, -0.3, 1.3, E.inOut);
  return (
    <div style={{position: 'relative', width: LW * sc, height: LH * sc, ...style}}>
      {[0, 1, 2, 3].map((i) => {
        const p = tween(t, i * 4, i * 4 + 20, 0, 1, E.out);
        return (
          <Masked
            key={i}
            src={`img/logo_stripe_${i}.png`}
            color={markColor}
            style={{
              opacity: Math.min(1, p * 1.5),
              transform: `translate(${(1 - p) * -90 * sc}px, ${(1 - p) * 34 * sc}px)`,
            }}
          />
        );
      })}
      <Masked
        src="img/logo_word.png"
        color={wordColor}
        style={{
          clipPath: `inset(0 ${(1 - wordP) * 66}% 0 0)`,
          transform: `translateX(${(1 - wordP) * -24 * sc}px)`,
          opacity: wordP,
        }}
      />
      {sweep ? (
        <Masked
          src="img/logo_full.png"
          color={`linear-gradient(105deg, rgba(255,255,255,0) ${sweepP * 100 - 18}%, rgba(255,255,255,0.95) ${sweepP * 100}%, rgba(255,255,255,0) ${sweepP * 100 + 18}%)`}
          style={{mixBlendMode: 'screen', opacity: 0.85}}
        />
      ) : null}
    </div>
  );
};

export const LOGO_ASPECT = LW / LH;
