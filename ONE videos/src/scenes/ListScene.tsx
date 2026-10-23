import {KineticText, kineticEnd} from '../components/KineticText';
import {Label, Scramble} from '../components/Label';
import {Rule} from '../components/Rule';
import {useLayout} from '../design/layout';
import {color, font, tracking, type} from '../design/theme';
import type {SceneSpec} from '../types';
import {Stage} from './Stage';

type Spec = Extract<SceneSpec, {type: 'list'}>;

// Title on one side, numbered rows on the other. Each row's rule draws, its number
// decodes and its words rise, cascading down the list.
export const ListScene: React.FC<{spec: Spec; duration: number}> = ({spec, duration}) => {
  const {u, landscape, display} = useLayout();
  const titleStart = spec.kicker ? 8 : 4;
  const first = Math.min(kineticEnd(spec.title, titleStart, 3, 28) - 16, 30);
  const step = Math.max(6, Math.min(10, 40 / spec.items.length));
  const itemSize = (spec.items.length > 4 ? type.h3 * 0.85 : type.h3) * u * display;

  return (
    <Stage duration={duration}>
      <div
        style={{
          display: 'flex',
          flexDirection: landscape ? 'row' : 'column',
          alignItems: landscape ? 'center' : 'stretch',
          gap: (landscape ? 140 : 80) * u,
        }}
      >
        <div style={{flex: landscape ? '0 0 36%' : undefined}}>
          {spec.kicker ? <Label text={spec.kicker} start={2} /> : null}
          <KineticText
            text={spec.title}
            start={titleStart}
            stagger={3}
            duration={28}
            style={{
              marginTop: spec.kicker ? 36 * u : 0,
              fontWeight: 600,
              fontSize: type.h2 * u * display,
              lineHeight: 1.0,
              letterSpacing: tracking.display,
            }}
          />
        </div>
        <div style={{flex: 1}}>
          <Rule start={first - 6} />
          {spec.items.map((item, i) => {
            const at = first + i * step;
            return (
              <div key={i}>
                <div style={{display: 'flex', alignItems: 'baseline', gap: 40 * u, padding: `${30 * u}px 0`}}>
                  <span
                    style={{
                      fontFamily: font.mono,
                      fontWeight: 500,
                      fontSize: type.label * u,
                      letterSpacing: '0.08em',
                      color: color.accent,
                      flex: 'none',
                    }}
                  >
                    <Scramble text={String(i + 1).padStart(2, '0')} start={at} />
                  </span>
                  <KineticText
                    text={item}
                    start={at + 2}
                    stagger={2}
                    duration={26}
                    style={{fontWeight: 500, fontSize: itemSize, lineHeight: 1.05, letterSpacing: tracking.heading}}
                  />
                </div>
                <Rule start={at + 4} />
              </div>
            );
          })}
        </div>
      </div>
    </Stage>
  );
};
