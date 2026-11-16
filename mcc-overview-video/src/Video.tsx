import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Background } from './components/Background';
import { EnterType, ExitType, SceneShell } from './components/Scene';
import { loadFonts } from './fonts';
import { FPS, SCENES, SceneId, VO_CHUNKS, s2f, sceneDur, sceneStart } from './timing';
import { LogoScene } from './scenes/S01_Logo';
import { TitleScene } from './scenes/S02_Title';
import { BillAmountScene, EngineScene, MetaDefScene, QuestionScene, ScaleScene } from './scenes/S03_Intro';
import { Ch1, Ch2, Ch3 } from './scenes/Chapter';
import { DataStaysScene, ExploreScene, SourcesScene } from './scenes/S04_Part1';
import { AccessScene, MissingScene } from './scenes/S05_Part2';
import { JobsScene, StewardScene, TraceScene } from './scenes/S06_Part3';
import { ConclusionScene, TaglineScene } from './scenes/S07_Outro';

loadFonts();

type Entry = {
  id: SceneId;
  C: React.FC;
  enter?: EnterType;
  exit?: ExitType;
  inDur?: number;
  outDur?: number;
};

export const SCENE_LIST: Entry[] = [
  { id: 'logo', C: LogoScene, enter: 'fade', exit: 'through', inDur: 10, outDur: 22 },
  { id: 'title', C: TitleScene, enter: 'zoomOut', exit: 'through', inDur: 24 },
  { id: 'question', C: QuestionScene, enter: 'zoom', exit: 'through' },
  { id: 'engine', C: EngineScene, enter: 'zoom', exit: 'push', outDur: 16 },
  { id: 'metaDef', C: MetaDefScene, enter: 'push', exit: 'recede', inDur: 18 },
  { id: 'billAmount', C: BillAmountScene, enter: 'zoom', exit: 'recede' },
  { id: 'scale', C: ScaleScene, enter: 'zoomOut', exit: 'through' },
  { id: 'ch1', C: Ch1, enter: 'zoom', exit: 'through' },
  { id: 'dataStays', C: DataStaysScene, enter: 'zoom', exit: 'through', outDur: 14 },
  { id: 'explore', C: ExploreScene, enter: 'zoom', exit: 'push', inDur: 18 },
  { id: 'sources', C: SourcesScene, enter: 'push', exit: 'through' },
  { id: 'ch2', C: Ch2, enter: 'zoom', exit: 'through' },
  { id: 'access', C: AccessScene, enter: 'zoom', exit: 'recede' },
  { id: 'missing', C: MissingScene, enter: 'zoom', exit: 'through' },
  { id: 'ch3', C: Ch3, enter: 'zoom', exit: 'through' },
  { id: 'steward', C: StewardScene, enter: 'zoom', exit: 'push' },
  { id: 'trace', C: TraceScene, enter: 'push', exit: 'recede' },
  { id: 'jobs', C: JobsScene, enter: 'zoom', exit: 'through' },
  { id: 'conclusion', C: ConclusionScene, enter: 'zoom', exit: 'through' },
  { id: 'tagline', C: TaglineScene, enter: 'zoom', exit: 'none' },
];

export const MCCVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#221F20' }}>
      <Background />
      {SCENE_LIST.map(({ id, C, enter, exit, inDur, outDur }) => (
        <Sequence key={id} name={id} from={sceneStart(id)} durationInFrames={sceneDur(id)}>
          <SceneShell enter={enter} exit={exit} inDur={inDur} outDur={outDur}>
            <C />
          </SceneShell>
        </Sequence>
      ))}
      {VO_CHUNKS.map((c) => (
        <Sequence
          key={c.id}
          name={`vo-${c.id}`}
          from={s2f(c.from + c.offset)}
          durationInFrames={s2f(c.to - c.from) + 2}
          layout="none"
        >
          <Audio
            src={staticFile('media/vo.mp3')}
            trimBefore={Math.round(c.from * FPS)}
            trimAfter={Math.round(c.to * FPS)}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export { SCENES };
