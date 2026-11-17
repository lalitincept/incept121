import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Icon} from '../components/Icons';
import {Chip, IconRing, KText} from '../components/UI';
import {keys, pop, rand, tween} from '../lib/anim';
import {C, E, FONT} from '../lib/theme';
import {VF, shotById} from '../lib/time';

const W1 = shotById('W1');
const W2 = shotById('W2');
const A = W1.to; // card collapses into the centre tile
const B = W2.from + 24; // zoomed through the Export node

const COLS = 19;
const ROWS = 9;
const TW = 78;
const TH = 56;
const GAP_X = 14;
const GAP_Y = 16;
const GRID_W = COLS * TW + (COLS - 1) * GAP_X;
const GRID_H = ROWS * TH + (ROWS - 1) * GAP_Y;
const GX = 960 - GRID_W / 2;
const GY = 540 - GRID_H / 2 + 40;
const CENTER = {c: 9, r: 4};
const VISIT = [
  {c: 3, r: 2},
  {c: 4, r: 2},
  {c: 5, r: 3},
];

const vt = (ts: number[]) => ts.map((t) => VF(t));

export const BulkIntro: React.FC = () => {
  const fr = useCurrentFrame();
  if (fr < A - 2 || fr > B + 4) return null;
  const hundreds = VF(118.9);
  const indiv = VF(121.94);
  const notPractical = VF(123.56);
  const bulk = VF(125.38);
  const template = VF(126.18);
  const workflow = VF(127.3);
  const collapse = tween(fr, bulk - 4, bulk + 22, 0, 1, E.inOut);
  // final zoom into the Export node
  const zoom = tween(fr, W2.from - 16, W2.from + 14, 0, 1, E.in);
  const zx = 560;
  const zy = 770;
  const others = 1 - tween(fr, W2.from - 18, W2.from - 2);
  const exportFade = 1 - tween(fr, W2.from + 6, W2.from + 16);
  const count = Math.round(480 * tween(fr, hundreds, hundreds + 50, 0, 1, E.soft));
  // cursor that hops between tiles
  const hop = (i: number) => ({x: GX + VISIT[i].c * (TW + GAP_X) + TW / 2, y: GY + VISIT[i].r * (TH + GAP_Y) + TH / 2});
  const hopT = [indiv - 6, indiv + 12, indiv + 30];
  let cur = hop(0);
  for (let i = 1; i < VISIT.length; i++) {
    const p = tween(fr, hopT[i] - 12, hopT[i], 0, 1, E.inOut);
    const a = hop(i - 1);
    const b = hop(i);
    if (fr >= hopT[i] - 12) cur = {x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p};
  }
  const assigned = VISIT.map((_, i) => fr >= hopT[i] + 4);
  const dimRest = tween(fr, notPractical - 4, notPractical + 10);
  return (
    <AbsoluteFill style={{transform: `scale(${1 + zoom * 0.14})`, transformOrigin: `${zx}px ${zy}px`}}>
      {/* grid of tables */}
      <AbsoluteFill style={{opacity: 1 - collapse}}>
        {Array.from({length: ROWS * COLS}).map((_, i) => {
          const c = i % COLS;
          const r = Math.floor(i / COLS);
          const isCenter = c === CENTER.c && r === CENTER.r;
          const d = Math.hypot(c - CENTER.c, (r - CENTER.r) * 1.6);
          const appear = isCenter ? tween(fr, A + 16, A + 26) : tween(fr, A + 10 + d * 2.2, A + 24 + d * 2.2, 0, 1, E.out);
          let x = GX + c * (TW + GAP_X);
          let y = GY + r * (TH + GAP_Y);
          // pull toward the template ring when collapsing
          const cp = tween(fr, bulk - 4 + rand(i) * 10, bulk + 16 + rand(i) * 10, 0, 1, E.in);
          x += (960 - TW / 2 - x) * cp;
          y += (470 - TH / 2 - y) * cp;
          const vIdx = VISIT.findIndex((v) => v.c === c && v.r === r);
          const isVisited = vIdx >= 0 && assigned[vIdx];
          const schemaShade = c < 6 ? 0 : c < 13 ? 1 : 2;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: TW,
                height: TH,
                borderRadius: 12,
                background: isVisited ? 'rgba(0,114,206,0.35)' : `rgba(255,255,255,${[0.06, 0.075, 0.06][schemaShade]})`,
                border: `1.5px solid ${isVisited ? C.blueLight : 'rgba(255,255,255,0.13)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: appear * (isVisited ? 1 : 1 - 0.55 * dimRest) * (1 - cp * 0.6),
                transform: `scale(${(0.5 + 0.5 * appear) * (1 - cp * 0.5)})`,
              }}
            >
              <Icon name={isVisited ? 'tableUser' : 'table'} size={36} strokePx={1.8} progress={appear} />
            </div>
          );
        })}
        {/* schema group labels */}
        {['Schema · Customer', 'Schema · Metering', 'Schema · Assets'].map((s, i) => {
          const x0 = GX + [0, 6, 13][i] * (TW + GAP_X);
          const w = [6, 7, 6][i] * (TW + GAP_X) - GAP_X;
          const p = tween(fr, VF(120.4) + i * 4, VF(120.4) + i * 4 + 14);
          return (
            <div key={s} style={{position: 'absolute', left: x0, top: GY - 50, width: w, opacity: p * (1 - dimRest * 0.5)}}>
              <div style={{height: 2, background: 'rgba(90,169,234,0.6)', transform: `scaleX(${p})`, transformOrigin: 'left'}} />
              <div style={{fontFamily: FONT, fontSize: 20, fontWeight: 600, color: C.blueSoft, marginTop: 8, letterSpacing: '0.04em', textTransform: 'uppercase'}}>{s}</div>
            </div>
          );
        })}
        {/* cursor */}
        {fr >= indiv - 10 && fr < bulk ? (
          <div style={{position: 'absolute', left: cur.x - 6, top: cur.y - 4, opacity: tween(fr, indiv - 10, indiv - 2) * (1 - tween(fr, bulk - 10, bulk))}}>
            <Icon name="cursor" size={64} strokePx={3} />
          </div>
        ) : null}
        <div style={{position: 'absolute', left: 960, top: 96, transform: 'translateX(-50%)'}}>
          <KText text="Hundreds of tables across *enterprise schemas*" times={vt([118.9, 119.34, 119.6, 119.96, 120.38, 120.92])} size={56} weight={700} exit={indiv - 12} />
        </div>
        <div style={{position: 'absolute', left: 960, top: 96, transform: 'translateX(-50%)'}}>
          <KText text="One at a time *isn’t practical*" times={vt([121.94, 122.32, 122.6, 122.9, 123.56, 124.0])} size={56} weight={700} exit={bulk - 8} />
        </div>
        {/* counters */}
        <div style={{position: 'absolute', left: GX, top: GY + GRID_H + 40, display: 'flex', gap: 18, opacity: 1 - tween(fr, bulk - 10, bulk)}}>
          <div style={{transform: `scale(${pop(fr, hundreds)})`, opacity: tween(fr, hundreds, hundreds + 8)}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 24px', borderRadius: 999, border: '1.5px solid rgba(90,169,234,0.55)', background: 'rgba(255,255,255,0.05)', fontFamily: FONT, fontSize: 28, fontWeight: 600, color: '#fff'}}>
              <Icon name="table" size={34} strokePx={2.2} />
              {count} tables
            </div>
          </div>
          <div style={{transform: `scale(${pop(fr, indiv + 6)})`, opacity: tween(fr, indiv + 6, indiv + 14)}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 24px', borderRadius: 999, background: 'rgba(0,114,206,0.25)', border: '1.5px solid rgba(90,169,234,0.55)', fontFamily: FONT, fontSize: 28, fontWeight: 600, color: '#fff'}}>
              <Icon name="stopwatch" size={34} strokePx={2.2} />
              {assigned.filter(Boolean).length} of 480 assigned
            </div>
          </div>
        </div>
        <div style={{position: 'absolute', right: GX, top: GY + GRID_H + 40}}>
          <Chip label="Not practical" icon="hourglass" start={notPractical + 4} variant="white" size={28} />
        </div>
      </AbsoluteFill>
      {/* bulk template + workflow */}
      {fr >= bulk - 4 ? (
        <AbsoluteFill>
          <div style={{position: 'absolute', inset: 0, opacity: others}}>
          <div style={{position: 'absolute', left: 960, top: 112, transform: 'translateX(-50%)'}}>
            <KText text="The catalog’s *bulk template*" times={vt([125.38, 125.62, 126.18, 126.36])} size={60} weight={700} />
          </div>
          <div style={{position: 'absolute', left: 960 - 130, top: 470 - 130 - 40}}>
            <IconRing name="spreadsheet" start={template - 4} size={260} filled />
          </div>
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            {[0, 1].map((i) => {
              const p = tween(fr, workflow + 6 + i * 10, workflow + 18 + i * 10, 0, 1, E.inOut);
              const x1 = [560, 960][i] + 96;
              const x2 = [960, 1360][i] - 96;
              return (
                <g key={i}>
                  <line x1={x1} y1={770} x2={x1 + (x2 - x1) * p} y2={770} stroke={C.blueLight} strokeWidth={4} strokeLinecap="round" />
                  {p > 0.9 ? <path d={`M${x2 - 16} 756 L${x2} 770 L${x2 - 16} 784`} fill="none" stroke={C.blueLight} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /> : null}
                </g>
              );
            })}
            <path d="M960 560 V650" stroke="rgba(255,255,255,0.35)" strokeWidth={3} strokeDasharray="6 8" opacity={tween(fr, workflow, workflow + 10)} />
          </svg>
          </div>
          {[
            {x: 560, icon: 'exportBox', t: 'Export', at: workflow},
            {x: 960, icon: 'edit', t: 'Update', at: workflow + 10},
            {x: 1360, icon: 'importBox', t: 'Re-import', at: workflow + 20},
          ].map((n, i) => (
            <div key={i} style={{position: 'absolute', left: n.x - 90, top: 770 - 90, opacity: i === 0 ? exportFade : others}}>
              <IconRing name={n.icon} start={n.at} size={180} filled={i === 0 && fr > W2.from - 20} />
              <div style={{position: 'absolute', left: -60, right: -60, top: 200, textAlign: 'center'}}>
                <KText text={n.t} start={n.at + 4} size={34} />
              </div>
            </div>
          ))}
          <div style={{position: 'absolute', left: 1600, top: 770, transform: 'translate(-50%,-50%)', opacity: others}}>
            <Chip label="Single workflow" icon="bolt" start={VF(127.94)} variant="blue" size={26} />
          </div>
          {/* zoom target highlight */}
          <div style={{position: 'absolute', left: 560 - 100, top: 770 - 100, width: 200, height: 200, borderRadius: '50%', boxShadow: `0 0 ${60 * keys(fr, [[W2.from - 30, 0], [W2.from - 10, 1]])}px rgba(0,114,206,0.9)`}} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
