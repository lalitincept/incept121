import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { E, prog } from '../anim';
import { Logo } from '../components/Logo';

// 0.0s – 4.0s : Dominion Energy logo build (no VO)
export const LogoScene: React.FC = () => {
  const f = useCurrentFrame();
  const stripes = [0, 1, 2, 3].map((i) => prog(f, 8 + i * 5, 26, E.outExpo));
  const word = prog(f, 30, 30, E.inOutSoft);
  const push = prog(f, 0, 120, E.outCubic);
  const glow = prog(f, 20, 40, E.outCubic) * (1 - prog(f, 80, 30, E.inCubic));
  // exit: scale up softly + blur (handled by shell); add a gentle drift
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          position: 'absolute',
          width: 2200,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(0,114,206,0.30) 0%, rgba(0,114,206,0) 65%)',
          opacity: glow,
          filter: 'blur(40px)',
        }}
      />
      <div style={{ transform: `scale(${0.94 + push * 0.08})` }}>
        <Logo width={1240} stripes={stripes} word={word} markColor="#2F74C8" />
      </div>
    </AbsoluteFill>
  );
};
