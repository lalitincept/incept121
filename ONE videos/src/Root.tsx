import {Composition} from 'remotion';
import {loadFonts} from './design/fonts';
import {settings, shots} from './storyboard';
import {buildTimeline} from './timeline';
import {Video} from './Video';

loadFonts();

const formats = [
  {id: 'Main', width: 1920, height: 1080},
  {id: 'Vertical', width: 1080, height: 1920},
  {id: 'Square', width: 1080, height: 1080},
];

export const RemotionRoot: React.FC = () => {
  const {total} = buildTimeline(shots, settings.fps);
  return (
    <>
      {formats.map((f) => (
        <Composition
          key={f.id}
          id={f.id}
          component={Video}
          durationInFrames={total}
          fps={settings.fps}
          width={f.width}
          height={f.height}
        />
      ))}
    </>
  );
};
