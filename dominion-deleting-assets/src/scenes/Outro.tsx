import React from 'react';
import {AbsoluteFill} from 'remotion';
import {LogoLockup} from '../components/Logo';
import {Words, ws} from '../components/Kinetic';
import {clamp01, ease, lerp} from '../lib/anim';

/** o = seconds since outro start. Brand lockup with the course and module name. */
export const Outro: React.FC<{o: number}> = ({o}) => {
  const enter = ease.out(clamp01(o / 0.9));
  const divider = ease.inOut(clamp01((o - 0.85) / 0.6));
  const drift = lerp(1.0, 1.025, clamp01(o / 5.8));
  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity: enter,
        transform: `scale(${drift})`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 110}}>
        <LogoLockup id="outro" height={370} stripes={clamp01((o - 0.1) / 1.0)} word={clamp01((o - 0.45) / 0.7)} shine={clamp01((o - 1.9) / 1.1)} />
        <div style={{width: 6, height: 420, background: '#FFFFFF', transformOrigin: 'center', transform: `scaleY(${divider})`, borderRadius: 3}} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
          <Words t={o} size={76} weight={400} color="#D9DFE5" align="flex-start" words={ws('Cloud Data Governance & Catalog', [1.15, 1.23, 1.31, 1.39, 1.47])} />
          <Words t={o} size={100} weight={600} align="flex-start" words={ws('*Deleting* *Assets* *Correctly*', [1.6, 1.72, 1.84])} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Final fade to black. */
export const FadeOut: React.FC<{g: number; start: number; dur: number}> = ({g, start, dur}) => {
  const p = ease.inOut(clamp01((g - start) / dur));
  if (p <= 0) return null;
  return <AbsoluteFill style={{backgroundColor: '#000', opacity: p}} />;
};

