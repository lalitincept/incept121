import React from 'react';
import { C } from '../theme';
import { O } from '../timing';
import { E, prog, useT } from '../lib/anim';
import { At, FadeText, KText, Pill, PopIcon, Scene, ws } from '../components/Kit';

const Rings: React.FC<{ t: number }> = ({ t }) => {
  const p = E.inOutCubic(prog(t, 0.1, 1.8));
  const rings = [
    { r: 1320, w: 4, a: 0.08, dash: undefined as string | undefined, rot: 0 },
    { r: 1500, w: 6, a: 0.2, dash: '6 26', rot: t * 3 },
    { r: 1700, w: 3, a: 0.06, dash: undefined, rot: 0 },
  ];
  return (
    <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      {rings.map((g, i) => (
        <g key={i} transform={`rotate(${g.rot - 90})`}>
          <circle
            r={g.r}
            fill="none"
            stroke={`rgba(255,255,255,${g.a})`}
            strokeWidth={g.w}
            strokeDasharray={g.dash ?? `${2 * Math.PI * g.r * p} ${2 * Math.PI * g.r}`}
            opacity={g.dash ? p : 1}
          />
        </g>
      ))}
      {[0, 1, 2].map((i) => {
        const a = t * 0.18 + (i * Math.PI * 2) / 3;
        return (
          <g key={i} opacity={E.outCubic(prog(t, 0.8 + i * 0.15, 0.6))}>
            <circle cx={Math.cos(a) * 1500} cy={Math.sin(a) * 1500} r={34} fill="rgba(0,114,206,0.35)" />
            <circle cx={Math.cos(a) * 1500} cy={Math.sin(a) * 1500} r={14} fill={C.blue} stroke="#fff" strokeWidth={5} />
          </g>
        );
      })}
    </svg>
  );
};

export const TitleScene: React.FC = () => {
  const t = useT();
  const line = E.outExpo(prog(t, 1.3, 0.9));
  return (
    <Scene x={O.title[0]} y={O.title[1]} from={0} to={5.4}>
      <Rings t={t} />
      <FadeText x={0} y={-575} text="DOMINION ENERGY  ·  DATA GOVERNANCE TRAINING" at={0.25} size={48} weight={650} color={C.text2} tracking={0.3} />
      <Pill x={0} y={-410} text="MODULE 14" at={0.45} size={54} />
      <KText x={0} y={-160} anchor="center" size={205} words={ws('Creating System &', [0.6, 0.72, 0.84], { 1: 'blue' })} />
      <KText x={0} y={78} anchor="center" size={205} words={ws('Data Set Assets', [0.95, 1.05, 1.18], { 0: 'blue', 1: 'blue' })} />
      <At x={0} y={262}>
        <div style={{ width: 560 * line, height: 10, borderRadius: 5, background: C.blue, boxShadow: '0 0 40px rgba(0,114,206,0.7)' }} />
      </At>
      <FadeText x={0} y={365} text="CDGC Business Data  ·  For Data Stewards" at={1.45} size={66} weight={500} color={C.text2} />
      <At x={-1470} y={-30}>
        <PopIcon name="server" size={380} at={1.15} glow />
      </At>
      <At x={1470} y={-30}>
        <PopIcon name="table" size={380} at={1.3} glow tilt={10} />
      </At>
    </Scene>
  );
};
