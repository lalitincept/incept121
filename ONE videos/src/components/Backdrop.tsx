import {noise2D} from '@remotion/noise';
import {AbsoluteFill} from 'remotion';
import {useLayout} from '../design/layout';
import {color} from '../design/theme';
import {useTime} from '../motion/time';

// The stage everything sits on: ink, two slow light pools, a faint grid and a vignette.
// It lives outside the scenes, so transitions move the content and never the room.
export const Backdrop: React.FC = () => {
  const frame = useTime();
  const {width, height, u} = useLayout();
  const t = frame / 240;
  const size = Math.max(width, height);
  const warm = {x: 74 + noise2D('wx', t, 0) * 10, y: 28 + noise2D('wy', t, 0) * 12};
  const cool = {x: 20 + noise2D('cx', t, 0) * 10, y: 80 + noise2D('cy', t, 0) * 10};
  const cell = 120 * u;
  const line = `rgba(243, 240, 232, 0.035)`;

  return (
    <AbsoluteFill style={{backgroundColor: color.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(${size * 0.62}px circle at ${warm.x}% ${warm.y}%, ${color.glowWarm}, transparent 72%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(${size * 0.7}px circle at ${cool.x}% ${cool.y}%, ${color.glowCool}, transparent 72%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
          backgroundSize: `${cell}px ${cell}px`,
          backgroundPosition: `${width / 2}px ${height / 2 - frame * 0.25 * u}px`,
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.6) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
