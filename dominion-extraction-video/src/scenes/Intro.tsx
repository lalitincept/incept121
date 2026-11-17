import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Icon } from '../components/Icon';
import { KLine } from '../components/Kinetic';
import { Cam, MaskedImage, useT } from '../components/Scene';
import { Chip, Connector, Glass, hexA, IconBadge, Pill, Reveal } from '../components/UI';
import { C, EASE_IN, EASE_IN_OUT, EASE_OUT, FONT, keys, pop, tween } from '../theme';

/* ------------------------------------------------------------------ */
/* Logo sting (before the voiceover starts)                             */
/* ------------------------------------------------------------------ */
export const LogoSting: React.FC = () => {
  const t = useT();
  if (t > 0.0) return null;
  const S = 1.7;
  const W = 980 * S, H = 365 * S;
  const left = 1920 - W / 2, top = 1080 - H / 2;
  const markP = tween(t, -2.4, -1.55, 0, 1, EASE_OUT);
  const wordP = tween(t, -1.95, -1.2, 0, 1, EASE_OUT);
  const glint = tween(t, -1.35, -0.6, -0.3, 1.3, EASE_IN_OUT);
  const exitP = tween(t, -0.62, -0.05, 0, 1, EASE_IN);
  const glow = tween(t, -2.4, -1.2, 0, 1, EASE_OUT) * (1 - exitP);
  return (
    <AbsoluteFill style={{ opacity: 1 - exitP, transform: `scale(${1 - 0.1 * exitP + 0.03 * tween(t, -2.5, 0.3, 0, 1, (n) => n)})`, filter: exitP > 0 ? `blur(${exitP * 16}px)` : undefined }}>
      <div style={{ position: 'absolute', left: 1920 - 1400, top: 1080 - 700, width: 2800, height: 1400, background: `radial-gradient(closest-side, rgba(0,114,206,${0.35 * glow}), rgba(0,114,206,0))` }} />
      <div style={{ position: 'absolute', left, top, width: 308 * S, height: H, clipPath: `polygon(0 0, ${markP * 140 - 20}% 0, ${markP * 140 - 40}% 100%, 0 100%)` }}>
        <MaskedImage src="brand/dominion_mark_white.png" w={308 * S} h={H} background="linear-gradient(160deg, #8CC8FF 0%, #2E95F0 35%, #0072CE 65%, #0A4F96 100%)" style={{ filter: 'drop-shadow(0 0 40px rgba(0,114,206,0.8))' }} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: left + 358 * S,
          top,
          opacity: wordP,
          transform: `translateX(${(1 - wordP) * 120}px)`,
          filter: wordP < 1 ? `blur(${(1 - wordP) * 18}px)` : undefined,
          clipPath: `inset(0 ${(1 - wordP) * 100}% 0 0)`,
        }}
      >
        <MaskedImage src="brand/dominion_wordmark_white.png" w={622 * S} h={H} background="#FFFFFF" />
      </div>
      <div style={{ position: 'absolute', left, top, mixBlendMode: 'screen' }}>
        <MaskedImage
          src="brand/dominion_logo_white.png"
          w={W}
          h={H}
          background={`linear-gradient(105deg, rgba(255,255,255,0) ${glint * 100 - 14}%, rgba(255,255,255,0.95) ${glint * 100}%, rgba(255,255,255,0) ${glint * 100 + 14}%)`}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Intro                                                                */
/* ------------------------------------------------------------------ */

const TitleCard: React.FC = () => {
  const t = useT();
  const frame = useCurrentFrame();
  const pillS = pop(frame, 0.62, { damping: 13, stiffness: 120 });
  const wm = tween(t, -0.3, 1.4, 0, 1, EASE_OUT);
  return (
    <Cam from={-0.3} to={5.05} enter="none" exit="up" push={0.05}>
      <div style={{ position: 'absolute', left: 1920 - 470, top: 1080 - 560, opacity: 0.06 * wm, transform: `scale(${0.92 + 0.08 * wm})` }}>
        <MaskedImage src="brand/dominion_mark_white.png" w={940} h={1114} background="#FFFFFF" />
      </div>
      <KLine y={760} text="Viewing Metadata" times={[0.02, 0.24]} size={176} weight={600} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: 3840,
          top: 1020,
          display: 'flex',
          justifyContent: 'center',
          opacity: Math.min(1, pillS * 1.5),
          transform: `scale(${0.7 + 0.3 * pillS})`,
        }}
      >
        <Pill text="Extraction Results" size={150} />
      </div>
      <Reveal t0={3.7} dy={40} style={{ position: 'absolute', top: 1420, left: 0, width: 3840, display: 'flex', justifyContent: 'center' }}>
        <Chip text="Dominion's Data Catalog" icon="catalog" size={62} />
      </Reveal>
    </Cam>
  );
};

const Goals: React.FC = () => {
  const items = [
    { icon: 'searchDoc' as const, label: 'Inspect results', t0: 4.95, x: 960 },
    { icon: 'shieldCheck' as const, label: 'Verify asset coverage', t0: 5.62, x: 1920 },
    { icon: 'compareCheck' as const, label: 'Match reality', t0: 7.44, x: 2880 },
  ];
  return (
    <Cam from={4.75} to={10.25} enter="rise" exit="push" push={0.06}>
      <Connector x1={1190} y1={960} x2={1690} y2={960} t0={5.4} dur={0.5} dashed width={6} />
      <Connector x1={2150} y1={960} x2={2650} y2={960} t0={7.2} dur={0.5} dashed width={6} />
      {items.map((it) => (
        <IconBadge key={it.label} icon={it.icon} t0={it.t0} x={it.x} y={960} d={440} label={it.label} labelSize={76} />
      ))}
      <KLine y={1600} text="Ensure what landed *matches reality*" times={[7.2, 7.44, 7.78, 8.1, 8.54, 9.04]} size={104} weight={500} />
    </Cam>
  );
};

const JobCheck: React.FC = () => {
  const t = useT();
  const frame = useCurrentFrame();
  const checkPop = pop(frame, 10.12, { damping: 12, stiffness: 140 });
  const toCard = tween(t, 11.15, 11.85, 0, 1, EASE_IN_OUT);
  const cardP = tween(t, 11.2, 11.9, 0, 1, EASE_OUT);
  const bar = tween(t, 11.6, 12.95, 0, 1, EASE_IN_OUT);
  const done = tween(t, 12.95, 13.35, 0, 1, EASE_OUT);
  // card shrinks to the top during "It doesn't tell you…"
  const lift = tween(t, 13.95, 14.65, 0, 1, EASE_IN_OUT);
  const cardCx = 1920, cardCy = keys(t, [13.95, 14.65], [930, 470]);
  const cardScale = 1 - 0.42 * lift;
  const cw = 2000, ch = 560;
  // check: big centre → status slot on card (right side)
  const bigSize = 460;
  const slotX = cardCx + (cw / 2 - 210) * cardScale, slotY = cardCy - 40 * cardScale;
  const chkSize = bigSize + (170 * cardScale - bigSize) * toCard;
  const chkX = 1920 + (slotX - 1920) * toCard;
  const chkY = 900 + (slotY - 900) * toCard;
  // data blocks travelling across
  const blocks = [0, 1, 2, 3, 4, 5];
  const lost = [1, 4];
  const srcX = 900, dstX = 2940, flowY = 1240;
  return (
    <Cam from={10.05} to={17.85} enter="none" exit="push" push={0.03}>
      {/* job card */}
      <div style={{ position: 'absolute', left: cardCx - cw / 2, top: cardCy - ch / 2, width: cw, height: ch, transform: `scale(${cardScale * (0.85 + 0.15 * cardP)})`, opacity: cardP, transformOrigin: '50% 50%' }}>
        <Glass style={{ inset: 0 }}>
          <div style={{ position: 'absolute', left: 90, top: 90 }}>
            <Icon name="gear" size={230} progress={tween(t, 11.3, 12.2)} style={{ transform: `rotate(${t * 40}deg)` }} />
          </div>
          <div style={{ position: 'absolute', left: 400, top: 96, fontFamily: FONT, color: C.text }}>
            <div style={{ fontSize: 92, fontWeight: 600, letterSpacing: '-0.02em' }}>Extraction job</div>
            <div style={{ fontSize: 56, color: C.textDim, marginTop: 12 }}>Snowflake_Enterprise · Catalog source</div>
          </div>
          <div style={{ position: 'absolute', left: 400, top: 380, width: 1180, height: 30, borderRadius: 20, background: 'rgba(255,255,255,0.1)' }}>
            <div style={{ width: `${bar * 100}%`, height: '100%', borderRadius: 20, background: `linear-gradient(90deg, ${C.blue}, ${done > 0 ? C.green : '#2E95F0'})`, boxShadow: '0 0 30px rgba(0,114,206,0.8)' }} />
          </div>
          <div style={{ position: 'absolute', left: 400, top: 432, fontFamily: FONT, fontSize: 50, color: done > 0 ? '#7EE2A8' : C.textDim, opacity: tween(t, 11.6, 12.0) }}>
            {done > 0.01 ? 'Scan finished · 100%' : `Scanning… ${Math.round(bar * 100)}%`}
          </div>
        </Glass>
      </div>
      {/* green check */}
      <div style={{ position: 'absolute', left: chkX - chkSize / 2, top: chkY - chkSize / 2, opacity: Math.min(1, checkPop * 1.6), transform: `scale(${0.4 + 0.6 * checkPop})` }}>
        <div style={{ position: 'absolute', inset: -chkSize * 0.25, borderRadius: '50%', background: `radial-gradient(closest-side, ${hexA(C.green, 0.45 * (1 - toCard * 0.6))}, rgba(47,191,113,0))` }} />
        <Icon name="check" size={chkSize} progress={tween(t, 10.12, 10.95)} fill={C.green} strokePx={10} />
      </div>
      <KLine y={1500} text="A green checkmark tells you *the scan finished*" times={[10.26, 10.4, 10.64, 12.32, 12.64, 12.82, 12.98, 13.24]} size={100} out={13.85} />

      {/* "did the right data make it across?" */}
      <IconBadge icon="database" t0={14.3} x={srcX} y={flowY} d={400} label="Source" labelSize={68} />
      <IconBadge icon="catalog" t0={14.55} x={dstX} y={flowY} d={400} label="Catalog" labelSize={68} />
      <Connector x1={srcX + 230} y1={flowY} x2={dstX - 230} y2={flowY} t0={14.6} dur={0.7} dashed width={7} color="rgba(120,180,255,0.7)" glow={false} />
      {blocks.map((b) => {
        const s0 = 14.95 + b * 0.32;
        const p = tween(t, s0, s0 + 1.35, 0, 1, EASE_IN_OUT);
        if (p <= 0) return null;
        const isLost = lost.includes(b);
        const x = srcX + 240 + (dstX - srcX - 480) * (isLost ? Math.min(p, 0.55) : p);
        const lostP = isLost ? tween(p, 0.42, 0.55, 0, 1, (n) => n) : 0;
        const arrive = !isLost ? tween(p, 0.9, 1, 0, 1) : 0;
        const y = flowY - 18 + Math.sin(p * Math.PI) * -60;
        return (
          <React.Fragment key={b}>
            <div
              style={{
                position: 'absolute',
                left: x - 46,
                top: y - 46,
                width: 92,
                height: 92,
                borderRadius: 18,
                background: C.blue,
                border: '8px solid #FFFFFF',
                boxShadow: '0 0 30px rgba(0,114,206,0.8)',
                opacity: (1 - lostP) * (1 - arrive),
                transform: `rotate(${p * 90}deg) scale(${1 - 0.4 * lostP})`,
              }}
            />
            {isLost && lostP > 0 ? (
              <div style={{ position: 'absolute', left: x - 60, top: flowY - 230, width: 120, textAlign: 'center', fontFamily: FONT, fontSize: 130, fontWeight: 700, color: C.amber, opacity: lostP * tween(t, 17.4, 17.8, 1, 0), transform: `scale(${0.5 + 0.5 * lostP})`, textShadow: '0 0 30px rgba(242,169,59,0.6)' }}>
                ?
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      <KLine y={1770} text="Did the *right data* actually make it across?" times={[14.78, 15.36, 15.54, 15.76, 16.12, 16.66, 16.88, 17.02]} size={100} />
    </Cam>
  );
};

const Rely: React.FC = () => {
  const t = useT();
  return (
    <Cam from={17.85} to={24.55} enter="zoom" exit="push" push={0.05} originX={1920} originY={1060}>
      {(() => {
        // Logo lands centre-stage on "At Dominion Energy", then glides up to make room.
        const inP = tween(t, 18.1, 18.7, 0, 1, EASE_OUT);
        const up = tween(t, 19.25, 19.95, 0, 1, EASE_IN_OUT);
        const sc = 1.9 - 1.0 * up;
        const cy = 1000 - (1000 - 340) * up;
        return (
          <div style={{ position: 'absolute', left: 1920 - (490 * sc) / 2, top: cy - (183 * sc) / 2, opacity: inP, filter: inP < 1 ? `blur(${(1 - inP) * 14}px)` : undefined }}>
            <MaskedImage src="brand/dominion_logo_white.png" w={490 * sc} h={183 * sc} background="#FFFFFF" />
          </div>
        );
      })()}
      <IconBadge icon="team" t0={19.74} x={760} y={1060} d={420} label="Business teams" labelSize={72} />
      <IconBadge icon="catalog" t0={21.1} x={1920} y={1060} d={500} label="Data catalog" labelSize={76} />
      <IconBadge icon="server" t0={23.3} x={3080} y={1060} d={420} label="Source systems" labelSize={72} />
      <Connector x1={990} y1={1060} x2={1650} y2={1060} t0={20.4} dur={0.6} arrow width={7} />
      <Reveal t0={20.55} dy={20} style={{ position: 'absolute', left: 1320 - 200, top: 900, width: 400, display: 'flex', justifyContent: 'center' }}>
        <Chip text="rely on" size={50} />
      </Reveal>
      <Connector x1={2190} y1={1035} x2={2850} y2={1035} t0={21.8} dur={0.6} dashed width={7} />
      <Connector x1={2850} y1={1085} x2={2190} y2={1085} t0={22.1} dur={0.6} dashed width={7} />
      <Reveal t0={22.38} dy={20} style={{ position: 'absolute', left: 2520 - 330, top: 880, width: 660, display: 'flex', justifyContent: 'center' }}>
        <Chip text="true state" icon="compareCheck" size={50} />
      </Reveal>
      {/* mirror shimmer across the catalog when "reflect" is spoken */}
      <div style={{ position: 'absolute', left: 1920 - 250, top: 1060 - 250, width: 500, height: 500, borderRadius: '50%', overflow: 'hidden', opacity: tween(t, 21.8, 22.0) * tween(t, 22.8, 23.1, 1, 0) }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, width: 160, left: keys(t, [21.8, 22.9], [-200, 560]), background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))', transform: 'skewX(-20deg)' }} />
      </div>
      <KLine y={1680} text="The catalog should reflect the *true state* of our source systems" times={[21.06, 21.22, 21.56, 21.8, 22.14, 22.38, 22.7, 23.08, 23.26, 23.44, 23.64]} size={92} />
    </Cam>
  );
};

const Risk: React.FC = () => {
  const t = useT();
  const frame = useCurrentFrame();
  const tiles = Array.from({ length: 9 }, (_, i) => i);
  const gx = 1180, gy = 1080, tile = 250, gap = 44;
  const omitP = tween(t, 26.22, 26.8, 0, 1, EASE_OUT);
  const misP = tween(t, 27.96, 28.4, 0, 1, EASE_OUT);
  const shake = misP > 0 && misP < 1 ? Math.sin(frame * 1.9) * 14 * (1 - misP) : 0;
  // schema tree (right)
  const tx = 2760;
  const node = (x: number, y: number, w: number, label: string, t0: number, warn = false) => {
    const p = tween(t, t0, t0 + 0.5, 0, 1, EASE_OUT);
    const wcol = warn ? misP : 0;
    return (
      <div
        key={label}
        style={{
          position: 'absolute',
          left: x - w / 2 + (warn ? shake : 0),
          top: y - 62,
          width: w,
          height: 124,
          borderRadius: 26,
          background: warn && wcol > 0 ? `rgba(242,169,59,${0.18 * wcol})` : 'rgba(28,30,36,0.92)',
          border: `5px solid ${warn && wcol > 0 ? C.amber : 'rgba(90,170,255,0.8)'}`,
          boxShadow: warn && wcol > 0 ? '0 0 40px rgba(242,169,59,0.5)' : '0 0 30px rgba(0,114,206,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT,
          fontSize: 52,
          color: C.text,
          opacity: p,
          transform: `scale(${0.8 + 0.2 * p}) rotate(${warn ? -6 * wcol : 0}deg)`,
        }}
      >
        {warn && wcol > 0.5 ? 'type ≠ ?' : label}
      </div>
    );
  };
  return (
    <Cam from={24.4} to={29.35} enter="zoom" exit="up" push={0.04}>
      <KLine y={260} text="Omitted tables. *Misread schemas.*" times={[26.22, 27.12, 27.96, 28.92]} size={112} weight={600} />
      {tiles.map((i) => {
        const r = Math.floor(i / 3), c = i % 3;
        const x = gx + (c - 1) * (tile + gap), y = gy + (r - 1) * (tile + gap);
        const p = pop(frame, 24.45 + i * 0.07, { damping: 15 });
        const isOmit = i === 4;
        return (
          <div key={i} style={{ position: 'absolute', left: x - tile / 2, top: y - tile / 2, width: tile, height: tile, opacity: Math.min(1, p * 1.4), transform: `scale(${0.6 + 0.4 * p})` }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 40,
                background: isOmit ? `rgba(28,30,36,${0.92 * (1 - omitP)})` : 'rgba(28,30,36,0.92)',
                border: isOmit && omitP > 0 ? `6px dashed ${C.amber}` : '4px solid rgba(90,170,255,0.7)',
                boxShadow: isOmit && omitP > 0 ? '0 0 40px rgba(242,169,59,0.45)' : '0 0 30px rgba(0,114,206,0.3)',
              }}
            />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isOmit ? 1 - omitP : 1 }}>
              <Icon name="table" size={150} progress={tween(t, 24.7 + i * 0.07, 25.6 + i * 0.07)} />
            </div>
            {isOmit && omitP > 0 ? (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: omitP }}>
                <Icon name="warning" size={140} fill={C.amber} progress={omitP} />
              </div>
            ) : null}
          </div>
        );
      })}
      <Reveal t0={26.5} dy={30} style={{ position: 'absolute', left: gx - 500, top: gy + 520, width: 1000, display: 'flex', justifyContent: 'center' }}>
        <Chip text="Critical table omitted" icon="warning" size={54} border={C.amber} />
      </Reveal>
      {/* schema tree */}
      <Connector x1={tx} y1={760} x2={tx} y2={880} t0={25.3} dur={0.3} glow={false} color="rgba(120,180,255,0.8)" />
      <Connector x1={tx - 380} y1={880} x2={tx + 380} y2={880} t0={25.45} dur={0.4} glow={false} color="rgba(120,180,255,0.8)" />
      <Connector x1={tx - 380} y1={880} x2={tx - 380} y2={1000} t0={25.7} dur={0.3} glow={false} color="rgba(120,180,255,0.8)" />
      <Connector x1={tx + 380} y1={880} x2={tx + 380} y2={1000} t0={25.7} dur={0.3} glow={false} color="rgba(120,180,255,0.8)" />
      <Connector x1={tx + 380} y1={1120} x2={tx + 380} y2={1250} t0={25.95} dur={0.3} glow={false} color="rgba(120,180,255,0.8)" />
      {node(tx, 700, 520, 'Schema', 25.1)}
      {node(tx - 380, 1060, 520, 'Table', 25.75)}
      {node(tx + 380, 1060, 520, 'Table', 25.85)}
      {node(tx + 380, 1310, 520, 'Column', 26.05, true)}
      <Reveal t0={28.2} dy={30} style={{ position: 'absolute', left: tx - 500, top: gy + 520, width: 1000, display: 'flex', justifyContent: 'center' }}>
        <Chip text="Schema misinterpreted" icon="warning" size={54} border={C.amber} />
      </Reveal>
    </Cam>
  );
};

const Downstream: React.FC = () => {
  const t = useT();
  const brk = tween(t, 32.24, 32.75, 0, 1, EASE_OUT);
  const items = [
    { icon: 'governance' as const, label: 'Governance', t0: 30.12, x: 880, rot: -5 },
    { icon: 'lineage' as const, label: 'Lineage', t0: 31.1, x: 1920, rot: 4 },
    { icon: 'report' as const, label: 'Reporting', t0: 31.76, x: 2960, rot: -3 },
  ];
  return (
    <Cam from={29.15} to={34.95} enter="rise" exit="push" push={0.05}>
      <KLine y={190} text="Downstream *governance, lineage, and reporting*" times={[29.28, 30.12, 31.1, 31.62, 31.76]} size={100} />
      <IconBadge icon="extract" t0={29.3} x={1920} y={560} d={300} />
      {items.map((it, i) => (
        <Connector key={`c${i}`} x1={1920} y1={720} x2={it.x} y2={1000} t0={it.t0 - 0.35} dur={0.4} width={7} broken={brk} color={brk > 0.3 ? C.amber : '#4FA3F0'} />
      ))}
      {items.map((it, i) => {
        const fall = tween(t, 32.24 + i * 0.1, 32.9 + i * 0.1, 0, 1, EASE_OUT);
        return (
          <div key={it.label} style={{ position: 'absolute', inset: 0, transform: `translateY(${fall * 50}px) rotate(${fall * it.rot}deg)`, transformOrigin: `${it.x}px 1200px` }}>
            <IconBadge icon={it.icon} t0={it.t0} x={it.x} y={1200} d={420} label={it.label} labelSize={74} ring={fall > 0.2 ? C.amber : undefined} accent={fall > 0.2 ? C.amber : C.blue} />
            <Reveal t0={32.35 + i * 0.12} dy={0} scaleFrom={0.3} style={{ position: 'absolute', left: it.x + 120, top: 960 }}>
              <Icon name="warning" size={150} fill={C.amber} progress={tween(t, 32.35 + i * 0.12, 33.0 + i * 0.12)} />
            </Reveal>
          </div>
        );
      })}
      <KLine y={1760} text="*Break down* before anyone even realizes it." times={[32.24, 32.6, 32.98, 33.28, 33.8, 34.08, 34.52]} size={96} />
    </Cam>
  );
};

export const Intro: React.FC = () => (
  <>
    <LogoSting />
    <TitleCard />
    <Goals />
    <JobCheck />
    <Rely />
    <Risk />
    <Downstream />
  </>
);
