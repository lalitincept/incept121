import {interpolate} from 'remotion';
import {useLayout} from '../design/layout';
import {color} from '../design/theme';
import {ease, tween} from '../motion/easing';
import {useTime} from '../motion/time';

// A row of ticks that rise in, then light up in the accent colour as `fill` is reached.
export const Meter: React.FC<{
  start?: number;
  fillStart?: number;
  fillDuration?: number;
  // How much of the meter ends up lit, 0 to 1.
  fill?: number;
  count?: number;
  style?: React.CSSProperties;
}> = ({start = 0, fillStart = start + 10, fillDuration = 54, fill = 1, count = 72, style}) => {
  const frame = useTime();
  const {u} = useLayout();
  const lit = tween(frame, fillStart, fillDuration, ease.out) * fill * count;
  return (
    <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 40 * u, ...style}}>
      {Array.from({length: count}, (_, i) => {
        const rise = tween(frame, start + i * 0.35, 16, ease.out);
        const glow = interpolate(lit - i, [0, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const major = i % 8 === 0;
        return (
          <div
            key={i}
            style={{
              width: 3 * u,
              height: (major ? 40 : 22) * u,
              background: glow > 0 ? color.accent : color.fgFaint,
              opacity: glow > 0 ? 0.35 + glow * 0.65 : 1,
              transform: `scaleY(${rise})`,
              transformOrigin: 'bottom',
            }}
          />
        );
      })}
    </div>
  );
};
