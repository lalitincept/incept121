import {random} from 'remotion';
import {useLayout} from '../design/layout';
import {color, font, tracking, type} from '../design/theme';
import {tween} from '../motion/easing';
import {useTime} from '../motion/time';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+/<>';

// Mono text that decodes left to right: each character flickers through glyphs, then locks.
export const Scramble: React.FC<{text: string; start?: number; seed?: string}> = ({
  text,
  start = 0,
  seed = text,
}) => {
  const frame = useTime();
  const t = frame - start;
  return (
    <span style={{whiteSpace: 'pre'}}>
      {[...text].map((ch, i) => {
        const appear = i * 0.9;
        const lock = appear + 9;
        if (ch === ' ' || t >= lock) return <span key={i}>{ch}</span>;
        if (t < appear) return <span key={i} style={{opacity: 0}}>{ch}</span>;
        const g = GLYPHS[Math.floor(random(`${seed}-${i}-${t}`) * GLYPHS.length)];
        return (
          <span key={i} style={{opacity: 0.55}}>
            {g}
          </span>
        );
      })}
    </span>
  );
};

// Kicker label: an accent dash draws in, then the words decode.
export const Label: React.FC<{text: string; start?: number; style?: React.CSSProperties}> = ({
  text,
  start = 0,
  style,
}) => {
  const frame = useTime();
  const {u} = useLayout();
  const p = tween(frame, start, 20);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18 * u,
        fontFamily: font.mono,
        fontWeight: 500,
        fontSize: type.label * u,
        letterSpacing: tracking.label,
        textTransform: 'uppercase',
        color: color.fgMuted,
        ...style,
      }}
    >
      <div
        style={{
          width: 32 * u,
          height: 2 * u,
          background: color.accent,
          transform: `scaleX(${p})`,
          transformOrigin: 'left',
          flex: 'none',
        }}
      />
      <Scramble text={text.toUpperCase()} start={start + 5} />
    </div>
  );
};
