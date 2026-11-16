import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, FONT, useT } from '../lib/constants';
import { clamp, ease, pop, ramp, window as win } from '../lib/anim';
import { KineticText } from '../components/KineticText';
import { Icon } from '../components/Icon';
import { Logo } from '../components/Logo';
import { At, Chip, FlowLine, IconTile, LineLayer } from '../components/ui';
import { World, WorldKey } from '../components/World';

const X1 = 1920;
const X2 = 6120;
const X3 = 10320;
const X4 = 14520;
const Y = 1080;

const CAM: WorldKey[] = [
  { t: 125.5, x: X1, y: Y + 60, s: 0.9 },
  { t: 126.6, x: X1, y: Y, s: 1.0 },
  { t: 130.3, x: X1, y: Y, s: 1.04 },
  { t: 131.25, x: X2, y: Y, s: 1.0 },
  { t: 134.9, x: X2, y: Y, s: 1.04 },
  { t: 135.85, x: X3, y: Y, s: 1.0 },
  { t: 140.95, x: X3, y: Y, s: 1.03 },
  { t: 141.9, x: X4, y: Y, s: 1.0 },
  { t: 148.0, x: X4, y: Y, s: 1.05 },
  { t: 148.9, x: X4, y: Y - 200, s: 1.35 },
];

const glass: React.CSSProperties = {
  background: 'linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)',
  boxShadow: '0 0 0 2px rgba(255,255,255,0.11) inset, 0 50px 120px rgba(0,0,0,0.4)',
  borderRadius: 54,
};

const Appear: React.FC<{ at: number; out?: number; children: React.ReactNode; dy?: number }> = ({ at, out, children, dy = 70 }) => {
  const t = useT();
  const p = pop(t, at, 15, 120);
  const q = out !== undefined ? ramp(t, out, 0.45, ease.inOutSoft) : 0;
  if (p <= 0.001) return null;
  return <div style={{ opacity: clamp(p * 1.3) * (1 - q), transform: `translateY(${(1 - p) * dy - q * 40}px) scale(${0.9 + 0.1 * p})` }}>{children}</div>;
};

/* -------------------- C1: ready to run its first scan -------------------- */
const SourceCard: React.FC = () => {
  const t = useT();
  const ready = ramp(t, 127.8, 0.5, ease.inOut);
  const scanPulse = t > 129.0 ? ((t - 129.0) % 1.3) / 1.3 : -1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 90 }}>
      <Appear at={125.9}>
        <div style={{ ...glass, width: 2300, height: 560, display: 'flex', alignItems: 'center', padding: '0 90px', gap: 80, boxSizing: 'border-box' }}>
          <div style={{ width: 330, height: 330, borderRadius: 80, background: 'rgba(0,114,206,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 2px rgba(0,114,206,0.4) inset' }}>
            <Icon name="bridge" size={250} at={126.0} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 92, color: C.text, letterSpacing: '-0.015em' }}>Talend_DEV_Sales_and_Revenue</div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 60, color: C.muted, marginTop: 18 }}>Catalog source · Talend Data Integration</div>
            <div style={{ display: 'flex', gap: 24, marginTop: 44 }}>
              {['Registration', 'Configuration', 'Schedule'].map((s, i) => (
                <div
                  key={s}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '14px 30px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.06)',
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: 46,
                    color: C.text,
                    opacity: ramp(t, 126.3 + i * 0.18, 0.5),
                  }}
                >
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: C.blue, boxShadow: '0 0 16px rgba(0,140,255,0.8)' }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
          {/* status pill: Saved → Ready to scan */}
          <div style={{ position: 'relative', width: 600, height: 116, alignSelf: 'flex-start', marginTop: 70, whiteSpace: 'nowrap', flexShrink: 0 }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 18,
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 52,
                color: C.text,
                background: 'rgba(255,255,255,0.08)',
                opacity: (1 - ready) * ramp(t, 126.2, 0.4),
              }}
            >
              ✓ Saved
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 52,
                color: '#fff',
                background: `linear-gradient(135deg, #1A86DE, ${C.blue})`,
                boxShadow: `0 0 ${60 * ready}px rgba(0,140,255,0.7)`,
                opacity: ready,
                transform: `scale(${0.85 + 0.15 * ready})`,
              }}
            >
              Ready to scan
            </div>
          </div>
        </div>
      </Appear>
      <Appear at={128.35}>
        <div style={{ position: 'relative' }}>
          {scanPulse >= 0 ? (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 900 + 500 * scanPulse,
                height: 190 + 160 * scanPulse,
                transform: 'translate(-50%,-50%)',
                borderRadius: 999,
                border: `6px solid rgba(124,196,250,${1 - scanPulse})`,
              }}
            />
          ) : null}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 30,
              padding: '42px 90px',
              borderRadius: 999,
              background: `linear-gradient(135deg, #1A86DE, ${C.blue})`,
              boxShadow: '0 30px 90px rgba(0,114,206,0.5)',
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 76,
              color: '#fff',
            }}
          >
            <Icon name="play" size={110} at={128.4} strokePx={7} fill="rgba(255,255,255,0.35)" />
            Run first scan
          </div>
        </div>
      </Appear>
    </div>
  );
};

/* -------------------- C2: raw details → governed metadata -------------------- */
const RawPanel: React.FC = () => {
  const t = useT();
  const rows = ['Source type', 'Export directory', 'Runtime environment', 'Filters', 'Schedule'];
  return (
    <Appear at={131.0}>
      <div style={{ ...glass, width: 1180, padding: '70px 80px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 34, marginBottom: 50 }}>
          <Icon name="server" size={120} at={131.1} strokePx={8} />
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 70, color: C.text }}>Connection details</div>
        </div>
        {rows.map((r, i) => (
          <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 30, marginTop: 30, opacity: ramp(t, 131.4 + i * 0.12, 0.4) }}>
            <div style={{ width: 430, fontFamily: FONT, fontWeight: 500, fontSize: 48, color: C.muted }}>{r}</div>
            <div style={{ flex: 1, height: 34, borderRadius: 17, background: 'rgba(255,255,255,0.12)', width: `${50 + ((i * 37) % 45)}%` }} />
          </div>
        ))}
      </div>
    </Appear>
  );
};

const TreeNode: React.FC<{ label: string; at: number; icon: 'schema' | 'table' | 'layers'; indent: number; badge?: boolean }> = ({ label, at, icon, indent, badge }) => (
  <Appear at={at} dy={40}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 26, marginLeft: indent * 90, marginTop: 26 }}>
      <Icon name={icon} size={86} at={at} strokePx={6} />
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 54, color: C.text }}>{label}</div>
      {badge ? (
        <div style={{ marginLeft: 10, padding: '6px 22px', borderRadius: 999, background: 'rgba(0,114,206,0.25)', color: C.blueSoft, fontFamily: FONT, fontWeight: 600, fontSize: 38 }}>Governed</div>
      ) : null}
    </div>
  </Appear>
);

const MetadataPanel: React.FC = () => (
  <Appear at={133.3}>
    <div style={{ ...glass, width: 1180, padding: '70px 80px', boxSizing: 'border-box', boxShadow: '0 0 0 3px rgba(0,114,206,0.6) inset, 0 0 120px rgba(0,114,206,0.35), 0 50px 120px rgba(0,0,0,0.4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 34, marginBottom: 30 }}>
        <Icon name="shield" size={120} at={133.4} strokePx={8} />
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 70, color: C.text }}>Governed metadata</div>
      </div>
      <TreeNode label="SALES_REVENUE" icon="schema" indent={0} at={133.6} badge />
      <TreeNode label="Orders" icon="table" indent={1} at={133.8} />
      <TreeNode label="Invoices" icon="table" indent={1} at={133.95} />
      <TreeNode label="Customers" icon="table" indent={1} at={134.1} />
    </div>
  </Appear>
);

/* -------------------- C4: dependency network -------------------- */
const Network: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => {
  const t = useT();
  const n = 12;
  const nodes = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? 560 : 470;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.82, at: 145.35 + i * 0.16 };
  });
  return (
    <>
      <LineLayer>
        {nodes.map((nd, i) => (
          <FlowLine key={i} d={`M ${cx} ${cy} L ${nd.x} ${nd.y}`} at={nd.at - 0.1} dur={0.45} width={6} pulses={1} pulseSpeed={0.6} color="rgba(255,255,255,0.3)" />
        ))}
      </LineLayer>
      {nodes.map((nd, i) => {
        const p = pop(t, nd.at, 13, 150);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: nd.x - 70,
              top: nd.y - 70,
              width: 140,
              height: 140,
              borderRadius: 38,
              background: 'rgba(0,114,206,0.18)',
              boxShadow: '0 0 0 3px rgba(0,114,206,0.7) inset',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: clamp(p),
              transform: `scale(${p})`,
            }}
          >
            <Icon name={i % 3 === 0 ? 'table' : i % 3 === 1 ? 'database' : 'chart'} size={92} at={nd.at} strokePx={6} />
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: cx, top: cy, transform: 'translate(-50%,-50%)' }}>
        <IconTile icon="bridge" at={144.75} size={190} />
      </div>
    </>
  );
};

/* -------------------- rising light streaks ("from the source up") -------------------- */
const Rise: React.FC<{ at: number; out: number }> = ({ at, out }) => {
  const t = useT();
  const v = win(t, at, out, 0.6, 0.6);
  if (v <= 0.001) return null;
  return (
    <>
      {Array.from({ length: 14 }, (_, i) => {
        const x = 300 + ((i * 263) % 3240);
        const speed = 0.35 + ((i * 7) % 5) * 0.08;
        const ph = ((t - at) * speed + i * 0.13) % 1;
        const y = 2300 - ph * 2700;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 8,
              height: 420,
              borderRadius: 4,
              background: 'linear-gradient(0deg, rgba(0,114,206,0) 0%, rgba(90,170,240,0.7) 100%)',
              opacity: v * 0.7,
            }}
          />
        );
      })}
    </>
  );
};

export const Conclusion: React.FC = () => {
  const t = useT();
  if (t < 125.3) return null;
  const worldFade = ramp(t, 125.5, 0.8, ease.outSoft) * (1 - ramp(t, 148.0, 0.8, ease.inOutSoft));
  const endFade = 1; // the end card holds through the last frame
  const dividerP = ramp(t, 152.2, 0.7, ease.out);
  return (
    <AbsoluteFill>
      {t < 149.2 ? (
        <World cam={CAM} opacity={worldFade}>
          {/* C1 */}
          {t < 131.6 ? (
            <At x={X1} y={Y + 200}>
              <div style={{ opacity: 1 - ramp(t, 130.3, 0.6, ease.inOutSoft) }}>
                <SourceCard />
              </div>
            </At>
          ) : null}
          {/* C2 */}
          {t > 130.2 && t < 136.2 ? (
            <div style={{ opacity: 1 - ramp(t, 134.9, 0.6, ease.inOutSoft) }}>
              <At x={X2 - 900} y={Y + 200}>
                <RawPanel />
              </At>
              <LineLayer>
                <FlowLine d={`M ${X2 - 270} ${Y + 200} L ${X2 + 270} ${Y + 200}`} at={132.55} dur={0.6} width={12} pulses={3} pulseSpeed={0.9} />
                <FlowLine d={`M ${X2 + 210} ${Y + 140} L ${X2 + 275} ${Y + 200} L ${X2 + 210} ${Y + 260}`} at={133.0} dur={0.3} width={12} pulses={0} />
              </LineLayer>
              <At x={X2} y={Y + 40}>
                <Icon name="radar" size={220} at={132.6} glow />
              </At>
              <At x={X2 + 900} y={Y + 200}>
                <MetadataPanel />
              </At>
            </div>
          ) : null}
          {/* C3 */}
          {t > 135.0 && t < 142.0 ? (
            <div style={{ opacity: 1 - ramp(t, 140.95, 0.6, ease.inOutSoft) }}>
              <At x={X3 - 1350} y={Y + 300}>
                <IconTile icon="gear" label="Careful setup" at={137.15} size={250} labelSize={68} />
              </At>
              <LineLayer>
                <FlowLine d={`M ${X3 - 1020} ${Y + 240} L ${X3 + 1650} ${Y + 240}`} at={137.6} dur={1.4} width={10} pulses={4} pulseSpeed={0.6} />
              </LineLayer>
              {Array.from({ length: 7 }, (_, i) => (
                <At key={i} x={X3 - 700 + i * 360} y={Y + 240}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Icon name="check" size={170} at={139.15 + i * 0.17} dur={0.5} glow />
                  </div>
                </At>
              ))}
              <At x={X3 + 380} y={Y + 470}>
                <div style={{ opacity: ramp(t, 139.9, 0.6), fontFamily: FONT, fontWeight: 600, fontSize: 64, color: C.muted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Every scan after</div>
              </At>
            </div>
          ) : null}
          {/* C4 */}
          {t > 141.0 ? (
            <>
              <At x={X4 - 1150} y={Y + 300}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50 }}>
                  <Chip text="Naming" icon="tag" at={142.95} size={76} />
                  <Chip text="Scope" icon="target" at={143.45} size={76} />
                  <Chip text="Easy to fix now" icon="check" at={144.15} size={76} variant="blue" />
                </div>
              </At>
              <Network cx={X4 + 820} cy={Y + 300} />
              <At x={X4 + 820} y={Y + 900}>
                <div style={{ opacity: ramp(t, 146.4, 0.6), fontFamily: FONT, fontWeight: 600, fontSize: 60, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>A dozen dependent assets later</div>
              </At>
            </>
          ) : null}
        </World>
      ) : null}

      {/* screen-space kinetic text */}
      <At x={1920} y={330}>
        <KineticText text="Once saved, this catalog source is *ready* / to run its *first scan* whenever you are." at={125.75} out={130.35} size={112} maxWidth={3500} />
      </At>
      <At x={1920} y={330}>
        <KineticText text="That's the moment raw connection details / turn into *governed metadata.*" at={130.8} out={134.95} size={112} maxWidth={3500} />
      </At>
      <At x={1920} y={1080}>
        <KineticText text="Take your time / on this *setup.*" at={135.3} out={136.95} size={190} />
      </At>
      <At x={1920} y={330}>
        <KineticText text="A little extra care here / pays off in *every scan* that runs afterward." at={137.2} out={140.95} size={112} maxWidth={3500} />
      </At>
      <At x={1920} y={330}>
        <KineticText text="Much easier to fix a *naming* or *scope* decision *now* / than after a dozen technical assets depend on it." at={141.4} out={148.0} size={104} maxWidth={3600} />
      </At>

      {/* tagline */}
      <Rise at={148.4} out={151.4} />
      <At x={1920} y={1080}>
        <KineticText text="Building *reliable data* / from the source up" at={148.5} out={150.95} size={180} lineHeight={1.12} />
      </At>

      {/* end card */}
      {t > 151.0 ? (
        <AbsoluteFill style={{ opacity: endFade }}>
          <At x={1920} y={1080}>
            <div style={{ width: 2400, height: 2400, borderRadius: '50%', background: `radial-gradient(circle, rgba(0,114,206,${0.22 * ramp(t, 151.4, 1.2)}) 0%, rgba(0,114,206,0) 65%)` }} />
          </At>
          <At x={1340} y={1080}>
            <Logo width={1120} at={151.55} />
          </At>
          <div
            style={{
              position: 'absolute',
              left: 2010,
              top: 1080 - 190 * dividerP,
              width: 5,
              height: 380 * dividerP,
              background: 'rgba(255,255,255,0.85)',
              borderRadius: 3,
            }}
          />
          <At x={2120} y={1080} anchor="left">
            <KineticText text="*Reliable data* powers / everything we do." at={152.9} size={96} weight={500} align="left" lineHeight={1.2} />
          </At>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
