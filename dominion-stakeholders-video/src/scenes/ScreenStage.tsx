import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Caption, CaptionDef, CardLayout, Overlay, ScreenCard} from '../components/ScreenCard';
import {Icon} from '../components/Icons';
import {Chip, IconRing, KText, Panel} from '../components/UI';
import {env, keys, pop, tween} from '../lib/anim';
import {C, E, FONT} from '../lib/theme';
import {TL, VF, f, shotById, srcFrame} from '../lib/time';

/* =====================================================================
 * Timing anchors (frames). Everything is tied to voiceover words (VF) or
 * to the moment a source-recording event appears on screen (srcFrame).
 * ===================================================================== */
const W1 = shotById('W1');
const W2 = shotById('W2');
const X1 = shotById('X1');
const W3 = shotById('W3');

export const STAGE = {
  w1In: W1.from, // card flies in from the intro
  w1Out: W1.to, // card collapses into the part-3 grid
  w2In: W2.from,
  w3Out: W3.to,
};

/* ------------------------------------------------------------- overlays */
const OVERLAYS: Overlay[] = [
  // ---- Method 1: review what came in
  {kind: 'ripple', shot: 'W1', x: 382, y: 549, at: srcFrame('W1', 33.7)},
  {kind: 'spot', shot: 'W1', rect: [203, 240, 1140, 356], from: f(62.7), to: f(65.9), tag: 'Description', tagPos: 'bottom'},
  {kind: 'ripple', shot: 'W1', x: 339, y: 204, at: srcFrame('W1', 56.0)},
  {kind: 'spot', shot: 'W1', rect: [203, 240, 1263, 808], from: f(66.4), to: f(68.5), tag: 'Primary columns', tagPos: 'right'},
  {kind: 'box', shot: 'W1', rect: [1272, 186, 1356, 224], from: f(75.2), to: f(77.0), tag: 'History'},
  {kind: 'ripple', shot: 'W1', x: 1311, y: 204, at: srcFrame('W1', 72.9)},
  {kind: 'spot', shot: 'W1', rect: [203, 240, 1632, 582], from: f(77.6), to: f(81.5)},
  {kind: 'spot', shot: 'W1', rect: [226, 330, 1608, 505], from: f(81.5), to: f(83.8), morph: true},
  {kind: 'spot', shot: 'W1', rect: [226, 506, 1608, 582], from: f(83.8), to: f(86.2), morph: true},
  {kind: 'spot', shot: 'W1', rect: [203, 240, 1632, 582], from: f(86.2), to: f(88.8), morph: true},
  // ---- Part 2: assign manually
  {kind: 'box', shot: 'W1', rect: [972, 186, 1088, 224], from: f(90.3), to: f(91.9), tag: 'Stakeholders'},
  {kind: 'ripple', shot: 'W1', x: 1029, y: 204, at: srcFrame('W1', 88.19)},
  {kind: 'box', shot: 'W1', rect: [1349, 252, 1387, 289], from: f(91.95), to: f(92.95), tag: 'Modify Stakeholders', tagPos: 'left'},
  {kind: 'ripple', shot: 'W1', x: 1367, y: 270, at: srcFrame('W1', 95.6)},
  {kind: 'spot', shot: 'W1', rect: [510, 289, 1163, 540], from: f(92.95), to: f(94.4)},
  {kind: 'ripple', shot: 'W1', x: 972, y: 508, at: srcFrame('W1', 104.4)},
  {kind: 'box', shot: 'W1', rect: [246, 116, 711, 150], from: f(95.2), to: f(96.8), tag: 'Select Roles', tagPos: 'bottom'},
  {kind: 'spot', shot: 'W1', rect: [246, 152, 712, 398], from: f(97.3), to: f(99.7)},
  {kind: 'box', shot: 'W1', rect: [252, 166, 700, 200], from: VF(93.85), to: f(99.6), tag: 'Data Owner', tagPos: 'right'},
  {kind: 'box', shot: 'W1', rect: [252, 202, 700, 235], from: VF(95.0), to: f(99.6), tag: 'Data Steward', tagPos: 'right'},
  {kind: 'spot', shot: 'W1', rect: [133, 280, 711, 630], from: f(101.1), to: f(102.4)},
  {kind: 'spot', shot: 'W1', rect: [133, 364, 711, 409], from: f(102.4), to: f(104.2), morph: true},
  {kind: 'ripple', shot: 'W1', x: 157, y: 386, at: srcFrame('W1', 117.4)},
  {kind: 'box', shot: 'W1', rect: [133, 497, 711, 542], from: f(114.6), to: f(116.2)},
  {kind: 'ripple', shot: 'W1', x: 157, y: 519, at: srcFrame('W1', 125.85)},
  {kind: 'box', shot: 'W1', rect: [748, 110, 1556, 290], from: f(115.2), to: f(117.0), tag: 'Selected Stakeholders (2)', tagPos: 'bottom'},
  {kind: 'box', shot: 'W1', rect: [212, 186, 322, 220], from: VF(111.8), to: f(117.2), tag: 'User Groups', tagPos: 'bottom'},
  // ---- Part 3: export
  {kind: 'ripple', shot: 'W2', x: 1230, y: 158, at: srcFrame('W2', 184.4)},
  {kind: 'spot', shot: 'W2', rect: [510, 204, 1164, 624], from: f(135.05), to: f(136.95)},
  {kind: 'ripple', shot: 'W2', x: 962, y: 594, at: srcFrame('W2', 210.6)},
  {kind: 'box', shot: 'W2', rect: [680, 72, 1098, 108], from: f(136.95), to: f(137.6), tag: 'Export job started', tagPos: 'bottom'},
  {kind: 'box', shot: 'W2', rect: [506, 466, 1322, 494], from: f(137.65), to: f(139.0)},
  // ---- Part 3: spreadsheet
  {kind: 'box', shot: 'X1', rect: [100, 855, 736, 881], from: f(140.0), to: f(141.7), tag: 'Tabs = asset levels'},
  {kind: 'box', shot: 'X1', rect: [220, 855, 338, 881], from: f(141.75), to: f(145.4)},
  {kind: 'lens', shot: 'X1', rect: [92, 848, 520, 888], from: f(142.0), to: f(145.4), at: [700, 640], zoom: 2.6},
  {kind: 'box', shot: 'X1', rect: [66, 208, 232, 229], from: f(147.2), to: f(151.7)},
  {kind: 'lens', shot: 'X1', rect: [40, 200, 470, 246], from: f(147.3), to: f(151.7), at: [700, 420], zoom: 2.5},
  {kind: 'box', shot: 'X1', rect: [1153, 208, 1217, 246], from: f(153.3), to: f(155.3)},
  {kind: 'lens', shot: 'X1', rect: [960, 200, 1420, 246], from: f(153.4), to: f(155.3), at: [1000, 430], zoom: 2.4},
  // ---- Part 3: re-import
  {kind: 'box', shot: 'W3', rect: [526, 258, 1306, 308], from: f(155.4), to: f(156.5), tag: 'Import Assets', tagPos: 'bottom'},
  {kind: 'ripple', shot: 'W3', x: 1142, y: 705, at: srcFrame('W3', 364.7)},
  {kind: 'box', shot: 'W3', rect: [926, 390, 1058, 422], from: f(157.0), to: f(157.6), tag: 'Choose Files', tagPos: 'right'},
  {kind: 'box', shot: 'W3', rect: [160, 82, 826, 108], from: f(157.6), to: f(158.4)},
  {kind: 'spot', shot: 'W3', rect: [212, 196, 1604, 244], from: f(159.4), to: f(161.4)},
  {kind: 'box', shot: 'W3', rect: [1452, 78, 1582, 112], from: f(159.8), to: f(161.4), tag: 'Start Import', tagPos: 'bottom'},
];

/* ------------------------------------------------------------- captions */
const CAPTIONS: CaptionDef[] = [
  {from: f(55.3), to: f(59.7), icon: 'schema', text: 'Browse the *technical assets* under your catalog source'},
  {from: f(59.8), to: f(62.65), icon: 'table', text: 'Open *key tables* and check the essentials'},
  {from: f(62.75), to: f(65.95), icon: 'edit', text: 'Does the *description* clearly define its purpose?'},
  {from: f(66.05), to: f(68.5), icon: 'column', text: 'Are the *primary columns* fully accounted for?'},
  {from: f(72.9), to: f(76.75), icon: 'history', text: 'Open the *History* tab to track changes over time'},
  {from: f(76.85), to: f(81.4), icon: 'clock', text: 'Every update is logged *since first ingestion*'},
  {from: f(81.5), to: f(83.75), icon: 'magnifier', text: 'Audit *schema modifications*'},
  {from: f(83.85), to: f(89.0), icon: 'shieldCheck', text: 'Verify no *unexpected structural change* slipped through'},
  {from: f(89.6), to: f(94.85), icon: 'users', text: '*Stakeholders* tab  ›  *Modify Stakeholders*'},
  {from: f(94.95), to: f(97.25), icon: 'idBadge', text: 'Select the appropriate *governance role*'},
  {from: f(97.35), to: f(100.05), icon: 'steward', text: 'Most commonly *Data Owner* or *Data Steward*'},
  {from: f(100.15), to: f(104.0), icon: 'magnifier', text: 'Search for the designated *individual or user group*'},
  {from: f(112.7), to: f(116.9), icon: 'users', text: 'Assign *multiple stakeholders* or shared *user groups*'},
  {from: f(134.1), to: f(138.3), icon: 'exportBox', text: '*Export* the technical assets you need to assign'},
  {from: f(138.4), to: f(141.9), icon: 'spreadsheet', text: 'Open the spreadsheet  ›  tab matching your *asset level*'},
  {from: f(142.0), to: f(145.4), icon: 'table', text: 'For tables, select the *Technical Data Set* tab'},
  {from: f(145.5), to: f(148.75), icon: 'column', text: 'Locate the specific *stakeholder role column*'},
  {from: f(148.85), to: f(151.6), icon: 'idBadge', text: 'Enter the *usernames or user groups*'},
  {from: f(151.7), to: f(155.25), icon: 'checklist', text: 'Make sure the *Operation* column is set to *Update*'},
  {from: f(155.35), to: f(158.6), icon: 'importBox', text: '*Re-import* the file'},
  {from: f(158.7), to: f(161.45), icon: 'bolt', text: 'Ownership applies across *all selected assets*, immediately'},
];

/* ------------------------------------------------------------- layout (camera) */
const BASE: CardLayout = {cx: 960, cy: 437, scale: 1, opacity: 1};
const SIDE = {cx: 640, cy: 470, scale: 0.7};

// side-panel windows
const CHECK_A = f(68.45);
const CHECK_B = f(72.85);
const NOTE_A = f(104.1);
const NOTE_B = f(112.6);
const JOINT_A = f(117.05);
const JOINT_B = W1.to; // collapses into the grid

const layoutAt = (fr: number): CardLayout | null => {
  // --- W1 window
  if (fr >= W1.from - 2 && fr <= W1.to + 34) {
    const enter = tween(fr, W1.from + 4, W1.from + 38, 0, 1, E.out);
    let cx = BASE.cx;
    let cy = 437 + (1 - enter) * 260;
    let scale = 0.84 + 0.16 * enter;
    const rotX = (1 - enter) * 24;
    let opacity = tween(fr, W1.from + 4, W1.from + 18, 0, 1);
    // side panel: initial health check
    const side1 = keys(fr, [[CHECK_A - 4, 0], [CHECK_A + 16, 1], [CHECK_B - 14, 1], [CHECK_B + 6, 0]]);
    // side panel: joint responsibility
    const side2 = keys(fr, [[JOINT_A - 4, 0], [JOINT_A + 16, 1]]);
    const side = Math.max(side1, side2);
    cx += (SIDE.cx - cx) * side;
    cy += (SIDE.cy - cy) * side;
    scale += (SIDE.scale - 1) * side;
    // permission note: pull back slightly
    const note = env(fr, NOTE_A, NOTE_B, 16, 16, E.inOut, E.inOut);
    scale *= 1 - 0.06 * note;
    cy += 10 * note;
    // collapse into the part-3 grid tile
    const out = tween(fr, W1.to - 2, W1.to + 24, 0, 1, E.inOut);
    let tile = 0;
    if (out > 0) {
      cx += (960 - cx) * out;
      cy += (580 - cy) * out;
      scale = scale + (0.0513 - scale) * out;
      tile = tween(fr, W1.to + 8, W1.to + 22);
      opacity *= 1 - tween(fr, W1.to + 24, W1.to + 32, 0, 1);
    }
    return {cx, cy, scale, opacity, rotX, tile};
  }
  // --- W2 / X1 / W3 window
  if (fr >= W2.from - 2 && fr <= W3.to + 30) {
    const enter = tween(fr, W2.from - 2, W2.from + 26, 0, 1, E.inOut);
    // grows out of the "Export" node of the workflow diagram
    let cx = 560 + (BASE.cx - 560) * enter;
    let cy = 770 + (437 - 770) * enter;
    let scale = 0.1 + 0.9 * enter;
    let opacity = tween(fr, W2.from - 2, W2.from + 8, 0, 1);
    const xlH = (1440 * 900) / 1674;
    // Excel is taller: nudge up so the caption keeps its lane
    const xl = keys(fr, [[X1.from - 4, 0], [X1.from + 10, 1], [X1.to - 4, 1], [X1.to + 10, 0]]);
    cy -= ((xlH - 754) / 2 + 2) * xl;
    // collapse into the asset icon of the conclusion
    const out = tween(fr, W3.to - 4, W3.to + 24, 0, 1, E.inOut);
    if (out > 0) {
      cx += (1580 - cx) * out;
      cy += (560 - cy) * out;
      scale *= 1 - 0.9 * out;
      opacity *= 1 - tween(fr, W3.to + 14, W3.to + 26, 0, 1);
    }
    return {cx, cy, scale, opacity};
  }
  return null;
};

/* ------------------------------------------------------------- side panels */
const CheckPanel: React.FC = () => {
  const fr = useCurrentFrame();
  if (fr < CHECK_A - 2 || fr > CHECK_B + 8) return null;
  const p = env(fr, CHECK_A + 4, CHECK_B + 4, 16, 12);
  const items = [
    {t: 'Description defines its purpose', at: CHECK_A + 18},
    {t: 'Primary columns accounted for', at: CHECK_A + 30},
    {t: 'Evident gaps caught early', at: VF(66.92)},
  ];
  return (
    <div style={{position: 'absolute', left: 1218, top: 230, width: 640, opacity: p, transform: `translateX(${(1 - p) * 60}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
        <IconRing name="clipboardCheck" start={CHECK_A + 6} size={150} />
        <KText text="Initial *health check*" start={CHECK_A + 10} size={46} align="left" />
      </div>
      <div style={{marginTop: 34, display: 'flex', flexDirection: 'column', gap: 18}}>
        {items.map((it, i) => {
          const s = pop(fr, it.at, 13, 0.7, 140);
          const ck = tween(fr, it.at + 6, it.at + 20);
          return (
            <Panel key={i} style={{padding: '20px 26px', display: 'flex', alignItems: 'center', gap: 20, opacity: Math.min(1, s * 1.5), transform: `translateX(${(1 - s) * 40}px)`, borderRadius: 20}}>
              <svg width={44} height={44} viewBox="0 0 44 44">
                <circle cx={22} cy={22} r={20} fill={C.blue} opacity={ck} />
                <circle cx={22} cy={22} r={20} fill="none" stroke="#fff" strokeWidth={2.5} />
                <path d="M13 23 L19.5 29 L31 16" fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ck} />
              </svg>
              <div style={{fontFamily: FONT, fontSize: 30, fontWeight: 500, color: C.text}}>{it.t}</div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
};

const NotePanel: React.FC = () => {
  const fr = useCurrentFrame();
  if (fr < NOTE_A - 2 || fr > NOTE_B + 4) return null;
  const p = env(fr, NOTE_A, NOTE_B, 16, 14);
  const s = pop(fr, NOTE_A + 2, 15, 0.8, 110);
  const inactive = VF(104.14);
  const admin = VF(105.42);
  const arrowP = tween(fr, admin - 8, admin + 10, 0, 1, E.inOut);
  // inactive button wobble
  const wob = fr > inactive + 6 && fr < inactive + 26 ? Math.sin((fr - inactive) * 1.4) * 6 * (1 - (fr - inactive - 6) / 20) : 0;
  return (
    <>
      <div style={{position: 'absolute', inset: 0, background: `rgba(16,15,16,${0.72 * p})`}} />
      <div style={{position: 'absolute', left: 960, top: 455, transform: `translate(-50%,-50%) scale(${0.92 + 0.08 * s})`, opacity: p}}>
        <Panel glow style={{width: 1180, padding: '48px 60px', borderRadius: 34, background: 'linear-gradient(160deg, rgba(40,37,38,0.96), rgba(28,26,27,0.96))', border: '1.5px solid rgba(90,169,234,0.35)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
            <IconRing name="lock" start={NOTE_A + 6} size={170} />
            <div>
              <Chip label="Note" icon="bulb" start={NOTE_A + 4} variant="blue" size={22} />
              <KText text="Assigning stakeholders requires" start={VF(100.0)} stagger={2} size={44} align="left" style={{marginTop: 16}} />
              <KText text="*Manage Access* permissions" start={VF(101.9)} stagger={3} size={56} weight={700} align="left" />
            </div>
          </div>
          <div style={{height: 1.5, background: 'rgba(255,255,255,0.12)', margin: '40px 0 36px', transform: `scaleX(${tween(fr, inactive - 10, inactive + 10)})`, transformOrigin: 'left'}} />
          <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
            {/* inactive button */}
            <div style={{opacity: tween(fr, inactive - 4, inactive + 8), transform: `translateX(${wob}px)`, position: 'relative'}}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '18px 28px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1.5px dashed rgba(255,255,255,0.3)',
                  fontFamily: FONT,
                  fontSize: 28,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.42)',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{fontSize: 34, lineHeight: 1}}>+</span> Modify Stakeholders
              </div>
              <div style={{position: 'absolute', right: -26, bottom: -30, transform: `scale(${pop(fr, inactive + 2)})`}}>
                <Icon name="cursor" size={64} progress={tween(fr, inactive, inactive + 20)} />
              </div>
              <div style={{position: 'absolute', left: 0, right: 0, top: '100%', marginTop: 16, textAlign: 'center', fontFamily: FONT, fontSize: 22, color: C.muted, opacity: tween(fr, inactive + 8, inactive + 20)}}>
                Button inactive?
              </div>
            </div>
            <svg width={150} height={40} style={{overflow: 'visible'}}>
              <path d="M6 20 H138 M120 6 L140 20 L120 34" fill="none" stroke={C.blueLight} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - arrowP} />
            </svg>
            <IconRing name="admin" start={admin} size={130} />
            <KText text="Verify your role access / with an *administrator*" start={VF(105.42)} times={undefined} stagger={3} size={36} align="left" />
          </div>
        </Panel>
      </div>
    </>
  );
};

const JointPanel: React.FC = () => {
  const fr = useCurrentFrame();
  if (fr < JOINT_A - 2 || fr > JOINT_B + 20) return null;
  const p = tween(fr, JOINT_A + 6, JOINT_A + 22) * (1 - tween(fr, JOINT_B - 6, JOINT_B + 10, 0, 1, E.in));
  const cx = 1530;
  const cy = 500;
  const units = [
    {a: -150, t: 'Business unit', at: VF(113.6)},
    {a: -30, t: 'Business unit', at: VF(113.75)},
    {a: 90, t: 'Business unit', at: VF(113.9)},
  ];
  const R = 225;
  const hub = VF(114.32);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: p}}>
      <KText text="Joint operational / *responsibility*" start={VF(114.62)} stagger={3} size={44} align="center" style={{position: 'absolute', left: cx - 330, width: 660, top: 116}} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        {units.map((u, i) => {
          const rad = (u.a * Math.PI) / 180;
          const x = cx + Math.cos(rad) * R;
          const y = cy + Math.sin(rad) * R;
          const lp = tween(fr, hub + i * 3, hub + i * 3 + 18, 0, 1, E.inOut);
          return (
            <line key={i} x1={x} y1={y} x2={x + (cx - x) * lp} y2={y + (cy - y) * lp} stroke={C.blueLight} strokeWidth={3} strokeDasharray="7 8" strokeDashoffset={-fr * 0.8} opacity={0.9} />
          );
        })}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(90,169,234,0.18)" strokeWidth={2} />
      </svg>
      <div style={{position: 'absolute', left: cx - 95, top: cy - 95}}>
        <IconRing name="table" start={JOINT_A + 8} size={190} filled />
      </div>
      <div style={{position: 'absolute', left: cx - 120, top: cy + 104, width: 240, textAlign: 'center', fontFamily: FONT, fontSize: 26, fontWeight: 600, color: C.text, opacity: tween(fr, JOINT_A + 16, JOINT_A + 28)}}>
        Dataset
      </div>
      {units.map((u, i) => {
        const rad = (u.a * Math.PI) / 180;
        const x = cx + Math.cos(rad) * R;
        const y = cy + Math.sin(rad) * R;
        return (
          <div key={i} style={{position: 'absolute', left: x - 62, top: y - 62}}>
            <IconRing name={i === 1 ? 'users' : 'building'} start={u.at} size={124} />
          </div>
        );
      })}
    </div>
  );
};

const ImportBurst: React.FC = () => {
  const fr = useCurrentFrame();
  const a = VF(155.0);
  if (fr < a || fr > W3.to + 6) return null;
  const cols = 7;
  const n = 14;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {Array.from({length: n}).map((_, i) => {
        const t0 = a + i * 1.6;
        const p = tween(fr, t0, t0 + 20, 0, 1, E.out);
        const fade = 1 - tween(fr, W3.to - 6, W3.to + 4);
        const col = i % cols;
        const row = Math.floor(i / cols);
        const tx = 520 + col * 146;
        const ty = 420 + row * 140;
        const x = 940 + (tx - 940) * p;
        const y = 268 + (ty - 268) * p;
        const ck = tween(fr, t0 + 8, t0 + 22);
        return (
          <div key={i} style={{position: 'absolute', left: x - 44, top: y - 44, opacity: Math.min(1, p * 2) * fade, transform: `scale(${0.3 + 0.7 * p})`}}>
            <div style={{width: 88, height: 88, borderRadius: 22, background: 'rgba(34,31,32,0.94)', border: '2px solid rgba(90,169,234,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.35), 0 0 22px rgba(0,114,206,0.5)'}}>
              <Icon name="tableUser" size={60} strokePx={2.8} progress={ck} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------- stage */
export const ScreenStage: React.FC = () => {
  const fr = useCurrentFrame();
  const lay = layoutAt(fr);
  const inW1 = fr >= W1.from - 2 && fr <= W1.to + 34;
  const shots = inW1 ? [W1] : [W2, X1, W3];
  const capY = 952;
  return (
    <>
      {lay ? <ScreenCard shots={shots} overlays={OVERLAYS} layout={lay} /> : null}
      <CheckPanel />
      <JointPanel />
      <NotePanel />
      <ImportBurst />
      {CAPTIONS.map((c, i) => (
        <Caption key={i} c={c} y={capY} />
      ))}
    </>
  );
};

export const SCREEN_TL = TL;
