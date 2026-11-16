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
import { at, atOut, s2f, sceneStart } from '../timing';
import { FONT } from '../theme';

const RolePanel: React.FC<{
  title: string;
  sub: string;
  subAt: number;
  items: { icon: string; label: string; t: number }[];
  at: number;
  outAt?: number;
}> = ({ title, sub, subAt, items, at: a, outAt }) => {
  const f = useCurrentFrame();
  return (
    <Reveal at={a} outAt={outAt} x={120} y={0} scale={0.94}>
      <GlowCard w={1240} h={150 + 130 + items.length * 150} radius={56}>
        <div style={{ position: 'absolute', left: 64, top: 52, right: 64, fontFamily: FONT, color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <Icon name="badge" size={110} />
            <div style={{ fontSize: 70, fontWeight: 600, letterSpacing: '-0.02em' }}>{title}</div>
          </div>
          <div
            style={{
              marginTop: 18,
              marginLeft: 138,
              fontSize: 50,
              color: 'rgba(160,205,245,0.95)',
              opacity: prog(f, subAt, 16),
              transform: `translateY(${(1 - prog(f, subAt, 22, E.outExpo)) * 20}px)`,
            }}
          >
            {sub}
          </div>
          <div style={{ marginTop: 34 }}>
            {items.map((it) => {
              const p = prog(f, it.t, 24, E.outExpo);
              return (
                <div
                  key={it.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 34,
                    height: 150,
                    borderTop: '2px solid rgba(255,255,255,0.1)',
                    opacity: 0.18 + 0.82 * p,
                  }}
                >
                  <div style={{ transform: `scale(${0.6 + 0.4 * p})` }}>
                    <Icon name={it.icon} size={104} />
                  </div>
                  <div
                    style={{
                      fontSize: 60,
                      fontWeight: 500,
                      transform: `translateX(${(1 - p) * 40}px)`,
                    }}
                  >
                    {it.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </GlowCard>
    </Reveal>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// "Access to MCC runs through roles assigned in Administrator, which is another
//  service in Informatica. You can explore different user roles ... The
//  Governance Administrator role ... A narrower Admin role ..."
// ───────────────────────────────────────────────────────────────────────────
export const AccessScene: React.FC = () => {
  const T = at('access');
  const O = atOut('access');
  const f = useCurrentFrame();
  const end = s2f(121.2) - sceneStart('access');
  const phaseAOut = prog(f, O(98.2), 18, E.inCubic);
  const cardIn = prog(f, O(98.2), 26, E.outQuint);
  const unlock = prog(f, T(89.5), 16, E.outBack);
  return (
    <AbsoluteFill>
      {/* Phase A: user → role → MCC */}
      <AbsoluteFill
        style={{
          opacity: 1 - phaseAOut,
          transform: `scale(${1 - phaseAOut * 0.08})`,
          filter: phaseAOut > 0 ? `blur(${phaseAOut * 20}px)` : undefined,
        }}
      >
        <Cam keys={[{ f: 0, s: 1.05 }, { f: O(98.2), s: 0.98 }]}>
          <At x={1920} y={420}>
            <KText
              text="Access to MCC runs through *roles*"
              times={[T(86.88), T(87.32), T(87.54), T(88.02), T(88.52), T(88.88)]}
              start={0}
              size={130}
            />
          </At>
          <Connector d="M 1090 1130 L 1700 1130" at={T(88.4)} dur={14} arrow pulses={2} pulseSpeed={30} />
          <Connector d="M 2140 1130 L 2740 1130" at={T(88.9)} dur={14} arrow pulses={2} pulseSpeed={30} />
          <At x={860} y={1130}>
            <Reveal at={T(86.88)} y={0} x={-100} scale={0.7}>
              <IconBadge icon="user" size={380} />
            </Reveal>
          </At>
          <At x={860} y={1420}>
            <Reveal at={T(86.88) + 6} y={20}>
              <Caption text="You" size={64} />
            </Reveal>
          </At>
          <At x={1920} y={1130}>
            <Reveal at={T(88.88)} y={0} scale={0.5}>
              <IconBadge icon="badge" size={380} glow={1.3} />
            </Reveal>
          </At>
          <At x={1920} y={1420}>
            <Reveal at={T(88.88) + 4} y={20}>
              <Caption text="Role" size={64} weight={600} />
            </Reveal>
          </At>
          <At x={1920} y={1600}>
            <Reveal at={T(89.6)} y={40}>
              <Chip icon="admin" label="Assigned in Administrator" size={58} />
            </Reveal>
          </At>
          <At x={2980} y={1130}>
            <div style={{ position: 'relative' }}>
              <Hub size={400} at={T(87.4)} label="MCC" pulse={unlock * 0.5} />
              <div style={{ position: 'absolute', right: -70, top: -70, opacity: prog(f, T(87.6), 14) }}>
                <div style={{ position: 'absolute', transform: `scale(${1 - unlock})` }}>
                  <Icon name="lock" size={170} />
                </div>
                <div style={{ position: 'absolute', transform: `scale(${unlock})` }}>
                  <Icon name="check" size={170} />
                </div>
              </div>
            </div>
          </At>
        </Cam>
      </AbsoluteFill>

      {/* Phase B: recording */}
      {f >= O(98.2) - 1 ? (
        <AbsoluteFill
          style={{
            opacity: cardIn,
            transform: `scale(${0.9 + 0.1 * cardIn})`,
            filter: cardIn < 1 ? `blur(${(1 - cardIn) * 20}px)` : undefined,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ScreenCard
            width={3360}
            clips={[
              { from: O(98.2) - 1, to: O(101.6), src: 140.0 - 0.0 },
              { from: O(101.6), to: O(104.95), src: 153.4, rate: 1.1, fade: 8 },
              { from: O(104.95), to: O(107.1), src: 157.1 },
              { from: O(107.1), to: O(108.7), src: 159.5, freeze: true },
              { from: O(108.7), to: O(109.6), src: 168.9 },
              { from: O(109.6), to: O(116.9), src: 170.5, freeze: true },
              { from: O(116.9), to: end, src: 159.5, freeze: true, fade: 12 },
            ]}
            zoom={[
              { f: 0, x: 833, y: 470, s: 1.5 },
              { f: O(101.45), x: 833, y: 470, s: 1.5 },
              { f: O(102.1), x: SRC_W / 2, y: SRC_H / 2, s: 1.0 },
              { f: O(103.5), x: SRC_W / 2, y: SRC_H / 2, s: 1.0 },
              { f: O(104.3), x: 300, y: 230, s: 2.3 },
              { f: O(106.0), x: 300, y: 230, s: 2.3 },
              { f: O(106.9), x: 900, y: 470, s: 1.12 },
              { f: O(109.7), x: 900, y: 470, s: 1.12 },
              { f: O(110.6), x: 748, y: 536, s: 1.6 },
              { f: O(116.8), x: 748, y: 536, s: 1.6 },
              { f: O(117.7), x: 748, y: 383, s: 1.6 },
            ]}
            highlights={[
              { x: 716, y: 530, w: 226, h: 63, at: O(99.3), outAt: O(101.2), label: 'Administrator', labelIcon: 'admin', labelSide: 'bottom', labelSize: 64, labelOffset: 26, dim: 0.45 },
              { x: 4, y: 169, w: 154, h: 34, at: O(104.15), outAt: O(106.1), label: 'User Roles tab', labelIcon: 'badge', labelSize: 58, labelOffset: 24, dim: 0.5 },
              { x: 228, y: 400, w: 1367, h: 37, at: O(110.3), outAt: O(116.75) },
              { x: 228, y: 247, w: 1367, h: 37, at: O(117.5) },
            ]}
            ripples={[
              { x: 826, y: 570, at: O(101.25), end: O(101.62) },
              { x: 60, y: 186, at: O(104.76) },
              { x: 977, y: 751, at: O(109.05) },
            ]}
          />
        </AbsoluteFill>
      ) : null}

      <At x={1920} y={1840}>
        <CaptionBar
          at={T(90.84)}
          outAt={O(101.5)}
          width={2400}
          text={
            <span>
              <b>Administrator</b> is another service in Informatica
            </span>
          }
        />
      </At>
      <At x={1920} y={1840}>
        <CaptionBar
          at={T(93.34)}
          outAt={T(95.9)}
          width={2400}
          text={<span>Explore user roles and their permissions</span>}
        />
      </At>

      <At x={2960} y={1420}>
        <RolePanel
          at={O(110.9)}
          outAt={O(116.7)}
          title="Governance Administrator"
          sub="Covers most day-to-day work"
          subAt={T(102.94)}
          items={[
            { icon: 'gear', label: 'Configuring catalog sources', t: T(105.04) },
            { icon: 'play', label: 'Running them', t: T(106.74) },
            { icon: 'pulse', label: 'Monitoring jobs', t: T(107.68) },
          ]}
        />
      </At>
      <At x={2960} y={1500}>
        <RolePanel
          at={O(117.6)}
          title="Admin"
          sub="A narrower role"
          subAt={T(109.26)}
          items={[
            { icon: 'upgrade', label: 'Upgrades', t: T(111.42) },
            { icon: 'gear', label: 'Configuration changes', t: T(112.08) },
          ]}
        />
      </At>
    </AbsoluteFill>
  );
};

// ───────────────────────────────────────────────────────────────────────────
// "If Metadata Command Center isn't showing up in your services list, that's
//  usually a sign your role hasn't been granted yet. Worth a quick check with
//  your org admin before assuming something's broken."
// ───────────────────────────────────────────────────────────────────────────
export const MissingScene: React.FC = () => {
  const T = at('missing');
  const f = useCurrentFrame();
  const end = s2f(132.6) - sceneStart('missing');
  const gone = prog(f, T(115.2), 18, E.inOutSoft);
  const side = prog(f, T(117.4), 34, E.inOutSoft);
  const q = prog(f, T(115.5), 20, E.outBack);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 1920 - side * 860,
          top: 1080 - side * 60,
          transform: `translate(-50%,-50%) scale(${1 - side * 0.48})`,
        }}
      >
        <ScreenCard
          width={3360}
          clips={[{ from: 0, to: end, src: 194.2, freeze: true }]}
          zoom={[
            { f: 0, x: 833, y: 414, s: 1.25 },
            { f: T(113.6), x: 833, y: 414, s: 1.25 },
            { f: T(114.6), x: 700, y: 470, s: 1.6 },
          ]}
          overlays={(s, k) => (
            <div
              style={{
                position: 'absolute',
                left: 470 * k,
                top: 512 * k,
                width: 236 * k,
                height: 69 * k,
                background: '#fff',
                opacity: gone,
                borderRadius: 4 * k,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 6 * k,
                  border: `${4 / s}px dashed rgba(0,114,206,0.75)`,
                  borderRadius: 6 * k,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 34 * k,
                  color: '#0072CE',
                }}
              >
                <span style={{ transform: `scale(${q})`, display: 'inline-block' }}>?</span>
              </div>
            </div>
          )}
          highlights={[
            { x: 470, y: 512, w: 236, h: 69, at: T(113.94), outAt: T(115.15), label: 'Metadata Command Center', labelSide: 'left', labelSize: 60, dim: 0.45 },
            { x: 470, y: 512, w: 236, h: 69, at: T(115.3), label: 'Not showing up?', labelIcon: 'question', labelSide: 'left', labelSize: 64, dim: 0.45 },
          ]}
        />
      </div>

      {/* role not granted */}
      <At x={2830} y={720}>
        <Reveal at={T(117.56)} x={140} y={0} scale={0.92}>
          <GlowCard w={1280} h={560} radius={56}>
            <div style={{ position: 'absolute', left: 64, top: 60, right: 64, fontFamily: FONT, color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
                <Icon name="badge" size={150} />
                <div>
                  <div style={{ fontSize: 48, color: 'rgba(160,205,245,0.95)' }}>Your role</div>
                  <div style={{ fontSize: 74, fontWeight: 600, letterSpacing: '-0.02em' }}>MCC access</div>
                </div>
              </div>
              <div
                style={{
                  marginTop: 60,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 24,
                  padding: '22px 44px 22px 26px',
                  borderRadius: 60,
                  background: 'rgba(0,114,206,0.25)',
                  border: '4px solid rgba(111,181,242,0.9)',
                  fontSize: 58,
                  fontWeight: 600,
                  opacity: prog(f, T(118.94), 14),
                  transform: `scale(${0.7 + 0.3 * prog(f, T(118.94), 24, E.outBack)})`,
                  transformOrigin: '0 50%',
                }}
              >
                <Icon name="hourglass" size={92} />
                Not granted yet
              </div>
            </div>
          </GlowCard>
        </Reveal>
      </At>

      {/* quick check with org admin */}
      <Connector d="M 2420 1470 L 3200 1470" at={T(120.78)} dur={16} arrow pulses={2} pulseSpeed={28} />
      <At x={2280} y={1470}>
        <Reveal at={T(120.36)} y={0} x={-60} scale={0.6}>
          <IconBadge icon="user" size={250} />
        </Reveal>
      </At>
      <At x={2810} y={1350}>
        <Reveal at={T(120.94)} y={30} scale={0.6}>
          <Icon name="chat" size={170} />
        </Reveal>
      </At>
      <At x={3380} y={1470}>
        <Reveal at={T(121.48)} y={0} x={60} scale={0.6}>
          <IconBadge icon="admin" size={250} glow={1.2} />
        </Reveal>
      </At>
      <At x={3380} y={1660}>
        <Reveal at={T(121.6)} y={20}>
          <Caption text="Org admin" size={54} weight={600} />
        </Reveal>
      </At>
      <At x={2830} y={1870}>
        <Reveal at={T(122.0)} y={30}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, fontFamily: FONT, fontSize: 56, color: 'rgba(244,247,251,0.75)' }}>
            <div style={{ position: 'relative' }}>
              <Icon name="wrench" size={96} />
              <svg width={96} height={96} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                <line x1={0} y1={96} x2={96 * prog(f, T(122.86), 12)} y2={96 - 96 * prog(f, T(122.86), 12)} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
              </svg>
            </div>
            Check first — before assuming it's broken
          </div>
        </Reveal>
      </At>
    </AbsoluteFill>
  );
};
