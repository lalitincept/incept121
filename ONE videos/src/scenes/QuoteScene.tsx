import {spring} from 'remotion';
import {KineticText, kineticEnd} from '../components/KineticText';
import {Scramble} from '../components/Label';
import {useLayout} from '../design/layout';
import {color, font, tracking, type} from '../design/theme';
import {ease, mix, tween} from '../motion/easing';
import {springs} from '../motion/springs';
import {BASE_FPS, useTime} from '../motion/time';
import type {SceneSpec} from '../types';
import {Stage} from './Stage';

type Spec = Extract<SceneSpec, {type: 'quote'}>;

// A pull quote in the serif voice, with an oversized quote mark that swings into place.
export const QuoteScene: React.FC<{spec: Spec; duration: number}> = ({spec, duration}) => {
  const t = useTime();
  const {u, display} = useLayout();
  const mark = spring({frame: t - 2, fps: BASE_FPS, config: springs.snappy});
  const quoteEnd = kineticEnd(spec.quote, 8, 2.2, 26);
  const by = tween(t, quoteEnd - 14, 26, ease.out);

  return (
    <Stage duration={duration}>
      <div style={{position: 'relative', maxWidth: 1480 * u}}>
        <div
          style={{
            position: 'absolute',
            left: -16 * u * display,
            top: -250 * u * display,
            fontFamily: font.serif,
            fontSize: 420 * u * display,
            lineHeight: 1,
            color: color.accent,
            opacity: Math.min(1, mark),
            transform: `translateY(${mix(mark, 60, 0) * u}px) rotate(${mix(mark, -14, 0)}deg)`,
            transformOrigin: '30% 70%',
          }}
        >
          “
        </div>
        <KineticText
          text={spec.quote}
          variant="blur"
          start={8}
          stagger={2.2}
          duration={26}
          style={{
            fontFamily: font.serif,
            fontWeight: 400,
            fontSize: 104 * u * display,
            lineHeight: 1.06,
            letterSpacing: '-0.015em',
          }}
        />
        <div style={{display: 'flex', alignItems: 'center', gap: 26 * u, marginTop: 60 * u}}>
          <div
            style={{
              width: 56 * u,
              height: 2 * u,
              background: color.accent,
              transform: `scaleX(${by})`,
              transformOrigin: 'left',
            }}
          />
          <span
            style={{
              fontWeight: 600,
              fontSize: 32 * u,
              letterSpacing: '-0.01em',
              opacity: by,
              transform: `translateX(${mix(by, -16, 0) * u}px)`,
            }}
          >
            {spec.author}
          </span>
          {spec.role ? (
            <span
              style={{
                fontFamily: font.mono,
                fontSize: type.label * u,
                letterSpacing: tracking.label,
                textTransform: 'uppercase',
                color: color.fgMuted,
              }}
            >
              <Scramble text={spec.role.toUpperCase()} start={quoteEnd - 4} />
            </span>
          ) : null}
        </div>
      </div>
    </Stage>
  );
};
