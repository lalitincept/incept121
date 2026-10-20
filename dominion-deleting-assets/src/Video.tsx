import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Background} from './components/Background';
import {LogoOpen, TitleCard} from './scenes/Opening';
import {SceneConnected} from './scenes/SceneConnected';
import {SceneDependencies} from './scenes/SceneDependencies';
import {SceneRisk} from './scenes/SceneRisk';
import {SceneGuardrails} from './scenes/SceneGuardrails';
import {SceneModule} from './scenes/SceneModule';
import {SceneConclusion} from './scenes/SceneConclusion';
import {FadeOut, Outro} from './scenes/Outro';
import {CONC, CONC_LEN, FPS, INTRO, INTRO_LEN, OUTRO, TOTAL, sec} from './timeline';
import {clamp01, ease} from './lib/anim';
import {FONT} from './theme';

const within = (x: number, a: number, b: number) => x >= a && x <= b;

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const g = frame / FPS;
  const t = g - INTRO; // intro VO time
  const c = g - CONC; // conclusion VO time
  const o = g - OUTRO; // outro time
  const glow = 0.25 + 0.75 * ease.inOut(clamp01((g - 1.6) / 2.2));

  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <Background g={g} intensity={glow} />

      {within(g, 0, 4.1) && <LogoOpen g={g} />}
      {within(g, 3.2, 9.1) && <TitleCard g={g} />}

      {within(t, -0.7, 5.65) && <SceneConnected t={t} g={g} />}
      {within(t, 4.85, 14.0) && <SceneDependencies t={t} g={g} />}
      {within(t, 13.35, 24.35) && <SceneRisk t={t} g={g} />}
      {within(t, 23.75, 31.45) && <SceneGuardrails t={t} g={g} />}
      {within(t, 30.75, 45.65) && <SceneModule t={t} g={g} />}

      {within(c, -0.65, 14.35) && <SceneConclusion c={c} g={g} />}
      {within(o, -0.1, TOTAL) && <Outro o={o} />}
      <FadeOut g={g} start={TOTAL - 0.9} dur={0.8} />

      <Sequence from={sec(INTRO)} durationInFrames={sec(INTRO_LEN)} name="VO Intro">
        <Html5Audio src={staticFile('vo_intro.wav')} />
      </Sequence>
      <Sequence from={sec(CONC)} durationInFrames={sec(CONC_LEN)} name="VO Conclusion">
        <Html5Audio src={staticFile('vo_conclusion.wav')} />
      </Sequence>
    </AbsoluteFill>
  );
};
