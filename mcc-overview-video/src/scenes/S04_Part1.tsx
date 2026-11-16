import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { E, prog } from '../anim';
import { Connector } from '../components/Connector';
import { Icon } from '../components/Icons';
import { KText, Reveal } from '../components/Kinetic';
import { Caption, Hub } from '../components/Hub';
import { At, Cam } from '../components/Scene';
import { ScreenCard, SRC_H, SRC_W } from '../components/ScreenCard';
import { CaptionBar, Chip, GlowCard, IconBadge } from '../components/UI';
import { atOut, at, s2f, sceneStart } from '../timing';
import { ACCENT_GRADIENT, FONT } from '../theme';

// ───────────────────────────────────────────────────────────────────────────
// "MCC doesn't move or copy actual data. Meter readings and account balances
//  stay exactly where they are. It scans the structure around that data."
// ───────────────────────────────────────────────────────────────────────────
const Record: React.FC<{ icon: string; title: string; value: string; glow: number }> = ({
  icon,
  title,
  value,
  glow,
}) => (
  <div
    style={{
      width: 820,
      height: 190,
      borderRadius: 34,
      background: `rgba(0,114,206,${0.16 + glow * 0.25})`,
      border: `3px solid rgba(111,181,242,${0.35 + glow * 0.6})`,
      boxShadow: `0 0 ${glow * 60}px rgba(0,114,206,${glow * 0.8})`,
      display: 'flex',
      alignItems: 'center',
      gap: 36,
      padding: '0 40px',
      boxSizing: 'border-box',
      fontFamily: FONT,
      color: '#fff',
    }}
  >
    <Icon name={icon} size={130} />
    <div>
      <div style={{ fontSize: 50, color: 'rgba(160,205,245,0.95)', fontWeight: 500 }}>{title}</div>
      <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: '-0.01em' }}>{value}</div>
    </div>
  </div>
);

export const DataStaysScene: React.FC = () => {
  const T = at('dataStays');
  const f = useCurrentFrame();
  const srcX = 1050;
  const srcY = 1170;
  const hubX = 2920;
  const recY = [srcY - 60, srcY + 180];
  // ghosts that try to move / copy
  const g1 = prog(f, T(43.4), 28, E.inOutSoft);
  const g2 = prog(f, T(43.94), 28, E.inOutSoft);
  const block = prog(f, T(44.5), 14, E.outBack);
  const back = prog(f, T(45.2), 22, E.inOutSoft);
  const stay = prog(f, T(46.2), 20, E.outCubic);
  const scan = prog(f, T(49.38), 34, E.inOutSoft);
  const scanOn = f >= T(49.3) && f <= T(49.38) + 40;
  const fly = prog(f, T(50.0), 34, E.inOutSoft);
  const recv = Math.max(0, Math.sin(prog(f, T(50.0) + 28, 20) * Math.PI));
  const ghost = (p: number, y: number, key: string, label: string, icon: string, value: string) => {
    const travel = p * (1 - back);
    const x = srcX + travel * 900 - (block > 0 ? Math.sin(f * 1.4) * 10 * (1 - back) * block : 0);
    const op = Math.min(1, travel * 4) * 0.75 * (1 - back);
    return (
      <div key={key} style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', opacity: op, filter: 'saturate(0.6)' }}>
        <div style={{ border: '4px dashed rgba(255,255,255,0.6)', borderRadius: 36 }}>
          <Record icon={icon} title={label} value={value} glow={0} />
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Cam keys={[{ f: 0, s: 1.04 }, { f: T(49.2), s: 1.0 }, { f: T(51.4), s: 0.98, x: 60 }]}>
        {/* headline phases */}
        <At x={1920} y={330}>
          <KText
            text="MCC doesn't *move* or *copy* data"
            times={[T(42.2), T(42.82), T(43.4), T(43.7), T(43.94), T(44.82)]}
            start={0}
            size={124}
            outAt={T(45.6)}
          />
        </At>
        <At x={1920} y={330}>
          <KText text="Data *stays exactly where it is*" times={[T(45.86), T(47.26), T(47.6), T(48.12), T(48.44), T(48.6)]} start={0} size={124} outAt={T(49.0)} />
        </At>
        <At x={1920} y={330}>
          <KText text="It scans the *structure* around it" times={[T(49.18), T(49.38), T(49.74), T(50.0), T(50.36), T(50.9)]} start={0} size={124} />
        </At>

        {/* source system */}
        <At x={srcX} y={srcY}>
          <Reveal at={0} y={120} scale={0.9}>
            <GlowCard w={1000} h={900} radius={60}>
              <div style={{ position: 'absolute', left: 60, top: 50, display: 'flex', alignItems: 'center', gap: 30 }}>
                <Icon name="database" size={130} />
                <div style={{ fontFamily: FONT, color: '#fff' }}>
                  <div style={{ fontSize: 46, color: 'rgba(160,205,245,0.9)' }}>Source system</div>
                  <div style={{ fontSize: 70, fontWeight: 600 }}>Billing database</div>
                </div>
              </div>
            </GlowCard>
          </Reveal>
        </At>
        {[0, 1].map((i) => (
          <At key={i} x={srcX} y={recY[i]}>
            <Reveal at={8 + i * 5} y={50}>
              <Record
                icon={i === 0 ? 'meter' : 'coin'}
                title={i === 0 ? 'Meter readings' : 'Account balances'}
                value={i === 0 ? '4,218 kWh' : '$1,204.56'}
                glow={stay * (1 - prog(f, T(49.3), 20))}
              />
            </Reveal>
          </At>
        ))}
        {/* pin "stays in place" */}
        <At x={srcX + 500} y={srcY - 450}>
          <div style={{ transform: `scale(${prog(f, T(47.26), 22, E.outBack)})` }}>
            <IconBadge icon="pin" size={200} />
          </div>
        </At>
        {/* scan beam */}
        {scanOn ? (
          <div
            style={{
              position: 'absolute',
              left: srcX - 520,
              top: srcY - 450 + scan * 900 - 40,
              width: 1040,
              height: 80,
              background: 'linear-gradient(180deg, rgba(111,181,242,0) 0%, rgba(160,215,255,0.85) 50%, rgba(111,181,242,0) 100%)',
              boxShadow: '0 0 80px rgba(43,142,240,0.9)',
              borderRadius: 40,
              opacity: Math.sin(scan * Math.PI) * 0.95 + 0.05,
            }}
          />
        ) : null}

        {/* move / copy ghosts */}
        {ghost(g1, recY[0], 'g1', 'Meter readings', 'meter', '4,218 kWh')}
        {ghost(g2, recY[1], 'g2', 'Account balances', 'coin', '$1,204.56')}
        <At x={1960} y={srcY + 10}>
          <div style={{ transform: `scale(${block * (1 - prog(f, T(45.7), 14))})`, opacity: block }}>
            <IconBadge icon="cross" size={240} />
          </div>
        </At>

        {/* structure wireframe flying to MCC */}
        {f >= T(49.6) ? (
          <div
            style={{
              position: 'absolute',
              left: srcX + fly * (hubX - srcX),
              top: srcY - fly * 40,
              transform: `translate(-50%,-50%) scale(${1 - fly * 0.62})`,
              opacity: prog(f, T(49.6), 14) * (1 - prog(f, T(50.0) + 30, 8)),
            }}
          >
            <div
              style={{
                width: 900,
                padding: '40px 50px',
                borderRadius: 40,
                border: '5px dashed rgba(160,215,255,0.95)',
                background: 'rgba(0,114,206,0.18)',
                boxShadow: '0 0 60px rgba(0,114,206,0.7)',
                fontFamily: '"JetBrains Mono", Menlo, Consolas, monospace',
                color: '#fff',
                fontSize: 50,
                lineHeight: 1.6,
              }}
            >
              <div style={{ fontWeight: 700, color: '#9BCBF6' }}>METER_READING</div>
              <div>├ METER_ID · VARCHAR</div>
              <div>├ READ_KWH · DECIMAL</div>
              <div>└ READ_DATE · DATE</div>
            </div>
          </div>
        ) : null}
        <At x={1990} y={srcY + 520}>
          <Reveal at={T(50.0)} y={30}>
            <Chip icon="scan" label="Structure only" size={56} />
          </Reveal>
        </At>

        {/* MCC hub */}
        <At x={hubX} y={srcY}>
          <Reveal at={6} x={140} y={0} scale={0.9}>
            <Hub size={480} at={10} label="MCC" pulse={recv} />
          </Reveal>
        </At>
      </Cam>
    </AbsoluteFill>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// Recording: MCC Home → Explore → Catalog Sources list, then
// "every catalog source produces technical assets ... govern inside CDGC"
// ───────────────────────────────────────────────────────────────────────────
export const ExploreScene: React.FC = () => {
  const O = atOut('explore'); // output seconds → local frame
  const T = at('explore');
  const f = useCurrentFrame();
  const CARD_W = 3360;
  const shrink = prog(f, T(68.25), 34, E.inOutSoft);
  const cardScale = 1 - shrink * 0.5;
  const cardX = 1920 - shrink * 880;
  const flowAt = T(69.0);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: cardX,
          top: 1080,
          transform: `translate(-50%,-50%) scale(${cardScale})`,
        }}
      >
        <ScreenCard
          width={CARD_W}
          clips={[
            { from: 0, to: O(59.1), src: 55.75, freeze: true },
            { from: O(59.1), to: O(63.65), src: 55.75 },
            { from: O(63.65), to: s2f(80.0) - sceneStart('explore'), src: 61.0, freeze: true },
          ]}
          zoom={[
            { f: 0, x: SRC_W / 2, y: SRC_H / 2, s: 1 },
            { f: O(60.1), x: SRC_W / 2, y: SRC_H / 2, s: 1 },
            { f: O(61.0), x: 300, y: 230, s: 2.3 },
            { f: O(62.9), x: 300, y: 230, s: 2.3 },
            { f: O(64.0), x: 760, y: 400, s: 1.22 },
            { f: O(69.9), x: 760, y: 400, s: 1.22 },
            { f: O(70.6), x: 700, y: 330, s: 1.55 },
            { f: O(71.6), x: 700, y: 330, s: 1.55 },
            { f: O(72.3), x: 700, y: 420, s: 1.45 },
            { f: O(74.1), x: 700, y: 420, s: 1.45 },
            { f: O(75.3), x: 760, y: 400, s: 1.15 },
          ]}
          highlights={[
            { x: 4, y: 134, w: 154, h: 34, at: O(60.9), outAt: O(63.2), label: 'Explore tab', labelIcon: 'compass', labelSize: 58, labelOffset: 24, dim: 0.5 },
            { x: 222, y: 142, w: 945, h: 434, at: O(63.9), outAt: O(70.0), dim: 0.42, radius: 16 },
            { x: 226, y: 259, w: 936, h: 34, at: O(70.3), outAt: O(71.8), label: 'Oracle billing database', labelIcon: 'database', labelSize: 64, labelSide: 'bottom', labelOffset: 30 },
            { x: 226, y: 329, w: 936, h: 174, at: O(71.95), outAt: O(74.2), label: 'Snowflake analytics warehouse', labelIcon: 'warehouse', labelSize: 64, labelSide: 'bottom', labelOffset: 30 },
          ]}
          ripples={[{ x: 45, y: 150, at: O(61.17) }]}
        />
      </div>

      <At x={1920} y={1835}>
        <CaptionBar
          at={T(57.46) + 4}
          outAt={T(64.0) - 6}
          width={2600}
          text={
            <span>
              A <b>catalog source</b> = one connection to a source system
            </span>
          }
        />
      </At>

      {/* flow: catalog source → technical assets → CDGC */}
      <Connector d="M 1930 1080 L 2330 1080" at={flowAt} dur={12} arrow pulses={2} pulseSpeed={30} />
      <At x={2620} y={1000}>
        <Reveal at={flowAt + 6} y={0} x={60} scale={0.7}>
          <IconBadge icon="layers" size={330} />
        </Reveal>
      </At>
      <At x={2620} y={1250}>
        <Reveal at={flowAt + 10} y={20}>
          <Caption text="Technical assets" size={60} />
        </Reveal>
      </At>
      {['Tables', 'Columns', 'Views'].map((t, i) => (
        <At key={t} x={2620} y={1400 + i * 120}>
          <Reveal at={T(70.44) + i * 4} y={20}>
            <Chip label={t} size={46} />
          </Reveal>
        </At>
      ))}
      <Connector d="M 2860 1000 L 3150 1000" at={T(72.2)} dur={10} arrow pulses={2} pulseSpeed={30} />
      <At x={3420} y={1000}>
        <Reveal at={T(72.3)} y={0} x={60} scale={0.7}>
          <IconBadge icon="shield" size={330} />
        </Reveal>
      </At>
      <At x={3420} y={1250}>
        <Reveal at={T(72.5)} y={20}>
          <div style={{ textAlign: 'center' }}>
            <Caption text="CDGC" size={64} weight={700} />
            <Caption text="Data Governance & Catalog" size={40} color="rgba(160,205,245,0.9)" />
          </div>
        </Reveal>
      </At>
      <At x={3420} y={1500}>
        <Reveal at={T(71.86)} y={30}>
          <Chip icon="search" label="Browse" size={48} />
        </Reveal>
      </At>
      <At x={3420} y={1640}>
        <Reveal at={T(72.44)} y={30}>
          <Chip icon="shield" label="Govern" size={48} />
        </Reveal>
      </At>
      <At x={1920} y={250}>
        <KText
          text="Every catalog source produces *technical assets*"
          times={[T(68.48), T(68.86), T(69.26), T(69.68), T(70.44), T(70.86)]}
          start={0}
          size={100}
        />
      </At>
    </AbsoluteFill>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// "MCC supports well over 100 source types in all, spanning relational
//  databases, cloud storage, and BI tools alike. So most systems in your
//  environment already have a supported path in."
// ───────────────────────────────────────────────────────────────────────────
export const SourcesScene: React.FC = () => {
  const T = at('sources');
  const f = useCurrentFrame();
  const n = Math.round(100 * prog(f, T(75.8), 26, E.outQuint));
  const plus = prog(f, T(76.6), 16, E.outBack);
  const up = prog(f, T(78.0), 30, E.inOutSoft);
  const cards = [
    { icon: 'database', title: 'Relational databases', sub: 'Tables, views & schemas', t: T(78.64) },
    { icon: 'cloud', title: 'Cloud storage', sub: 'Files, folders & buckets', t: T(80.26) },
    { icon: 'chart', title: 'BI tools', sub: 'Reports & dashboards', t: T(81.34) },
  ];
  const cx = [900, 1920, 2940];
  // drifting variety icons in the background
  const bg = ['database', 'cloud', 'chart', 'warehouse', 'table', 'layers', 'database', 'cloud', 'chart', 'table', 'warehouse', 'layers'];
  return (
    <AbsoluteFill>
      <Cam keys={[{ f: 0, s: 1.06 }, { f: T(78.0), s: 1.0 }, { f: T(86.2), s: 1.02 }]}>
        {bg.map((ic, i) => {
          const a = (i / bg.length) * Math.PI * 2;
          const r = 1450 + (i % 3) * 140;
          const x = 1920 + Math.cos(a + f * 0.0018) * r;
          const y = 1080 + Math.sin(a + f * 0.0018) * r * 0.5;
          const p = prog(f, 4 + i * 2, 30, E.outCubic) * (1 - up * 0.85);
          return (
            <div key={i} style={{ position: 'absolute', left: x - 90, top: y - 90, opacity: p * 0.32, transform: `scale(${0.7 + (i % 3) * 0.15})` }}>
              <Icon name={ic} size={180} />
            </div>
          );
        })}
        {/* 100+ counter */}
        <div
          style={{
            position: 'absolute',
            left: 1920,
            top: 900 - up * 540,
            transform: `translate(-50%,-50%) scale(${1 - up * 0.48})`,
            textAlign: 'center',
          }}
        >
          <Reveal at={T(74.74)} y={30}>
            <div style={{ fontFamily: FONT, fontSize: 80, color: 'rgba(244,247,251,0.75)', fontWeight: 400 }}>MCC supports well over</div>
          </Reveal>
          <Reveal at={T(75.7)} y={60} scale={0.85}>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 520,
                lineHeight: 1.0,
                letterSpacing: '0em',
                backgroundImage: ACCENT_GRADIENT,
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                padding: '0 30px',
              }}
            >
              {n}
              <span
                style={{
                  display: 'inline-block',
                  transform: `scale(${plus})`,
                  opacity: Math.min(1, plus),
                  backgroundImage: ACCENT_GRADIENT,
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                +
              </span>
            </div>
          </Reveal>
          <Reveal at={T(76.92)} y={30}>
            <div style={{ fontFamily: FONT, fontSize: 110, color: '#fff', fontWeight: 500, letterSpacing: '-0.02em' }}>source types</div>
          </Reveal>
        </div>

        {/* category cards */}
        {cards.map((c, i) => {
          const chk = prog(f, T(85.34) + i * 4, 20, E.outBack);
          return (
            <At key={c.title} x={cx[i]} y={1330}>
              <Reveal at={c.t} y={140} scale={0.85}>
                <GlowCard w={860} h={760} radius={60}>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
                    <IconBadge icon={c.icon} size={280} />
                    <div style={{ textAlign: 'center' }}>
                      <Caption text={c.title} size={70} weight={600} />
                      <div style={{ height: 14 }} />
                      <Caption text={c.sub} size={46} color="rgba(160,205,245,0.9)" weight={400} />
                    </div>
                  </div>
                  <div style={{ position: 'absolute', right: -50, top: -50, transform: `scale(${chk})`, opacity: chk }}>
                    <Icon name="check" size={170} />
                  </div>
                </GlowCard>
              </Reveal>
            </At>
          );
        })}
      </Cam>
      <At x={1920} y={1940}>
        <KText
          text="Most systems already have *a supported path in*"
          times={[T(82.92), T(83.14), T(84.32), T(84.84), T(85.18), T(85.34), T(85.68), T(85.96)]}
          start={0}
          size={96}
        />
      </At>
    </AbsoluteFill>
  );
};
