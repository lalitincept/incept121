import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../lib/theme';

/** #221F20 base with slowly breathing #0072CE glows in the top-left and bottom-right corners. */
export const Background: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const a = 0.5 + 0.06 * Math.sin(t * 0.35);
  const b = 0.52 + 0.06 * Math.sin(t * 0.3 + 1.7);
  const ax = -6 + 3 * Math.sin(t * 0.13);
  const ay = -14 + 3 * Math.cos(t * 0.11);
  const bx = 104 + 3 * Math.sin(t * 0.12 + 2);
  const by = 112 + 3 * Math.cos(t * 0.1 + 1);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(52% 44% at ${ax}% ${ay}%, rgba(0,114,206,${a}) 0%, rgba(0,114,206,${a * 0.42}) 38%, rgba(0,114,206,0) 72%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(56% 46% at ${bx}% ${by}%, rgba(0,114,206,${b}) 0%, rgba(0,114,206,${b * 0.42}) 38%, rgba(0,114,206,0) 72%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: 'radial-gradient(120% 90% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
