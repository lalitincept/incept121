import {useLayout} from '../design/layout';
import {color as palette} from '../design/theme';
import {ease, tween} from '../motion/easing';
import {useTime} from '../motion/time';

// A hairline that draws itself in.
export const Rule: React.FC<{
  start?: number;
  duration?: number;
  color?: string;
  thickness?: number;
  style?: React.CSSProperties;
}> = ({start = 0, duration = 34, color = palette.fgFaint, thickness = 2, style}) => {
  const frame = useTime();
  const {u} = useLayout();
  const p = tween(frame, start, duration, ease.inOutSoft);
  return (
    <div
      style={{
        height: thickness * u,
        background: color,
        transform: `scaleX(${p})`,
        transformOrigin: 'left',
        ...style,
      }}
    />
  );
};
