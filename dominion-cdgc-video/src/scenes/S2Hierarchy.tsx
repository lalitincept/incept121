import React from 'react';
import { C } from '../theme';
import { O, ti } from '../timing';
import { E, prog, spring, useT } from '../lib/anim';
import { At, FlowPath, KText, PopIcon, Scene, Slash, ws } from '../components/Kit';

const CHILDREN = [
  { x: 150, y: 330, dx: -260, dy: 140, rot: -22 },
  { x: 750, y: 330, dx: 90, dy: 330, rot: 16 },
  { x: 1350, y: 330, dx: 230, dy: 70, rot: 28 },
];
const EXTRAS = [
  { x: 380, y: 840, at: 10.5, rot: -14, dx: -50, dy: 30 },
  { x: 1300, y: 860, at: 10.7, rot: 20, dx: 60, dy: 20 },
  { x: 300, y: -700, at: 10.9, rot: 12, dx: -40, dy: -40 },
];

const Question: React.FC<{ x: number; y: number; at: number; o: number }> = ({ x, y, at, o }) => {
  const t = useT();
  if (t < at) return null;
  const s = spring(t, at, 2, 0.45);
  return (
    <At x={x} y={y} s={s} o={o}>
      <div
        style={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: C.blue,
          border: '10px solid #fff',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 64,
          fontWeight: 800,
          boxShadow: '0 0 50px rgba(0,114,206,0.6)',
        }}
      >
        ?
      </div>
    </At>
  );
};

export const S2Hierarchy: React.FC = () => {
  const t = useT();
  const drift = E.outCubic(prog(t, ti(10.3), 2.2));
  const dim1 = E.inOutCubic(prog(t, ti(10.4), 1.6));
  const dim2 = E.inOutCubic(prog(t, ti(12.6), 0.8));
  const childO = 1 - 0.42 * dim1 - 0.36 * dim2;
  const rootO = 1 - 0.65 * dim1 - 0.25 * dim2;
  const iconsDim = 1 - 0.55 * E.inOutCubic(prog(t, ti(14.65), 0.6));
  const wob = (k: number) => Math.sin(t * 0.9 + k) * 6 * drift;

  return (
    <Scene x={O.s2[0]} y={O.s2[1]} from={ti(7.3)} to={ti(17.7)}>
      {/* The hierarchy assembles… */}
      {CHILDREN.map((c, i) => (
        <FlowPath
          key={i}
          id={`s2-branch-${i}`}
          c={[[750, -330], [750, -60], [c.x, -120], [c.x, 200]]}
          at={ti(8.92) + i * 0.08}
          dur={0.55}
          out={ti(10.2) + i * 0.06}
          width={11}
          dashed={false}
          color="rgba(255,255,255,0.75)"
        />
      ))}
      <At x={750} y={-480 - 120 * drift} r={8 * drift} o={rootO}>
        <PopIcon name="server" size={300} at={ti(8.6)} glow />
      </At>

      {/* …then falls apart: assets drift and lose context */}
      {CHILDREN.map((c, i) => (
        <React.Fragment key={i}>
          <At x={c.x + c.dx * drift} y={c.y + c.dy * drift + wob(i)} r={c.rot * drift} o={childO}>
            <PopIcon name="cube" size={240} at={ti(9.0) + i * 0.12} glow />
          </At>
          <Question x={c.x + c.dx * drift + 120} y={c.y + c.dy * drift - 140} at={ti(11.8) + i * 0.1} o={1 - 0.6 * dim2} />
        </React.Fragment>
      ))}
      {EXTRAS.map((c, i) => (
        <At key={i} x={c.x + c.dx * drift} y={c.y + c.dy * drift + wob(i + 3)} r={c.rot * drift} o={0.75 - 0.45 * dim2}>
          <PopIcon name="cube" size={170} at={ti(c.at)} />
        </At>
      ))}

      {/* Discoverability & governance become nearly impossible */}
      <At x={520} y={-380} o={iconsDim}>
        <PopIcon name="search" size={360} at={ti(12.98)} glow />
      </At>
      <At x={1320} y={-380} o={iconsDim}>
        <PopIcon name="shield" size={360} at={ti(14.14)} glow />
      </At>
      <Slash x={520} y={-380} size={400} at={ti(14.75)} />
      <Slash x={1320} y={-380} size={400} at={ti(14.95)} />
      <At x={920} y={210}>
        <PopIcon name="warn" size={250} at={ti(15.22)} glow />
      </At>

      {/* Kinetic text */}
      <KText x={-1650} y={-420} size={170} words={ws('Without a clear', [ti(8.28), ti(8.52), ti(8.7)])} out={ti(9.78)} />
      <KText x={-1650} y={-200} size={170} words={ws('hierarchy', [ti(8.92)], { 0: 'box' })} out={ti(9.82)} />

      <KText x={-1650} y={-420} size={160} words={ws('Individual data assets', [ti(10.18), ti(10.38), ti(10.74)])} out={ti(12.58)} />
      <KText x={-1650} y={-200} size={160} words={ws('lose their context', [ti(11.22), ti(11.56), ti(11.8)], { 2: 'strike' })} out={ti(12.6)} />

      <KText x={-1650} y={-420} size={170} words={ws('Discoverability', [ti(12.98)])} />
      <KText x={-1650} y={-200} size={170} words={ws('& governance', [ti(13.84), ti(14.14)])} />
      <KText x={-1650} y={10} size={120} weight={700} color={C.text2} words={ws('nearly impossible.', [ti(14.62), ti(15.22)], { 1: 'under' })} />
    </Scene>
  );
};
