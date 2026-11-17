import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FPS } from '../theme';

/**
 * #221F20 base with soft #0072CE glows in the top-left and bottom-right corners.
 * The glows breathe and drift very slowly so the frame never feels static.
 */
export const Background: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  const frame = useCurrentFrame();
  const s = frame / FPS;
  const driftA = Math.sin(s * 0.21) * 2.2;
  const driftB = Math.cos(s * 0.17) * 2.2;
  const breathe = 0.92 + Math.sin(s * 0.45) * 0.06;
  const a = 0.78 * intensity * breathe;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(52% 40% at ${4 + driftA}% ${-6 + driftB}%, rgba(0,114,206,${a}) 0%, rgba(0,114,206,${a * 0.45}) 38%, rgba(0,114,206,0) 72%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(52% 40% at ${96 - driftB}% ${106 - driftA}%, rgba(0,114,206,${a}) 0%, rgba(0,114,206,${a * 0.45}) 38%, rgba(0,114,206,0) 72%)`,
        }}
      />
      {/* faint vignette to keep focus in the middle */}
      <AbsoluteFill style={{ background: 'radial-gradient(75% 75% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.28) 100%)' }} />
    </AbsoluteFill>
  );
};
