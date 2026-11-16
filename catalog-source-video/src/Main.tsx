import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Background } from './components/Background';
import { FPS, VO_OFFSET } from './lib/constants';
import { loadFonts } from './lib/fonts';
import { Intro } from './scenes/Intro';
import { Methods } from './scenes/Methods';
import { Conclusion } from './scenes/Conclusion';

loadFonts();

export const Main: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#221F20' }}>
    <Background />
    <Intro />
    <Methods />
    <Conclusion />
    <Sequence from={Math.round(VO_OFFSET * FPS)}>
      <Audio src={staticFile('vo.mp3')} />
    </Sequence>
  </AbsoluteFill>
);
