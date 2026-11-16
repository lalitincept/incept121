import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background } from "./components/Background";
import { ScreenStage } from "./stage/ScreenStage";
import { FoundationScene, LogoSting, RunJobScene, SolidScene, TitleScene } from "./scenes/Intro";
import { ComfortScene, EndCard, HealthyScene, NormalScene, TaglineScene } from "./scenes/Outro";
import { FPS, VO_OFFSET } from "./theme";
import "./fonts";

export const Main: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#221F20" }}>
    <Background />

    {/* Introduction — pure motion graphics */}
    <LogoSting />
    <TitleScene />
    <FoundationScene />
    <SolidScene />
    <RunJobScene />

    {/* Methods 1–3 — screen recordings retimed to the voice-over */}
    <ScreenStage />

    {/* Conclusion — pure motion graphics */}
    <HealthyScene />
    <ComfortScene />
    <NormalScene />
    <TaglineScene />
    <EndCard />

    <Sequence from={Math.round(VO_OFFSET * FPS)}>
      <Audio src={staticFile("audio/voiceover.mp3")} />
    </Sequence>
  </AbsoluteFill>
);
