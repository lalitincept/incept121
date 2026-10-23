import {AbsoluteFill} from 'remotion';
import {Camera} from '../components/Camera';
import {useLayout} from '../design/layout';
import {color, font} from '../design/theme';

// Every scene sits on a Stage: safe margins, a slow camera push, house type defaults.
export const Stage: React.FC<{
  duration: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({duration, children, style}) => {
  const {padX, padY} = useLayout();
  return (
    <Camera duration={duration}>
      <AbsoluteFill
        style={{
          padding: `${padY}px ${padX}px`,
          justifyContent: 'center',
          fontFamily: font.display,
          color: color.fg,
          ...style,
        }}
      >
        {children}
      </AbsoluteFill>
    </Camera>
  );
};
