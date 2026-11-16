import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { E, prog } from '../anim';
import { Connector } from '../components/Connector';
import { Icon } from '../components/Icons';
import { KText, Reveal } from '../components/Kinetic';
import { Caption, Hub } from '../components/Hub';
import { Logo } from '../components/Logo';
import { At, Cam } from '../components/Scene';
import { IconBadge } from '../components/UI';
import { at, atOut } from '../timing';
import { FONT } from '../theme';

// ───────────────────────────────────────────────────────────────────────────
// Conclusion (pure animation)
// "Every asset in the catalog has an origin story, and that story starts in
//  Metadata Command Center. The more comfortable you get with that idea, the
//  faster you'll be able to answer your own questions about where a piece of
//  data came from."
// ───────────────────────────────────────────────────────────────────────────
const TRAIL =
  'M 2860 1180 C 2650 1180, 2520 860, 2280 860 C 2000 860, 1920 1420, 1640 1420 C 1380 1420, 1240 1150, 1010 1150';
const TRAIL_FWD =
  'M 1010 1150 C 1240 1150, 1380 1420, 1640 1420 C 1920 1420, 2000 860, 2280 860 C 2520 860, 2650 1180, 2860 1180';

export const ConclusionScene: React.FC = () => {
  const T = at('conclusion');
  const f = useCurrentFrame();
  const traceAt = T(154.2);
  const originAt = T(156.3);
  const qs = [
    { x: 2620, y: 640, t: T(162.72), c: T(164.42) },
    { x: 3420, y: 760, t: T(163.02), c: T(164.74) },
    { x: 3380, y: 1620, t: T(163.26), c: T(165.08) },
  ];
  const way = [
    { x: 2280, y: 860, icon: 'sync', t: traceAt + 10 },
    { x: 1640, y: 1420, icon: 'scan', t: traceAt + 22 },
  ];
  return (
    <AbsoluteFill>
      <Cam
        keys={[
          { f: 0, s: 1.08, x: 220 },
          { f: T(155.4), s: 1.0, x: 0 },
          { f: T(159.12), s: 1.0, x: 0 },
          { f: T(160.6), s: 0.9, x: 40 },
          { f: T(166.0), s: 0.88, x: 60 },
        ]}
      >
        <Connector d={TRAIL} at={traceAt} dur={34} width={9} dashed={false} />
        <Connector
          d={TRAIL_FWD}
          at={T(159.3)}
          dur={2}
          width={1}
          color="rgba(0,0,0,0)"
          glow={false}
          pulses={4}
          pulseSpeed={46}
          pulseSize={18}
        />
        {way.map((w) => (
          <At key={w.icon} x={w.x} y={w.y}>
            <Reveal at={w.t} y={0} scale={0.3}>
              <IconBadge icon={w.icon} size={170} />
            </Reveal>
          </At>
        ))}
        <At x={3020} y={1180}>
          <Reveal at={T(152.84)} y={0} x={120} scale={0.7}>
            <IconBadge icon="table" size={330} />
          </Reveal>
        </At>
        <At x={3020} y={1420}>
          <Reveal at={T(152.84) + 6} y={20}>
            <Caption text="Catalog asset" size={58} />
          </Reveal>
        </At>
        <At x={820} y={1150}>
          {f >= originAt - 2 ? <Hub size={400} at={originAt} label="MCC" /> : null}
        </At>
        <At x={820} y={1450}>
          <Reveal at={T(157.34)} y={20}>
            <Caption text="Metadata Command Center" size={56} weight={600} />
          </Reveal>
        </At>
        <At x={820} y={1540}>
          <Reveal at={T(156.0)} y={20}>
            <Caption text="where the story starts" size={44} color="rgba(160,205,245,0.9)" weight={400} />
          </Reveal>
        </At>
        {qs.map((q, i) => {
          const p = prog(f, q.t, 20, E.outBack);
          const flip = prog(f, q.c, 14, E.inOutSoft);
          const sx = Math.abs(Math.cos(flip * Math.PI));
          const showCheck = flip > 0.5;
          return (
            <At key={i} x={q.x} y={q.y}>
              <div style={{ transform: `scale(${p}) scaleX(${sx})`, opacity: Math.min(1, p) }}>
                <Icon name={showCheck ? 'check' : 'question'} size={190} />
              </div>
            </At>
          );
        })}
      </Cam>

      <At x={1920} y={330}>
        <KText
          text="Every asset has an *origin story*"
          times={[T(152.54), T(152.84), T(153.86), T(154.3), T(154.48), T(154.86)]}
          start={0}
          size={130}
          outAt={T(155.4)}
        />
      </At>
      <At x={1920} y={330}>
        <KText
          text="It starts in *Metadata Command Center*"
          times={[T(155.88), T(156.48), T(156.96), T(157.34), T(157.68), T(158.22)]}
          start={0}
          size={130}
          outAt={T(158.95)}
        />
      </At>
      <At x={1920} y={330}>
        <KText
          text="Get comfortable with that idea…"
          times={[T(159.28), T(159.5), T(160.32), T(160.5), T(160.66)]}
          start={0}
          size={120}
          outAt={T(161.2)}
        />
      </At>
      <At x={1920} y={330}>
        <KText
          text="…and *answer your own questions* faster"
          times={[T(161.36), T(162.72), T(163.02), T(163.26), T(163.56), T(164.04)]}
          start={0}
          size={120}
        />
      </At>
      <At x={1920} y={1930}>
        <KText
          text="Where did this data come from?"
          times={[T(164.42), T(164.74), T(164.92), T(165.26), T(165.44), T(165.74)]}
          start={0}
          size={72}
          weight={400}
          color="rgba(244,247,251,0.7)"
        />
      </At>
    </AbsoluteFill>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// Tagline + end card
// "Behind every trusted report is a clear data trail, built right from the start."
// ───────────────────────────────────────────────────────────────────────────
export const TaglineScene: React.FC = () => {
  const T = at('tagline');
  const O = atOut('tagline');
  const f = useCurrentFrame();
  const out = prog(f, O(183.0), 20, E.inCubic);
  const endIn = O(183.4);
  const stripes = [0, 1, 2, 3].map((i) => prog(f, endIn + i * 4, 24, E.outExpo));
  const word = prog(f, endIn + 10, 26, E.inOutSoft);
  const div = prog(f, endIn + 18, 26, E.outExpo);
  const fadeAll = prog(f, O(186.9), 18, E.inCubic);
  return (
    <AbsoluteFill style={{ opacity: 1 - fadeAll }}>
      <AbsoluteFill
        style={{
          opacity: 1 - out,
          transform: `scale(${1 + out * 0.06})`,
          filter: out > 0 ? `blur(${out * 20}px)` : undefined,
        }}
      >
        <Cam keys={[{ f: 0, s: 1.05 }, { f: O(183.0), s: 1.0 }]}>
          <Connector
            d="M 220 1760 C 900 1760, 1100 1640, 1920 1680 S 3100 1780, 3620 1660"
            at={T(168.92)}
            dur={26}
            pulses={3}
            pulseSpeed={44}
          />
          <At x={220} y={1760}>
            <div style={{ transform: `scale(${prog(f, T(170.3), 20, E.outBack)})` }}>
              <Hub size={170} at={T(170.3)} label="" />
            </div>
          </At>
          <At x={3620} y={1660}>
            <Reveal at={T(169.6)} y={0} scale={0.4}>
              <Icon name="check" size={160} />
            </Reveal>
          </At>
          <At x={1920} y={520}>
            <Reveal at={T(167.6)} y={60} scale={0.6}>
              <IconBadge icon="report" size={330} glow={1.2} />
            </Reveal>
          </At>
          <At x={1920} y={1120}>
            <KText
              text="Behind every *trusted report* | is a *clear data trail,* | built right from the start."
              times={[
                T(166.58), T(166.88), T(167.4), T(167.74), T(168.26), T(168.58), T(168.92),
                T(169.12), T(169.48), T(169.86), T(170.32), T(170.7), T(170.96), T(171.12),
              ]}
              start={0}
              size={150}
              lineHeight={1.22}
            />
          </At>
        </Cam>
      </AbsoluteFill>

      {/* End card: logo | tagline */}
      {f >= endIn - 1 ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 110 }}>
            <Logo width={1000} stripes={stripes} word={word} markColor="#FFFFFF" />
            <div
              style={{
                width: 6,
                height: 360 * div,
                background: '#fff',
                borderRadius: 4,
                opacity: div,
              }}
            />
            <div style={{ fontFamily: FONT, fontSize: 96, fontWeight: 400, color: '#fff', lineHeight: 1.22, letterSpacing: '-0.015em' }}>
              <KText text="Behind every trusted report" start={endIn + 22} stagger={3} size={96} weight={400} align="left" />
              <KText text="is a clear data trail." start={endIn + 32} stagger={3} size={96} weight={400} align="left" />
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
