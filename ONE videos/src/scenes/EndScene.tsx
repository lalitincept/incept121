import {spring} from 'remotion';
import {KineticText, kineticEnd} from '../components/KineticText';
import {Scramble} from '../components/Label';
import {Ring} from '../components/Ring';
import {useLayout} from '../design/layout';
import {color, font, tracking, type} from '../design/theme';
import {ease, mix, tween} from '../motion/easing';
import {springs} from '../motion/springs';
import {BASE_FPS, useTime} from '../motion/time';
import type {SceneSpec} from '../types';
import {Stage} from './Stage';

type Spec = Extract<SceneSpec, {type: 'end'}>;

// The sign-off. The ring closes, the dot drops in with a pulse, then the name and the ask.
export const EndScene: React.FC<{spec: Spec; duration: number}> = ({spec, duration}) => {
  const t = useTime();
  const {u, display} = useLayout();
  const size = 168 * u;
  const draw = tween(t, 2, 34, ease.inOut);
  const land = 30;
  const dot = spring({frame: t - land, fps: BASE_FPS, config: springs.pop});
  const pulse = tween(t, land + 2, 40, ease.out);
  const titleStart = land + 4;
  const lineStart = kineticEnd(spec.title, titleStart, 4, 30) - 12;
  const ctaStart = spec.line ? kineticEnd(spec.line, lineStart, 1.6, 24) - 6 : lineStart;
  const cta = spring({frame: t - ctaStart, fps: BASE_FPS, config: springs.snappy});

  return (
    <Stage duration={duration} style={{alignItems: 'center', textAlign: 'center'}}>
      <div style={{position: 'relative', width: size, height: size}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `${2 * u}px solid ${color.accent}`,
            transform: `scale(${mix(pulse, 1, 2.1)})`,
            opacity: pulse > 0 && pulse < 1 ? (1 - pulse) * 0.7 : 0,
          }}
        />
        <Ring size={size} stroke={5 * u} progress={draw} color={color.fg} rotate={-40 + draw * 40} />
        <div
          style={{
            position: 'absolute',
            left: size / 2 - 26 * u,
            top: size / 2 - 26 * u,
            width: 52 * u,
            height: 52 * u,
            borderRadius: '50%',
            background: color.accent,
            transform: `translateY(${mix(Math.min(dot, 1), -120, 0) * u}px) scale(${dot})`,
          }}
        />
      </div>
      <KineticText
        text={spec.title}
        start={titleStart}
        stagger={4}
        duration={30}
        style={{
          marginTop: 64 * u,
          fontWeight: 600,
          fontSize: type.h1 * u * display,
          lineHeight: 1,
          letterSpacing: tracking.display,
        }}
      />
      {spec.line ? (
        <KineticText
          text={spec.line}
          variant="blur"
          start={lineStart}
          stagger={1.6}
          duration={24}
          style={{marginTop: 30 * u, fontSize: type.body * u, color: color.fgMuted}}
        />
      ) : null}
      {spec.cta ? (
        <div
          style={{
            marginTop: 56 * u,
            display: 'flex',
            alignItems: 'center',
            gap: 16 * u,
            padding: `${18 * u}px ${30 * u}px`,
            borderRadius: 999,
            border: `${1.5 * u}px solid ${color.fgFaint}`,
            background: 'rgba(243, 240, 232, 0.04)',
            fontFamily: font.mono,
            fontWeight: 500,
            fontSize: type.label * u,
            letterSpacing: tracking.label,
            textTransform: 'uppercase',
            opacity: Math.min(1, cta),
            transform: `translateY(${mix(cta, 24, 0) * u}px) scale(${mix(Math.min(cta, 1), 0.92, 1)})`,
          }}
        >
          <span style={{width: 10 * u, height: 10 * u, borderRadius: '50%', background: color.accent}} />
          <Scramble text={spec.cta.toUpperCase()} start={ctaStart + 2} />
        </div>
      ) : null}
    </Stage>
  );
};
