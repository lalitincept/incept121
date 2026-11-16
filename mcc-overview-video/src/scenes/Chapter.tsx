import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { E, prog } from '../anim';
import { KText } from '../components/Kinetic';
import { At } from '../components/Scene';
import { Watermark } from '../components/UI';
import { ACCENT_GRADIENT, FONT } from '../theme';

// Chapter card: ghost numeral, eyebrow, kinetic title, growing accent rule.
export const Chapter: React.FC<{ num: string; title: string; eyebrow: string }> = ({
  num,
  title,
  eyebrow,
}) => {
  const f = useCurrentFrame();
  const n = prog(f, 0, 40, E.outExpo);
  const rule = prog(f, 14, 36, E.outExpo);
  const drift = prog(f, 0, 95, E.linear);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.8 * n }}>
        <Watermark opacity={0.03} width={1300} x={(drift - 0.5) * 80} />
      </AbsoluteFill>
      <At x={1920} y={1060}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 980,
            letterSpacing: '-0.05em',
            lineHeight: 1,
            WebkitTextStroke: '6px rgba(111,181,242,0.35)',
            color: 'transparent',
            opacity: n * 0.9,
            transform: `scale(${1.25 - 0.25 * n + drift * 0.06})`,
            filter: n < 1 ? `blur(${(1 - n) * 30}px)` : undefined,
          }}
        >
          {num}
        </div>
      </At>
      <At x={1920} y={850}>
        <div style={{ opacity: prog(f, 4, 20), transform: `translateY(${(1 - prog(f, 4, 26)) * 30}px)` }}>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 60,
              letterSpacing: '0.34em',
              textTransform: 'uppercase',
              backgroundImage: ACCENT_GRADIENT,
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {eyebrow}
          </div>
        </div>
      </At>
      <At x={1920} y={1080}>
        <KText text={title} start={8} stagger={5} size={190} weight={500} />
      </At>
      <At x={1920} y={1300}>
        <div
          style={{
            width: 900 * rule,
            height: 8,
            borderRadius: 8,
            background: 'linear-gradient(90deg, rgba(0,114,206,0), #2B8EF0 30%, #9BCBF6 50%, #2B8EF0 70%, rgba(0,114,206,0))',
            boxShadow: '0 0 30px rgba(0,114,206,0.9)',
          }}
        />
      </At>
    </AbsoluteFill>
  );
};

export const Ch1: React.FC = () => <Chapter num="01" eyebrow="Part 1" title="What MCC *Actually Does*" />;
export const Ch2: React.FC = () => <Chapter num="02" eyebrow="Part 2" title="Getting *Access*" />;
export const Ch3: React.FC = () => <Chapter num="03" eyebrow="Part 3" title="Why *Data Stewards* Should Care" />;
