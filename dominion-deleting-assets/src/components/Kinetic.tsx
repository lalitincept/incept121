import React from 'react';
import {C, HL} from '../theme';
import {clamp01, ease, sampleGradient} from '../lib/anim';

export type Word = {w: string; at: number; hl?: boolean};

/** Build a word list from "text" with per-word VO times; words wrapped in *asterisks* are highlighted. */
export const ws = (text: string, times: number[]): Word[] =>
  text.split(' ').map((raw, i) => {
    const hl = raw.startsWith('*') && raw.endsWith('*');
    return {w: hl ? raw.slice(1, -1) : raw, at: times[Math.min(i, times.length - 1)], hl};
  });

type Props = {
  words: Word[];
  t: number;
  size: number;
  weight?: number;
  color?: string;
  /** Time the line starts leaving. */
  out?: number;
  dur?: number;
  /** Words land slightly ahead of the spoken word so they read as in sync. */
  lead?: number;
  rise?: number;
  align?: 'center' | 'flex-start' | 'flex-end';
  letterSpacing?: string;
  style?: React.CSSProperties;
};

/**
 * Kinetic line: each word rises out of a soft blur on its spoken timestamp.
 * Highlighted runs share one continuous blue gradient across their words.
 */
export const Words: React.FC<Props> = ({
  words,
  t,
  size,
  weight = 500,
  color = C.text,
  out,
  dur = 0.55,
  lead = 0.1,
  rise = 0.42,
  align = 'center',
  letterSpacing = '-0.02em',
  style,
}) => {
  // Gradient spans for consecutive highlighted words.
  const spans: {f0: number; f1: number}[] = words.map(() => ({f0: 0, f1: 0}));
  let i = 0;
  while (i < words.length) {
    if (!words[i].hl) {
      i++;
      continue;
    }
    let j = i;
    while (j < words.length && words[j].hl) j++;
    const total = words.slice(i, j).reduce((acc, w) => acc + w.w.length + 1, -1);
    let pos = 0;
    for (let k = i; k < j; k++) {
      spans[k] = {f0: pos / total, f1: (pos + words[k].w.length) / total};
      pos += words[k].w.length + 1;
    }
    i = j;
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: align,
        alignItems: 'baseline',
        flexWrap: 'nowrap',
        whiteSpace: 'nowrap',
        columnGap: size * 0.27,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.18,
        letterSpacing,
        color,
        ...style,
      }}
    >
      {words.map((wd, k) => {
        const p = ease.out(clamp01((t - (wd.at - lead)) / dur));
        const q = out === undefined ? 0 : ease.inOut(clamp01((t - out - k * 0.02) / 0.32));
        const op = Math.min(1, p * 1.25) * (1 - q);
        const y = (1 - p) * rise * size - q * 0.28 * size;
        const blur = (1 - p) * size * 0.09 + q * size * 0.07;
        const hl: React.CSSProperties = wd.hl
          ? {
              backgroundImage: `linear-gradient(90deg, ${sampleGradient(HL, spans[k].f0)}, ${sampleGradient(
                HL,
                spans[k].f1,
              )})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              // Keep descenders inside the clipped background.
              paddingBottom: '0.08em',
              marginBottom: '-0.08em',
            }
          : {};
        return (
          <span
            key={k}
            style={{
              display: 'inline-block',
              opacity: op,
              transform: `translateY(${y.toFixed(2)}px)`,
              filter: blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : undefined,
              ...hl,
            }}
          >
            {wd.w}
          </span>
        );
      })}
    </div>
  );
};

/** Absolutely centre children on a point. */
export const At: React.FC<{x: number; y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  x,
  y,
  children,
  style,
}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', ...style}}>{children}</div>
);
