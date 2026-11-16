import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { E, prog } from '../anim';
import { Connector } from '../components/Connector';
import { Icon } from '../components/Icons';
import { KText, Reveal } from '../components/Kinetic';
import { Caption } from '../components/Hub';
import { At, Cam } from '../components/Scene';
import { ScreenCard } from '../components/ScreenCard';
import { Chip, GlowCard, IconBadge, StepDot } from '../components/UI';
import { at, s2f, sceneStart } from '../timing';
import { FONT } from '../theme';

// ───────────────────────────────────────────────────────────────────────────
// "Even without ever configuring a catalog source yourself, everything reviewed
//  as a steward, technical assets, stakeholders, glossary matches, started here."
// ───────────────────────────────────────────────────────────────────────────
export const StewardScene: React.FC = () => {
  const T = at('steward');
  const f = useCurrentFrame();
  const end = s2f(144.2) - sceneStart('steward');
  const cards = [
    { icon: 'layers', label: 'Technical assets', t: T(129.82), y: 700 },
    { icon: 'people', label: 'Stakeholders', t: T(131.0), y: 1080 },
    { icon: 'book', label: 'Glossary matches', t: T(132.0), y: 1460 },
  ];
  const strike = prog(f, T(126.6), 14, E.inOutSoft);
  const here = T(132.92);
  return (
    <AbsoluteFill>
      <Cam
        keys={[
          { f: 0, s: 1.06, x: -120 },
          { f: T(127.6), s: 1.0, x: 0 },
          { f: here - 4, s: 1.0, x: 0 },
          { f: here + 22, s: 0.84, x: 500 },
          { f: end, s: 0.82, x: 510 },
        ]}
      >
        <At x={820} y={1000}>
          <Reveal at={2} y={0} scale={0.7}>
            <IconBadge icon="steward" size={460} />
          </Reveal>
        </At>
        <At x={820} y={1310}>
          <Reveal at={8} y={20}>
            <Caption text="Data steward" size={66} weight={600} />
          </Reveal>
        </At>
        <At x={820} y={1520}>
          <Reveal at={T(125.42)} y={30}>
            <div style={{ position: 'relative', opacity: 1 - strike * 0.5 }}>
              <Chip icon="gear" label="Configuring sources" size={50} active={1 - strike} />
              <div
                style={{
                  position: 'absolute',
                  left: 20,
                  top: '50%',
                  height: 8,
                  width: `${strike * 94}%`,
                  borderRadius: 8,
                  background: '#fff',
                  boxShadow: '0 0 16px rgba(0,114,206,1)',
                }}
              />
            </div>
          </Reveal>
        </At>
        <At x={820} y={1680}>
          <Reveal at={T(126.82)} y={20}>
            <Caption text="Not required" size={46} color="rgba(160,205,245,0.95)" />
          </Reveal>
        </At>

        {cards.map((c) => (
          <React.Fragment key={c.label}>
            <Connector d={`M 1060 1000 C 1300 1000, 1350 ${c.y}, 1620 ${c.y}`} at={c.t - 6} dur={12} />
            <div style={{ position: 'absolute', left: 1660, top: c.y, transform: 'translateY(-50%)' }}>
              <Reveal at={c.t} x={-60} y={0} scale={0.8}>
                <Chip icon={c.icon} label={c.label} size={72} />
              </Reveal>
            </div>
            <Connector d={`M 2560 ${c.y} C 2700 ${c.y}, 2700 1080, 2840 1080`} at={here + i(c.y)} dur={14} pulses={2} pulseSpeed={30} />
          </React.Fragment>
        ))}

        <At x={3600} y={1080}>
          <Reveal at={here - 6} x={240} y={0} scale={0.9}>
            <ScreenCard width={1500} clips={[{ from: 0, to: end, src: 56.0, freeze: true }]} glow={1.3} radius={30} />
          </Reveal>
        </At>
        <At x={3600} y={600}>
          <Reveal at={here + 6} y={30}>
            <Chip icon="gear" label="Metadata Command Center" size={60} />
          </Reveal>
        </At>
      </Cam>
      <At x={1920} y={250}>
        <KText
          text="Everything you review as a steward…"
          times={[T(127.82), T(128.18), T(128.18), T(128.62), T(128.86), T(129.02)]}
          start={0}
          size={100}
          outAt={here - 8}
        />
      </At>
      <At x={1920} y={250}>
        <KText text="…started *here*" times={[here, here, T(133.42)]} start={0} size={110} />
      </At>
    </AbsoluteFill>
  );
};
const i = (y: number) => (y === 700 ? 0 : y === 1080 ? 3 : 6);

// ───────────────────────────────────────────────────────────────────────────
// "Knowing that MCC is the front door makes it much easier to trace where a
//  piece of metadata came from and when it was last refreshed."
// ───────────────────────────────────────────────────────────────────────────
const Door: React.FC<{ open: number; glow: number }> = ({ open, glow }) => (
  <div style={{ position: 'relative', width: 460, height: 680, perspective: 1600 }}>
    {/* light behind */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 26,
        background: `radial-gradient(ellipse at 50% 55%, rgba(220,238,255,${0.95 * glow}) 0%, rgba(111,181,242,${0.8 * glow}) 40%, rgba(0,114,206,${0.5 * glow}) 100%)`,
        boxShadow: `0 0 ${200 * glow}px rgba(80,160,245,${0.9 * glow})`,
      }}
    />
    {/* door panel */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 20,
        transformOrigin: '0% 50%',
        transform: `rotateY(${-open * 72}deg)`,
        background: 'linear-gradient(160deg, #1A86E6 0%, #0072CE 60%, #005BA6 100%)',
        border: '10px solid #fff',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ position: 'absolute', left: 50, right: 50, top: 60, height: 230, border: '10px solid rgba(255,255,255,0.9)', borderRadius: 16 }} />
      <div style={{ position: 'absolute', left: 50, right: 50, top: 340, height: 270, border: '10px solid rgba(255,255,255,0.9)', borderRadius: 16 }} />
      <div style={{ position: 'absolute', right: 40, top: 330, width: 34, height: 34, borderRadius: '50%', background: '#fff' }} />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 170,
          transform: 'translate(-50%,-50%)',
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 92,
          color: '#fff',
          letterSpacing: '0.04em',
        }}
      >
        MCC
      </div>
    </div>
    {/* frame */}
    <div style={{ position: 'absolute', inset: -34, border: '10px solid #fff', borderBottom: 'none', borderRadius: '34px 34px 0 0' }} />
    <div style={{ position: 'absolute', left: -150, right: -150, bottom: -10, height: 10, background: '#fff', borderRadius: 10 }} />
  </div>
);

export const TraceScene: React.FC = () => {
  const T = at('trace');
  const f = useCurrentFrame();
  const end = s2f(152.4) - sceneStart('trace');
  const open = prog(f, T(135.5), 26, E.inOutSoft);
  const glow = prog(f, T(135.4), 30, E.outCubic);
  const push = prog(f, T(136.3), 22, E.inExpo);
  const cardIn = prog(f, T(136.6), 26, E.outQuint);
  return (
    <AbsoluteFill>
      {/* door phase */}
      <AbsoluteFill
        style={{
          opacity: 1 - prog(f, T(136.62), 10),
          transformOrigin: '1920px 860px',
          transform: `scale(${1 + push * 4.5})`,
          filter: push > 0 ? `blur(${push * 10}px)` : undefined,
        }}
      >
        <At x={1920} y={860}>
          <Reveal at={2} y={80} scale={0.85}>
            <Door open={open} glow={glow} />
          </Reveal>
        </At>
        <At x={1920} y={1560}>
          <KText
            text="MCC is the *front door*"
            times={[T(134.6), T(135.16), T(135.56), T(135.74), T(136.0)]}
            start={0}
            size={140}
          />
        </At>
      </AbsoluteFill>

      {/* recording */}
      {f >= T(136.6) - 1 ? (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity: cardIn,
            transform: `scale(${0.82 + 0.18 * cardIn})`,
            filter: cardIn < 1 ? `blur(${(1 - cardIn) * 24}px)` : undefined,
          }}
        >
          <ScreenCard
            width={3360}
            clips={[{ from: 0, to: end, src: 61.0, freeze: true }]}
            zoom={[
              { f: T(136.6), x: 833, y: 413, s: 1.0 },
              { f: T(137.6), x: 833, y: 413, s: 1.0 },
              { f: T(138.4), x: 640, y: 400, s: 1.42 },
              { f: T(140.3), x: 640, y: 400, s: 1.42 },
              { f: T(141.0), x: 1000, y: 380, s: 1.6 },
            ]}
            highlights={[
              { x: 226, y: 399, w: 440, h: 34, at: T(137.96), outAt: T(140.4), label: 'Where it came from', labelIcon: 'route', labelSide: 'bottom', labelSize: 64, labelOffset: 30 },
              { x: 966, y: 196, w: 150, h: 380, at: T(140.6), label: 'Last refreshed', labelIcon: 'clock', labelSide: 'right', labelSize: 64, labelOffset: 30 },
            ]}
          />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// "If a table looks out of date, MCC's job history is usually the first place
//  to check, well before assuming CDGC itself has a problem."
// ───────────────────────────────────────────────────────────────────────────
export const JobsScene: React.FC = () => {
  const T = at('jobs');
  const f = useCurrentFrame();
  const end = s2f(162.8) - sceneStart('jobs');
  const aOut = prog(f, T(144.3), 16, E.inCubic);
  const cardIn = prog(f, T(144.3), 26, E.outQuint);
  const s1 = prog(f, T(146.84), 22, E.outBack);
  const s2 = prog(f, T(149.36), 22, E.outBack);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - aOut, transform: `scale(${1 - aOut * 0.08})`, filter: aOut > 0 ? `blur(${aOut * 20}px)` : undefined }}>
        <Cam keys={[{ f: 0, s: 1.04 }, { f: 70, s: 1.0 }]}>
          <At x={1920} y={830}>
            <Reveal at={2} y={60} scale={0.8}>
              <div style={{ position: 'relative' }}>
                <IconBadge icon="table" size={460} />
                <div
                  style={{
                    position: 'absolute',
                    right: -80,
                    top: -60,
                    transform: `scale(${prog(f, T(143.38), 22, E.outBack)}) rotate(${(1 - prog(f, T(143.38), 30, E.outBack)) * -40}deg)`,
                  }}
                >
                  <Icon name="clock" size={210} />
                </div>
              </div>
            </Reveal>
          </At>
          <At x={1920} y={1430}>
            <KText
              text="If a table looks *out of date…*"
              times={[T(142.42), T(142.74), T(142.9), T(143.16), T(143.38), T(143.62), T(143.76)]}
              start={0}
              size={140}
            />
          </At>
        </Cam>
      </AbsoluteFill>

      {f >= T(144.3) - 1 ? (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity: cardIn,
            transform: `scale(${0.9 + 0.1 * cardIn})`,
            filter: cardIn < 1 ? `blur(${(1 - cardIn) * 20}px)` : undefined,
          }}
        >
          <ScreenCard
            width={3360}
            clips={[{ from: 0, to: end, src: 56.0, freeze: true }]}
            zoom={[
              { f: T(144.3), x: 833, y: 413, s: 1.0 },
              { f: T(144.9), x: 833, y: 413, s: 1.0 },
              { f: T(145.7), x: 1180, y: 520, s: 1.75 },
            ]}
            highlights={[
              { x: 1168, y: 430, w: 458, h: 264, at: T(145.16), label: 'Job history', labelIcon: 'history', labelSide: 'top', labelSize: 64, labelOffset: 30, radius: 18 },
            ]}
          />
        </AbsoluteFill>
      ) : null}

      <div style={{ position: 'absolute', left: 340, top: 1250 }}>
        <Reveal at={T(146.6)} x={-120} y={0} scale={0.94}>
          <GlowCard w={1300} h={620} radius={56}>
            <div style={{ position: 'absolute', left: 64, top: 50, right: 64, fontFamily: FONT, color: '#fff' }}>
              <div style={{ fontSize: 52, color: 'rgba(160,205,245,0.95)', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                Where to look first
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 34, marginTop: 50, transform: `scale(${0.9 + 0.1 * s1})`, opacity: Math.min(1, s1), transformOrigin: '0 50%' }}>
                <StepDot n={1} size={120} />
                <Icon name="history" size={120} />
                <div style={{ fontSize: 66, fontWeight: 600 }}>MCC job history</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 34, marginTop: 50, transform: `scale(${0.9 + 0.1 * s2})`, opacity: Math.min(1, s2) * 0.7, transformOrigin: '0 50%' }}>
                <StepDot n={2} size={120} style={{ background: 'rgba(255,255,255,0.12)', boxShadow: 'none' }} />
                <Icon name="shield" size={120} />
                <div style={{ fontSize: 66, fontWeight: 500 }}>Then CDGC itself</div>
              </div>
            </div>
          </GlowCard>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};
