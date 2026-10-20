import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Shell} from '../components/Shell';
import {At, Words, ws} from '../components/Kinetic';
import {Badge, Camera, Particles} from '../components/UI';
import {IconName} from '../components/Icons';
import {CamKey, camAt, clamp01, ease, lerp} from '../lib/anim';
import {C} from '../theme';

// "In an interconnected enterprise catalog, assets rarely exist in isolation."
// Camera opens tight on a single asset, then pulls back to reveal the web around it.

type Node = {x: number; y: number; s: number; icon: IconName; at: number; dim?: boolean};

export const NODES: Node[] = [
  {x: 1920, y: 1240, s: 400, icon: 'catalog', at: -0.45},
  {x: 1130, y: 930, s: 310, icon: 'term', at: 0.55},
  {x: 2710, y: 930, s: 310, icon: 'columns', at: 0.7},
  {x: 1080, y: 1640, s: 310, icon: 'system', at: 0.85},
  {x: 2760, y: 1640, s: 310, icon: 'dataset', at: 1.0},
  {x: 1920, y: 1975, s: 250, icon: 'lineage', at: 1.2},
  {x: 400, y: 1240, s: 240, icon: 'report', at: 1.45, dim: true},
  {x: 3440, y: 1240, s: 240, icon: 'relations', at: 1.55, dim: true},
  {x: 440, y: 650, s: 230, icon: 'dataset', at: 1.7, dim: true},
  {x: 3400, y: 650, s: 230, icon: 'term', at: 1.8, dim: true},
  {x: 640, y: 2040, s: 230, icon: 'columns', at: 1.9, dim: true},
  {x: 3200, y: 2040, s: 230, icon: 'catalog', at: 2.0, dim: true},
];

const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
  [1, 3], [2, 4], [3, 5], [4, 5],
  [1, 8], [1, 6], [3, 6], [3, 10],
  [2, 9], [2, 7], [4, 7], [4, 11],
];

const CAM: CamKey[] = [
  {t: -0.7, x: 1920, y: 1240, s: 2.1, r: -2.2},
  {t: 3.7, x: 1920, y: 1190, s: 1.0, r: 0, e: ease.glide},
  {t: 4.55, x: 1900, y: 1170, s: 1.04, e: ease.outSoft},
  {t: 5.6, x: 1130, y: 930, s: 2.5, e: ease.in},
];

export const EdgeLines: React.FC<{
  nodes: {x: number; y: number; s: number}[];
  edges: [number, number][];
  progress: (i: number) => number;
  t: number;
  pulses?: boolean;
  opacity?: (i: number) => number;
}> = ({nodes, edges, progress, t, pulses = true, opacity}) => (
  <svg width={3840} height={2160} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    {edges.map(([a, b], i) => {
      const A = nodes[a];
      const B = nodes[b];
      const dx = B.x - A.x;
      const dy = B.y - A.y;
      const len = Math.hypot(dx, dy);
      const ux = dx / len;
      const uy = dy / len;
      // Lines stop at the badge rims.
      const x1 = A.x + ux * (A.s / 2 + 8);
      const y1 = A.y + uy * (A.s / 2 + 8);
      const x2 = B.x - ux * (B.s / 2 + 8);
      const y2 = B.y - uy * (B.s / 2 + 8);
      const p = progress(i);
      if (p <= 0) return null;
      const op = opacity ? opacity(i) : 1;
      const xe = lerp(x1, x2, p);
      const ye = lerp(y1, y2, p);
      const phase = ((t * 0.55 + i * 0.37) % 1 + 1) % 1;
      return (
        <g key={i} opacity={op}>
          <line x1={x1} y1={y1} x2={xe} y2={ye} stroke={C.line} strokeWidth={5} strokeLinecap="round" />
          {pulses && p >= 1 ? (
            <>
              <circle cx={lerp(x1, x2, phase)} cy={lerp(y1, y2, phase)} r={22} fill="rgba(80,160,235,0.22)" />
              <circle cx={lerp(x1, x2, phase)} cy={lerp(y1, y2, phase)} r={9} fill="#CFE6FA" />
            </>
          ) : null}
        </g>
      );
    })}
  </svg>
);

export const SceneConnected: React.FC<{t: number; g: number}> = ({t, g}) => {
  const cam = camAt(t, CAM);
  const edgeStart = (i: number) => 0.3 + i * 0.09;
  return (
    <Shell t={t} a={-0.5} b={5.6} enter="fade" exit="fade" enterDur={0.45} exitDur={0.55}>
      <Particles g={g} cam={cam} seed={3} />
      <Camera cam={cam} id="a">
        <EdgeLines
          nodes={NODES}
          edges={EDGES}
          t={t}
          progress={(i) => ease.inOut(clamp01((t - edgeStart(i)) / 0.65))}
          opacity={(i) => (NODES[EDGES[i][1]].dim ? 0.55 : 1)}
        />
        {NODES.map((n, i) => (
          <At key={i} x={n.x} y={n.y} style={{opacity: n.dim ? 0.6 : 1}}>
            <Badge size={n.s} icon={n.icon} p={clamp01((t - n.at) / 1.0)} glow={n.dim ? 0.5 : 1} />
          </At>
        ))}
      </Camera>
      <AbsoluteFill>
        <At x={1920} y={300}>
          <Words
            t={t}
            size={128}
            out={2.2}
            words={ws('An *interconnected* *enterprise* *catalog*', [0.18, 0.36, 0.94, 1.6])}
          />
        </At>
        <At x={1920} y={300}>
          <Words t={t} size={128} out={4.7} words={ws('Assets rarely exist *in* *isolation*', [2.7, 2.82, 3.14, 3.64, 3.88])} />
        </At>
      </AbsoluteFill>
    </Shell>
  );
};
