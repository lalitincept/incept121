import React, { CSSProperties, useMemo } from 'react';
import { C, FONT, useT } from '../lib/constants';
import { ease, ramp } from '../lib/anim';
import { timedWords } from '../lib/words';

export type KineticTextProps = {
  text: string;
  /** voiceover time hint used to match words */
  at: number;
  /** exit start (VO seconds) */
  out?: number;
  outDur?: number;
  size?: number;
  weight?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  maxWidth?: number;
  lineHeight?: number;
  /** seconds a word starts appearing before it is spoken */
  lead?: number;
  /** animate all words together at `at` instead of word sync */
  together?: boolean;
  /** per-word stagger when `together` */
  stagger?: number;
  style?: CSSProperties;
  letterSpacing?: string;
  exit?: 'up' | 'down' | 'fade';
};

export const hlStyle: CSSProperties = {
  backgroundImage: `linear-gradient(100deg, #7CC0F4 0%, ${C.blueLight} 45%, #1F86DA 100%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

/** Word-by-word kinetic typography synced to the voiceover. */
export const KineticText: React.FC<KineticTextProps> = ({
  text,
  at,
  out,
  outDur = 0.55,
  size = 140,
  weight = 600,
  color = C.text,
  align = 'center',
  maxWidth = 3000,
  lineHeight = 1.18,
  lead = 0.12,
  together = false,
  stagger = 0.06,
  style,
  letterSpacing = '-0.02em',
  exit = 'up',
}) => {
  const t = useT();
  const words = useMemo(() => timedWords(text, at), [text, at]);
  if (out !== undefined && t > out + outDur + 0.3) return null;
  const justify = align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end';
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight,
        letterSpacing,
        maxWidth,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: justify,
        textAlign: align,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const s = together ? at + i * stagger : w.s - lead;
        const p = ramp(t, s, 0.62, ease.out);
        const q = out !== undefined ? ramp(t, out + i * 0.018, outDur, ease.inOutSoft) : 0;
        const vis = p * (1 - q);
        const y = (1 - p) * 0.42 + (exit === 'up' ? -q * 0.32 : exit === 'down' ? q * 0.32 : 0);
        const blur = (1 - p) * 16 + q * 12;
        return (
          <React.Fragment key={i}>
            <span
              style={{
                display: 'inline-block',
                marginRight: '0.26em',
                opacity: vis,
                transform: `translateY(${y}em)`,
                filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
                whiteSpace: 'pre',
                ...(w.hl ? hlStyle : null),
              }}
            >
              {w.text}
            </span>
            {w.br ? <span style={{ flexBasis: '100%', height: 0 }} /> : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};
