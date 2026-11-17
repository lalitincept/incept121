import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Icon } from '../components/Icon';
import { KLine, KText } from '../components/Kinetic';
import { Cam, MaskedImage, useT } from '../components/Scene';
import { Connector, IconBadge } from '../components/UI';
import { C, EASE_IN, EASE_IN_OUT, EASE_OUT, FONT, pop, tween } from '../theme';


/* Extraction results = the catalog's raw material */
const RawMaterial: React.FC = () => {
  const t = useT();
  const frame = useCurrentFrame();
  const S = 330;
  // pyramid of cubes (bottom row first)
  const cubes = [
    { x: 1920 - S * 0.98, y: 1500, d: 0 },
    { x: 1920, y: 1500, d: 1 },
    { x: 1920 + S * 0.98, y: 1500, d: 2 },
    { x: 1920 - S * 0.49, y: 1500 - S * 0.74, d: 3 },
    { x: 1920 + S * 0.49, y: 1500 - S * 0.74, d: 4 },
    { x: 1920, y: 1500 - S * 1.48, d: 5 },
  ];
  return (
    <Cam from={120.25} to={123.75} enter="zoom" exit="down" push={0.04}>
      <KLine y={200} text="Extraction results are the catalog's *raw material*" times={[120.6, 121.14, 121.46, 121.76, 121.96, 122.48, 122.78]} size={104} weight={600} />
      {cubes.map((c) => {
        const t0 = 120.5 + c.d * 0.16;
        const p = pop(frame, t0, { damping: 11, stiffness: 150, mass: 0.8 });
        if (p <= 0.001) return null;
        return (
          <div key={c.d} style={{ position: 'absolute', left: c.x - S / 2, top: c.y - S / 2 - (1 - p) * 900, opacity: Math.min(1, p * 2) }}>
            <Icon name="cube" size={S} progress={tween(t, t0, t0 + 0.7)} />
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 1920 - 900, top: 1720, width: 1800, height: 40, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(0,114,206,0.55), rgba(0,114,206,0))', opacity: tween(t, 120.9, 121.6) }} />
    </Cam>
  );
};

/* Everything a steward does next starts from what's captured here */
const StewardFlow: React.FC = () => {
  const t = useT();
  const glow = tween(t, 127.98, 128.6, 0, 1, EASE_OUT);
  return (
    <Cam from={123.6} to={130.15} enter="rise" exit="push" push={0.04}>
      <KLine y={110} text="Everything a steward does next" times={[123.9, 124.22, 124.48, 124.74, 124.96]} size={92} weight={600} />
      <IconBadge icon="steward" t0={124.4} x={1920} y={560} d={320} label="Data steward" labelSize={64} />
      <Connector x1={1780} y1={680} x2={1210} y2={980} t0={124.95} dur={0.5} arrow width={7} />
      <Connector x1={2060} y1={680} x2={2630} y2={980} t0={125.25} dur={0.5} arrow width={7} />
      <IconBadge icon="glossary" t0={125.84} x={1060} y={1110} d={320} label="Glossary work" labelSize={64} />
      <IconBadge icon="review" t0={126.84} x={2780} y={1110} d={320} label="Stakeholder review" labelSize={64} />
      <IconBadge icon="cubes" t0={123.75} x={1920} y={1650} d={330} />
      <div style={{ position: 'absolute', left: 2140, top: 1600, fontFamily: FONT, fontSize: 70, fontWeight: 600, color: C.text, opacity: tween(t, 128.5, 129.0), transform: `translateX(${(1 - tween(t, 128.5, 129.0)) * -40}px)` }}>
        Starts from <span style={{ color: C.blueLight }}>what's captured here</span>
      </div>
      <Connector x1={1780} y1={1560} x2={1215} y2={1200} t0={127.98} dur={0.5} arrow width={9} color={glow > 0 ? '#8CC6FF' : '#4FA3F0'} />
      <Connector x1={2060} y1={1560} x2={2625} y2={1200} t0={128.1} dur={0.5} arrow width={9} color={glow > 0 ? '#8CC6FF' : '#4FA3F0'} />
    </Cam>
  );
};

/* Finding + reading = time well spent */
const FindRead: React.FC = () => {
  const t = useT();
  const glyph = (txt: string, x: number, t0: number) => (
    <div style={{ position: 'absolute', left: x - 100, top: 960, width: 200, textAlign: 'center', fontFamily: FONT, fontSize: 180, fontWeight: 300, color: C.blueLight, opacity: tween(t, t0, t0 + 0.4), transform: `scale(${0.6 + 0.4 * tween(t, t0, t0 + 0.4, 0, 1, EASE_OUT)})`, textShadow: '0 0 30px rgba(46,149,240,0.6)' }}>
      {txt}
    </div>
  );
  return (
    <Cam from={130.0} to={134.45} enter="zoom" exit="push" push={0.05}>
      <KLine y={240} text="Get comfortable *finding and reading* results" times={[130.26, 130.5, 131.02, 131.5, 131.76, 132.28]} size={104} weight={600} />
      <IconBadge icon="search" t0={130.95} x={1040} y={1080} d={440} label="Finding" labelSize={72} />
      {glyph('+', 1480, 131.5)}
      <IconBadge icon="eye" t0={131.7} x={1920} y={1080} d={440} label="Reading" labelSize={72} />
      {glyph('=', 2360, 132.7)}
      <IconBadge icon="clockCheck" t0={132.95} x={2800} y={1080} d={440} label="Time well spent" labelSize={72} />
    </Cam>
  );
};

/* Checking a fresh scan takes a couple of minutes */
const TwoMinutes: React.FC = () => {
  const t = useT();
  const run = tween(t, 135.96, 138.06, 0, 1, EASE_IN_OUT);
  const secs = Math.round(120 * run);
  const R = 340;
  const a = run * Math.PI * 2 * (2 / 6); // two of six "minute" sectors on the dial
  return (
    <Cam from={134.35} to={138.45} enter="zoom" exit="fade" push={0.05}>
      <KLine y={230} text="Once you know *where to look*" times={[134.6, 134.76, 134.9, 135.04, 135.18, 135.32]} size={108} weight={600} />
      <IconBadge icon="stopwatch" t0={134.75} x={1920} y={1020} d={600} />
      {run > 0 ? (
        <svg style={{ position: 'absolute', left: 1920 - R - 40, top: 1020 - R - 40, overflow: 'visible' }} width={2 * R + 80} height={2 * R + 80}>
          <path d={`M ${R + 40} 40 A ${R} ${R} 0 ${a > Math.PI ? 1 : 0} 1 ${R + 40 + R * Math.sin(a)} ${R + 40 - R * Math.cos(a)}`} fill="none" stroke="#8CC6FF" strokeWidth={16} strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 18px #2E95F0)' }} />
        </svg>
      ) : null}
      <div style={{ position: 'absolute', left: 1920 - 400, top: 1400, width: 800, textAlign: 'center', fontFamily: FONT, fontSize: 130, fontWeight: 600, color: C.text, fontVariantNumeric: 'tabular-nums', opacity: tween(t, 135.8, 136.2) }}>
        {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, '0')}
      </div>
      <KLine y={1690} text="Checking a fresh scan takes *a couple of minutes*" times={[135.96, 136.14, 136.38, 136.56, 136.92, 137.52, 137.7, 137.86, 138.06]} size={92} />
    </Cam>
  );
};

/* End slate: logo | tagline */
const EndSlate: React.FC = () => {
  const t = useT();
  if (t < 138.25) return null;
  const S = 1.0;
  const W = 980 * S, H = 365 * S;
  const left = 470, top = 1080 - H / 2;
  const markP = tween(t, 138.3, 138.95, 0, 1, EASE_OUT);
  const wordP = tween(t, 138.55, 139.2, 0, 1, EASE_OUT);
  const div = tween(t, 138.8, 139.35, 0, 1, EASE_OUT);
  const fade = tween(t, 145.5, 146.45, 0, 1, EASE_IN);
  const glint = tween(t, 143.0, 144.0, -0.3, 1.3, EASE_IN_OUT);
  return (
    <AbsoluteFill style={{ opacity: 1 - fade }}>
      <div style={{ position: 'absolute', left, top, width: 308 * S, height: H, clipPath: `polygon(0 0, ${markP * 140 - 20}% 0, ${markP * 140 - 40}% 100%, 0 100%)` }}>
        <MaskedImage src="brand/dominion_mark_white.png" w={308 * S} h={H} background="#FFFFFF" />
      </div>
      <div style={{ position: 'absolute', left: left + 358 * S, top, opacity: wordP, transform: `translateX(${(1 - wordP) * 80}px)`, clipPath: `inset(0 ${(1 - wordP) * 100}% 0 0)` }}>
        <MaskedImage src="brand/dominion_wordmark_white.png" w={622 * S} h={H} background="#FFFFFF" />
      </div>
      <div style={{ position: 'absolute', left, top, mixBlendMode: 'screen' }}>
        <MaskedImage src="brand/dominion_logo_white.png" w={W} h={H} background={`linear-gradient(105deg, rgba(140,198,255,0) ${glint * 100 - 12}%, rgba(140,198,255,0.9) ${glint * 100}%, rgba(140,198,255,0) ${glint * 100 + 12}%)`} />
      </div>
      <div style={{ position: 'absolute', left: 1590, top: 1080 - 190 * div, width: 6, height: 380 * div, background: '#FFFFFF', borderRadius: 3 }} />
      <div style={{ position: 'absolute', left: 1730, top: 1080 - 112 }}>
        <KText
          text="Confirming what landed *today* / powers the decisions we make *tomorrow.*"
          times={[138.44, 139.62, 139.82, 140.2, 140.6, 141.16, 141.42, 141.92, 142.16, 142.38]}
          size={88}
          weight={400}
          align="left"
          lineHeight={1.22}
        />
      </div>
    </AbsoluteFill>
  );
};

export const Outro: React.FC = () => {
  return (
    <>
      <RawMaterial />
      <StewardFlow />
      <FindRead />
      <TwoMinutes />
      <EndSlate />
    </>
  );
};

