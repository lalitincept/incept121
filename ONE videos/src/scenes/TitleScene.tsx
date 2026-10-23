import {AbsoluteFill} from 'remotion';
import {KineticText, kineticEnd} from '../components/KineticText';
import {Label} from '../components/Label';
import {onRing, Ring} from '../components/Ring';
import {useLayout} from '../design/layout';
import {color, font, tracking, type} from '../design/theme';
import {ease, tween} from '../motion/easing';
import {useTime} from '../motion/time';
import type {SceneSpec} from '../types';
import {Stage} from './Stage';

type Spec = Extract<SceneSpec, {type: 'title'}>;

export const TitleScene: React.FC<{spec: Spec; duration: number}> = ({spec, duration}) => {
  const t = useTime();
  const {u, width, height, landscape, portrait, display} = useLayout();
  const titleStart = spec.kicker ? 8 : 4;
  const subStart = kineticEnd(spec.title, titleStart, 4, 30) - 12;

  // The ring motif: draws itself on, then keeps turning with an accent arc chasing its head.
  const size = (landscape ? 780 : 640) * u;
  const cx = landscape ? width * 0.77 : portrait ? width * 0.7 : width * 0.82;
  const cy = landscape ? height * 0.5 : portrait ? height * 0.24 : height * 0.22;
  const draw = tween(t, 4, 70, ease.inOut);
  const spin = t * 0.35;
  const head = onRing(size / 2 - u, draw, spin);
  const arc = 0.16 * tween(t, 10, 50, ease.out);

  return (
    <Stage duration={duration}>
      <AbsoluteFill>
        <div style={{position: 'absolute', left: cx - size / 2, top: cy - size / 2, width: size, height: size}}>
          <Ring size={size} stroke={2 * u} progress={draw} color={color.fgFaint} rotate={spin} />
          <Ring
            size={size}
            stroke={2 * u}
            progress={Math.min(arc, draw)}
            color={color.accent}
            rotate={spin + (draw - Math.min(arc, draw)) * 360}
            style={{position: 'absolute', inset: 0}}
          />
          <div
            style={{
              position: 'absolute',
              left: size / 2 + head.x - 9 * u,
              top: size / 2 + head.y - 9 * u,
              width: 18 * u,
              height: 18 * u,
              borderRadius: '50%',
              background: color.accent,
              boxShadow: `0 0 ${28 * u}px ${color.accent}`,
              opacity: draw > 0 ? 1 : 0,
            }}
          />
        </div>
      </AbsoluteFill>

      <div style={{position: 'relative', maxWidth: landscape ? 1240 * u : undefined}}>
        {spec.kicker ? <Label text={spec.kicker} start={2} /> : null}
        <KineticText
          text={spec.title}
          start={titleStart}
          stagger={4}
          duration={30}
          style={{
            marginTop: spec.kicker ? 40 * u : 0,
            fontWeight: 600,
            fontSize: type.hero * u * display,
            lineHeight: 0.96,
            letterSpacing: tracking.display,
          }}
        />
        {spec.sub ? (
          <KineticText
            text={spec.sub}
            variant="blur"
            start={subStart}
            stagger={1.4}
            duration={24}
            style={{
              marginTop: 48 * u,
              maxWidth: 780 * u,
              fontFamily: font.display,
              fontSize: type.body * u,
              lineHeight: 1.4,
              color: color.fgMuted,
            }}
          />
        ) : null}
      </div>
    </Stage>
  );
};
