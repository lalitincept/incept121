import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {useLayout} from '../design/layout';
import {color, font, tracking, type} from '../design/theme';
import {tween} from '../motion/easing';
import {BASE_FPS, useTime} from '../motion/time';
import type {TimedShot} from '../timeline';
import {Scramble} from './Label';

// A viewfinder over the whole film: corner marks, the title, a shot counter and a progress line.
export const FrameChrome: React.FC<{shots: TimedShot[]; total: number; title: string}> = ({shots, total, title}) => {
  const frame = useCurrentFrame();
  const t = useTime();
  const {fps} = useVideoConfig();
  const {u, width, height} = useLayout();
  const inset = 48 * u;
  const arm = 22 * u;
  const line = 2 * u;
  const show = tween(t, 4, 24) * interpolate(frame, [total - fps * 0.8, total - fps * 0.3], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // The counter flips halfway through each transition, when the new shot takes over.
  const switchAt = (s: TimedShot) => s.from + s.overlap / 2;
  const active = shots.reduce((acc, s) => (frame >= switchAt(s) ? s.index : acc), 0);
  const flippedAt = (switchAt(shots[active]) * BASE_FPS) / fps;
  const pad = (n: number) => String(n).padStart(2, '0');

  const corner = (x: 'left' | 'right', y: 'top' | 'bottom'): React.CSSProperties => ({
    position: 'absolute',
    [x]: inset,
    [y]: inset,
    width: arm,
    height: arm,
    [`border${y === 'top' ? 'Top' : 'Bottom'}`]: `${line}px solid ${color.fgFaint}`,
    [`border${x === 'left' ? 'Left' : 'Right'}`]: `${line}px solid ${color.fgFaint}`,
  });
  const text: React.CSSProperties = {
    position: 'absolute',
    top: inset + line / 2,
    transform: 'translateY(-50%)',
    fontFamily: font.mono,
    fontWeight: 500,
    fontSize: (type.label - 4) * u,
    letterSpacing: tracking.label,
    textTransform: 'uppercase',
  };

  return (
    <AbsoluteFill style={{opacity: show, pointerEvents: 'none'}}>
      <div style={corner('left', 'top')} />
      <div style={corner('right', 'top')} />
      <div style={corner('left', 'bottom')} />
      <div style={corner('right', 'bottom')} />
      <div style={{...text, left: inset + arm + 18 * u, color: color.fg}}>{title}</div>
      <div style={{...text, right: inset + arm + 18 * u, color: color.fgMuted}}>
        <span style={{color: color.fg}}>
          <Scramble text={pad(active + 1)} start={flippedAt} seed={`shot-${active}`} />
        </span>
        {` / ${pad(shots.length)}`}
      </div>
      <div
        style={{
          position: 'absolute',
          left: inset + arm + 18 * u,
          right: inset + arm + 18 * u,
          top: height - inset - line / 2 - 1 * u,
          height: line,
          background: color.fgGhost,
        }}
      >
        <div
          style={{
            height: '100%',
            width: (width - 2 * (inset + arm + 18 * u)) * Math.min(1, frame / (total - 1)),
            background: color.accent,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
