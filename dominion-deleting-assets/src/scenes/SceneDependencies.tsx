import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Shell} from '../components/Shell';
import {At, Words, ws} from '../components/Kinetic';
import {Badge, Camera, ColumnChip, Glass, Label, Particles} from '../components/UI';
import {Icon} from '../components/Icons';
import {CamKey, camAt, camSpeed, clamp01, ease, lerp} from '../lib/anim';
import {C, FONT} from '../theme';

// "A single Business Term might anchor dozens of technical columns,
//  while a System provides the operational foundation for critical Data Sets."

const TERM = {x: 920, y: 1180, s: 440};
const COLS = ['CUST_ACCT_ID', 'APPROVED_FLG', 'METER_ID', 'SVC_ADDR_LN1', 'RATE_CODE', 'BILL_AMT', 'PREMISE_NO', 'OUTAGE_TS'];

const chipPos = (i: number) => {
  const a = lerp(-58, 58, i / (COLS.length - 1)) * (Math.PI / 180);
  return {x: TERM.x + 1360 * Math.cos(a) - 40, y: TERM.y + 560 * Math.sin(a)};
};

const SYS = {x: 4800, y: 830, s: 380};
const SETS = [
  {name: 'Customer Billing', x: 3500},
  {name: 'Meter Readings', x: 4370},
  {name: 'Outage Events', x: 5240},
  {name: 'Asset Registry', x: 6110},
];
const SET_Y = 1510;
const BUS_Y = 1215;

const CAM: CamKey[] = [
  {t: 4.9, x: 920, y: 1180, s: 1.8},
  {t: 6.5, x: 1780, y: 1120, s: 1.0, e: ease.glide},
  {t: 9.0, x: 1840, y: 1125, s: 1.035, e: ease.outSoft},
  {t: 10.35, x: 4800, y: 1120, s: 1.0, e: ease.inOut},
  {t: 13.25, x: 4880, y: 1110, s: 1.045, e: ease.outSoft},
  {t: 13.65, x: 5500, y: 1110, s: 1.05, e: ease.in},
];

export const SceneDependencies: React.FC<{t: number; g: number}> = ({t, g}) => {
  const cam = camAt(t, CAM);
  const {vx} = camSpeed(t, CAM);
  const blurX = Math.min(28, Math.abs(vx) / 140);
  const termP = clamp01((t - 5.25) / 1.0);
  const chipAt = (i: number) => 7.0 + i * 0.2;
  const sysP = clamp01((t - 9.2) / 1.0);
  const crit = (i: number) => ease.out(clamp01((t - (12.0 + i * 0.16)) / 0.5));

  return (
    <Shell t={t} a={4.9} b={13.65} enter="fade" exit="fade" enterDur={0.55} exitDur={0.5}>
      <Particles g={g} cam={cam} seed={5} />
      <Camera cam={cam} id="b" blurX={blurX}>
        {/* Business Term fan-out */}
        <svg width={3840} height={2160} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          {COLS.map((_, i) => {
            const c = chipPos(i);
            const sx = TERM.x + TERM.s / 2 + 10;
            const p = ease.inOut(clamp01((t - (chipAt(i) - 0.3)) / 0.55));
            if (p <= 0) return null;
            const d = `M ${sx} ${TERM.y} C ${sx + 360} ${TERM.y}, ${c.x - 380} ${c.y}, ${c.x - 6} ${c.y}`;
            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={C.line}
                strokeWidth={5}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - p}
              />
            );
          })}
        </svg>
        <At x={TERM.x} y={TERM.y}>
          <Badge size={TERM.s} icon="term" p={termP} />
        </At>
        <At x={TERM.x} y={TERM.y + TERM.s / 2 + 92} style={{opacity: ease.out(clamp01((t - 5.7) / 0.5))}}>
          <Label size={68}>Business Term</Label>
        </At>
        {COLS.map((label, i) => {
          const c = chipPos(i);
          return (
            <div key={i} style={{position: 'absolute', left: c.x, top: c.y - 62}}>
              <ColumnChip label={label} p={(t - chipAt(i)) / 0.6} w={640} />
            </div>
          );
        })}

        {/* System and the Data Sets beneath it */}
        <svg width={3840} height={2160} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          {(() => {
            const pTrunk = ease.inOut(clamp01((t - 10.3) / 0.45));
            const pBus = ease.inOut(clamp01((t - 10.55) / 0.6));
            const trunkTop = SYS.y + SYS.s / 2 + 8;
            const xs = SETS.map((s) => s.x);
            return (
              <g stroke={C.line} strokeWidth={5} strokeLinecap="round" fill="none">
                {pTrunk > 0 ? <line x1={SYS.x} y1={trunkTop} x2={SYS.x} y2={lerp(trunkTop, BUS_Y, pTrunk)} /> : null}
                {pBus > 0 ? (
                  <line x1={SYS.x - (SYS.x - xs[0]) * pBus} y1={BUS_Y} x2={SYS.x + (xs[xs.length - 1] - SYS.x) * pBus} y2={BUS_Y} />
                ) : null}
                {xs.map((x, i) => {
                  const p = ease.inOut(clamp01((t - (10.95 + i * 0.12)) / 0.35));
                  return p > 0 ? <line key={i} x1={x} y1={BUS_Y} x2={x} y2={lerp(BUS_Y, SET_Y - 170, p)} /> : null;
                })}
              </g>
            );
          })()}
        </svg>
        <At x={SYS.x} y={SYS.y}>
          <Badge size={SYS.s} icon="system" p={sysP} />
        </At>
        <At x={SYS.x + SYS.s / 2 + 70} y={SYS.y} style={{transform: 'translate(0,-50%)', opacity: ease.out(clamp01((t - 9.5) / 0.5))}}>
          <Label size={68}>System</Label>
        </At>
        {SETS.map((s, i) => {
          const p = ease.out(clamp01((t - (11.0 + i * 0.14)) / 0.7));
          const k = crit(i);
          return (
            <At key={i} x={s.x} y={SET_Y} style={{opacity: p, transform: `translate(-50%, -50%) translateY(${(1 - p) * 80}px)`}}>
              <Glass w={760} h={330} r={48} glow={k * 0.6}>
                <div style={{position: 'absolute', left: 52, top: 50}}>
                  <Icon name="dataset" size={150} p={clamp01((t - (11.15 + i * 0.14)) / 0.9)} />
                </div>
                <div style={{position: 'absolute', left: 238, top: 66, fontFamily: FONT}}>
                  <div style={{fontSize: 60, fontWeight: 600, color: C.text, letterSpacing: '-0.015em'}}>{s.name}</div>
                  <div style={{fontSize: 46, fontWeight: 500, color: C.dim, marginTop: 10}}>Data Set</div>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    right: 40,
                    bottom: 38,
                    padding: '10px 26px',
                    borderRadius: 40,
                    background: C.blue,
                    border: '3px solid #FFFFFF',
                    color: '#FFFFFF',
                    fontFamily: FONT,
                    fontSize: 36,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    opacity: k,
                    transform: `scale(${lerp(0.6, 1, ease.outBack(k))})`,
                  }}
                >
                  CRITICAL
                </div>
              </Glass>
            </At>
          );
        })}
      </Camera>
      <AbsoluteFill>
        <At x={1920} y={250}>
          <Words t={t} size={112} out={8.5} words={ws('A single *Business* *Term*', [5.3, 5.42, 5.76, 6.14])} />
        </At>
        <At x={1920} y={396}>
          <Words
            t={t}
            size={112}
            out={8.54}
            words={ws('might anchor *dozens* *of* *technical* *columns*', [6.54, 6.8, 7.16, 7.52, 7.84, 8.2])}
          />
        </At>
        <At x={1920} y={250}>
          <Words t={t} size={112} out={13.05} words={ws('While a *System* provides the', [9.04, 9.2, 9.38, 9.66, 10.2])} />
        </At>
        <At x={1920} y={396}>
          <Words
            t={t}
            size={112}
            out={13.08}
            words={ws('operational foundation for *critical* *Data* *Sets*', [10.44, 11.0, 11.6, 12.02, 12.48, 12.6])}
          />
        </At>
      </AbsoluteFill>
    </Shell>
  );
};
