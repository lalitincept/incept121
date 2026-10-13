import React from 'react';
import { O, ti } from '../timing';
import { bump, E, lerp, line, prog, spring, useT } from '../lib/anim';
import { At, FlowPath, KText, PopIcon, Scene, Sparkles, ws } from '../components/Kit';
import { IconName } from '../components/Icons';

const Ripple: React.FC<{ x: number; y: number; at: number; from?: number; to?: number }> = ({ x, y, at, from = 240, to = 1100 }) => {
  const t = useT();
  const p = prog(t, at, 1.4);
  if (p <= 0 || p >= 1) return null;
  const r = lerp(from, to, E.outCubic(p));
  return (
    <div
      style={{
        position: 'absolute',
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        border: `8px solid rgba(0,114,206,${0.8 * (1 - p)})`,
        boxShadow: `0 0 60px rgba(0,114,206,${0.4 * (1 - p)})`,
      }}
    />
  );
};

const CX = 900;
const CY = 40;
const NODES: { name: IconName; deg: number }[] = [
  { name: 'building', deg: 180 },
  { name: 'cloud', deg: 214 },
  { name: 'app', deg: 146 },
  { name: 'folder', deg: 108 },
  { name: 'server', deg: 72 },
  { name: 'people', deg: 34 },
  { name: 'database', deg: 0 },
  { name: 'cube', deg: -34 },
];
const node = (deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [CX + Math.cos(a) * 2350, CY + Math.sin(a) * 1090];
};

export const S1Catalog: React.FC = () => {
  const t = useT();
  // Catalog icon: hero in beat A, then becomes the hub of the trace + landscape.
  const mv = E.inOutCubic(prog(t, ti(2.25), 0.85));
  const catX = lerp(780, CX, mv);
  const catY = lerp(0, CY, mv);
  const pulse = 1 + 0.07 * bump(t, ti(5.3), ti(5.9)) + 0.05 * bump(t, ti(6.4), ti(7.0));
  const catS = lerp(1, 0.66, mv) * pulse;

  return (
    <Scene x={O.s1[0]} y={O.s1[1]} from={2.4} to={ti(9.6)}>
      {/* Beat C — enterprise landscape (behind everything) */}
      {NODES.map((n, i) => {
        const at = ti(5.0) + i * 0.2;
        const [nx, ny] = node(n.deg);
        const pl = spring(t, at, 1.4, 0.6);
        return (
          <React.Fragment key={n.name}>
            <FlowPath id={`s1-net-${i}`} c={line([nx, ny], [CX, CY])} at={at + 0.1} dur={0.6} width={8} pulses={2} pulseSpeed={0.55} color="rgba(255,255,255,0.32)" />
            {t >= at && (
              <At x={nx} y={ny} s={0.6 + 0.4 * pl} o={Math.min(1, pl * 1.5)}>
                <div
                  style={{
                    width: 440,
                    height: 440,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(34,31,32,0.95) 55%, rgba(34,31,32,0.7) 100%)',
                    border: '5px solid rgba(255,255,255,0.14)',
                    boxShadow: '0 30px 90px rgba(0,0,0,0.4)',
                  }}
                />
              </At>
            )}
            <At x={nx} y={ny}>
              <PopIcon name={n.name} size={260} at={at + 0.05} />
            </At>
          </React.Fragment>
        );
      })}

      {/* Beat B — users trace where data lives */}
      <FlowPath id="s1-trace-a" c={[[330, 470], [330, 160], [560, CY], [CX, CY]]} at={ti(3.38)} dur={0.5} width={12} pulses={2} color="rgba(255,255,255,0.7)" />
      <FlowPath id="s1-trace-b" c={[[CX, CY], [1250, CY], [1480, -80], [1480, -400]]} at={ti(3.8)} dur={0.5} width={12} pulses={2} color="rgba(255,255,255,0.7)" />

      <Ripple x={CX} y={CY} at={ti(5.38)} />
      <Ripple x={CX} y={CY} at={ti(6.42)} from={300} to={1500} />

      <At x={catX} y={catY} s={catS}>
        <PopIcon name="catalog" size={640} at={ti(0.35)} glow />
      </At>
      <At x={1180} y={-370}>
        <PopIcon name="gem" size={250} at={ti(1.94)} out={ti(2.62)} glow />
      </At>
      <Sparkles x={1180} y={-370} at={ti(2.0)} out={ti(2.62)} r={230} n={6} />

      <At x={330} y={470}>
        <PopIcon name="user" size={260} at={ti(2.74)} glow />
      </At>
      <At x={1480} y={-400}>
        <PopIcon name="database" size={280} at={ti(3.64)} glow />
      </At>
      <At x={1480} y={-705}>
        <PopIcon name="pin" size={170} at={ti(4.26)} tilt={0} />
      </At>

      {/* Kinetic text */}
      <KText x={-1650} y={-345} size={165} words={ws('A data catalog', [ti(0.14), ti(0.28), ti(0.52)])} out={ti(4.55)} dimAt={ti(2.36)} />
      <KText x={-1650} y={-125} size={165} words={ws('only delivers value', [ti(1.02), ti(1.52), ti(1.94)], { 2: 'box' })} out={ti(4.58)} dimAt={ti(2.36)} />
      <KText x={-1650} y={125} size={165} words={ws('When users can trace', [ti(2.36), ti(2.74), ti(3.08), ti(3.38)], { 3: 'box' })} out={ti(4.62)} />
      <KText x={-1650} y={345} size={165} words={ws('where data lives', [ti(3.64), ti(3.98), ti(4.26)], { 2: 'under' })} out={ti(4.66)} />

      <KText x={CX} y={-1300} anchor="center" size={190} words={ws('How it fits into the', [ti(4.98), ti(5.22), ti(5.38), ti(5.6), ti(5.9)])} />
      <KText x={CX} y={-1060} anchor="center" size={190} words={ws('broader enterprise landscape', [ti(6.06), ti(6.42), ti(6.96)], { 1: 'box', 2: 'box' })} />
    </Scene>
  );
};
