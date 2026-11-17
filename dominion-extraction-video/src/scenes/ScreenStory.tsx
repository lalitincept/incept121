import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Icon, IconName } from '../components/Icon';
import { KLine, KText } from '../components/Kinetic';
import { useT, Window } from '../components/Scene';
import { lerpRect, Rect, Ring, Screen, Seg, Spotlight } from '../components/Screen';
import { Chip, Glass, IconBadge, Reveal, Ripple } from '../components/UI';
import { C, EASE_IN, EASE_IN_OUT, EASE_OUT, envelope, FONT, keys, pop, tween } from '../theme';

/* ------------------------------------------------------------------ */
/* Edit decision list — Methods 1 & 2 (VO seconds ↔ recording seconds)  */
/* ------------------------------------------------------------------ */
export const SEGS_M12: Seg[] = [
  // Method 1 · navigate to the catalog source
  { vo0: 34.6, vo1: 36.4, rec0: 24.1, rec1: 25.9 }, // dashboard → click Browse
  { vo0: 36.4, vo1: 38.5, rec0: 41.85, rec1: 43.95 }, // Data Catalog list → click Snowflake_Enterprise
  { vo0: 38.5, vo1: 40.5, rec0: 45.75, rec1: 48.4 }, // source overview → click Hierarchy (1.3x)
  { vo0: 40.5, vo1: 43.3, rec0: 52.4, rec1: 55.2 }, // expand root → BIAD003_DEVL (database)
  { vo0: 43.3, vo1: 45.2, rec0: 56.4, rec1: 58.3 }, // expand database → schemas
  { vo0: 45.2, vo1: 47.0, rec0: 71.7, rec1: 73.5 }, // expand ENT_COTALITY → table
  { vo0: 47.0, vo1: 49.5, rec0: 78.9, rec1: 81.4 }, // expand PREMISE_CHARACTERISTICS → columns
  { vo0: 49.5, vo1: 54.5, rec0: 81.4, rec1: 86.4 }, // drill path settles on ADDRESS
  { vo0: 54.5, vo1: 63.3, still: '86.4' }, // freeze — search-bar explainer
  // Method 2 · Overview tab
  { vo0: 63.3, vo1: 65.35, rec0: 86.4, rec1: 88.45 }, // click ADDRESS
  { vo0: 65.35, vo1: 69.1, rec0: 89.85, rec1: 93.6 }, // column Overview loads
  { vo0: 69.1, vo1: 82.0, still: '93.6' }, // hold for description / classification / profiling
  { vo0: 82.0, vo1: 85.6, rec0: 96.9, rec1: 100.5 }, // table overview → click Contains
  { vo0: 85.6, vo1: 91.9, rec0: 100.5, rec1: 106.8 }, // Contains grid, scroll to profiling bars
];

// crop-space rectangles (1664×826 app window)
const R = {
  browse: { x: 12, y: 138, w: 92, h: 26 },
  sfRow: { x: 232, y: 322, w: 196, h: 26 },
  hierTab: { x: 294, y: 190, w: 92, h: 32 },
  cotality: { x: 300, y: 554, w: 132, h: 25 },
  premise: { x: 320, y: 586, w: 226, h: 25 },
  address: { x: 340, y: 617, w: 82, h: 25 },
  search: { x: 452, y: 14, w: 698, h: 36 },
  descPanel: { x: 205, y: 250, w: 932, h: 92 },
  decPanel: { x: 205, y: 632, w: 932, h: 112 },
  overviewTab: { x: 205, y: 190, w: 86, h: 32 },
  containsTab: { x: 294, y: 190, w: 88, h: 32 },
  grid: { x: 222, y: 300, w: 1010, h: 434 },
  nullCol: { x: 645, y: 300, w: 178, h: 434 },
} satisfies Record<string, Rect>;

const DEF = { x: 1920, y: 1185, w: 3100 };
const SIDE1 = { x: 1480, y: 1185, w: 2700 };
const SIDE2 = { x: 1200, y: 1185, w: 2150 };

const geom = (t: number) => {
  const T = [34.6, 35.45, 41.2, 41.9, 48.2, 48.9, 70.9, 71.6, 81.55, 82.25];
  const X = [DEF.x, DEF.x, DEF.x, SIDE1.x, SIDE1.x, DEF.x, DEF.x, SIDE2.x, SIDE2.x, DEF.x];
  const Y = [DEF.y + 420, DEF.y, DEF.y, SIDE1.y, SIDE1.y, DEF.y, DEF.y, SIDE2.y, SIDE2.y, DEF.y];
  const Wd = [2860, DEF.w, DEF.w, SIDE1.w, SIDE1.w, DEF.w, DEF.w, SIDE2.w, SIDE2.w, DEF.w];
  const enter = tween(t, 34.6, 35.45, 0, 1, EASE_OUT);
  const exit = tween(t, 91.45, 92.1, 0, 1, EASE_IN);
  return {
    x: keys(t, T, X),
    y: keys(t, T, Y) + exit * 260,
    w: keys(t, T, Wd) * (1 - 0.08 * exit),
    rotX: (1 - enter) * 16,
    opacity: Math.min(enter * 1.4, 1) * (1 - exit),
  };
};

/* ---------------- overlays inside the app window ---------------- */
const Overlays: React.FC<{ k: number; t: number }> = ({ k, t }) => {
  const frame = useCurrentFrame();
  // spotlight path (search bar → description → classifications → grid)
  const spotSearch = envelope(t, 58.3, 62.75, 0.45, 0.4);
  const spotDesc = envelope(t, 68.95, 70.75, 0.4, 0.45);
  const descToDec = tween(t, 69.95, 70.35, 0, 1, EASE_IN_OUT);
  const spotGrid = envelope(t, 85.75, 87.05, 0.4, 0.4);
  const drill = (t0: number) => envelope(t, t0, 54.35, 0.35, 0.35);
  const drillLine = tween(t, 50.0, 52.9, 0, 1, EASE_IN_OUT) * envelope(t, 49.9, 54.35, 0.2, 0.35);
  const sx = 262 * k;
  return (
    <>
      <Spotlight rect={R.search} k={k} opacity={spotSearch} pad={6} />
      <Spotlight rect={lerpRect(R.descPanel, R.decPanel, descToDec)} k={k} opacity={spotDesc} pad={6} dim={0.55} />
      <Spotlight rect={R.grid} k={k} opacity={spotGrid} pad={4} dim={0.42} />

      <Ring rect={R.browse} k={k} opacity={envelope(t, 34.95, 36.2, 0.3, 0.3)} />
      <Ring rect={R.sfRow} k={k} opacity={envelope(t, 37.05, 38.35, 0.3, 0.25)} />
      <Ring rect={R.hierTab} k={k} opacity={envelope(t, 39.3, 40.25, 0.3, 0.3)} />
      <Ripple x={290 * k} y={338 * k} t0={38.45} size={120} />
      <Ripple x={340 * k} y={208 * k} t0={39.86} size={120} />

      {/* drill path: schema → table → field */}
      {drillLine > 0 ? (
        <div style={{ position: 'absolute', left: sx - 4, top: 566 * k, width: 8, height: (629 - 566) * k * Math.min(1, drillLine), background: 'linear-gradient(180deg, #8CC6FF, #2E95F0)', borderRadius: 8, boxShadow: '0 0 24px #2E95F0', opacity: envelope(t, 49.9, 54.35, 0.2, 0.35) }} />
      ) : null}
      {[
        { r: R.cotality, t0: 50.0, y: 566 },
        { r: R.premise, t0: 51.2, y: 598 },
        { r: R.address, t0: 52.55, y: 629 },
      ].map((d) => (
        <React.Fragment key={d.t0}>
          <Ring rect={d.r} k={k} opacity={drill(d.t0)} />
          <div style={{ position: 'absolute', left: sx - 14, top: d.y * k - 14, width: 28, height: 28, borderRadius: 14, background: '#2E95F0', boxShadow: '0 0 20px #2E95F0', opacity: drill(d.t0), transform: `scale(${pop(frame, d.t0)})` }} />
        </React.Fragment>
      ))}
      {/* "layer by layer" click ripples */}
      <Ripple x={286 * k} y={566 * k} t0={55.95} size={110} />
      <Ripple x={308 * k} y={598 * k} t0={56.55} size={110} />
      <Ripple x={350 * k} y={629 * k} t0={57.15} size={110} />

      {/* Method 2 */}
      <Ring rect={R.address} k={k} opacity={envelope(t, 63.45, 65.15, 0.3, 0.25)} />
      <Ripple x={392 * k} y={630 * k} t0={65.08} size={120} />
      <Ring rect={R.overviewTab} k={k} opacity={envelope(t, 65.55, 66.95, 0.3, 0.3)} />
      <Ring rect={R.containsTab} k={k} opacity={envelope(t, 82.7, 84.2, 0.3, 0.3)} />
      <Ripple x={338 * k} y={206 * k} t0={83.95} size={120} />
      <Ring rect={R.nullCol} k={k} opacity={envelope(t, 88.95, 91.35, 0.4, 0.35)} radius={10} />
    </>
  );
};

/** Level tags (spaced out, with leader lines) drawn while drilling down. */
const DrillTags: React.FC<{ k: number; t: number }> = ({ k, t }) => {
  const rows: { y: number; ty: number; xEnd: number; t0: number; label: string; icon: IconName }[] = [
    { y: 566, ty: 486, xEnd: 436, t0: 50.15, label: 'Schema', icon: 'folderSchema' },
    { y: 598, ty: 598, xEnd: 550, t0: 51.35, label: 'Table', icon: 'table' },
    { y: 629, ty: 710, xEnd: 426, t0: 52.7, label: 'Single field', icon: 'column' },
  ];
  const tagX = 760;
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1664 * k} height={826 * k}>
        {rows.map((r) => {
          const o = envelope(t, r.t0, 54.3, 0.35, 0.35);
          const p = tween(t, r.t0, r.t0 + 0.45, 0, 1, EASE_OUT);
          const x2 = r.xEnd * k + (tagX * k - 20 - r.xEnd * k) * p;
          const y2 = r.y * k + (r.ty * k - r.y * k) * p;
          return o > 0 ? (
            <g key={r.label} opacity={o}>
              <path d={`M ${r.xEnd * k + 10} ${r.y * k} L ${x2} ${y2}`} stroke="#2E95F0" strokeWidth={5} fill="none" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px #2E95F0)' }} />
              <circle cx={r.xEnd * k + 10} cy={r.y * k} r={9} fill="#2E95F0" />
            </g>
          ) : null;
        })}
      </svg>
      {rows.map((r) => (
        <Reveal key={r.label} t0={r.t0 + 0.15} out={54.3} dx={-60} dy={0} style={{ position: 'absolute', left: tagX * k, top: r.ty * k - 56 }}>
          <Chip text={r.label} icon={r.icon} size={52} />
        </Reveal>
      ))}
    </>
  );
};

/* ---------------- side card: source hierarchy levels ---------------- */
const HierarchyCard: React.FC = () => {
  const t = useT();
  const frame = useCurrentFrame();
  const levels: { label: string; icon: IconName; t0: number }[] = [
    { label: 'Database', icon: 'database', t0: 42.92 },
    { label: 'Schema', icon: 'folderSchema', t0: 43.28 },
    { label: 'Table', icon: 'table', t0: 44.16 },
    { label: 'Column', icon: 'column', t0: 44.84 },
  ];
  const cx = 3315, top = 520, w = 860, h = 1330;
  const inP = tween(t, 41.45, 42.1, 0, 1, EASE_OUT);
  const outP = tween(t, 47.9, 48.35, 0, 1, EASE_IN);
  if (inP <= 0 || outP >= 1) return null;
  const lineP = tween(t, 42.9, 45.2, 0, 1, EASE_IN_OUT);
  const rowY = (i: number) => top + 330 + i * 250;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: inP * (1 - outP), transform: `translateX(${(1 - inP) * 200 + outP * 200}px)` }}>
      <Glass style={{ left: cx - w / 2, top, width: w, height: h }} />
      <div style={{ position: 'absolute', left: cx - w / 2 + 80, top: top + 90, fontFamily: FONT, fontSize: 58, fontWeight: 500, color: C.textDim, letterSpacing: '0.02em' }}>Mirrors the source</div>
      <div style={{ position: 'absolute', left: cx - w / 2 + 175, top: rowY(0), width: 8, height: (rowY(3) - rowY(0)) * lineP, background: 'linear-gradient(180deg,#8CC6FF,#2E95F0)', borderRadius: 6, boxShadow: '0 0 20px #2E95F0' }} />
      {levels.map((lv, i) => {
        const p = pop(frame, lv.t0, { damping: 14, stiffness: 140 });
        const active = tween(t, lv.t0, lv.t0 + 0.2) * (i === 3 ? 1 : tween(t, levels[i + 1].t0, levels[i + 1].t0 + 0.4, 1, 0.55));
        return (
          <div key={lv.label} style={{ position: 'absolute', left: cx - w / 2 + 90, top: rowY(i) - 90, height: 180, display: 'flex', alignItems: 'center', gap: 60, opacity: Math.min(1, p * 1.5) * (0.45 + 0.55 * active), transform: `translateX(${(1 - p) * 60}px)` }}>
            <div style={{ width: 200, height: 200, borderRadius: 100, background: 'radial-gradient(circle, rgba(18,20,26,0.95) 45%, rgba(0,114,206,0.6))', border: '5px solid #5AA9F2', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 ${40 * active}px rgba(0,114,206,0.8)` }}>
              <Icon name={lv.icon} size={128} progress={tween(t, lv.t0, lv.t0 + 0.8)} />
            </div>
            <div style={{ fontFamily: FONT, fontSize: 78, fontWeight: 600, color: C.text }}>{lv.label}</div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------------- search-bar explainer (over freeze frame) ---------------- */
const SearchDemo: React.FC = () => {
  const t = useT();
  const frame = useCurrentFrame();
  const g = geom(t);
  const k = g.w / 1664;
  const barX = g.x - g.w / 2 + 452 * k, barY = g.y - (g.w * 826) / 1664 / 2 + 14 * k;
  const open = tween(t, 58.75, 59.35, 0, 1, EASE_OUT);
  const close = tween(t, 62.75, 63.15, 0, 1, EASE_IN);
  if (open <= 0 || close >= 1) return null;
  const query = 'PREMISE_CHARACTERISTICS';
  const typed = Math.round(query.length * tween(t, 60.4, 61.55, 0, 1, (n) => n));
  const caretOn = Math.floor(frame / 8) % 2 === 0;
  const drop = tween(t, 61.5, 61.95, 0, 1, EASE_OUT);
  const pick = tween(t, 62.05, 62.3, 0, 1, EASE_OUT);
  const W = 2380, H = 200, X = 1920 - W / 2, Y = 700;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - close }}>
      {/* tether from real search bar to the magnified one */}
      <svg style={{ position: 'absolute', inset: 0, overflow: 'visible' }} width={3840} height={2160}>
        <path d={`M ${barX + 40 * k} ${barY + 36 * k} L ${X + 60} ${Y} M ${barX + 698 * k} ${barY + 36 * k} L ${X + W - 60} ${Y}`} stroke="rgba(140,198,255,0.55)" strokeWidth={4} strokeDasharray="14 12" opacity={open} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: X,
          top: Y,
          width: W,
          height: H,
          borderRadius: 40,
          background: '#FFFFFF',
          boxShadow: '0 0 0 6px rgba(46,149,240,0.9), 0 0 80px rgba(0,114,206,0.75), 0 40px 100px rgba(0,0,0,0.5)',
          transformOrigin: '50% 0%',
          transform: `translateY(${(1 - open) * -120}px) scale(${0.55 + 0.45 * open})`,
          opacity: open,
          display: 'flex',
          alignItems: 'center',
          fontFamily: FONT,
        }}
      >
        <div style={{ width: 430, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 50px', borderRight: '3px solid #D9DEE5', fontSize: 64, color: '#3A3F47', boxSizing: 'border-box' }}>
          Keyword <span style={{ fontSize: 50, color: '#6B7280' }}>▾</span>
        </div>
        <div style={{ flex: 1, padding: '0 60px', fontSize: 80, color: '#1B2A4A', fontWeight: 500, letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
          {typed === 0 ? <span style={{ color: '#9AA3AF', fontWeight: 400, fontSize: 68 }}>Start typing search terms for suggestions.</span> : query.slice(0, typed)}
          {typed > 0 && caretOn ? <span style={{ color: C.blue }}>|</span> : null}
        </div>
        <div style={{ width: 200, display: 'flex', justifyContent: 'center' }}>
          <Icon name="search" size={110} stroke="#1B2A4A" fill={C.blue} strokePx={9} />
        </div>
      </div>
      {/* suggestions */}
      {drop > 0 ? (
        <div style={{ position: 'absolute', left: X + 430, top: Y + H + 30, width: W - 430, borderRadius: 34, background: '#FFFFFF', boxShadow: '0 30px 90px rgba(0,0,0,0.5), 0 0 0 3px rgba(46,149,240,0.4)', opacity: drop, transform: `translateY(${(1 - drop) * -40}px)`, overflow: 'hidden', fontFamily: FONT }}>
          {[
            { name: 'PREMISE_CHARACTERISTICS', meta: 'Table · ENT_COTALITY', icon: 'table' as const },
            { name: 'PREMISE_ID', meta: 'Column · PREMISE_CHARACTERISTICS', icon: 'column' as const },
          ].map((row, i) => (
            <div key={row.name} style={{ display: 'flex', alignItems: 'center', gap: 50, padding: '40px 60px', background: i === 0 ? `rgba(0,114,206,${0.12 * pick})` : 'transparent', borderBottom: i === 0 ? '2px solid #E6EAF0' : undefined }}>
              <Icon name={row.icon} size={96} stroke="#1B2A4A" fill={C.blue} strokePx={8} />
              <div>
                <div style={{ fontSize: 70, fontWeight: 600, color: '#1556A8' }}>{row.name}</div>
                <div style={{ fontSize: 50, color: '#6B7280', marginTop: 6 }}>{row.meta}</div>
              </div>
              {i === 0 ? (
                <div style={{ marginLeft: 'auto', fontSize: 56, fontWeight: 600, color: C.blue, opacity: pick, transform: `translateX(${(1 - pick) * -40}px)` }}>Jump to asset →</div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      <Ripple x={X + 430 + 600} y={Y + H + 30 + 120} t0={62.12} size={180} />
    </div>
  );
};

/* ---------------- profiling side panel (Method 2) ---------------- */
const StatBar: React.FC<{ t0: number; parts: [number, number, number]; width: number }> = ({ t0, parts, width }) => {
  const t = useT();
  const p = tween(t, t0, t0 + 0.9, 0, 1, EASE_IN_OUT);
  const cols = [C.red, '#1D4FD8', '#1E8C7E'];
  return (
    <div style={{ width, height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', display: 'flex' }}>
      {parts.map((v, i) => (
        <div key={i} style={{ width: `${v * p}%`, height: '100%', background: cols[i], boxShadow: `inset 0 0 12px rgba(0,0,0,0.25)` }} />
      ))}
    </div>
  );
};

const ProfilingPanel: React.FC = () => {
  const t = useT();
  const cx = 3020, top = 440, w = 1380, h = 1490;
  const inP = tween(t, 71.25, 71.9, 0, 1, EASE_OUT);
  const outP = tween(t, 81.4, 81.9, 0, 1, EASE_IN);
  if (inP <= 0 || outP >= 1) return null;
  const left = cx - w / 2;
  const aOut = tween(t, 77.3, 77.7, 0, 1, EASE_IN);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: inP * (1 - outP), transform: `translateX(${(1 - inP) * 220 + outP * 220}px)` }}>
      <Glass style={{ left, top, width: w, height: h }} />
      {/* Panel A — profiling statistics */}
      {aOut < 1 ? (
        <div style={{ position: 'absolute', left, top, width: w, height: h, opacity: 1 - aOut, transform: `translateY(${-aOut * 80}px)` }}>
          <div style={{ position: 'absolute', left: 100, top: 110 }}>
            <KText text="Early *profiling statistics*" times={[71.72, 72.04, 72.54]} size={86} weight={600} align="left" />
          </div>
          {[
            { icon: 'nullSet' as IconName, label: 'Null counts', t0: 73.4, parts: [14, 58, 28] as [number, number, number] },
            { icon: 'distinct' as IconName, label: 'Distinct values', t0: 74.3, parts: [3, 86, 11] as [number, number, number] },
          ].map((row, i) => (
            <Reveal key={row.label} t0={row.t0} dx={60} dy={0} style={{ position: 'absolute', left: 100, top: 330 + i * 360 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}>
                <div style={{ width: 190, height: 190, borderRadius: 95, border: '5px solid #5AA9F2', background: 'radial-gradient(circle, rgba(18,20,26,0.95) 45%, rgba(0,114,206,0.55))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={row.icon} size={118} progress={tween(t, row.t0, row.t0 + 0.8)} />
                </div>
                <div>
                  <div style={{ fontFamily: FONT, fontSize: 76, fontWeight: 600, color: C.text, marginBottom: 30 }}>{row.label}</div>
                  <StatBar t0={row.t0 + 0.2} parts={row.parts} width={860} />
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal t0={73.9} style={{ position: 'absolute', left: 100, top: 1060, display: 'flex', gap: 50, fontFamily: FONT, fontSize: 48, color: C.textDim }}>
            {[
              ['Null', C.red],
              ['Distinct', '#1D4FD8'],
              ['Non-distinct', '#1E8C7E'],
            ].map(([l, col]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: col }} />
                {l}
              </div>
            ))}
          </Reveal>
          <Reveal t0={75.55} style={{ position: 'absolute', left: 100, top: 1250 }}>
            <Chip text="Captured during extraction" icon="extract" size={58} />
          </Reveal>
        </div>
      ) : null}
      {/* Panel B — first read on data quality */}
      <Window from={77.4} to={82}>
        <IconBadge icon="gauge" t0={77.6} x={cx} y={top + 430} d={430} />
        <div style={{ position: 'absolute', left, top: top + 720, width: w, display: 'flex', justifyContent: 'center' }}>
          <KText text="A first read on *data quality*" times={[78.08, 78.32, 78.5, 78.86, 79.1, 79.32, 79.56]} size={84} weight={600} />
        </div>
        <Reveal t0={79.95} dy={50} style={{ position: 'absolute', left: left + 110, top: top + 1000, width: w - 220 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 50, padding: '46px 60px', borderRadius: 40, background: 'rgba(255,255,255,0.05)', border: '3px solid rgba(90,170,255,0.4)' }}>
            <Icon name="ruleDoc" size={170} progress={tween(t, 80.0, 80.9)} />
            <div style={{ fontFamily: FONT, color: C.text }}>
              <div style={{ fontSize: 66, fontWeight: 600 }}>Before any rule is written</div>
              <div style={{ fontSize: 52, color: C.textDim, marginTop: 10 }}>
                Rules written: <span style={{ color: C.blueLight, fontWeight: 700 }}>0</span>
              </div>
            </div>
          </div>
        </Reveal>
      </Window>
    </div>
  );
};

/* ---------------- breadcrumb: "without losing your place" ---------------- */
const Breadcrumb: React.FC = () => {
  const t = useT();
  const parts = ['Snowflake_Enterprise', 'BIAD003_DEVL', 'ENT_COTALITY', 'PREMISE_CHARACTERISTICS', 'ADDRESS'];
  const o = envelope(t, 53.2, 54.75, 0.3, 0.4);
  if (o <= 0) return null;
  return (
    <div style={{ position: 'absolute', top: 1985, left: 0, width: 3840, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: o }}>
      <Reveal t0={53.2} dy={20}>
        <Icon name="pin" size={92} strokePx={8} />
      </Reveal>
      {parts.map((p, i) => (
        <Reveal key={p} t0={53.3 + i * 0.13} dy={20} dx={-20} style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          {i > 0 ? <span style={{ fontFamily: FONT, fontSize: 56, color: C.blueLight }}>›</span> : null}
          <Chip text={p} size={44} bg={i === parts.length - 1 ? 'rgba(0,114,206,0.55)' : undefined} />
        </Reveal>
      ))}
    </div>
  );
};

/* ---------------- headers (kinetic body text above the screen) ---------------- */
const Headers: React.FC = () => {
  const y = 150;
  const s = 96;
  return (
    <>
      <KLine y={y} size={s} text="In CDGC, browse to the *catalog source* you ran" times={[35.36, 35.54, 36.76, 36.88, 37.14, 37.34, 37.6, 37.96, 38.18]} out={38.75} />
      <KLine y={y} size={s} text="A hierarchy that *mirrors the source system*" times={[39.3, 39.52, 39.96, 40.24, 40.58, 40.88, 41.08]} out={49.2} />
      <KLine y={y} size={s} text="Drill from a container *down to a single field*" times={[49.6, 49.84, 50.08, 50.7, 51.94, 52.18, 52.36, 52.58, 52.86]} out={54.6} />
      <KLine y={y} size={s} text="Rather not click through *layer by layer?*" times={[55.36, 55.58, 55.92, 56.16, 56.98, 57.36, 57.56]} out={57.88} />
      <KLine y={y} size={s} text="The *search bar* works just as well" times={[58.22, 58.44, 58.66, 58.92, 59.18, 59.48, 59.68]} out={60.2} />
      <KLine y={y} size={s} text="Type a name and *jump straight to it*" times={[60.46, 60.58, 61.56, 61.84, 62.12, 62.32, 62.66, 62.92]} out={63.25} />
      <KLine y={y} size={s} text="Click into any *technical asset*" times={[63.56, 63.72, 64.0, 64.36, 64.84]} out={65.15} />
      <KLine y={y} size={s} text="Open its *Overview* tab" times={[65.6, 65.78, 65.94, 66.34]} out={67.0} />
      <KLine y={y} size={s} text="Basic details: *description* and *classification*" times={[67.86, 68.46, 69.16, 69.68, 70.04]} out={70.95} />
      <KLine y={y} size={s} text="The *Contains* tab is worth a look" times={[82.24, 82.9, 83.4, 83.68, 83.9, 84.04, 84.22]} out={85.0} />
      <KLine y={y} size={s} text="Every data element, *in one grid*" times={[85.58, 86.08, 86.38, 87.56, 87.8, 88.12]} out={88.45} />
      <KLine y={y} size={s} text="No need to open *each column one by one*" times={[88.82, 89.02, 89.26, 89.68, 89.9, 90.28, 90.68, 90.92, 91.08]} out={91.5} />
    </>
  );
};

export const ScreenStory: React.FC = () => {
  const t = useT();
  if (t < 34.5 || t > 92.2) return null;
  const g = geom(t);
  return (
    <>
      <Headers />
      <Screen
        segs={SEGS_M12}
        x={g.x}
        y={g.y}
        w={g.w}
        rotX={g.rotX}
        opacity={g.opacity}
        overlay={(k) => <Overlays k={k} t={t} />}
        outside={(k) => <DrillTags k={k} t={t} />}
      />
      <HierarchyCard />
      <Breadcrumb />
      <SearchDemo />
      <ProfilingPanel />
      <NullColTag />
    </>
  );
};

/** Label for the Null | Distinct | Non-Distinct % column in the Contains grid. */
const NullColTag: React.FC = () => {
  const t = useT();
  const g = geom(t);
  const k = g.w / 1664;
  const x = g.x - g.w / 2 + (645 + 89) * k;
  const y = g.y - (g.w * 826) / 1664 / 2 + 300 * k;
  return (
    <Reveal t0={89.15} out={91.3} dy={30} style={{ position: 'absolute', left: x - 700, top: y - 175, width: 1400, display: 'flex', justifyContent: 'center' }}>
      <Chip text="Profiling stats for every column" icon="profile" size={54} />
    </Reveal>
  );
};
