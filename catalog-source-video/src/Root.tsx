import React from 'react';
import { Composition } from 'remotion';
import { Main } from './Main';
import { IconSheet } from './IconSheet';
import { FPS, H, TOTAL_FRAMES, W } from './lib/constants';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="CatalogSource" component={Main} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="IconSheet" component={IconSheet} durationInFrames={1} fps={FPS} width={W} height={H} />
  </>
);
