import React from 'react';
import {color, font} from '../design/theme';
import {ease, mix, tween} from '../motion/easing';
import {useTime} from '../motion/time';

export type Word = {text: string; em: boolean; index: number};

// Script markup: *word* or *a few words* is emphasis, a newline is a forced line break.
export const parseRich = (src: string): Word[][] => {
  let em = false;
  let index = 0;
  return src.split('\n').map((line) => {
    const words: Word[] = [];
    for (const raw of line.split(/\s+/).filter(Boolean)) {
      let text = '';
      let wordEm = em;
      for (const ch of raw) {
        if (ch === '*') {
          em = !em;
          if (text === '') wordEm = em;
          continue;
        }
        text += ch;
      }
      if (text) words.push({text, em: wordEm, index: index++});
    }
    return words;
  });
};

// Emphasis switches voice: italic serif in the accent colour.
const emphasis: React.CSSProperties = {
  fontFamily: font.serif,
  fontStyle: 'italic',
  fontWeight: 400,
  fontSize: '1.08em',
  letterSpacing: '-0.01em',
  color: color.accent,
  paddingRight: '0.03em',
};

// A clip window around each word. clip-path (not overflow) keeps baselines aligned
// when serif and sans words share a line.
const mask: React.CSSProperties = {
  display: 'inline-block',
  paddingBottom: '0.16em',
  marginBottom: '-0.16em',
  clipPath: 'inset(-0.5em -0.3em 0 -0.3em)',
};

type Props = {
  text: string;
  start?: number;
  // Frames between words.
  stagger?: number;
  // Frames each word takes to land.
  duration?: number;
  // rise: words climb out of a mask. blur: words fade up out of focus.
  variant?: 'rise' | 'blur';
  style?: React.CSSProperties;
  emStyle?: React.CSSProperties;
};

export const KineticText: React.FC<Props> = ({
  text,
  start = 0,
  stagger = 3,
  duration = 28,
  variant = 'rise',
  style,
  emStyle,
}) => {
  const frame = useTime();
  const lines = parseRich(text);

  return (
    <div style={{textWrap: 'balance', ...style}}>
      {lines.map((line, li) => (
        <div key={li}>
          {line.map((w, wi) => {
            const look = w.em ? {...emphasis, ...emStyle} : undefined;
            const at = start + w.index * stagger;
            let word: React.ReactNode;
            if (variant === 'rise') {
              const p = tween(frame, at, duration, ease.out);
              word = (
                <span style={mask}>
                  <span
                    style={{
                      display: 'inline-block',
                      transform: `translateY(${mix(p, 1.3, 0)}em) rotate(${mix(p, 8, 0)}deg)`,
                      transformOrigin: '0% 100%',
                      ...look,
                    }}
                  >
                    {w.text}
                  </span>
                </span>
              );
            } else {
              const p = tween(frame, at, duration, ease.outSoft);
              word = (
                <span
                  style={{
                    display: 'inline-block',
                    opacity: p,
                    transform: `translateY(${mix(p, 0.32, 0)}em)`,
                    filter: p < 1 ? `blur(${mix(p, 0.16, 0)}em)` : undefined,
                    ...look,
                  }}
                >
                  {w.text}
                </span>
              );
            }
            return (
              <React.Fragment key={wi}>
                {wi > 0 ? ' ' : null}
                {word}
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Frame at which the last word of `text` has landed. Handy for sequencing what follows.
export const kineticEnd = (text: string, start = 0, stagger = 3, duration = 28) => {
  const count = parseRich(text).flat().length;
  return start + Math.max(0, count - 1) * stagger + duration;
};
