import React from 'react';
import { C } from '../theme';
import { END_AT, O } from '../timing';
import { E, line, prog, useT } from '../lib/anim';
import { At, FadeText, FlowPath, KText, Pill, PopIcon, Scene, ws } from '../components/Kit';

export const EndScene: React.FC = () => {
  const t = useT();
  const a = END_AT + 0.75;
  const rule = E.outExpo(prog(t, a + 0.9, 0.9));
  return (
    <Scene x={O.end[0]} y={O.end[1]} from={END_AT - 0.6} to={999}>
      <FlowPath id="end-link" c={line([-120, -585], [120, -585])} at={a + 0.35} dur={0.5} width={12} pulses={1} pulseSpeed={0.8} color="rgba(255,255,255,0.75)" />
      <At x={-300} y={-585}>
        <PopIcon name="server" size={260} at={a} glow />
      </At>
      <At x={300} y={-585}>
        <PopIcon name="table" size={260} at={a + 0.15} glow tilt={10} />
      </At>
      <Pill x={0} y={-330} text="MODULE 14" at={a + 0.3} size={52} />
      <KText x={0} y={-125} anchor="center" size={175} words={ws('Creating System &', [a + 0.45, a + 0.55, a + 0.65], { 1: 'blue' })} />
      <KText x={0} y={80} anchor="center" size={175} words={ws('Data Set Assets', [a + 0.75, a + 0.85, a + 0.95], { 0: 'blue', 1: 'blue' })} />
      <At x={0} y={255}>
        <div style={{ width: 520 * rule, height: 10, borderRadius: 5, background: C.blue, boxShadow: '0 0 40px rgba(0,114,206,0.7)' }} />
      </At>
      <FadeText x={0} y={350} text="CDGC Business Data  ·  For Data Stewards" at={a + 1.1} size={62} weight={500} color={C.text2} />
      <FadeText x={0} y={600} text="DOMINION ENERGY" at={a + 1.4} size={50} weight={700} color={C.text2} tracking={0.42} />
    </Scene>
  );
};
