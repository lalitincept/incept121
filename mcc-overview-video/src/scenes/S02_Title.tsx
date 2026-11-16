import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { E, prog } from '../anim';
import { KText, Reveal } from '../components/Kinetic';
import { Chip, Pill, Watermark } from '../components/UI';
import { at } from '../timing';
import { FONT } from '../theme';

const T = at('title');

// VO: "This module talks about Metadata Command Center, what it is,
//      and how you get access to it."
export const TitleScene: React.FC = () => {
  const f = useCurrentFrame();
  const wm = prog(f, 0, 60, E.outCubic);
  const drift = prog(f, 0, 230, E.linear);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: wm, transform: `scale(${1.06 - drift * 0.06})` }}>
        <Watermark opacity={0.03} width={1450} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          transform: `scale(${1 + drift * 0.035})`,
        }}
      >
        <Reveal at={4} y={30} blur={10}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 54,
              fontWeight: 600,
              letterSpacing: '0.32em',
              color: 'rgba(160,205,245,0.9)',
              marginBottom: 70,
              textTransform: 'uppercase',
            }}
          >
            Data Steward Training
          </div>
        </Reveal>
        <KText text="Metadata Command Center" start={T(1.4)} stagger={6} size={200} weight={500} />
        <div style={{ height: 70 }} />
        <Pill text="Overview & Access" at={T(2.6)} size={170} />
        <div style={{ height: 150 }} />
        <div style={{ display: 'flex', gap: 60 }}>
          <Reveal at={T(3.16)} y={50}>
            <Chip icon="search" label="What it is" size={66} />
          </Reveal>
          <Reveal at={T(4.28)} y={50}>
            <Chip icon="key" label="How to get access" size={66} />
          </Reveal>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
