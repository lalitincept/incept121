// A circle stroke that can draw itself on. progress 0 to 1, drawn clockwise from 12 o'clock.
export const Ring: React.FC<{
  size: number;
  stroke: number;
  progress?: number;
  color: string;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({size, stroke, progress = 1, color, rotate = 0, style}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{overflow: 'visible', transform: `rotate(${rotate - 90}deg)`, ...style}}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - progress)}
        strokeLinecap={progress > 0 && progress < 1 ? 'round' : 'butt'}
        opacity={progress > 0 ? 1 : 0}
      />
    </svg>
  );
};

// Point on a circle of `radius` around the origin, at `progress` of a clockwise turn from 12 o'clock.
export const onRing = (radius: number, progress: number, rotate = 0) => {
  const a = ((progress * 360 + rotate - 90) * Math.PI) / 180;
  return {x: Math.cos(a) * radius, y: Math.sin(a) * radius};
};
