import React from 'react';
import { interpolateColors } from 'remotion';
import { C } from '../theme';
import { O, tc } from '../timing';
import { bump, E, prog, spring, useT } from '../lib/anim';
import { At, FlowPath, KText, Panel, Pill, PopIcon, Scene, ws } from '../components/Kit';
import { Icon } from '../components/Icons';

// Container (System) geometry, scene-local.
const BX = -1510;
const BY = -270;
const BW = 1900;
const BH = 1000;
const HEAD = 210;
const TILES = [-1080, -560, -40];
const TILE_Y = 330;

// Parent field card geometry.
const FX = 660;
const FY = -180;
const FW = 980;
const FH = 620;

const Container: React.FC = () => {
  const t = useT();
  const draw = E.inOutCubic(prog(t, tc(189.3), 0.9));
  if (draw <= 0) return null;
  const head = E.inOutCubic(prog(t, tc(189.5), 0.65));
  const glow = E.outCubic(prog(t, tc(192.28), 0.6));
  const zoneGlow = bump(t, tc(192.2), tc(193.6));
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: BX,
          top: BY,
          width: BW,
          height: BH,
          borderRadius: 56,
          background: `rgba(255,255,255,${0.035 * draw})`,
          boxShadow: `0 60px 160px rgba(0,0,0,${0.4 * draw}), 0 0 200px rgba(0,114,206,${0.35 * glow})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: BX,
          top: BY,
          width: BW,
          height: HEAD,
          borderRadius: '56px 56px 0 0',
          background: `linear-gradient(90deg, ${C.blue} 0%, #0a63ad 100%)`,
          clipPath: `inset(0 ${(1 - head) * 100}% 0 0)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: BX + 60,
          top: BY + HEAD + 50,
          width: BW - 120,
          height: BH - HEAD - 100,
          borderRadius: 36,
          border: `5px dashed rgba(255,255,255,${0.16 + 0.3 * zoneGlow})`,
          background: `rgba(0,114,206,${0.1 * zoneGlow})`,
          opacity: head,
        }}
      />
      <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <rect
          x={BX}
          y={BY}
          width={BW}
          height={BH}
          rx={56}
          fill="none"
          stroke="#ffffff"
          strokeWidth={10}
          pathLength={1}
          strokeDasharray={draw < 1 ? '1 1' : undefined}
          strokeDashoffset={draw < 1 ? 1 - draw : undefined}
        />
        <line x1={BX} y1={BY + HEAD} x2={BX + BW * head} y2={BY + HEAD} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
      </svg>
      <At x={BX + 140} y={BY + HEAD / 2}>
        <PopIcon name="server" size={150} at={tc(189.35)} />
      </At>
      <KText
        x={BX + 260}
        y={BY + HEAD / 2 + 4}
        size={84}
        words={[
          { w: 'System', at: tc(189.3) },
          { w: '—', at: tc(189.94), hl: 'dim' },
          { w: 'the', at: tc(189.94), hl: 'dim' },
          { w: 'container', at: tc(190.1), hl: 'dim' },
        ]}
        shadow={false}
      />
    </>
  );
};

const DataSetTile: React.FC<{ x: number; at: number }> = ({ x, at }) => {
  const t = useT();
  if (t < at) return null;
  const s = spring(t, at, 1.25, 0.6);
  const y = TILE_Y - (1 - s) * 1600;
  const settle = E.outCubic(prog(t, at + 0.35, 0.5));
  return (
    <At x={x} y={y} r={(1 - s) * 10}>
      <Panel w={440} h={440} radius={40} active={0.35 * settle} style={{ background: 'rgba(34,31,32,0.95)' }}>
        <At x={220} y={185}>
          <Icon name="table" size={230} p={prog(t, at, 0.8)} />
        </At>
        <At x={220} y={372} o={settle}>
          <div style={{ fontSize: 54, fontWeight: 800, whiteSpace: 'nowrap' }}>Data Set</div>
        </At>
      </Panel>
    </At>
  );
};

const Chevron: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={1} height={1} style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}>
    <path d="M-22 -10 L0 12 L22 -10" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ParentField: React.FC = () => {
  const t = useT();
  const at = tc(193.7);
  if (t < at) return null;
  const s = spring(t, at, 1.2, 0.7);
  const filled = E.outCubic(prog(t, tc(195.4), 0.5));
  const mand = E.outCubic(prog(t, tc(197.96), 0.4));
  const astPulse = 1 + 0.55 * bump(t, tc(197.96), tc(198.7));
  const focus = E.outCubic(prog(t, tc(194.46), 0.5));
  return (
    <At x={FX + FW / 2 + (1 - s) * 420} y={FY + FH / 2} o={Math.min(1, s * 1.5)}>
      <Panel w={FW} h={FH} radius={48} active={0.5 + 0.5 * mand} style={{ background: 'rgba(34,31,32,0.94)' }}>
        <At x={70} y={85} anchor="left">
          <div style={{ fontSize: 46, fontWeight: 650, color: C.text3, whiteSpace: 'nowrap' }}>New Data Set</div>
        </At>
        <At x={70} y={205} anchor="left">
          <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
            <span
              style={{
                fontSize: 78,
                fontWeight: 800,
                padding: '0 0.14em',
                margin: '0 -0.14em',
                borderRadius: '0.12em',
                background: `rgba(0,114,206,${0.9 * focus})`,
              }}
            >
              Parent
            </span>
            <span
              style={{
                display: 'inline-block',
                marginLeft: 22,
                fontSize: 110,
                fontWeight: 800,
                color: '#fff',
                transform: `translateY(18px) scale(${astPulse})`,
                textShadow: `0 0 ${30 + 60 * mand}px rgba(0,114,206,${0.6 + 0.4 * mand})`,
              }}
            >
              *
            </span>
          </div>
        </At>
        <div
          style={{
            position: 'absolute',
            left: 70,
            top: 290,
            width: 840,
            height: 170,
            borderRadius: 28,
            border: `5px solid ${interpolateColors(focus, [0, 1], ['rgba(255,255,255,0.3)', '#ffffff'])}`,
            background: 'rgba(255,255,255,0.04)',
            boxSizing: 'border-box',
          }}
        />
        <At x={110} y={375} anchor="left" o={1 - filled}>
          <div style={{ fontSize: 58, fontWeight: 500, color: C.text3, whiteSpace: 'nowrap' }}>Select a system…</div>
        </At>
        <At x={170} y={375} o={filled} s={0.8 + 0.2 * filled}>
          <Icon name="server" size={130} p={prog(t, tc(195.4), 0.6)} />
        </At>
        <At x={270} y={375} anchor="left" o={filled}>
          <div style={{ fontSize: 80, fontWeight: 800, whiteSpace: 'nowrap' }}>HR</div>
        </At>
        <Chevron x={840} y={375} />
        <At x={70} y={545} anchor="left" o={mand} s={0.85 + 0.15 * mand}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: '0.24em',
              padding: '14px 30px 14px 36px',
              borderRadius: 999,
              border: `5px solid ${C.blue}`,
              background: 'rgba(0,114,206,0.25)',
              whiteSpace: 'nowrap',
            }}
          >
            REQUIRED
          </div>
        </At>
      </Panel>
    </At>
  );
};

const Seal: React.FC = () => {
  const t = useT();
  const at = tc(196.62);
  if (t < at) return null;
  const p = E.outBack(prog(t, at, 0.45));
  const o = E.outCubic(prog(t, at, 0.15));
  return (
    <At x={FX + FW - 60} y={FY + 30} s={2.2 - 1.2 * p} r={-28 + 16 * p} o={o}>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            inset: -120,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,114,206,0.45) 0%, rgba(0,114,206,0) 65%)',
          }}
        />
        <div style={{ position: 'relative' }}>
          <Icon name="badge" size={270} p={prog(t, at, 0.5)} />
        </div>
      </div>
    </At>
  );
};

export const S5Container: React.FC = () => {
  return (
    <Scene x={O.s5[0]} y={O.s5[1]} from={38.6} to={tc(200.8)}>
      <Pill x={0} y={-900} text="IN SUMMARY" at={39.9} size={52} />
      <KText
        x={0}
        y={-690}
        anchor="center"
        size={140}
        words={ws("So here's the shape of it.", [tc(187.3), tc(187.56), tc(188.02), tc(188.16), tc(188.34), tc(188.5)], { 3: 'box' })}
      />
      <Container />
      {/* child → parent arrows */}
      {TILES.map((x, i) => (
        <FlowPath
          key={i}
          id={`s5-parent-${i}`}
          c={[[x, TILE_Y - 230], [x, TILE_Y - 290], [x, -10], [x, -50]]}
          at={tc(194.5) + i * 0.08}
          dur={0.45}
          width={10}
          arrow
          color="rgba(255,255,255,0.9)"
        />
      ))}
      {TILES.map((x, i) => (
        <DataSetTile key={i} x={x} at={tc(191.36) + i * 0.14} />
      ))}
      <FlowPath
        id="s5-link"
        c={[[FX - 5, FY + 375], [520, FY + 375], [540, BY + HEAD / 2], [BX + BW + 10, BY + HEAD / 2]]}
        at={tc(194.8)}
        dur={0.7}
        width={11}
        arrow
        pulses={2}
        pulseSpeed={0.7}
        color="rgba(255,255,255,0.85)"
      />
      <ParentField />
      <Seal />
      <KText
        x={FX + FW / 2}
        y={640}
        anchor="center"
        size={100}
        words={[
          { w: 'Official', at: tc(196.66) },
          { w: '&', at: tc(197.16), hl: 'dim' },
          { w: 'mandatory', at: tc(197.96), hl: 'box' },
        ]}
      />
    </Scene>
  );
};
