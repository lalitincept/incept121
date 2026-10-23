import {KineticText} from '../components/KineticText';
import {Label} from '../components/Label';
import {Meter} from '../components/Meter';
import {Odometer} from '../components/Odometer';
import {useLayout} from '../design/layout';
import {color, font, tracking, type} from '../design/theme';
import {ease, mix, tween} from '../motion/easing';
import {useTime} from '../motion/time';
import type {SceneSpec} from '../types';
import {Stage} from './Stage';

type Spec = Extract<SceneSpec, {type: 'stat'}>;

// A number that earns its size: it rolls in, the meter fills with it, then the meaning lands.
export const StatScene: React.FC<{spec: Spec; duration: number}> = ({spec, duration}) => {
  const t = useTime();
  const {u, width, padX, display} = useLayout();
  const roll = {start: 8, duration: 56};

  // Fit the figure to the frame width (digits are ~0.6em, separators ~0.3em).
  const formatted = spec.value.toLocaleString('en-US', {
    minimumFractionDigits: spec.decimals ?? 0,
    maximumFractionDigits: spec.decimals ?? 0,
  });
  const digits = formatted.replace(/\D/g, '').length;
  const ems = digits * 0.6 + (formatted.length - digits) * 0.3 + ((spec.prefix ?? '').length + (spec.suffix ?? '').length) * 0.36;
  const size = Math.min(300 * u * display, (width - 2 * padX) / ems);

  const affix = tween(t, roll.start + roll.duration * 0.55, 24, ease.out);
  const affixStyle: React.CSSProperties = {
    fontFamily: font.serif,
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: size * 0.62,
    lineHeight: 1,
    color: color.accent,
    opacity: affix,
    transform: `translateY(${mix(affix, 0.3, 0)}em)`,
    paddingBottom: size * 0.06,
  };

  return (
    <Stage duration={duration}>
      {spec.kicker ? <Label text={spec.kicker} start={2} /> : null}
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 14 * u, marginTop: 28 * u}}>
        {spec.prefix ? <span style={{...affixStyle, paddingRight: 8 * u}}>{spec.prefix}</span> : null}
        <Odometer
          value={spec.value}
          decimals={spec.decimals}
          start={roll.start}
          duration={roll.duration}
          style={{fontSize: size, fontWeight: 600, letterSpacing: '-0.05em'}}
        />
        {spec.suffix ? <span style={affixStyle}>{spec.suffix}</span> : null}
      </div>
      <Meter
        start={6}
        fillStart={roll.start}
        fillDuration={roll.duration}
        fill={spec.fill ?? 1}
        style={{marginTop: 34 * u, maxWidth: 1440 * u}}
      />
      <KineticText
        text={spec.label}
        variant="blur"
        start={roll.start + 26}
        stagger={2}
        duration={26}
        style={{
          marginTop: 52 * u,
          maxWidth: 1200 * u,
          fontWeight: 500,
          fontSize: type.h3 * u * display,
          lineHeight: 1.1,
          letterSpacing: tracking.heading,
        }}
      />
      {spec.note ? (
        <div
          style={{
            marginTop: 40 * u,
            fontFamily: font.mono,
            fontSize: (type.label - 2) * u,
            letterSpacing: '0.08em',
            color: color.fgMuted,
            opacity: tween(t, roll.start + 50, 20),
          }}
        >
          {spec.note}
        </div>
      ) : null}
    </Stage>
  );
};
