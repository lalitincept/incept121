import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Shell} from '../components/Shell';
import {At, Words, ws} from '../components/Kinetic';
import {AlertDot, Badge, Camera, Cursor, Glass, Particles, Ripple} from '../components/UI';
import {IconName} from '../components/Icons';
import {CamKey, camAt, clamp01, ease, lerp} from '../lib/anim';
import {C} from '../theme';

// "If an asset is deleted while other elements still rely on it, you risk breaking lineage,
//  corrupting glossaries, and creating blind spots across Dominion's governance landscape."

const CENTER = {x: 1920, y: 1190, s: 380};
const DEPS: {x: number; y: number; s: number; icon: IconName}[] = [
  {x: 1000, y: 880, s: 270, icon: 'columns'},
  {x: 2840, y: 880, s: 270, icon: 'report'},
  {x: 960, y: 1510, s: 270, icon: 'dataset'},
  {x: 2880, y: 1510, s: 270, icon: 'lineage'},
  {x: 1460, y: 1915, s: 250, icon: 'columns'},
  {x: 2380, y: 1915, s: 250, icon: 'system'},
];
const RISKS: {x: number; icon: IconName; label: string; times: number[]; at: number}[] = [
  {x: 1060, icon: 'lineageBroken', label: 'Breaking *lineage*', times: [17.72, 18.16], at: 17.55},
  {x: 1920, icon: 'glossaryCrack', label: 'Corrupting *glossaries*', times: [18.98, 19.46], at: 18.82},
  {x: 2780, icon: 'eyeSlash', label: 'Creating *blind* *spots*', times: [20.38, 20.8, 21.18], at: 20.22},
];

const CAM: CamKey[] = [
  {t: 13.4, x: 1960, y: 1190, s: 1.02},
  {t: 17.0, x: 1920, y: 1180, s: 1.06, e: ease.outSoft},
  {t: 18.2, x: 1920, y: 1150, s: 1.0, e: ease.inOut},
  {t: 24.3, x: 1940, y: 1150, s: 1.07, e: ease.outSoft},
];

const CLICK = 14.72;
const BREAK = 15.2;

export const SceneRisk: React.FC<{t: number; g: number}> = ({t, g}) => {
  const cam = camAt(t, CAM);
  const recede = ease.inOut(clamp01((t - 17.05) / 0.85));

  // Cursor path into the central asset, click, then exit.
  const cm = ease.inOut(clamp01((t - 13.85) / 0.75));
  const cx = lerp(3000, CENTER.x + 70, cm);
  const cy = lerp(2050, CENTER.y + 50, cm);
  const press = clamp01((t - CLICK) / 0.08) * (1 - clamp01((t - CLICK - 0.16) / 0.1));
  const cursorOp = clamp01((t - 13.85) / 0.2) * (1 - clamp01((t - 15.25) / 0.3));

  const trash = ease.inOut(clamp01((t - (CLICK + 0.12)) / 0.22));
  const implode = clamp01((t - (BREAK - 0.05)) / 0.4);
  const centerScale = implode < 0.3 ? lerp(1, 1.08, ease.out(implode / 0.3)) : lerp(1.08, 0, ease.in((implode - 0.3) / 0.7));
  const flash = Math.max(0, 1 - Math.abs(t - (BREAK + 0.12)) / 0.18);

  const brk = (i: number) => ease.out(clamp01((t - (BREAK + i * 0.05)) / 0.6));

  return (
    <Shell t={t} a={13.55} b={24.3} enter="slideLeft" exit="zoomOut" enterDur={0.6} exitDur={0.55}>
      <Particles g={g} cam={cam} seed={7} />
      <Camera cam={cam} id="c">
        <AbsoluteFill
          style={{
            transformOrigin: `${CENTER.x}px ${CENTER.y}px`,
            transform: `scale(${lerp(1, 0.72, recede)})`,
            opacity: lerp(1, 0.14, recede),
            filter: recede > 0.01 ? `blur(${(recede * 8).toFixed(2)}px)` : undefined,
          }}
        >
          <svg width={3840} height={2160} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
            {DEPS.map((d, i) => {
              const dx = CENTER.x - d.x;
              const dy = CENTER.y - d.y;
              const len = Math.hypot(dx, dy);
              const ux = dx / len;
              const uy = dy / len;
              const bx = d.x + ux * (d.s / 2 + 8);
              const by = d.y + uy * (d.s / 2 + 8);
              const ax = CENTER.x - ux * (CENTER.s / 2 + 8);
              const ay = CENTER.y - uy * (CENTER.s / 2 + 8);
              const grow = ease.inOut(clamp01((t - (13.95 + i * 0.07)) / 0.5));
              const k = brk(i);
              const reach = grow * (1 - 0.56 * k);
              const ex = lerp(bx, ax, reach);
              const ey = lerp(by, ay, reach);
              const spark = clamp01((t - (BREAK + i * 0.05)) / 0.55);
              return (
                <g key={i}>
                  <line
                    x1={bx}
                    y1={by}
                    x2={ex}
                    y2={ey}
                    stroke={k > 0.02 ? 'rgba(140,195,240,0.5)' : C.line}
                    strokeWidth={5}
                    strokeLinecap="round"
                    strokeDasharray={k > 0.02 ? '20 16' : undefined}
                  />
                  {spark > 0 && spark < 1
                    ? [-50, 0, 50].map((ang, j) => {
                        const a = Math.atan2(uy, ux) + (ang * Math.PI) / 180;
                        const r0 = 14 + spark * 30;
                        const r1 = r0 + 34 * (1 - spark);
                        return (
                          <line
                            key={j}
                            x1={ex + Math.cos(a) * r0}
                            y1={ey + Math.sin(a) * r0}
                            x2={ex + Math.cos(a) * r1}
                            y2={ey + Math.sin(a) * r1}
                            stroke="#CFE6FA"
                            strokeWidth={6}
                            strokeLinecap="round"
                            opacity={1 - spark}
                          />
                        );
                      })
                    : null}
                </g>
              );
            })}
          </svg>
          {DEPS.map((d, i) => {
            const flick = t > BREAK && t < BREAK + 0.7 ? 0.55 + 0.45 * Math.abs(Math.sin((t - BREAK) * 38 + i)) : 1;
            const pulse = (((t - 15.6) * 0.9 + i * 0.17) % 1 + 1) % 1;
            return (
              <React.Fragment key={i}>
                <At x={d.x} y={d.y} style={{opacity: flick * (t > BREAK + 0.3 ? 0.78 : 1)}}>
                  <Badge size={d.s} icon={d.icon} p={clamp01((t - (13.85 + i * 0.07)) / 0.8)} glow={t > BREAK ? 0.45 : 1} />
                </At>
                <At x={d.x + d.s * 0.36} y={d.y - d.s * 0.36}>
                  <AlertDot p={(t - (15.55 + i * 0.13)) / 0.45} size={86} pulse={t > 15.6 ? pulse : 0} />
                </At>
              </React.Fragment>
            );
          })}
          <At x={CENTER.x} y={CENTER.y} style={{transform: `translate(-50%,-50%) scale(${centerScale})`}}>
            <div style={{position: 'relative', width: CENTER.s, height: CENTER.s}}>
              <div style={{position: 'absolute', inset: 0, opacity: 1 - trash}}>
                <Badge size={CENTER.s} icon="term" p={clamp01((t - 13.7) / 0.8)} />
              </div>
              {trash > 0 ? (
                <div style={{position: 'absolute', inset: 0, opacity: trash}}>
                  <Badge size={CENTER.s} icon="trash" p={clamp01((t - (CLICK + 0.1)) / 0.45)} glow={1.4} />
                </div>
              ) : null}
            </div>
          </At>
          {flash > 0 ? (
            <At x={CENTER.x} y={CENTER.y}>
              <div
                style={{
                  width: 520,
                  height: 520,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(220,238,252,0.95) 0%, rgba(80,160,235,0.5) 40%, rgba(0,114,206,0) 70%)',
                  opacity: flash,
                }}
              />
            </At>
          ) : null}
          <Ripple x={CENTER.x} y={CENTER.y} t={t} at={BREAK + 0.05} r0={190} r1={820} dur={0.95} width={6} />
          <Ripple x={cx} y={cy} t={t} at={CLICK + 0.04} r0={16} r1={90} dur={0.45} />
          <Cursor x={cx - 12} y={cy - 6} press={press} opacity={cursorOp} size={128} />
        </AbsoluteFill>

        {RISKS.map((r, i) => (
          <React.Fragment key={i}>
            <At x={r.x} y={1050}>
              <Badge size={460} icon={r.icon} p={clamp01((t - r.at) / 1.0)} />
            </At>
            <At x={r.x} y={1395}>
              <Words t={t} size={76} weight={600} words={ws(r.label, r.times)} />
            </At>
          </React.Fragment>
        ))}
        <At
          x={1920}
          y={1790}
          style={{
            opacity: ease.out(clamp01((t - 21.3) / 0.5)),
            transform: `translate(-50%,-50%) translateY(${(1 - ease.out(clamp01((t - 21.3) / 0.6))) * 60}px)`,
          }}
        >
          <Glass w={2780} h={210} r={105} style={{background: 'linear-gradient(90deg, rgba(0,114,206,0.30), rgba(0,114,206,0.12))'}}>
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Words
                t={t}
                size={88}
                weight={500}
                words={ws("across Dominion's *governance* *landscape*", [21.52, 21.9, 22.58, 22.88])}
              />
            </div>
          </Glass>
        </At>
      </Camera>
      <AbsoluteFill>
        <At x={1920} y={250}>
          <Words t={t} size={112} out={16.85} words={ws('If an asset is *deleted*', [13.92, 14.14, 14.28, 14.54, 14.72])} />
        </At>
        <At x={1920} y={396}>
          <Words
            t={t}
            size={112}
            out={16.9}
            words={ws('while other elements *still* *rely* *on* *it*', [15.12, 15.46, 15.76, 16.12, 16.4, 16.74, 16.94])}
          />
        </At>
        <At x={1920} y={330}>
          <Words t={t} size={150} weight={600} words={ws('You *risk*', [17.42, 17.56])} />
        </At>
      </AbsoluteFill>
    </Shell>
  );
};
