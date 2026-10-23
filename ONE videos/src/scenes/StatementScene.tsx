import {KineticText} from '../components/KineticText';
import {Label} from '../components/Label';
import {useLayout} from '../design/layout';
import {tracking, type} from '../design/theme';
import type {SceneSpec} from '../types';
import {Stage} from './Stage';

type Spec = Extract<SceneSpec, {type: 'statement'}>;

// One idea, set big. The type is the picture.
export const StatementScene: React.FC<{spec: Spec; duration: number}> = ({spec, duration}) => {
  const {u, display} = useLayout();
  return (
    <Stage duration={duration}>
      {spec.kicker ? <Label text={spec.kicker} start={2} /> : null}
      <KineticText
        text={spec.text}
        start={spec.kicker ? 8 : 4}
        stagger={3}
        duration={28}
        style={{
          marginTop: spec.kicker ? 44 * u : 0,
          maxWidth: 1560 * u,
          fontWeight: 500,
          fontSize: type.h1 * u * display,
          lineHeight: 1.02,
          letterSpacing: tracking.heading,
        }}
      />
    </Stage>
  );
};
