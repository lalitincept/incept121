import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {FPS, TOTAL_FRAMES, WIDTH, HEIGHT} from './timeline';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="DeletingAssetsCorrectly"
    component={Video}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
