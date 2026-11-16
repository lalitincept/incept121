import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { E, prog } from '../anim';
import { Connector } from '../components/Connector';
import { Icon } from '../components/Icons';
import { KText, Reveal } from '../components/Kinetic';
import { Caption, Hub } from '../components/Hub';
import { At, Cam } from '../components/Scene';
import { Chip, IconBadge } from '../components/UI';
import { at } from '../timing';
import { ACCENT_GRADIENT, FONT } from '../theme';

// ───────────────────────────────────────────────────────────────────────────
// "Where does all of the catalog's metadata actually come from?
//  Not from anyone typing it in by hand."
// ───────────────────────────────────────────────────────────────────────────
export const QuestionScene: React.FC = () => {
  const T = at('question');
  const f = useCurrentFrame();
  const qOut = T(9.42);
  const orbit = f * 0.9;
  const kp = prog(f, T(9.64), 30, E.outExpo);
  const strike = prog(f, T(11.1), 16, E.inOutSoft);
  return (
    <AbsoluteFill>
      <Cam keys={[{ f: 0, s: 1.0 }, { f: 190, s: 1.07 }]}>
        {/* Phase 1 — question */}
        <At x={1920} y={760}>
          <Reveal at={2} outAt={qOut} y={80} scale={0.8}>
            <div style={{ position: 'relative' }}>
              <IconBadge icon="catalog" size={500} />
              {[0, 1, 2].map((i) => {
                const a = ((orbit + i * 120) * Math.PI) / 180;
                const p = prog(f, T(7.6) + i * 5, 24, E.outBack);
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: 250 + Math.cos(a) * 420 - 80,
                      top: 250 + Math.sin(a) * 250 - 80,
                      transform: `scale(${p})`,
                      opacity: p,
                    }}
                  >
                    <Icon name="question" size={160} />
                  </div>
                );
              })}
            </div>
          </Reveal>
        </At>
        <At x={1920} y={1440}>
          <KText
            text="Where does the catalog's metadata | *actually come from?*"
            times={[T(6.16), T(6.34), T(6.96), T(7.08), T(7.6), T(7.9), T(8.4), T(8.72)]}
            start={0}
            size={150}
            outAt={qOut}
          />
        </At>

        {/* Phase 2 — not typed by hand */}
        <At x={1920} y={790}>
          <div style={{ opacity: kp, transform: `translateY(${(1 - kp) * 120}px) scale(${0.85 + 0.15 * kp})`, filter: kp < 1 ? `blur(${(1 - kp) * 20}px)` : undefined, position: 'relative' }}>
            <Icon name="keyboard" size={620} />
            {/* floating typed characters */}
            {['A', 'B', 'C', '1', 'x'].map((ch, i) => {
              const st = T(10.2) + i * 4;
              const p = prog(f, st, 26, E.outCubic);
              const op = p > 0 && p < 1 ? Math.sin(p * Math.PI) : 0;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: 120 + i * 95,
                    top: 120 - p * 200,
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: 90,
                    color: '#fff',
                    opacity: op * (1 - strike),
                  }}
                >
                  {ch}
                </div>
              );
            })}
            <svg width={620} height={620} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <line
                x1={40}
                y1={560}
                x2={40 + 540 * strike}
                y2={560 - 500 * strike}
                stroke="#fff"
                strokeWidth={22}
                strokeLinecap="round"
                opacity={strike > 0 ? 1 : 0}
                style={{ filter: 'drop-shadow(0 0 20px rgba(0,114,206,1))' }}
              />
            </svg>
            <div style={{ position: 'absolute', right: -70, top: -40, transform: `scale(${prog(f, T(11.25), 22, E.outBack)})` }}>
              <Icon name="cross" size={220} />
            </div>
          </div>
        </At>
        <At x={1920} y={1460}>
          <KText
            text="Not typed in *by hand.*"
            times={[T(9.64), T(10.54), T(11.0), T(11.12), T(11.3)]}
            start={0}
            size={150}
          />
        </At>
      </Cam>
    </AbsoluteFill>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// "It comes from Metadata Command Center, or MCC, the engine that connects to
//  source systems and pulls their structure ... into the catalog automatically."
// ───────────────────────────────────────────────────────────────────────────
const Collapse: React.FC<{ word: string; p: number; accent: number }> = ({ word, p, accent }) => (
  <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
    <span
      style={{
        display: 'inline-block',
        backgroundImage: accent > 0 ? ACCENT_GRADIENT : undefined,
        WebkitBackgroundClip: accent > 0 ? 'text' : undefined,
        backgroundClip: accent > 0 ? 'text' : undefined,
        color: accent > 0 ? 'transparent' : '#fff',
        fontWeight: 500 + Math.round(accent * 200),
      }}
    >
      {word[0]}
    </span>
    <span
      style={{
        display: 'inline-block',
        fontSize: `${1 - p}em`,
        opacity: 1 - Math.min(1, p * 1.6),
        filter: p > 0 ? `blur(${p * 10}px)` : undefined,
        verticalAlign: 'baseline',
      }}
    >
      {word.slice(1)}
    </span>
  </span>
);

export const EngineScene: React.FC = () => {
  const T = at('engine');
  const f = useCurrentFrame();
  const words = ['Metadata', 'Command', 'Center'];
  const wordT = [T(12.86), T(13.32), T(13.74)];
  const acc = prog(f, T(14.3), 14, E.outCubic);
  const col = prog(f, T(14.62), 26, E.inOutSoft);
  const intro = prog(f, T(14.5), 12, E.inCubic); // "It comes from" fades as collapse starts
  const mv = prog(f, T(15.45), 20, E.inOutSoft); // MCC wordmark flies into hub label
  const textOut = prog(f, T(15.45) + 20, 6, E.inCubic);
  const hubAt = T(15.45) + 4;
  const srcY = [640, 1020, 1400];
  const srcs = [
    { icon: 'database', label: 'Databases' },
    { icon: 'warehouse', label: 'Warehouses' },
    { icon: 'cloud', label: 'Cloud & BI' },
  ];
  const chips = [
    { icon: 'table', label: 'Table names', t: T(19.42) },
    { icon: 'column', label: 'Column names', t: T(20.28) },
    { icon: 'tag', label: 'Data types', t: T(21.2) },
    { icon: 'relationship', label: 'Relationships', t: T(22.06) },
  ];
  const chipY = [700, 880, 1060, 1240];
  const intoCat = T(23.3);
  const catAt = T(22.98);
  const hubPulse = Math.max(0, Math.sin(((f - T(18.0)) / 20) * Math.PI)) * prog(f, T(18.0), 10) * 0.6;

  return (
    <AbsoluteFill>
      <Cam
        keys={[
          { f: 0, s: 1.05 },
          { f: T(15.6), s: 1.0 },
          { f: T(16.6), s: 0.94, y: 20 },
          { f: T(24.6), s: 0.97, y: 20 },
        ]}
      >
        {/* Kinetic: "It comes from Metadata Command Center, or MCC" */}
        <At x={1920} y={830}>
 <div style={{ opacity: 1 - intro }}>
            <KText text="It comes from" start={T(12.12)} stagger={5} size={96} weight={400} color="rgba(244,247,251,0.7)" />
          </div>
        </At>
        <At x={1920} y={1050 + mv * 92} style={{ zIndex: 5 }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 210,
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: '#fff',
              whiteSpace: 'nowrap',
              opacity: 1 - textOut,
              transform: `scale(${(1 + col * 0.25) * (1 - mv * 0.7)})`,
            }}
          >
            {words.map((w, i) => {
              const p = prog(f, wordT[i], 22, E.outExpo);
              return (
                <span
                  key={w}
                  style={{
                    display: 'inline-block',
                    opacity: p,
                    transform: `translateY(${(1 - p) * 0.4}em)`,
                    marginRight: i < 2 ? `${0.26 * (1 - col)}em` : 0,
                  }}
                >
                  <Collapse word={w} p={col} accent={acc} />
                </span>
              );
            })}
          </div>
        </At>

        {/* Hub */}
        <At x={1920} y={1020}>
          {f >= hubAt - 2 ? <Hub size={520} at={hubAt} label="MCC" pulse={hubPulse} labelAt={T(15.45) + 20} /> : null}
        </At>
        <At x={1920} y={1580}>
          <KText text="The *engine*" start={T(15.78)} stagger={5} size={84} weight={500} outAt={T(18.4)} />
        </At>

        {/* Sources → hub */}
        {srcs.map((s, i) => {
          const a = T(16.5) + i * 5;
          return (
            <React.Fragment key={s.label}>
              <Connector
                d={`M ${700} ${srcY[i]} C ${1150} ${srcY[i]}, ${1250} ${1020}, ${1640} ${1020}`}
                at={a + 6}
                dur={22}
                pulses={prog(f, T(18.04), 1) > 0 ? 3 : 0}
                pulseSpeed={42}
              />
              <At x={540} y={srcY[i]}>
                <Reveal at={a} x={-80} y={0} scale={0.7}>
                  <IconBadge icon={s.icon} size={250} />
                </Reveal>
              </At>
              <At x={540} y={srcY[i] + 175}>
                <Reveal at={a + 4} y={20}>
                  <Caption text={s.label} size={52} />
                </Reveal>
              </At>
            </React.Fragment>
          );
        })}
        <At x={540} y={360}>
          <KText text="Source systems" start={T(16.78)} stagger={4} size={64} weight={600} color="rgba(160,205,245,0.95)" />
        </At>

        {/* Structure chips */}
        {chips.map((c, i) => {
          const p = prog(f, c.t, 28, E.outExpo);
          const pf = prog(f, c.t, 14, E.outCubic);
          const q = prog(f, intoCat + i * 3, 22, E.inOutSoft);
          const x = 2240 + p * 470 + q * 700;
          const sc = (0.6 + 0.4 * p) * (1 - q * 0.75);
          return (
            <div
              key={c.label}
              style={{
                position: 'absolute',
                left: x,
                top: chipY[i],
                transform: `translate(-50%,-50%) scale(${sc})`,
                opacity: pf * (1 - prog(f, intoCat + i * 3 + 14, 8)),
                filter: (1 - pf) * 14 + q * 6 > 0.1 ? `blur(${(1 - pf) * 14 + q * 6}px)` : undefined,
              }}
            >
              <Chip icon={c.icon} label={c.label} size={60} />
            </div>
          );
        })}

        {/* Hub → catalog */}
        <Connector d="M 2200 1020 C 2600 1020, 2800 1020, 3180 1020" at={catAt} dur={16} pulses={3} pulseSpeed={36} />
        <At x={3380} y={1020}>
          <Reveal at={catAt} x={100} y={0} scale={0.7}>
            <div style={{ transform: `scale(${1 + 0.08 * Math.sin(prog(f, intoCat + 10, 20) * Math.PI)})` }}>
              <IconBadge icon="catalog" size={340} glow={1 + prog(f, intoCat + 6, 20) * 0.5} />
            </div>
          </Reveal>
        </At>
        <At x={3380} y={1250}>
          <Reveal at={catAt + 4} y={20}>
            <Caption text="Catalog" size={60} />
          </Reveal>
        </At>
        <At x={3380} y={1420}>
          <Reveal at={T(23.86)} y={40}>
            <Chip icon="sync" label="Automatically" size={56} />
          </Reveal>
        </At>
      </Cam>
    </AbsoluteFill>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// "Metadata, if the term's new to you, it simply means data about data."
// ───────────────────────────────────────────────────────────────────────────
export const MetaDefScene: React.FC = () => {
  const T = at('metaDef');
  const f = useCurrentFrame();
  const tagP = prog(f, T(28.6), 26, E.outBack);
  return (
    <AbsoluteFill>
      <Cam keys={[{ f: 0, s: 1.04 }, { f: 160, s: 1.0 }]}>
        <At x={1920} y={600}>
          <Reveal at={T(25.48) - 4} y={60} scale={0.8}>
            <div style={{ position: 'relative', width: 360, height: 360 }}>
              <Icon name="database" size={360} />
              <div
                style={{
                  position: 'absolute',
                  left: 230 + (1 - tagP) * 260,
                  top: -70 - (1 - tagP) * 220,
                  transform: `rotate(${-18 + (1 - tagP) * 40}deg) scale(${0.4 + 0.6 * tagP})`,
                  opacity: Math.min(1, tagP * 1.5),
                }}
              >
                <Icon name="tag" size={220} />
              </div>
            </div>
          </Reveal>
        </At>
        <At x={1920} y={1080}>
          <KText text="*Metadata*" start={T(25.48)} size={270} weight={600} mode="blur" dur={26} />
        </At>
        <At x={1920} y={1300}>
          <KText
            text="If the term's new to you…"
            start={T(26.18)}
            stagger={4}
            size={66}
            weight={400}
            color="rgba(244,247,251,0.6)"
            outAt={T(28.1)}
          />
        </At>
        <At x={1920} y={1340}>
          <KText
            text="= data *about* data"
            times={[T(28.2), T(28.34), T(28.76), T(29.22)]}
            start={0}
            size={170}
            weight={500}
          />
        </At>
      </Cam>
    </AbsoluteFill>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// "Not the billing amount itself, but the fact that there's a column called
//  BILL_AMOUNT, what type it is, and which table it lives in."
// ───────────────────────────────────────────────────────────────────────────
const ROWS = [
  ['100482', '2026-10-01', '$142.30'],
  ['100517', '2026-10-01', '$89.15'],
  ['100533', '2026-10-02', '$212.76'],
  ['100604', '2026-10-02', '$67.40'],
];
const COLS = ['ACCOUNT_ID', 'BILL_DATE', 'BILL_AMOUNT'];
const COLW = [500, 500, 520];

const Typewriter: React.FC<{ text: string; at: number; speed?: number }> = ({ text, at, speed = 1.6 }) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((f - at) * speed)));
  const caret = f >= at && n < text.length;
  return (
    <span>
      {text.slice(0, n)}
      <span style={{ opacity: caret ? 1 : 0, color: '#6FB5F2' }}>▍</span>
    </span>
  );
};

export const BillAmountScene: React.FC = () => {
  const T = at('billAmount');
  const f = useCurrentFrame();
  const valHot = prog(f, T(30.4), 12, E.outCubic) * (1 - prog(f, T(30.95), 12));
  const valStrike = prog(f, T(30.9), 18, E.inOutSoft);
  const hdr = prog(f, T(32.78), 18, E.outExpo);
  const tbl = prog(f, T(36.5), 18, E.outExpo);
  const panelAt = T(31.7);
  const mono = '"JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace';
  const tableX = 300;
  const tableY = 560;
  const rowsMeta = [
    { k: 'Column', v: 'BILL_AMOUNT', t: T(33.4), icon: 'column' },
    { k: 'Data type', v: 'DECIMAL(10,2)', t: T(35.32), icon: 'tag' },
    { k: 'Table', v: 'BILLING_INVOICE', t: T(36.58), icon: 'table' },
  ];
  return (
    <AbsoluteFill>
      <Cam keys={[{ f: 0, s: 0.98, x: -40 }, { f: 250, s: 1.02, x: 30 }]}>
        <At x={1920} y={300}>
          <KText text="Data vs. *metadata*" start={4} stagger={5} size={96} weight={500} />
        </At>
        {/* data table */}
        <div style={{ position: 'absolute', left: tableX, top: tableY }}>
          <Reveal at={0} y={100} scale={0.92}>
            <div
              style={{
                width: 1700,
                borderRadius: 48,
                background: 'linear-gradient(160deg, rgba(25,52,86,0.92), rgba(10,22,40,0.96))',
                border: '4px solid rgba(64,158,245,0.7)',
                boxShadow: '0 0 90px rgba(0,114,206,0.4), 0 40px 80px rgba(0,0,0,0.45)',
                padding: '50px 60px 60px',
                fontFamily: FONT,
                color: '#fff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 40 }}>
                <Icon name="table" size={110} />
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 62,
                    fontWeight: 600,
                    padding: '8px 22px',
                    borderRadius: 16,
                    color: tbl > 0 ? '#fff' : 'rgba(255,255,255,0.75)',
                    background: `rgba(0,114,206,${0.55 * tbl})`,
                    boxShadow: `0 0 ${50 * tbl}px rgba(0,114,206,${0.9 * tbl})`,
                    border: `4px solid rgba(111,181,242,${tbl})`,
                  }}
                >
                  BILLING_INVOICE
                </span>
              </div>
              <div style={{ display: 'flex', borderBottom: '3px solid rgba(255,255,255,0.18)' }}>
                {COLS.map((c, i) => (
                  <div
                    key={c}
                    style={{
                      width: COLW[i],
                      fontFamily: mono,
                      fontSize: 54,
                      fontWeight: 700,
                      padding: '26px 24px',
                      color: i === 2 && hdr > 0 ? '#fff' : 'rgba(160,205,245,0.95)',
                      position: 'relative',
                    }}
                  >
                    {i === 2 ? (
                      <div
                        style={{
                          position: 'absolute',
                          inset: '8px 0px',
                          borderRadius: 18,
                          border: `5px solid rgba(64,158,245,${hdr})`,
                          background: `rgba(0,114,206,${0.45 * hdr})`,
                          boxShadow: `0 0 ${60 * hdr}px rgba(0,114,206,${hdr})`,
                          transform: `scale(${1.08 - 0.08 * hdr})`,
                        }}
                      />
                    ) : null}
                    <span style={{ position: 'relative' }}>{c}</span>
                  </div>
                ))}
              </div>
              {ROWS.map((r, ri) => (
                <div key={ri} style={{ display: 'flex', borderBottom: ri < 3 ? '2px solid rgba(255,255,255,0.08)' : undefined }}>
                  {r.map((v, i) => {
                    const isVal = i === 2;
                    return (
                      <div
                        key={i}
                        style={{
                          width: COLW[i],
                          fontFamily: mono,
                          fontSize: 56,
                          padding: '26px 24px',
                          color: '#fff',
                          opacity: isVal ? 1 - valStrike * 0.7 : 0.82,
                          filter: isVal && valStrike > 0 ? `blur(${valStrike * 7}px)` : undefined,
                          background: isVal ? `rgba(0,114,206,${0.35 * valHot})` : undefined,
                          borderRadius: 12,
                        }}
                      >
                        {v}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        {/* "not the values" tag */}
        <At x={tableX + 1000 + 520 / 2 + 60} y={tableY + 1110}>
          <Reveal at={T(30.95)} y={30} outAt={T(37.4)}>
            <Chip icon="cross" label="Not the values" size={52} />
          </Reveal>
        </At>

        {/* metadata panel */}
        <div style={{ position: 'absolute', left: 2200, top: 640 }}>
          <Reveal at={panelAt} x={160} y={0} scale={0.92}>
            <div
              style={{
                width: 1360,
                borderRadius: 48,
                background: 'linear-gradient(160deg, rgba(25,52,86,0.94), rgba(10,22,40,0.97))',
                border: '4px solid rgba(64,158,245,0.95)',
                boxShadow: '0 0 110px rgba(0,114,206,0.55), 0 40px 80px rgba(0,0,0,0.45)',
                padding: '54px 64px 40px',
                fontFamily: FONT,
                color: '#fff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginBottom: 30 }}>
                <Icon name="tag" size={110} />
                <span style={{ fontSize: 78, fontWeight: 600 }}>Metadata</span>
              </div>
              {rowsMeta.map((m) => {
                const p = prog(f, m.t, 22, E.outExpo);
                return (
                  <div
                    key={m.k}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 34,
                      padding: '30px 0',
                      borderTop: '2px solid rgba(255,255,255,0.1)',
                      opacity: 0.25 + 0.75 * p,
                    }}
                  >
                    <div style={{ transform: `scale(${0.6 + 0.4 * p})` }}>
                      <Icon name={m.icon} size={96} />
                    </div>
                    <div style={{ width: 330, fontSize: 56, color: 'rgba(160,205,245,0.95)', fontWeight: 500 }}>{m.k}</div>
                    <div style={{ fontFamily: mono, fontSize: 58, fontWeight: 700 }}>
                      {f >= m.t ? <Typewriter text={m.v} at={m.t} /> : <span style={{ opacity: 0.3 }}>—</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
        <Connector d="M 1820 760 C 1960 760, 2000 1010, 2210 1010" at={T(33.3)} dur={14} />
        <Connector d={`M ${tableX + 900} ${tableY + 92} C 1500 380, 2100 400, 2330 1370`} at={T(36.58)} dur={18} />
      </Cam>
    </AbsoluteFill>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// "MCC is what goes out and collects that information at scale."
// ───────────────────────────────────────────────────────────────────────────
export const ScaleScene: React.FC = () => {
  const T = at('scale');
  const f = useCurrentFrame();
  const N = 14;
  const icons = ['database', 'cloud', 'chart', 'warehouse', 'table', 'layers', 'database'];
  const nodes = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    return { x: 1920 + Math.cos(a) * 1250, y: 980 + Math.sin(a) * 600, icon: icons[i % icons.length] };
  });
  const outer = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2 + 0.08;
    const r = 1 + 0.06 * Math.sin(i * 2.3);
    return { x: 1920 + Math.cos(a) * 1750 * r, y: 980 + Math.sin(a) * 900 * r };
  });
  const go = T(38.76);
  const collect = T(39.62);
  const scaleAt = T(40.7);
  const pulse = Math.max(0, Math.sin(((f - collect) / 16) * Math.PI)) * prog(f, collect, 6) * 0.7;
  return (
    <AbsoluteFill>
      <Cam keys={[{ f: 0, s: 1.25 }, { f: T(39.0), s: 1.0 }, { f: T(41.1), s: 0.86 }]}>
        {nodes.map((n, i) => {
          const a = go + i * 1.5;
          return (
            <React.Fragment key={i}>
              <Connector
                d={`M ${n.x} ${n.y} L 1920 980`}
                at={a}
                dur={14}
                width={5}
                pulses={f > collect ? 2 : 0}
                pulseSpeed={34}
                pulseSize={11}
                glow={false}
                color="rgba(111,181,242,0.45)"
              />
            </React.Fragment>
          );
        })}
        {outer.map((o, i) => {
          const p = prog(f, scaleAt + (i % 12) * 1.2, 18, E.outBack);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: o.x - 20,
                top: o.y - 20,
                width: 40,
                height: 40,
                borderRadius: 12,
                background: i % 3 === 0 ? '#0072CE' : 'rgba(111,181,242,0.5)',
                border: '3px solid rgba(255,255,255,0.7)',
                transform: `scale(${p})`,
                opacity: p * 0.9,
                boxShadow: '0 0 20px rgba(0,114,206,0.8)',
              }}
            />
          );
        })}
        {nodes.map((n, i) => (
          <At key={i} x={n.x} y={n.y}>
            <Reveal at={go + i * 1.5 + 6} y={0} scale={0.4}>
              <IconBadge icon={n.icon} size={180} />
            </Reveal>
          </At>
        ))}
        <At x={1920} y={980}>
          <Hub size={400} at={0} label="MCC" pulse={pulse} />
        </At>
      </Cam>
      <At x={1920} y={1960}>
        <KText text="Collected *at scale*" times={[T(39.62), T(40.7), T(41.1)]} start={0} size={110} />
      </At>
    </AbsoluteFill>
  );
};
