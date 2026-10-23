import {AbsoluteFill, random} from 'remotion';
import {useTime} from '../motion/time';

const TILE = 256;
const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${TILE}' height='${TILE}'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
const tile = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

// Film grain. One noise tile, jumped to a new offset every other frame:
// it reads as living texture, costs almost nothing and dithers gradient banding.
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
  const frame = useTime();
  const step = Math.floor(frame / 2);
  const x = Math.floor(random(`grain-x-${step}`) * TILE);
  const y = Math.floor(random(`grain-y-${step}`) * TILE);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: tile,
        backgroundPosition: `${x}px ${y}px`,
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};
