import React from 'react';
import { useCurrentFrame } from 'remotion';
import { E, prog } from '../anim';
import { ACCENT_GRADIENT, C, FONT } from '../theme';

// Kinetic typography.
// Markup: words wrapped in *asterisks* get the blue accent gradient.
// "|" forces a line break.

type Token = { text: string; accent: boolean; br?: boolean };

const parse = (src: string): Token[] => {
  const out: Token[] = [];
  let accent = false;
  for (const raw of src.split(' ')) {
    if (raw === '|') {
      out.push({ text: '', accent: false, br: true });
      continue;
    }
    let w = raw;
    let startAcc = false;
    let endAcc = false;
    if (w.startsWith('*')) {
      startAcc = true;
      w = w.slice(1);
    }
    if (w.endsWith('*')) {
      endAcc = true;
      w = w.slice(0, -1);
    }
    if (startAcc) accent = true;
    out.push({ text: w, accent });
    if (endAcc) accent = false;
  }
  return out;
};

export type KProps = {
  text: string;
  /** local frame the first word starts */
  start: number;
  /** frames between words (ignored if `times` given) */
  stagger?: number;
  /** explicit start frame per word (non-break tokens) */
  times?: number[];
  dur?: number;
  size: number;
  weight?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  lineHeight?: number;
  /** frame to start exiting (all words) */
  outAt?: number;
  outDur?: number;
  style?: React.CSSProperties;
  mode?: 'rise' | 'blur' | 'fade' | 'drop';
  letterSpacing?: number;
  accentColor?: string;
  maxWidth?: number;
};

export const KText: React.FC<KProps> = ({
  text,
  start,
  stagger = 3,
  times,
  dur = 22,
  size,
  weight = 500,
  color = C.text,
  align = 'center',
  lineHeight = 1.14,
  outAt,
  outDur = 14,
  style,
  mode = 'rise',
  letterSpacing = -0.02,
  accentColor,
  maxWidth,
}) => {
  const frame = useCurrentFrame();
  const tokens = parse(text);
  let wi = 0;
  const outP = outAt !== undefined ? prog(frame, outAt, outDur, E.inCubic) : 0;
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        lineHeight,
        letterSpacing: `${letterSpacing}em`,
        textAlign: align,
        color,
        maxWidth,
        ...style,
      }}
    >
      {tokens.map((t, i) => {
        if (t.br) return <br key={i} />;
        const idx = wi++;
        const st = times ? times[Math.min(idx, times.length - 1)] : start + idx * stagger;
        const p = prog(frame, st, dur, E.outExpo);
        const pf = prog(frame, st, dur * 0.7, E.outCubic);
        let ty = 0;
        let blur = 0;
        let sc = 1;
        if (mode === 'rise') {
          ty = (1 - p) * 0.42;
          blur = (1 - pf) * 14;
        } else if (mode === 'blur') {
          blur = (1 - pf) * 26;
          sc = 1 + (1 - p) * 0.06;
        } else if (mode === 'drop') {
          ty = -(1 - p) * 0.5;
          blur = (1 - pf) * 14;
        }
        const op = pf * (1 - outP);
        const exitTy = -outP * 0.3;
        const exitBlur = outP * 16;
        const accent = t.accent;
        return (
          <React.Fragment key={i}>
            <span
              style={{
                display: 'inline-block',
                opacity: op,
                transform: `translateY(${ty + exitTy}em) scale(${sc})`,
                filter: blur + exitBlur > 0.05 ? `blur(${blur + exitBlur}px)` : undefined,
                ...(accent
                  ? accentColor
                    ? { color: accentColor }
                    : {
                        backgroundImage: ACCENT_GRADIENT,
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        paddingBottom: '0.08em',
                        marginBottom: '-0.08em',
                      }
                  : null),
              }}
            >
              {t.text}
            </span>
            {i < tokens.length - 1 && !tokens[i + 1]?.br ? ' ' : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** Simple block reveal wrapper (fade + rise + blur), with optional exit. */
export const Reveal: React.FC<{
  at: number;
  dur?: number;
  outAt?: number;
  outDur?: number;
  y?: number;
  x?: number;
  scale?: number;
  blur?: number;
  ease?: (t: number) => number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({
  at,
  dur = 24,
  outAt,
  outDur = 14,
  y = 60,
  x = 0,
  scale = 0.96,
  blur = 16,
  ease = E.outExpo,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, at, dur, ease);
  const pf = prog(frame, at, dur * 0.6, E.outCubic);
  const o = outAt !== undefined ? prog(frame, outAt, outDur, E.inCubic) : 0;
  const s = scale + (1 - scale) * p;
  const b = (1 - pf) * blur + o * blur;
  return (
    <div
      style={{
        opacity: pf * (1 - o),
        transform: `translate(${(1 - p) * x}px, ${(1 - p) * y - o * y * 0.5}px) scale(${s - o * 0.03})`,
        filter: b > 0.05 ? `blur(${b}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
