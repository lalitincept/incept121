import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Background } from './components/Background';
import { Intro } from './scenes/Intro';
import { ScreenStory } from './scenes/ScreenStory';
import { Method3 } from './scenes/Method3';
import { Outro } from './scenes/Outro';
import { at } from './theme';

export const Video: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#221F20' }}>
    <Background />
    <Intro />
    <ScreenStory />
    <Method3 />
    <Outro />
    <Sequence from={at(0)} layout="none">
      <Audio src={staticFile('voiceover.mp3')} />
    </Sequence>
  </AbsoluteFill>
);
