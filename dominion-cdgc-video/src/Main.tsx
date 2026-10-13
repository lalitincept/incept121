import React, { useEffect, useState } from 'react';
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import '@fontsource-variable/plus-jakarta-sans';
import { C, FONT } from './theme';
import { CONC_VO_AT, FPS, INTRO_VO_AT, TOTAL } from './timing';
import { E, prog, SampleCtx, TimeCtx } from './lib/anim';
import { cameraAt, cameraSpeedPx } from './lib/camera';
import { Background, Foreground, World } from './components/Background';
import { TitleScene } from './scenes/Title';
import { S1Catalog } from './scenes/S1Catalog';
import { S2Hierarchy } from './scenes/S2Hierarchy';
import { S3Domain } from './scenes/S3Domain';
import { S4Learn } from './scenes/S4Learn';
import { S5Container } from './scenes/S5Container';
import { S6Forms } from './scenes/S6Forms';
import { EndScene } from './scenes/End';

const useFonts = () => {
  const [handle] = useState(() => delayRender('Loading Plus Jakarta Sans'));
  useEffect(() => {
    const fam = '"Plus Jakarta Sans Variable"';
    Promise.all([400, 500, 600, 700, 800].map((w) => document.fonts.load(`${w} 100px ${fam}`)))
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
};

/** Everything that moves with the camera, rendered at time t. */
const Stack: React.FC<{ t: number }> = ({ t }) => {
  const cam = cameraAt(t);
  return (
    <AbsoluteFill>
      <Background cam={cam} t={t} />
      <World cam={cam}>
        <TitleScene />
        <S1Catalog />
        <S2Hierarchy />
        <S3Domain />
        <S4Learn />
        <S5Container />
        <S6Forms />
        <EndScene />
      </World>
      <Foreground cam={cam} t={t} />
    </AbsoluteFill>
  );
};

// Motion blur: when the camera moves fast, average several sub-frame samples
// across a 180° shutter. Still frames render once, so cost stays low.
const SHUTTER = 0.5;
const PX_PER_SAMPLE = 10;
const MAX_SAMPLES = 14;

export const sampleCount = (t: number, fps: number) => {
  const speed = cameraSpeedPx(t, fps) * SHUTTER;
  return speed < PX_PER_SAMPLE * 1.2 ? 1 : Math.min(MAX_SAMPLES, Math.ceil(speed / PX_PER_SAMPLE));
};

export type MainProps = {
  /** Optional licensed music bed placed in /public (e.g. "music.mp3"). */
  musicSrc?: string;
  musicVolume?: number;
};

export const Main: React.FC<MainProps> = ({ musicSrc, musicVolume = 0.12 }) => {
  useFonts();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const n = sampleCount(t, fps);
  const shutter = SHUTTER / fps;
  const times = n === 1 ? [t] : Array.from({ length: n }, (_, k) => t + shutter * (k / (n - 1) - 0.5));
  const fadeIn = E.outCubic(prog(t, 0, 0.6));
  const fadeOut = E.inOutCubic(prog(t, TOTAL - 0.85, 0.8));

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT, color: C.white, overflow: 'hidden' }}>
      <AbsoluteFill style={{ opacity: fadeIn * (1 - fadeOut) }}>
        {times.map((ts, k) => (
          // Successive 1/(k+1) opacities give an equal-weight average of all samples.
          <AbsoluteFill key={k} style={{ opacity: 1 / (k + 1) }}>
            <TimeCtx.Provider value={ts}>
              <SampleCtx.Provider value={k}>
                <Stack t={ts} />
              </SampleCtx.Provider>
            </TimeCtx.Provider>
          </AbsoluteFill>
        ))}
      </AbsoluteFill>

      <Sequence from={Math.round(INTRO_VO_AT * FPS)} layout="none" name="VO – Intro">
        <Audio src={staticFile('vo_intro.wav')} />
      </Sequence>
      <Sequence from={Math.round(CONC_VO_AT * FPS)} layout="none" name="VO – Conclusion">
        <Audio src={staticFile('vo_conclusion.wav')} />
      </Sequence>
      {musicSrc && (
        <Audio
          src={staticFile(musicSrc)}
          volume={(f) => musicVolume * Math.min(1, f / (1.5 * fps), (durationInFrames - f) / (2 * fps))}
        />
      )}
    </AbsoluteFill>
  );
};
