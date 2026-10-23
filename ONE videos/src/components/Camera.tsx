import {noise2D} from '@remotion/noise';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {useLayout} from '../design/layout';
import {useTime} from '../motion/time';

// A slow push-in with a little handheld drift, so no shot is ever dead still.
export const Camera: React.FC<{
  duration: number;
  push?: number;
  drift?: number;
  children: React.ReactNode;
}> = ({duration, push = 0.035, drift = 5, children}) => {
  const frame = useTime();
  const {u} = useLayout();
  const p = interpolate(frame, [0, duration], [0, 1], {
    easing: Easing.bezier(0.33, 0, 0.67, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = noise2D('cam-x', frame / 90, 0) * drift * u;
  const y = noise2D('cam-y', 0, frame / 90) * drift * u;
  return (
    <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) scale(${1 + push * p})`}}>
      {children}
    </AbsoluteFill>
  );
};
