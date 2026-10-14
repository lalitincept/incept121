import React from 'react';
import {Composition} from 'remotion';
import {Reel, FPS, DURATION_S} from './Reel';

export const Root: React.FC = () => (
  <Composition id="InceptReel" component={Reel} durationInFrames={DURATION_S * FPS} fps={FPS} width={1080} height={1920} />
);
