import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, EASE_IN, EASE_OUT, FONT, HIGHLIGHT_GRADIENT, tween, voTime } from '../theme';

/**
 * Kinetic text line. Words wrapped in *asterisks* get the blue highlight gradient.
 * `times` is either a start time (seconds, VO clock) with `stagger`, or one time per word
 * so each word lands exactly when it is spoken.
 */
export type KTextProps = {
  text: string;
  times: number | number[];
  stagger?: number;
  out?: number;
  size?: number;
  weight?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  maxWidth?: number;
  lineHeight?: number;
  style?: React.CSSProperties;
  dur?: number;
  rise?: number;
  outRise?: number;
};

export const parseWords = (text: string) => {
  const out: { w: string; hi: boolean; br?: boolean }[] = [];
  let hi = false;
  text.split(/\s+/).forEach((raw) => {
    if (raw === '/') {
      out.push({ w: '', hi: false, br: true });
      return;
    }
    let w = raw;
    let startHi = false;
    let endHi = false;
    if (w.startsWith('*')) {
      startHi = true;
      w = w.slice(1);
    }
    if (w.endsWith('*') || w.endsWith('*,') || w.endsWith('*.') || w.endsWith('*?')) {
      endHi = true;
      w = w.replace(/\*([,.?]?)$/, '$1');
    }
    if (startHi) hi = true;
    out.push({ w, hi });
    if (endHi) hi = false;
  });
  return out;
};

export const KText: React.FC<KTextProps> = ({
  text,
  times,
  stagger = 0.07,
  out,
  size = 96,
  weight = 500,
  color = C.text,
  align = 'center',
  maxWidth,
  lineHeight = 1.18,
  style,
  dur = 0.55,
  rise = 0.55,
  outRise = 0.55,
}) => {
  const t = voTime(useCurrentFrame());
  const words = parseWords(text);
  let wi = 0;
  const outP = out !== undefined ? tween(t, out, out + 0.3, 0, 1, EASE_IN) : 0;
  if (outP >= 1) return null;
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        color,
        textAlign: align,
        lineHeight,
        letterSpacing: '-0.015em',
        maxWidth,
        opacity: 1 - outP,
        transform: `translateY(${-outP * size * outRise}px)`,
        filter: outP > 0 ? `blur(${outP * 10}px)` : undefined,
        ...style,
      }}
    >
      {words.map((wd, i) => {
        if (wd.br) return <br key={i} />;
        const start = Array.isArray(times) ? times[Math.min(wi, times.length - 1)] : times + wi * stagger;
        wi++;
        const p = tween(t, start, start + dur, 0, 1, EASE_OUT);
        const hiStyle: React.CSSProperties = wd.hi
          ? {
              backgroundImage: HIGHLIGHT_GRADIENT,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              fontWeight: Math.min(800, weight + 100),
            }
          : {};
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              opacity: p,
              transform: `translateY(${(1 - p) * size * rise}px)`,
              filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined,
              ...hiStyle,
            }}
          >
            {wd.w}
            {i < words.length - 1 && !words[i + 1]?.br ? ' ' : ''}
          </span>
        );
      })}
    </div>
  );
};

/** Absolutely positioned kinetic line centred on (x, y). */
export const KLine: React.FC<KTextProps & { x?: number; y: number; width?: number }> = ({ x = 1920, y, width = 3400, ...rest }) => (
  <div style={{ position: 'absolute', left: x - width / 2, top: y, width, display: 'flex', justifyContent: 'center' }}>
    <KText {...rest} maxWidth={width} />
  </div>
);
