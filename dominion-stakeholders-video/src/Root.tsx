import React from 'react';
import {Composition} from 'remotion';
import {IconSheet} from './dev/IconSheet';
import {Video} from './Video';
import {TL} from './lib/time';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="StakeholdersVideo" component={Video} durationInFrames={TL.durationInFrames} fps={30} width={1920} height={1080} />
    <Composition id="IconSheet" component={IconSheet} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
