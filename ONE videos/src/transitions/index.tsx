import {
  linearTiming,
  type TransitionPresentation,
  type TransitionPresentationComponentProps,
  type TransitionTiming,
} from '@remotion/transitions';
import {AbsoluteFill, interpolate} from 'remotion';
import {useLayout} from '../design/layout';
import {color} from '../design/theme';
import {ease, mix} from '../motion/easing';
import type {TransitionName} from '../types';

type NoProps = Record<string, unknown>;
type Props = TransitionPresentationComponentProps<NoProps>;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const unit = (v: number) => Math.min(1, Math.max(0, v));

// Old shot lifts and defocuses; new shot rises into focus. The workhorse.
const Push: React.FC<Props> = ({children, presentationDirection, presentationProgress: p}) => {
  const {u} = useLayout();
  const exiting = presentationDirection === 'exiting';
  const blur = 14 * u * (exiting ? p : 1 - p);
  return (
    <AbsoluteFill
      style={{
        opacity: exiting ? interpolate(p, [0, 0.6], [1, 0], clamp) : interpolate(p, [0.35, 1], [0, 1], clamp),
        transform: exiting
          ? `translateY(${-90 * u * p}px) scale(${1 - 0.02 * p})`
          : `translateY(${90 * u * (1 - p)}px)`,
        filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// A slanted ink panel with an accent edge sweeps across; the cut happens behind it.
const Wipe: React.FC<Props> = ({children, presentationDirection, presentationProgress: p}) => {
  const {u, width} = useLayout();
  if (presentationDirection === 'exiting') {
    const q = ease.in(unit(p / 0.5));
    return (
      <AbsoluteFill style={{opacity: p < 0.5 ? 1 : 0, transform: `translateX(${q * 70 * u}px)`}}>
        {children}
      </AbsoluteFill>
    );
  }
  const skew = 240 * u;
  const edge = 18 * u;
  const travel = width + 2 * (skew + edge);
  const x = p < 0.5 ? mix(ease.inOutSoft(unit(p / 0.5)), -1, 0) : mix(ease.inOutSoft(unit((p - 0.5) / 0.5)), 0, 1);
  const panel = (extra: number, background: string) => {
    const w = width + 2 * (skew + extra);
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: -(skew + extra),
          width: w,
          background,
          transform: `translateX(${x * travel}px)`,
          clipPath: `polygon(${skew}px 0, ${w}px 0, ${w - skew}px 100%, 0 100%)`,
        }}
      />
    );
  };
  const settle = 1 - ease.out(unit((p - 0.5) / 0.5));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: p >= 0.5 ? 1 : 0, transform: `translateX(${-70 * u * settle}px)`}}>
        {children}
      </AbsoluteFill>
      {panel(edge, color.accent)}
      {panel(0, color.bgRaised)}
    </AbsoluteFill>
  );
};

// Fly through the old shot; the new one rushes up from depth.
const Zoom: React.FC<Props> = ({children, presentationDirection, presentationProgress: p}) => {
  const {u} = useLayout();
  const exiting = presentationDirection === 'exiting';
  const blur = 22 * u * (exiting ? p : 1 - p);
  return (
    <AbsoluteFill
      style={{
        opacity: exiting ? interpolate(p, [0.1, 0.55], [1, 0], clamp) : interpolate(p, [0.4, 0.95], [0, 1], clamp),
        transform: `scale(${exiting ? mix(p, 1, 1.6) : mix(p, 0.72, 1)})`,
        filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// The new shot opens from the centre; an accent ring rides the edge of the opening.
const Iris: React.FC<Props> = ({children, presentationDirection, presentationProgress: p}) => {
  const {u, width, height} = useLayout();
  const r = mix(p, 0, Math.hypot(width, height) / 2 + 40 * u);
  if (presentationDirection === 'exiting') {
    return (
      <AbsoluteFill
        style={{
          transform: `scale(${1 - 0.06 * p})`,
          opacity: interpolate(p, [0.4, 1], [1, 0], clamp),
          maskImage: `radial-gradient(circle at 50% 50%, transparent ${r}px, black ${r + 1}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: `circle(${r}px at 50% 50%)`, transform: `scale(${mix(p, 1.12, 1)})`}}>
        {children}
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: width / 2 - r,
          top: height / 2 - r,
          width: 2 * r,
          height: 2 * r,
          borderRadius: '50%',
          border: `${3 * u}px solid ${color.accent}`,
          opacity: interpolate(p, [0, 0.08, 0.75, 1], [0, 1, 1, 0], clamp),
        }}
      />
    </AbsoluteFill>
  );
};

const make = (component: React.FC<Props>): TransitionPresentation<NoProps> => ({component, props: {}});

const presentations: Record<Exclude<TransitionName, 'cut'>, TransitionPresentation<NoProps>> = {
  push: make(Push),
  wipe: make(Wipe),
  zoom: make(Zoom),
  iris: make(Iris),
};

// The wipe eases each half itself, so it takes linear time.
const curves: Record<Exclude<TransitionName, 'cut'>, (t: number) => number> = {
  push: ease.inOutSoft,
  wipe: (t) => t,
  zoom: ease.inOut,
  iris: ease.inOut,
};

export const transition = (
  name: Exclude<TransitionName, 'cut'>,
  durationInFrames: number,
): {presentation: TransitionPresentation<NoProps>; timing: TransitionTiming} => ({
  presentation: presentations[name],
  timing: linearTiming({durationInFrames, easing: curves[name]}),
});
