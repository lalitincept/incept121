import React from 'react';
import { Composition } from 'remotion';
import { Main } from './Main';
import { FPS, H, TOTAL, W } from './timing';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="CDGCSystemDataSet"
    component={Main}
    durationInFrames={Math.round(TOTAL * FPS)}
    fps={FPS}
    width={W}
    height={H}
  />
);
