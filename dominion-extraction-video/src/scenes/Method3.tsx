import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Icon, IconName } from '../components/Icon';
import { KLine } from '../components/Kinetic';
import { Cam, useT } from '../components/Scene';
import { Ring, Screen, Seg, Spotlight } from '../components/Screen';
import { Chip, Connector, Glass, hexA, IconBadge, Reveal } from '../components/UI';
import { C, EASE_IN, EASE_IN_OUT, EASE_OUT, envelope, FONT, keys, pop, tween } from '../theme';

/* ------------------------------------------------------------------ */
/* Quick sanity check                                                   */
/* ------------------------------------------------------------------ */
const SanityCheck: React.FC = () => {
  const t = useT();
  const loop = tween(t, 93.65, 94.5, 0, 1, EASE_OUT);
  const R = 380;
  return (
    <Cam from={91.85} to={95.4} enter="zoom" exit="push" push={0.05}>
      <KLine y={250} text="A quick *sanity check*" times={[92.1, 92.58, 92.76, 93.2]} size={124} weight={600} />
      <IconBadge icon="clipboard" t0={92.05} x={1920} y={1060} d={560} />
      {loop > 0 ? (
        <svg style={{ position: 'absolute', left: 1920 - R - 60, top: 1060 - R - 60, overflow: 'visible', transform: `rotate(${t * 40}deg)` }} width={2 * R + 120} height={2 * R + 120}>
          <g transform={`translate(${R + 60} ${R + 60})`} fill="none" stroke="#5AA9F2" strokeWidth={9} strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 14px #2E95F0)' }}>
            {[0, 180].map((rot) => (
              <g key={rot} transform={`rotate(${rot})`}>
                <path d={`M ${R} 0 A ${R} ${R} 0 0 1 ${R * Math.cos(2.6)} ${R * Math.sin(2.6)}`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - loop} />
                {loop > 0.95 ? <path d={`M ${R * Math.cos(2.6) + 40} ${R * Math.sin(2.6) - 30} L ${R * Math.cos(2.6)} ${R * Math.sin(2.6)} L ${R * Math.cos(2.6) + 48} ${R * Math.sin(2.6) + 22}`} /> : null}
              </g>
            ))}
          </g>
        </svg>
      ) : null}
      <KLine y={1600} text="Build it into *your routine*" times={[93.76, 93.9, 94.14, 94.4, 94.6]} size={100} />
    </Cam>
  );
};

/* ------------------------------------------------------------------ */
/* Compare counts on the real grid                                       */
/* ------------------------------------------------------------------ */
const SEGS_M3: Seg[] = [{ vo0: 95.0, vo1: 101.8, still: '101.0' }];

const cmpGeom = (t: number) => {
  const T = [95.1, 95.85, 97.85, 98.5, 100.85, 101.5];
  return {
    x: keys(t, T, [1920, 1920, 1920, 1200, 1200, -1300]),
    y: keys(t, T, [1185 + 380, 1185, 1185, 1185, 1185, 1185]),
    w: keys(t, T, [2860, 3100, 3100, 2150, 2150, 2150]),
    opacity: tween(t, 95.1, 95.7) * tween(t, 101.1, 101.5, 1, 0),
    rotX: keys(t, [95.1, 95.85], [14, 0]),
  };
};

const CompareScreen: React.FC = () => {
  const t = useT();
  if (t < 95.0 || t > 101.8) return null;
  const g = cmpGeom(t);
  return (
    <>
      <KLine y={150} size={96} text="Compare *row and column counts*" times={[95.54, 96.18, 96.34, 96.6, 96.9]} out={97.55} />
      <KLine y={150} size={96} text="…against what you'd *expect from the source*" times={[97.95, 98.42, 98.66, 98.92, 99.18, 99.44, 100.02]} out={100.8} />
      <Screen
        segs={SEGS_M3}
        x={g.x}
        y={g.y}
        w={g.w}
        rotX={g.rotX}
        opacity={g.opacity}
        overlay={(k) => (
          <>
            <Spotlight rect={{ x: 222, y: 256, w: 170, h: 30 }} k={k} opacity={envelope(t, 96.45, 98.1, 0.4, 0.4)} dim={0.5} />
            <Ring rect={{ x: 222, y: 765, w: 112, h: 20 }} k={k} opacity={envelope(t, 96.95, 98.1, 0.35, 0.4)} />
          </>
        )}
        outside={(k) => (
          <Reveal t0={97.15} out={98.0} dx={-40} dy={0} style={{ position: 'absolute', left: 410 * k, top: 271 * k - 50 }}>
            <Chip text="169 columns in the catalog" icon="catalog" size={50} />
          </Reveal>
        )}
      />
    </>
  );
};

/* count tiles: catalog vs source (match → mismatch) */
const CountTile: React.FC<{ icon: IconName; label: string; value: number; t0: number; warn?: number }> = ({ icon, label, value, t0, warn = 0 }) => {
  const t = useT();
  const frame = useCurrentFrame();
  const p = pop(frame, t0, { damping: 15 });
  const n = Math.round(value * tween(t, t0 + 0.1, t0 + 0.9, 0, 1, EASE_OUT));
  return (
    <div
      style={{
        width: 500,
        height: 600,
        borderRadius: 50,
        background: 'linear-gradient(170deg, rgba(48,52,62,0.95), rgba(28,29,34,0.95))',
        border: `4px solid ${warn > 0 ? hexA(C.amber, 0.5 + 0.5 * warn) : 'rgba(90,170,255,0.75)'}`,
        boxShadow: `0 0 50px ${warn > 0 ? hexA(C.amber, 0.4 * warn) : 'rgba(0,114,206,0.4)'}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 26,
        opacity: Math.min(1, p * 1.4),
        transform: `scale(${0.7 + 0.3 * p})`,
        fontFamily: FONT,
      }}
    >
      <Icon name={icon} size={170} progress={tween(t, t0, t0 + 0.8)} />
      <div style={{ fontSize: 54, color: C.textDim }}>{label}</div>
      <div style={{ fontSize: 150, fontWeight: 700, color: warn > 0.5 ? '#FFD08A' : C.text, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>{n}</div>
      <div style={{ fontSize: 46, color: C.textDim, marginTop: -16 }}>columns</div>
    </div>
  );
};

const CountCompare: React.FC = () => {
  const t = useT();
  if (t < 97.9 || t > 108.0) return null;
  const panelO = tween(t, 98.0, 98.6) * tween(t, 100.85, 101.35, 1, 0);
  const move = tween(t, 100.9, 101.65, 0, 1, EASE_IN_OUT);
  const cx = 3020 + (1920 - 3020) * move;
  const cy = 1210 + (560 - 1210) * move;
  const sc = 1 - 0.3 * move;
  const mis = tween(t, 101.16, 101.5, 0, 1, EASE_OUT);
  const match = tween(t, 100.0, 100.35, 0, 1, EASE_OUT);
  const srcVal = mis > 0 ? Math.round(169 + 13 * tween(t, 101.16, 101.6, 0, 1, EASE_OUT)) : 169;
  const out = tween(t, 107.65, 108.05, 0, 1, EASE_IN);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out }}>
      {panelO > 0 ? <Glass style={{ left: 3020 - 690, top: 440, width: 1380, height: 1490, opacity: panelO }} /> : null}
      {panelO > 0 ? (
        <div style={{ position: 'absolute', left: 3020 - 150, top: 540, opacity: panelO, transform: `rotate(${keys(t, [98.2, 99.0, 99.6, 100.0], [-9, 7, -4, 0])}deg)`, transformOrigin: '50% 20%' }}>
          <Icon name="scale" size={300} progress={tween(t, 98.0, 98.9)} />
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: cx - 620, top: cy - 300, width: 1240, height: 600, transform: `scale(${sc})`, transformOrigin: '50% 50%' }}>
        <div style={{ position: 'absolute', left: 0, top: 0 }}>
          <CountTile icon="catalog" label="In the catalog" value={169} t0={98.1} />
        </div>
        <div style={{ position: 'absolute', right: 0, top: 0 }}>
          {mis > 0 ? (
            <div style={{ fontFamily: FONT }}>
              <CountTile icon="database" label="At the source" value={srcVal} t0={98.9} warn={mis} />
            </div>
          ) : (
            <CountTile icon="database" label="At the source" value={169} t0={98.9} />
          )}
        </div>
        <div style={{ position: 'absolute', left: 500, width: 240, top: 190, textAlign: 'center', fontFamily: FONT, fontSize: 200, fontWeight: 600, lineHeight: '200px', color: mis > 0.5 ? C.amber : C.blueLight, opacity: Math.max(match, mis), transform: `scale(${0.6 + 0.4 * Math.max(match, mis)})`, textShadow: `0 0 40px ${mis > 0.5 ? 'rgba(242,169,59,0.6)' : 'rgba(46,149,240,0.7)'}` }}>
          {mis > 0.5 ? '≠' : '='}
        </div>
      </div>
      {/* verdict chip */}
      <div style={{ position: 'absolute', left: cx - 500, top: cy + 300 * sc + 50, width: 1000, display: 'flex', justifyContent: 'center', opacity: match }}>
        {mis > 0.5 ? (
          <Chip text="Mismatch" icon="warning" size={60} border={C.amber} style={{ transform: `scale(${0.8 + 0.2 * mis})` }} />
        ) : (
          <Chip text="Counts match" icon="check" size={60} border={C.green} style={{ transform: `scale(${0.8 + 0.2 * match})` }} />
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Root causes: scope settings / permissions gap — not a catalog bug     */
/* ------------------------------------------------------------------ */
const Causes: React.FC = () => {
  const t = useT();
  const frame = useCurrentFrame();
  if (t < 101.9 || t > 108.0) return null;
  const card = tween(t, 102.2, 102.8, 0, 1, EASE_OUT);
  const out = tween(t, 107.65, 108.05, 0, 1, EASE_IN);
  const strike = tween(t, 106.7, 107.05, 0, 1, EASE_OUT);
  const L = 380, T = 1030, W = 1900, H = 800;
  const rows: { icon: IconName; title: string; sub: string; t0: number }[] = [
    { icon: 'sliders', title: 'Scope settings', sub: 'What the job was told to scan', t0: 102.98 },
    { icon: 'lock', title: 'Permissions gap', sub: 'What the job was allowed to read', t0: 104.22 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - out, filter: out > 0 ? `blur(${out * 12}px)` : undefined }}>
      <Connector x1={1580} y1={900} x2={1300} y2={1020} t0={102.1} dur={0.45} arrow width={7} />
      <div style={{ position: 'absolute', inset: 0, opacity: card, transform: `translateY(${(1 - card) * 80}px)` }}>
        <Glass style={{ left: L, top: T, width: W, height: H }} />
        <div style={{ position: 'absolute', left: L + 90, top: T + 70, display: 'flex', alignItems: 'center', gap: 40 }}>
          <Icon name="extract" size={150} progress={tween(t, 102.3, 103.0)} />
          <div style={{ fontFamily: FONT, fontSize: 80, fontWeight: 600, color: C.text }}>
            Points back to the <span style={{ color: C.blueLight }}>original job</span>
          </div>
        </div>
        <div style={{ position: 'absolute', left: L + 90, right: 3840 - L - W + 90, top: T + 270, height: 3, background: 'rgba(255,255,255,0.12)' }} />
        {rows.map((r, i) => {
          const p = pop(frame, r.t0, { damping: 15 });
          return (
            <div key={r.title} style={{ position: 'absolute', left: L + 110, top: T + 320 + i * 220, display: 'flex', alignItems: 'center', gap: 56, opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * 80}px)` }}>
              <div style={{ width: 180, height: 180, borderRadius: 90, border: '5px solid #5AA9F2', background: 'radial-gradient(circle, rgba(18,20,26,0.95) 45%, rgba(0,114,206,0.55))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={r.icon} size={122} progress={tween(t, r.t0, r.t0 + 0.8)} />
              </div>
              <div style={{ fontFamily: FONT }}>
                <div style={{ fontSize: 76, fontWeight: 600, color: C.text }}>{r.title}</div>
                <div style={{ fontSize: 52, color: C.textDim, marginTop: 8 }}>{r.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
      {/* not a catalog bug */}
      <IconBadge icon="catalog" t0={106.0} x={2960} y={1360} d={460} label="Not a bug in the catalog" labelSize={66} />
      {t > 106.4 ? (
        <div style={{ position: 'absolute', left: 3120, top: 1110, opacity: tween(t, 106.45, 106.8) }}>
          <div style={{ position: 'absolute', left: -20, top: -20, width: 220, height: 220, borderRadius: 110, background: 'rgba(28,30,36,0.95)', border: `5px solid ${C.red}`, boxShadow: '0 0 30px rgba(229,72,77,0.5)' }} />
          <div style={{ position: 'absolute', left: 20, top: 20 }}>
            <Icon name="bug" size={140} strokePx={8} progress={tween(t, 106.45, 107.0)} />
          </div>
          <div style={{ position: 'absolute', left: 90, top: -10, width: 10, height: 240 * strike, background: C.red, borderRadius: 6, transform: 'rotate(-45deg)', transformOrigin: '50% 0%', boxShadow: '0 0 16px rgba(229,72,77,0.8)' }} />
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Early vs weeks later                                                  */
/* ------------------------------------------------------------------ */
const EarlyLate: React.FC = () => {
  const t = useT();
  const axisY = 1150, x0 = 460, x1 = 3380, xToday = 720, xLate = 3000;
  const curve = tween(t, 109.8, 112.0, 0, 1, EASE_IN_OUT);
  const pathD = `M ${xToday} ${axisY - 20} C ${xToday + 1200} ${axisY - 40}, ${xLate - 500} ${axisY - 120}, ${xLate} ${axisY - 600}`;
  const areaD = `${pathD} L ${xLate} ${axisY} L ${xToday} ${axisY} Z`;
  const teams = [2240, 2600, 2960, 3320];
  return (
    <Cam from={107.85} to={115.8} enter="zoom" exit="push" push={0.04}>
      <KLine y={200} text="Catching it *early* is less painful" times={[108.6, 108.86, 109.1, 109.44, 110.16, 110.46]} size={106} weight={600} />
      <Connector x1={x0} y1={axisY} x2={x1} y2={axisY} t0={108.1} dur={1.1} width={8} arrow color="#7DB9F5" />
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={3840} height={2160}>
        <defs>
          <linearGradient id="painFill" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#0072CE" stopOpacity="0.15" />
            <stop offset="0.7" stopColor="#0072CE" stopOpacity="0.35" />
            <stop offset="1" stopColor="#F2A93B" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="painStroke" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#5AA9F2" />
            <stop offset="0.75" stopColor="#5AA9F2" />
            <stop offset="1" stopColor="#F2A93B" />
          </linearGradient>
          <clipPath id="painClip">
            <rect x={xToday} y={0} width={(xLate - xToday) * curve + 10} height={2160} />
          </clipPath>
        </defs>
        <g clipPath="url(#painClip)">
          <path d={areaD} fill="url(#painFill)" />
          <path d={pathD} fill="none" stroke="url(#painStroke)" strokeWidth={10} strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 14px rgba(46,149,240,0.8))' }} />
        </g>
      </svg>
      <Reveal t0={111.5} style={{ position: 'absolute', left: xLate - 900, top: axisY - 720 }}>
        <Chip text="Effort to fix" icon="warning" size={50} border={C.amber} />
      </Reveal>
      <IconBadge icon="check" t0={109.05} x={xToday} y={axisY} d={260} label="Caught early" labelSize={62} />
      <IconBadge icon="calendar" t0={111.8} x={xLate} y={axisY} d={280} label="Weeks later" labelSize={62} />
      {teams.map((x, i) => (
        <React.Fragment key={x}>
          <Connector x1={xLate} y1={axisY + 260} x2={x} y2={1560} t0={112.75 + i * 0.22} dur={0.4} dashed width={5} glow={false} color="rgba(242,169,59,0.75)" />
          <IconBadge icon="team" t0={112.9 + i * 0.22} x={x} y={1640} d={190} iconScale={0.56} accent={C.blue} />
        </React.Fragment>
      ))}
      <KLine y={1830} text="Other teams are *already relying on the results*" times={[112.68, 112.96, 113.28, 113.78, 114.58, 114.9, 115.18, 115.3]} size={80} x={1760} width={2600} />
    </Cam>
  );
};

/* ------------------------------------------------------------------ */
/* Five-minute check now vs a long conversation later                    */
/* ------------------------------------------------------------------ */
const FiveMinutes: React.FC = () => {
  const t = useT();
  const frame = useCurrentFrame();
  const sweep = tween(t, 116.38, 117.2, 0, 1, EASE_IN_OUT);
  const R = 300;
  const a = (sweep * 30 * Math.PI) / 180; // 5 of 60 minutes
  const bubbles = [
    { x: 3090, y: 760, t0: 118.6 },
    { x: 3180, y: 1000, t0: 118.85 },
    { x: 3090, y: 1240, t0: 119.1 },
  ];
  return (
    <Cam from={115.65} to={120.35} enter="zoom" exit="push" push={0.05}>
      <KLine y={250} text="A *five-minute check* now…" times={[116.24, 116.38, 116.66, 116.86, 117.14]} size={112} weight={600} />
      <IconBadge icon="stopwatch" t0={115.72} x={1150} y={1060} d={520} label="5 minutes now" labelSize={70} />
      {sweep > 0 ? (
        <svg style={{ position: 'absolute', left: 1150 - R - 40, top: 1060 - R - 40, overflow: 'visible' }} width={2 * R + 80} height={2 * R + 80}>
          <path
            d={`M ${R + 40} 40 A ${R} ${R} 0 0 1 ${R + 40 + R * Math.sin(a)} ${R + 40 - R * Math.cos(a)}`}
            fill="none"
            stroke="#8CC6FF"
            strokeWidth={14}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 16px #2E95F0)' }}
          />
        </svg>
      ) : null}
      <Connector x1={1480} y1={1060} x2={2330} y2={1060} t0={117.5} dur={0.5} arrow width={8} />
      <Reveal t0={117.6} dy={20} style={{ position: 'absolute', left: 1905 - 250, top: 900, width: 500, display: 'flex', justifyContent: 'center' }}>
        <Chip text="can save" size={52} />
      </Reveal>
      <IconBadge icon="chat" t0={118.3} x={2660} y={1060} d={520} label="A longer conversation later" labelSize={70} labelWidth={1100} />
      {bubbles.map((b) => {
        const p = pop(frame, b.t0, { damping: 13 });
        if (p <= 0.01) return null;
        return (
          <div key={b.t0} style={{ position: 'absolute', left: b.x, top: b.y - 55, width: 200, height: 110, borderRadius: 40, background: 'rgba(28,30,36,0.95)', border: '4px solid rgba(90,170,255,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: Math.min(1, p * 1.4), transform: `scale(${0.5 + 0.5 * p})` }}>
            {[0, 1, 2].map((d) => (
              <div key={d} style={{ width: 22, height: 22, borderRadius: 11, background: d === 1 ? C.blue : '#FFFFFF', opacity: 0.4 + 0.6 * Math.abs(Math.sin(frame / 6 + d)) }} />
            ))}
          </div>
        );
      })}
      <KLine y={1680} text="…can save a much *longer conversation later*" times={[117.5, 117.86, 118.06, 118.36, 118.56, 118.94, 119.58]} size={92} color={C.text} />
    </Cam>
  );
};

export const Method3: React.FC = () => (
  <>
    <SanityCheck />
    <CompareScreen />
    <CountCompare />
    <Causes />
    <EarlyLate />
    <FiveMinutes />
  </>
);
