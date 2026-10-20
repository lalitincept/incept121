import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C} from '../theme';

// #221F20 base with soft #0072CE light pooling in the top-left and bottom-right
// corners. The glows drift and breathe slowly so the frame never feels static.
export const Background: React.FC<{g: number; intensity?: number}> = ({g, intensity = 1}) => {
  const dx = Math.sin(g * 0.21) * 2.2;
  const dy = Math.cos(g * 0.17) * 1.6;
  const breathe = 0.92 + Math.sin(g * 0.45) * 0.08;
  const k = intensity * breathe;
  const a = (v: number) => `rgba(0,114,206,${(v * k).toFixed(3)})`;

  const tl = `radial-gradient(ellipse 52% 34% at ${10 + dx}% ${-6 + dy}%, ${a(0.82)} 0%, ${a(0.5)} 30%, ${a(
    0.16,
  )} 62%, rgba(0,114,206,0) 100%)`;
  const tlWide = `radial-gradient(ellipse 80% 55% at ${-4 + dx}% ${-12 + dy}%, ${a(0.28)} 0%, rgba(0,114,206,0) 70%)`;
  const br = `radial-gradient(ellipse 52% 34% at ${90 - dx}% ${106 - dy}%, ${a(0.82)} 0%, ${a(0.5)} 30%, ${a(
    0.16,
  )} 62%, rgba(0,114,206,0) 100%)`;
  const brWide = `radial-gradient(ellipse 80% 55% at ${104 - dx}% ${112 - dy}%, ${a(0.28)} 0%, rgba(0,114,206,0) 70%)`;

  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <AbsoluteFill style={{background: `${tl}, ${tlWide}`}} />
      <AbsoluteFill style={{background: `${br}, ${brWide}`}} />
      {/* Fine static grain dithers the gradients so they hold up without banding at 4K. */}
      <AbsoluteFill style={{opacity: 0.05, mixBlendMode: 'overlay'}}>
        <Img
          src={staticFile('grain.png')}
          style={{width: '100%', height: '100%', imageRendering: 'pixelated'}}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
