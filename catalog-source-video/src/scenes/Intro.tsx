import React from 'react';
import { AbsoluteFill } from 'remotion';
import { measureText } from '@remotion/layout-utils';
import { C, FONT, useT } from '../lib/constants';
import { clamp, ease, pop, ramp, window as win } from '../lib/anim';
import { KineticText, hlStyle } from '../components/KineticText';
import { Logo } from '../components/Logo';
import { Icon } from '../components/Icon';
import { At, Chip, Eyebrow, FlowLine, IconTile, LineLayer, TitlePill } from '../components/ui';
import { World, WorldKey } from '../components/World';

/* ------------------------------------------------------------------ */
/* world layout                                                         */
/* ------------------------------------------------------------------ */
const EX = 6120; // energy / data analogy column
const EY = 1080; // energy row
const DY = 2600; // data row
const BX = 10320; // bridge scene
const GX = 14520; // governed metadata scene
const SY = 2600;

const CAM: WorldKey[] = [
  { t: -2.6, x: 1920, y: 1080, s: 0.94 },
  { t: 0.0, x: 1920, y: 1080, s: 1.0 },
  { t: 5.25, x: 1920, y: 1080, s: 1.05 },
  { t: 6.45, x: 6950, y: EY, s: 1.04 },
  { t: 8.75, x: 6880, y: EY, s: 1.06 },
  { t: 9.85, x: 5500, y: EY, s: 1.1 },
  { t: 11.2, x: 5560, y: EY, s: 1.1 },
  { t: 12.4, x: EX + 150, y: EY, s: 0.9 },
  { t: 13.65, x: EX + 150, y: EY, s: 0.92 },
  { t: 14.75, x: EX + 150, y: (EY + DY) / 2, s: 0.6 },
  { t: 16.95, x: EX + 150, y: (EY + DY) / 2, s: 0.61 },
  { t: 17.85, x: EX, y: DY, s: 1.0 },
  { t: 24.6, x: EX, y: DY, s: 1.02 },
  { t: 25.4, x: EX, y: DY, s: 1.05 },
  { t: 29.1, x: EX, y: DY, s: 1.1 },
  { t: 30.0, x: BX, y: SY, s: 1.0 },
  { t: 35.9, x: BX, y: SY, s: 1.03 },
  { t: 36.8, x: GX, y: SY, s: 1.0 },
  { t: 40.9, x: GX, y: SY, s: 1.04 },
  { t: 42.1, x: GX, y: SY, s: 1.5 },
];

/* ------------------------------------------------------------------ */
/* Metadata Command Center → MCC acronym collapse                       */
/* ------------------------------------------------------------------ */
const Acronym: React.FC<{ at: number; collapse: number; out: number; size: number }> = ({ at, collapse, out, size }) => {
  const t = useT();
  const parts = [
    { lead: 'M', rest: 'etadata' },
    { lead: 'C', rest: 'ommand' },
    { lead: 'C', rest: 'enter' },
  ];
  const fadeP = ramp(t, collapse, 0.35, ease.inOutSoft);
  const cp = ramp(t, collapse + 0.2, 0.75, ease.inOut);
  const q = ramp(t, out, 0.5, ease.inOutSoft);
  const space = measureText({ text: ' ', fontFamily: 'Inter', fontWeight: 700, fontSize: size }).width;
  return (
    <div style={{ display: 'flex', fontFamily: FONT, fontWeight: 700, fontSize: size, letterSpacing: '-0.02em', color: C.text, opacity: 1 - q, whiteSpace: 'pre' }}>
      {parts.map((p, i) => {
        const appear = ramp(t, at + i * 0.38, 0.6, ease.out);
        const restW = measureText({ text: p.rest, fontFamily: 'Inter', fontWeight: 700, fontSize: size }).width;
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              opacity: appear,
              transform: `translateY(${(1 - appear) * 0.4}em)`,
              filter: appear < 0.99 ? `blur(${(1 - appear) * 14}px)` : undefined,
            }}
          >
            <span style={{ ...(fadeP > 0.02 ? hlStyle : null), transform: `scale(${1 + cp * 0.18})`, display: 'inline-block', transformOrigin: '50% 60%' }}>{p.lead}</span>
            <span style={{ display: 'inline-block', overflow: 'hidden', width: restW * (1 - cp), opacity: 1 - fadeP, filter: fadeP > 0.01 && fadeP < 0.99 ? `blur(${fadeP * 10}px)` : undefined }}>{p.rest}</span>
            {i < 2 ? <span style={{ display: 'inline-block', width: space * (1 - cp) + cp * size * 0.06 }} /> : null}
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* small helpers                                                        */
/* ------------------------------------------------------------------ */
const Label: React.FC<{ text: string; at: number; out?: number; size?: number; color?: string }> = ({ text, at, out, size = 70, color = C.text }) => {
  const t = useT();
  const v = win(t, at, out ?? 9999, 0.6, 0.45);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: size,
        color,
        letterSpacing: '-0.01em',
        whiteSpace: 'nowrap',
        textAlign: 'center',
        opacity: v,
        transform: `translateY(${(1 - ramp(t, at, 0.7)) * 26}px)`,
      }}
    >
      {text}
    </div>
  );
};

const Glow: React.FC<{ at: number; out?: number; size: number; strength?: number }> = ({ at, out, size, strength = 0.45 }) => {
  const t = useT();
  const v = win(t, at, out ?? 9999, 0.8, 0.6);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(0,114,206,${strength * v}) 0%, rgba(0,114,206,${strength * 0.35 * v}) 35%, rgba(0,114,206,0) 68%)`,
      }}
    />
  );
};

/** Expanding energy ring burst. */
const Burst: React.FC<{ at: number; size?: number }> = ({ at, size = 700 }) => {
  const t = useT();
  const p = clamp((t - at) / 0.9);
  if (t < at || p >= 1) return null;
  const e = ease.out(p);
  return (
    <div
      style={{
        width: size * (0.3 + e),
        height: size * (0.3 + e),
        borderRadius: '50%',
        border: `${10 * (1 - p) + 2}px solid rgba(124,196,250,${1 - p})`,
        boxShadow: `0 0 80px rgba(0,140,255,${0.7 * (1 - p)})`,
      }}
    />
  );
};

/** Little data packets that travel from x0 toward x1 and fade halfway (they never arrive). */
const LostPackets: React.FC<{ at: number; out: number; x0: number; x1: number; ys: number[] }> = ({ at, out, x0, x1, ys }) => {
  const t = useT();
  if (t < at || t > out + 0.5) return null;
  const vis = 1 - ramp(t, out, 0.5);
  return (
    <>
      {ys.map((y, i) => {
        const period = 1.6;
        const ph = ((t - at) / period + i * 0.37) % 1;
        const x = x0 + (x1 - x0) * 0.55 * ease.outSoft(ph);
        const o = clamp(ph * 6) * clamp((1 - ph) * 2.2) * vis;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - 22,
              top: y - 22,
              width: 44,
              height: 44,
              borderRadius: 12,
              background: C.blue,
              boxShadow: '0 0 30px rgba(0,140,255,0.8)',
              opacity: o,
              transform: `rotate(${ph * 90}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* the scene                                                            */
/* ------------------------------------------------------------------ */
export const Intro: React.FC = () => {
  const t = useT();
  if (t > 42.6) return null;

  const worldFade = 1 - ramp(t, 40.95, 0.85, ease.inOutSoft);
  // logo exit
  const logoOut = ramp(t, -0.45, 0.65, ease.inOutSoft);

  // plug halves slide together at "connection"
  const join = ramp(t, 23.35, 0.55, ease.inOut);
  const plugOut = ramp(t, 25.0, 0.5, ease.inOutSoft);

  return (
    <AbsoluteFill>
      <World cam={CAM} opacity={worldFade}>
        {/* ---------------- logo + title ---------------- */}
        {t < 6.5 ? (
          <>
            <At x={1920} y={1080}>
              <Glow at={-2.4} out={-0.2} size={2600} strength={0.4} />
            </At>
            <At x={1920} y={1080}>
              <div style={{ opacity: 1 - logoOut, transform: `scale(${1 - logoOut * 0.08})`, filter: logoOut > 0.01 ? `blur(${logoOut * 18}px)` : undefined }}>
                <Logo width={1500} at={-2.3} blueMark />
              </div>
            </At>
            <At x={1920} y={735}>
              <Eyebrow text="Metadata Command Center" at={0.35} out={5.0} size={58} />
            </At>
            <At x={1920} y={960}>
              <KineticText text="Creating a *Catalog Source*" at={0.15} together stagger={0.1} size={200} weight={600} out={5.05} maxWidth={3400} />
            </At>
            <At x={1920} y={1265}>
              <TitlePill text="Start to Finish" at={3.85} out={5.1} size={118} />
            </At>
          </>
        ) : null}

        {/* ---------------- energy row ---------------- */}
        {t > 5.0 && t < 18.5 ? (
          <>
            <LineLayer>
              {/* power line: station → tower → tower → city */}
              <FlowLine d={`M ${EX - 1000} ${EY + 10} Q ${EX - 640} ${EY - 40} ${EX - 300} ${EY - 165} Q ${EX + 120} ${EY - 60} ${EX + 560} ${EY - 165} Q ${EX + 1000} ${EY - 60} ${EX + 1400} ${EY + 30}`} at={5.9} dur={1.6} width={9} pulses={3} pulseSpeed={0.5} out={17.2} />
              <FlowLine d={`M ${EX - 1000} ${EY + 50} Q ${EX - 640} ${EY + 0} ${EX - 300} ${EY - 85} Q ${EX + 120} ${EY + 20} ${EX + 560} ${EY - 85} Q ${EX + 1000} ${EY + 20} ${EX + 1400} ${EY + 70}`} at={6.1} dur={1.6} width={6} pulses={2} pulseSpeed={0.42} color="rgba(255,255,255,0.32)" out={17.2} />
            </LineLayer>
            <At x={EX - 1220} y={EY + 40}>
              <Glow at={9.6} out={17.0} size={1100} />
            </At>
            <At x={EX - 1220} y={EY + 40}>
              <Icon name="station" size={520} at={9.55} dur={1.1} out={17.0} />
            </At>
            <At x={EX - 1220} y={EY + 420}>
              <Label text="Generation station" at={10.2} out={13.6} />
            </At>
            <At x={EX - 300} y={EY + 70}>
              <Icon name="tower" size={520} at={11.3} dur={1.0} out={17.0} />
            </At>
            <At x={EX + 560} y={EY + 70}>
              <Icon name="tower" size={520} at={11.6} dur={1.0} out={17.0} />
            </At>
            <At x={EX + 130} y={EY + 420}>
              <Label text="Transmission lines" at={12.2} out={13.6} />
            </At>
            <At x={EX + 1640} y={EY + 40}>
              <Glow at={6.6} out={17.0} size={1200} strength={0.55} />
            </At>
            <At x={EX + 1640} y={EY + 40}>
              <Icon name="city" size={520} at={6.6} dur={1.1} out={17.0} />
            </At>
            <At x={EX + 1640} y={EY + 420}>
              <Label text="The grid" at={7.3} out={13.6} />
            </At>
            <At x={EX + 1640} y={EY - 420}>
              <Icon name="bolt" size={200} at={7.0} dur={0.7} out={8.9} />
            </At>
          </>
        ) : null}

        {/* ---------------- analogy: data row + links ---------------- */}
        {t > 13.5 && t < 30.2 ? (
          <>
            {/* vertical analogy links */}
            <LineLayer>
              <FlowLine d={`M ${EX - 1220} ${EY + 520} L ${EX - 1220} ${DY - 420}`} at={14.6} dur={0.7} dashed width={7} pulses={0} out={17.1} length={1000} />
              <FlowLine d={`M ${EX + 1640} ${EY + 520} L ${EX + 1640} ${DY - 420}`} at={15.0} dur={0.7} dashed width={7} pulses={0} out={17.1} length={1000} />
            </LineLayer>

            {/* source systems */}
            <At x={EX - 1500} y={DY}>
              <Glow at={14.2} out={25.4} size={1200} strength={0.35} />
            </At>
            <At x={EX - 1500} y={DY}>
              <Icon name="database" size={420} at={14.2} out={25.1} />
            </At>
            <At x={EX - 1500} y={DY - 470}>
              <Icon name="cloud" size={300} at={17.9} out={25.1} />
            </At>
            <At x={EX - 1500} y={DY + 470}>
              <Icon name="chart" size={300} at={18.2} out={25.1} />
            </At>
            <At x={EX - 1500} y={DY + 760}>
              <Label text="Source systems" at={17.85} out={24.7} />
            </At>
            <At x={EX - 1220} y={DY + 330}>
              <Label text="Source system" at={14.4} out={17.0} size={64} color={C.muted} />
            </At>

            {/* catalog */}
            <At x={EX + 1640} y={DY}>
              <Glow at={14.5} out={25.4} size={1300} strength={0.45} />
            </At>
            <At x={EX + 1640} y={DY}>
              <Icon name="catalog" size={460} at={14.5} out={25.1} />
            </At>
            <At x={EX + 1640} y={DY + 360}>
              <Label text="Data catalog" at={14.9} out={24.7} />
            </At>

            {/* the gap: dashed, packets fade before arriving */}
            <LineLayer>
              <FlowLine d={`M ${EX - 1180} ${DY} L ${EX + 1300} ${DY}`} at={18.6} dur={0.8} dashed width={8} pulses={0} out={21.9} length={2400} color="rgba(255,255,255,0.32)" />
              {/* solid connection once established */}
              <FlowLine d={`M ${EX - 1180} ${DY} L ${EX - 330} ${DY}`} at={23.5} dur={0.5} width={10} pulses={2} pulseSpeed={0.9} out={25.2} />
              <FlowLine d={`M ${EX + 330} ${DY} L ${EX + 1300} ${DY}`} at={23.75} dur={0.5} width={10} pulses={2} pulseSpeed={0.9} out={25.2} />
            </LineLayer>
            <LostPackets at={18.8} out={21.7} x0={EX - 1180} x1={EX + 1300} ys={[DY - 40, DY + 40, DY]} />
            <At x={EX} y={DY - 10}>
              <div style={{ opacity: win(t, 19.3, 21.9, 0.4, 0.4), fontFamily: FONT, fontWeight: 700, fontSize: 220, color: 'rgba(255,255,255,0.18)', transform: `scale(${0.8 + 0.2 * pop(t, 19.3)})` }}>?</div>
            </At>

            {/* plug halves */}
            <div style={{ opacity: 1 - plugOut }}>
              <At x={EX - 360 + join * 376} y={DY}>
                <Icon name="plugLeft" size={520} at={21.85} dur={0.8} />
              </At>
              <At x={EX + 360 - join * 376} y={DY}>
                <Icon name="plugRight" size={520} at={22.05} dur={0.8} />
              </At>
            </div>
            <At x={EX} y={DY}>
              <Burst at={23.85} size={900} />
            </At>

            {/* MCC hub */}
            <At x={EX} y={DY + 120}>
              <Glow at={25.2} out={29.2} size={1500} strength={0.55} />
            </At>
            <At x={EX} y={DY + 120}>
              <Icon name="hub" size={600} at={25.2} dur={1.1} out={29.1} />
            </At>
            <At x={EX} y={DY + 120}>
              <Burst at={27.4} size={1100} />
            </At>
          </>
        ) : null}

        {/* ---------------- bridge scene ---------------- */}
        {t > 28.8 && t < 37.2 ? (
          <>
            <LineLayer>
              <FlowLine d={`M ${BX - 1000} ${SY - 330} C ${BX - 700} ${SY - 330} ${BX - 650} ${SY} ${BX - 420} ${SY}`} at={31.9} dur={0.6} width={8} pulses={2} out={36.0} />
              <FlowLine d={`M ${BX - 1000} ${SY} L ${BX - 420} ${SY}`} at={32.9} dur={0.6} width={8} pulses={2} out={36.0} />
              <FlowLine d={`M ${BX - 1000} ${SY + 330} C ${BX - 700} ${SY + 330} ${BX - 650} ${SY} ${BX - 420} ${SY}`} at={33.5} dur={0.6} width={8} pulses={2} out={36.0} />
              <FlowLine d={`M ${BX + 420} ${SY} L ${BX + 980} ${SY}`} at={34.0} dur={0.9} width={10} pulses={3} pulseSpeed={0.8} out={36.0} />
            </LineLayer>
            <At x={BX - 1330} y={SY - 330} anchor="center">
              <Chip text="Snowflake" icon="database" at={31.45} out={36.0} size={70} />
            </At>
            <At x={BX - 1330} y={SY} anchor="center">
              <Chip text="Oracle" icon="database" at={32.45} out={36.0} size={70} />
            </At>
            <At x={BX - 1330} y={SY + 330} anchor="center">
              <Chip text="Power BI" icon="chart" at={33.1} out={36.0} size={70} />
            </At>
            <At x={BX} y={SY}>
              <Glow at={29.6} out={36.0} size={1300} strength={0.5} />
            </At>
            <At x={BX} y={SY + 30}>
              <IconTile icon="bridge" label="Catalog source" at={29.6} out={36.0} size={330} labelSize={74} />
            </At>
            <At x={BX + 1320} y={SY + 30}>
              <IconTile icon="catalog" label="Data catalog" at={35.05} out={36.1} size={330} labelSize={74} />
            </At>
          </>
        ) : null}

        {/* ---------------- governed metadata scene ---------------- */}
        {t > 35.8 ? (
          <>
            <At x={GX} y={SY + 40}>
              <IconTile icon="sliders" label="Configure cleanly" at={36.35} out={37.9} size={360} labelSize={80} />
            </At>
            <At x={GX - 1290} y={SY + 120}>
              <IconTile icon="schema" label="Schemas" at={38.1} size={280} labelSize={70} />
            </At>
            <At x={GX - 600} y={SY + 120}>
              <IconTile icon="table" label="Tables" at={38.75} size={280} labelSize={70} />
            </At>
            <LineLayer>
              <FlowLine d={`M ${GX - 190} ${SY + 40} L ${GX + 190} ${SY + 40}`} at={39.15} dur={0.5} width={10} pulses={2} pulseSpeed={0.9} />
              <FlowLine d={`M ${GX + 150} ${SY - 10} L ${GX + 200} ${SY + 40} L ${GX + 150} ${SY + 90}`} at={39.5} dur={0.3} width={10} pulses={0} />
            </LineLayer>
            <At x={GX + 600} y={SY + 120}>
              <IconTile icon="discover" label="Discoverable" at={39.45} size={280} labelSize={70} />
            </At>
            <At x={GX + 1290} y={SY + 120}>
              <IconTile icon="shield" label="Governed" at={40.55} size={280} labelSize={70} />
            </At>
          </>
        ) : null}
      </World>

      {/* ---------------- screen-space kinetic text ---------------- */}
      <At x={1920} y={300}>
        <KineticText text="Every *watt of power* flowing through / Dominion Energy's grid" at={5.9} out={8.55} size={124} maxWidth={3300} />
      </At>
      <At x={1920} y={300}>
        <KineticText text="begins at a dedicated *generation station* / connected to our *transmission lines*" at={8.8} out={13.5} size={124} maxWidth={3300} />
      </At>
      <At x={1920} y={1080}>
        <KineticText text="In our enterprise data landscape, / the principle is *identical.*" at={13.7} out={16.95} size={128} maxWidth={3300} />
      </At>
      <At x={1920} y={300}>
        <KineticText text="Raw source systems don't *magically appear* / in the catalog on their own." at={17.65} out={21.55} size={124} maxWidth={3300} />
      </At>
      <At x={1920} y={300}>
        <KineticText text="Someone has to establish that / *foundational connection.*" at={21.75} out={24.6} size={124} maxWidth={3300} />
      </At>
      <At x={1920} y={330}>
        <div style={{ opacity: win(t, 24.8, 29.2, 0.4, 0.45) }}>
          <KineticText text="And that's where the" at={24.75} size={84} weight={500} color={C.muted} />
        </div>
      </At>
      <At x={1920} y={560}>
        <Acronym at={25.72} collapse={27.15} out={29.0} size={190} />
      </At>
      <At x={1920} y={300}>
        <KineticText text="A *catalog source* bridges systems / directly into our *data catalog.*" at={29.45} out={35.55} size={124} maxWidth={3500} />
      </At>
      <At x={1920} y={330}>
        <KineticText text="Configure it cleanly, and every schema and table / becomes *discoverable, governed metadata.*" at={36.3} out={41.3} size={112} maxWidth={3500} />
      </At>
    </AbsoluteFill>
  );
};
