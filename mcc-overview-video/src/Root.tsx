import React from 'react';
import { Composition } from 'remotion';
import { MCCVideo } from './Video';
import { DURATION, FPS, HEIGHT, WIDTH } from './timing';
import { IconSheet } from './dev/IconSheet';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="MCCOverview"
      component={MCCVideo}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="IconSheet"
      component={IconSheet}
      durationInFrames={1}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
