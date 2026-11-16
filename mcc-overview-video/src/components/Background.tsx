import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { C } from '../theme';

// Global, persistent backdrop: #221F20 with subtle brand-blue light pools in
// the top-left and bottom-right corners that breathe very slowly, plus a static
// fine grain to avoid gradient banding after encoding.
export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const d1 = Math.sin(t * 0.21) * 1.2;
  const d2 = Math.cos(t * 0.17) * 1.4;
  const i1 = 0.92 + Math.sin(t * 0.33) * 0.05;
  const i2 = 0.9 + Math.cos(t * 0.29) * 0.05;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 48% 30% at ${-2 + d1}% ${-4 + d2}%, rgba(0,114,206,${0.95 * i1}) 0%, rgba(0,114,206,${0.55 * i1}) 32%, rgba(0,114,206,${0.16 * i1}) 64%, rgba(0,114,206,0) 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 50% 32% at ${102 - d2}% ${104 - d1}%, rgba(0,114,206,${0.95 * i2}) 0%, rgba(0,114,206,${0.55 * i2}) 32%, rgba(0,114,206,${0.16 * i2}) 64%, rgba(0,114,206,0) 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,255,255,0.018) 0%, rgba(255,255,255,0) 70%)',
        }}
      />
      <AbsoluteFill style={{ opacity: 0.045, mixBlendMode: 'overlay' }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${staticFile('media/grain.png')})`,
            backgroundSize: '512px 512px',
          }}
        />
      </AbsoluteFill>
      {/* invisible Img keeps the grain decoded before first paint */}
      <Img src={staticFile('media/grain.png')} style={{ display: 'none' }} />
    </AbsoluteFill>
  );
};
