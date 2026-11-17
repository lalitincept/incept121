import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {Background} from './components/Background';
import {fontFace} from './lib/theme';
import {BulkIntro} from './scenes/BulkIntro';
import {Conclusion} from './scenes/Conclusion';
import {Intro} from './scenes/Intro';
import {ScreenStage} from './scenes/ScreenStage';

export const Video: React.FC<{music?: string | null; musicVolume?: number}> = ({music = null, musicVolume = 0.12}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <style>{fontFace}</style>
    <Background />
    <Intro />
    <BulkIntro />
    <Conclusion />
    <ScreenStage />
    <Audio src={staticFile('media/vo_final.wav')} />
    {music ? <Audio src={staticFile(music)} volume={musicVolume} /> : null}
  </AbsoluteFill>
);
