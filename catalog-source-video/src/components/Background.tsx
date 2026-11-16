import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, useT } from '../lib/constants';
import { drift } from '../lib/anim';

const glow = (x: number, y: number, a: number) =>
  `radial-gradient(ellipse 2500px 1650px at ${x}% ${y}%, rgba(0,114,206,${0.6 * a}) 0%, rgba(0,114,206,${0.3 * a}) 26%, rgba(0,114,206,${0.11 * a}) 52%, rgba(0,114,206,0) 74%)`;

/** #221F20 base with subtle, slowly breathing #0072CE glows in the top-left and bottom-right. */
export const Background: React.FC = () => {
  const t = useT();
  const dx = drift(t, 1, 1.6);
  const dy = drift(t, 2, 1.6);
  const breathe = 0.92 + 0.08 * Math.sin(t * 0.45);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ background: glow(-9 + dx, -16 + dy, breathe) }} />
      <AbsoluteFill style={{ background: glow(109 - dx, 116 - dy, 2 - breathe) }} />
      {/* fine grain to prevent gradient banding after encoding */}
      <AbsoluteFill style={{ opacity: 0.035, mixBlendMode: 'overlay' }}>
        <Img src={staticFile('noise.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
