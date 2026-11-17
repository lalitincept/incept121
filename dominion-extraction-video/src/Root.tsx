import React from 'react';
import { Composition } from 'remotion';
import './fonts';
import { Video } from './Video';
import { DURATION, FPS, HEIGHT, WIDTH } from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="ExtractionResults" component={Video} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
);
