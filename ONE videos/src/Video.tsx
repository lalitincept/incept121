import {TransitionSeries} from '@remotion/transitions';
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Backdrop} from './components/Backdrop';
import {FrameChrome} from './components/FrameChrome';
import {Grain} from './components/Grain';
import {BASE_FPS} from './motion/time';
import {Scene} from './scenes';
import {settings, shots} from './storyboard';
import {buildTimeline} from './timeline';
import {transition} from './transitions';

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {shots: timeline, total} = buildTimeline(shots, fps);
  const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
  const black = Math.max(
    interpolate(frame, [0, fps * 0.35], [1, 0], clamp),
    interpolate(frame, [total - fps * 0.6, total - 1], [0, 1], clamp),
  );

  return (
    <AbsoluteFill>
      <Backdrop />
      <TransitionSeries>
        {timeline.map((s) => (
          <React.Fragment key={s.index}>
            {s.transition !== 'cut' ? <TransitionSeries.Transition {...transition(s.transition, s.overlap)} /> : null}
            <TransitionSeries.Sequence durationInFrames={s.frames} name={`${s.index + 1} ${s.shot.type}`}>
              <Sequence from={s.delay} layout="none">
                <Scene spec={s.shot} duration={((s.frames - s.delay) * BASE_FPS) / fps} />
              </Sequence>
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>
      {settings.chrome ? <FrameChrome shots={timeline} total={total} title={settings.title} /> : null}
      <Grain />
      <AbsoluteFill style={{backgroundColor: 'black', opacity: black}} />
      {settings.music ? (
        <Audio
          src={staticFile(settings.music)}
          volume={(f) => interpolate(f, [0, fps, total - fps * 1.5, total], [0, 0.7, 0.7, 0], clamp)}
        />
      ) : null}
      {settings.voiceover ? <Audio src={staticFile(settings.voiceover)} /> : null}
    </AbsoluteFill>
  );
};
