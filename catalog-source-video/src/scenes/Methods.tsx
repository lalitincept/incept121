import React from 'react';
import { AbsoluteFill } from 'remotion';
import { measureText } from '@remotion/layout-utils';
import { C, FONT, useT } from '../lib/constants';
import { clamp, ease, pop, ramp, window as win } from '../lib/anim';
import { ScreenCard } from '../components/ScreenCard';
import { KineticText, hlStyle } from '../components/KineticText';
import { Icon } from '../components/Icon';
import { At, Chip, FlowLine, IconTile, LineLayer } from '../components/ui';
import { CAM, CARD, CLICKS, HIGHLIGHTS, REMAP } from './methodData';

const PX = 3110; // right-panel centre in split layouts

/* ------------------------------------------------------------------ */
/* "100+" counter                                                       */
/* ------------------------------------------------------------------ */
const Counter: React.FC<{ at: number; out: number }> = ({ at, out }) => {
  const t = useT();
  const p = pop(t, at, 15, 120);
  const q = ramp(t, out, 0.45, ease.inOutSoft);
  const n = Math.round(100 * ease.outSoft(ramp(t, at + 0.15, 1.0, (x) => x)));
  return (
    <div style={{ opacity: clamp(p) * (1 - q), transform: `scale(${0.8 + 0.2 * p}) translateY(${-q * 30}px)`, textAlign: 'center' }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 330, letterSpacing: '-0.04em', lineHeight: 1, ...hlStyle }}>
        {n}
        <span style={{ fontWeight: 700 }}>+</span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Talend_DEV_Sales_and_Revenue anatomy                                 */
/* ------------------------------------------------------------------ */
const NAME_SIZE = 168;
const TOKENS = [
  { text: 'Talend', at: 83.85, group: 0 },
  { text: '_', at: 84.35, group: -1 },
  { text: 'DEV', at: 84.95, group: 1 },
  { text: '_', at: 85.45, group: -1 },
  { text: 'Sales', at: 85.95, group: 2 },
  { text: '_and', at: 87.1, group: 2 },
  { text: '_Revenue', at: 88.1, group: 2 },
];
const GROUPS = [
  { label: 'Source system', at: 84.25 },
  { label: 'Environment', at: 85.3 },
  { label: 'Business domain', at: 88.35 },
];

const NameAnatomy: React.FC<{ out: number }> = ({ out }) => {
  const t = useT();
  const q = ramp(t, out, 0.5, ease.inOutSoft);
  const widths = TOKENS.map((tk) => measureText({ text: tk.text, fontFamily: 'Inter', fontWeight: 700, fontSize: NAME_SIZE, letterSpacing: '-0.01em' }).width);
  const total = widths.reduce((a, b) => a + b, 0);
  let x = -total / 2;
  const pos = widths.map((w) => {
    const p = x;
    x += w;
    return p;
  });
  const groupSpan = GROUPS.map((_, g) => {
    const idx = TOKENS.map((tk, i) => (tk.group === g ? i : -1)).filter((i) => i >= 0);
    const a = pos[idx[0]];
    const b = pos[idx[idx.length - 1]] + widths[idx[idx.length - 1]];
    return { a, b };
  });
  const check = pop(t, 88.7, 12, 150);
  const glowP = ramp(t, 88.7, 0.8, ease.out);
  return (
    <div style={{ position: 'absolute', left: 1920, top: 1000, opacity: 1 - q, transform: `translateY(${-q * 40}px)` }}>
      {/* soft plate */}
      <div
        style={{
          position: 'absolute',
          left: -total / 2 - 120,
          top: -170,
          width: total + 240,
          height: 340,
          borderRadius: 60,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
          boxShadow: `0 0 0 3px rgba(0,114,206,${0.25 + 0.6 * glowP}) inset, 0 0 ${120 * glowP}px rgba(0,114,206,${0.45 * glowP}), 0 50px 120px rgba(0,0,0,0.35)`,
          opacity: ramp(t, 83.6, 0.5, ease.outSoft),
        }}
      />
      {TOKENS.map((tk, i) => {
        const p = ramp(t, tk.at - 0.08, 0.55, ease.out);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: pos[i],
              top: -NAME_SIZE * 0.62,
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: NAME_SIZE,
              letterSpacing: '-0.01em',
              color: tk.group === -1 ? 'rgba(255,255,255,0.45)' : C.text,
              opacity: p,
              transform: `translateY(${(1 - p) * 60}px)`,
              filter: p < 0.99 ? `blur(${(1 - p) * 14}px)` : undefined,
              whiteSpace: 'pre',
            }}
          >
            {tk.text}
          </div>
        );
      })}
      {/* brackets + labels */}
      {GROUPS.map((g, i) => {
        const p = ramp(t, g.at, 0.6, ease.out);
        const { a, b } = groupSpan[i];
        const w = (b - a) * p;
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: (a + b) / 2 - w / 2, top: 128, width: w, height: 8, borderRadius: 4, background: C.blue, boxShadow: '0 0 24px rgba(0,140,255,0.8)' }} />
            <div style={{ position: 'absolute', left: (a + b) / 2, top: 120, width: 6, height: 32 * p, background: C.blue, transform: 'translateX(-50%)' }} />
            <div
              style={{
                position: 'absolute',
                left: (a + b) / 2,
                top: 190,
                transform: `translateX(-50%) translateY(${(1 - p) * 20}px)`,
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 66,
                color: C.blueSoft,
                whiteSpace: 'nowrap',
                opacity: p,
              }}
            >
              {g.label}
            </div>
          </React.Fragment>
        );
      })}
      {/* approval badge */}
      <div style={{ position: 'absolute', left: total / 2 + 40, top: -250, opacity: clamp(check), transform: `scale(${check})` }}>
        <Icon name="check" size={200} at={88.7} dur={0.6} />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* caption bubble (reference style)                                     */
/* ------------------------------------------------------------------ */
const Caption: React.FC<{ text: string; at: number; out: number; x: number; y: number }> = ({ text, at, out, x, y }) => {
  const t = useT();
  const p = pop(t, at, 14, 130);
  const v = win(t, at, out, 0.35, 0.4);
  if (v <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translateY(${(1 - p) * 50}px)`,
        opacity: v,
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: 72,
        color: '#fff',
        padding: '40px 64px',
        borderRadius: 34,
        background: `linear-gradient(135deg, #1A86DE 0%, ${C.blue} 100%)`,
        boxShadow: '0 40px 90px rgba(0,30,70,0.5), 0 0 0 2px rgba(255,255,255,0.14) inset',
        whiteSpace: 'nowrap',
        letterSpacing: '-0.01em',
      }}
    >
      {text}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* scene                                                                */
/* ------------------------------------------------------------------ */
export const Methods: React.FC = () => {
  const t = useT();
  if (t < 40.8 || t > 126.4) return null;
  return (
    <AbsoluteFill>
      <ScreenCard remap={REMAP} cam={CAM} card={CARD} highlights={HIGHLIGHTS} clicks={CLICKS} from={40.9} to={126.2} />

      {/* ---------- Method 1: 100+ systems (split) ---------- */}
      {t > 53.5 && t < 62.4 ? (
        <>
          <At x={PX} y={470}>
            <Counter at={53.95} out={61.65} />
          </At>
          <At x={PX} y={720}>
            <KineticText text="supported source systems" at={55.0} together stagger={0.07} size={74} weight={500} color={C.muted} out={61.65} />
          </At>
          <At x={PX} y={1060}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
              <Icon name="database" size={150} at={56.05} out={61.65} />
              <KineticText text="Databases" at={56.15} size={92} weight={600} out={61.65} />
            </div>
          </At>
          <At x={PX} y={1260}>
            <div style={{ display: 'flex', gap: 36 }}>
              <Chip text="SQL Server" at={56.95} out={61.65} size={64} />
              <Chip text="Snowflake" at={58.15} out={61.65} size={64} />
            </div>
          </At>
          <At x={PX} y={1560}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
              <Icon name="chart" size={150} at={59.2} out={61.65} />
              <KineticText text="BI tools" at={59.25} size={92} weight={600} out={61.65} />
            </div>
          </At>
          <At x={PX} y={1760}>
            <div style={{ display: 'flex', gap: 36 }}>
              <Chip text="Power BI" at={60.1} out={61.65} size={64} />
              <Chip text="Tableau" at={61.0} out={61.65} size={64} />
            </div>
          </At>
        </>
      ) : null}

      {/* ---------- Method 1: not sure? (split) ---------- */}
      {t > 64.6 && t < 74.2 ? (
        <>
          <At x={PX} y={640}>
            <IconTile icon="admin" at={64.95} out={69.75} size={250} />
          </At>
          <At x={PX} y={1080}>
            <KineticText text="Not sure which / type applies?" at={64.85} size={100} weight={600} out={69.75} maxWidth={1200} />
          </At>
          <At x={PX} y={1430}>
            <KineticText text="Check with whoever / *administers* that system" at={67.0} size={76} weight={500} color={C.muted} out={69.75} maxWidth={1200} />
          </At>

          <At x={PX} y={640}>
            <IconTile icon="restart" at={70.0} out={73.45} size={250} />
          </At>
          <At x={PX} y={1080}>
            <KineticText text="Picking the *wrong type*" at={70.2} size={100} weight={600} out={73.45} maxWidth={1200} />
          </At>
          <At x={PX} y={1360}>
            <KineticText text="can mean starting the whole / configuration *over*" at={71.35} size={76} weight={500} color={C.muted} out={73.45} maxWidth={1200} />
          </At>
        </>
      ) : null}

      {/* ---------- Method 2: naming ---------- */}
      {t > 82.4 && t < 95.8 ? (
        <>
          <At x={1920} y={560}>
            <KineticText text="Something like" at={82.85} size={86} weight={500} color={C.muted} out={90.25} />
          </At>
          <NameAnatomy out={90.25} />
          <At x={1920} y={1500}>
            <KineticText text="beats" at={88.7} size={76} weight={500} color={C.muted} out={90.25} />
          </At>
          <At x={1920} y={1700}>
            <Chip text="Source1" at={89.2} out={90.25} size={84} variant="muted" strike={89.75} />
          </At>

          <At x={1920} y={420}>
            <KineticText text="A few extra seconds naming things well *now* / saves real confusion *months down the road*" at={90.6} out={95.1} size={112} maxWidth={3500} />
          </At>
          <At x={960} y={1250}>
            <IconTile icon="clock" label="A few seconds now" at={90.85} out={95.1} size={280} labelSize={70} />
          </At>
          <LineLayer>
            <FlowLine d="M 1380 1180 L 2460 1180" at={92.5} dur={1.6} width={10} pulses={3} pulseSpeed={0.7} out={95.1} />
            <FlowLine d="M 2420 1130 L 2480 1180 L 2420 1230" at={94.05} dur={0.3} width={10} pulses={0} out={95.1} />
          </LineLayer>
          <At x={2880} y={1250}>
            <IconTile icon="calendar" label="Months down the road" at={94.3} out={95.1} size={280} labelSize={70} />
          </At>
        </>
      ) : null}

      {/* ---------- Method 3: why scope (split) ---------- */}
      {t > 110.6 && t < 116.2 ? (
        <>
          <At x={PX} y={560}>
            <KineticText text="Scoping to what / your team *governs*" at={110.95} size={100} weight={600} out={115.4} maxWidth={1250} />
          </At>
          <At x={PX} y={1110}>
            <IconTile icon="stopwatch" label="Reasonable job runtimes" at={112.95} out={115.4} size={230} labelSize={68} />
          </At>
          <At x={PX} y={1640}>
            <IconTile icon="target" label="Focused results" at={114.6} out={115.4} size={230} labelSize={68} />
          </At>
        </>
      ) : null}

      {/* ---------- Method 3: schedule caption ---------- */}
      <Caption text="Recurring scans — no manual runs to remember" at={119.45} out={122.25} x={300} y={1740} />
    </AbsoluteFill>
  );
};
