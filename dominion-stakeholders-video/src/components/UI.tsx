import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Icon} from './Icons';
import {pop, tween} from '../lib/anim';
import {BLUE_GRADIENT, C, E, FONT} from '../lib/theme';

/* ----------------------------------------------------------- IconRing
 * Blue ring with inner glow (reference style) holding a lineal icon. */
export const IconRing: React.FC<{
  name: string;
  size?: number;
  start: number;
  iconScale?: number;
  glow?: number;
  dashed?: boolean;
  filled?: boolean;
  style?: React.CSSProperties;
}> = ({name, size = 200, start, iconScale = 0.5, glow = 1, dashed, filled, style}) => {
  const fr = useCurrentFrame();
  const s = pop(fr, start, 13, 0.8, 110);
  const draw = tween(fr, start + 4, start + 30, 0, 1, E.soft);
  const ring = tween(fr, start, start + 22, 0, 1, E.out);
  const r = size / 2 - 3;
  return (
    <div style={{width: size, height: size, position: 'relative', transform: `scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s * 1.4), ...style}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: filled
            ? 'radial-gradient(circle at 50% 40%, rgba(0,114,206,0.55), rgba(0,114,206,0.18) 70%)'
            : `radial-gradient(circle at 50% 50%, rgba(34,31,32,0.0) 40%, rgba(0,114,206,${0.32 * glow}) 78%, rgba(0,114,206,${0.55 * glow}) 100%)`,
          boxShadow: `0 0 ${size * 0.22}px rgba(0,114,206,${0.35 * glow})`,
          opacity: ring,
        }}
      />
      <svg width={size} height={size} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={C.blue}
          strokeWidth={3}
          strokeDasharray={dashed ? '8 10' : undefined}
          pathLength={dashed ? undefined : 1}
          strokeDashoffset={dashed ? 0 : 1 - ring}
          style={dashed ? undefined : {strokeDasharray: '1 1'}}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Icon name={name} size={size * iconScale} progress={draw} />
      </div>
    </div>
  );
};

/* ----------------------------------------------------------- KText
 * Kinetic text: words rise out of a mask with a soft blur, optionally
 * timed to individual voiceover words. Words wrapped in *asterisks* get the
 * blue gradient treatment. */
export type KWord = {w: string; at?: number};
export const KText: React.FC<{
  text: string;
  start?: number;
  stagger?: number;
  times?: number[]; // optional per-word start frames (line-break tokens excluded)
  size?: number;
  weight?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  lineHeight?: number;
  exit?: number; // frame at which the line leaves
  maxWidth?: number;
  style?: React.CSSProperties;
  letterSpacing?: number;
  dur?: number;
}> = ({text, start, stagger = 3, times, size = 64, weight = 600, color = C.text, align = 'center', lineHeight = 1.18, exit, maxWidth, style, letterSpacing = -0.02, dur = 16}) => {
  const fr = useCurrentFrame();
  const t0Base = start ?? times?.[0] ?? 0;
  const exitP = exit !== undefined ? tween(fr, exit, exit + 12, 0, 1, E.in) : 0;
  // split into explicit lines on " / "
  const lines: string[][] = [[]];
  for (const tok of text.split(' ')) {
    if (tok === '/') lines.push([]);
    else lines[lines.length - 1].push(tok);
  }
  let hi = false;
  let wordIdx = -1;
  const justify = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight,
        textAlign: align,
        letterSpacing: `${letterSpacing}em`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: justify,
        opacity: 1 - exitP,
        transform: `translateY(${-exitP * size * 0.5}px)`,
        ...style,
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{display: 'flex', flexWrap: maxWidth ? 'wrap' : 'nowrap', justifyContent: justify, columnGap: '0.26em', maxWidth, whiteSpace: 'nowrap'}}>
          {line.map((tok, i) => {
            if (tok === '') return null;
            wordIdx++;
            let word = tok;
            let isHi = hi;
            if (word.startsWith('*')) {
              hi = true;
              isHi = true;
              word = word.slice(1);
            }
            if (word.endsWith('*')) {
              hi = false;
              word = word.slice(0, -1);
            } else if (/\*[.,?!:;]$/.test(word)) {
              hi = false;
              word = word.replace('*', '');
            }
            const t0 = times?.[wordIdx] ?? t0Base + wordIdx * stagger;
            const p = tween(fr, t0, t0 + dur, 0, 1, E.out);
            return (
              <span key={i} style={{display: 'inline-block', overflow: 'hidden', padding: '0.06em 0.03em 0.14em', margin: '-0.06em -0.03em -0.14em'}}>
                <span
                  style={{
                    display: 'inline-block',
                    transform: `translateY(${(1 - p) * 105}%)`,
                    opacity: Math.min(1, p * 1.6),
                    filter: p < 0.98 ? `blur(${(1 - p) * 6}px)` : undefined,
                    ...(isHi
                      ? {
                          backgroundImage: BLUE_GRADIENT,
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                        }
                      : {}),
                  }}
                >
                  {word}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ----------------------------------------------------------- Chip */
export const Chip: React.FC<{
  label: string;
  start: number;
  icon?: string;
  variant?: 'blue' | 'white' | 'ghost';
  size?: number;
  exit?: number;
  style?: React.CSSProperties;
}> = ({label, start, icon, variant = 'ghost', size = 30, exit, style}) => {
  const fr = useCurrentFrame();
  const s = pop(fr, start, 12, 0.7, 140);
  const ex = exit !== undefined ? tween(fr, exit, exit + 10, 0, 1, E.in) : 0;
  const bg = variant === 'blue' ? C.blue : variant === 'white' ? '#fff' : 'rgba(255,255,255,0.06)';
  const fg = variant === 'white' ? '#1d1b1c' : '#fff';
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.4,
        padding: `${size * 0.42}px ${size * 0.8}px`,
        borderRadius: 999,
        background: bg,
        border: variant === 'ghost' ? '1.5px solid rgba(90,169,234,0.55)' : 'none',
        boxShadow: variant === 'blue' ? '0 0 30px rgba(0,114,206,0.45)' : variant === 'white' ? '0 0 26px rgba(120,180,240,0.35)' : 'none',
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: size,
        color: fg,
        whiteSpace: 'nowrap',
        transform: `scale(${(0.7 + 0.3 * s) * (1 - ex * 0.2)})`,
        opacity: Math.min(1, s * 1.5) * (1 - ex),
        ...style,
      }}
    >
      {icon ? <Icon name={icon} size={size * 1.25} progress={tween(fr, start, start + 24)} /> : null}
      {label}
    </div>
  );
};

/* ----------------------------------------------------------- Panel (glass card) */
export const Panel: React.FC<{style?: React.CSSProperties; children?: React.ReactNode; glow?: boolean}> = ({style, children, glow}) => (
  <div
    style={{
      background: 'linear-gradient(160deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025))',
      border: '1.5px solid rgba(255,255,255,0.10)',
      borderRadius: 28,
      boxShadow: glow ? '0 0 60px rgba(0,114,206,0.25), 0 30px 60px rgba(0,0,0,0.35)' : '0 30px 60px rgba(0,0,0,0.30)',
      ...style,
    }}
  >
    {children}
  </div>
);

/* ----------------------------------------------------------- Label under icons */
export const Label: React.FC<{text: string; start: number; size?: number; color?: string; width?: number; weight?: number}> = ({text, start, size = 30, color = C.text, width = 320, weight = 500}) => (
  <KText text={text} start={start} size={size} weight={weight} color={color} stagger={2} maxWidth={width} style={{marginTop: 22}} />
);
