import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Icon} from '../components/Icons';
import {Logo} from '../components/Logo';
import {Chip, IconRing, KText, Panel} from '../components/UI';
import {env, keys, pop, rand, tween} from '../lib/anim';
import {C, E, FONT} from '../lib/theme';
import {VF, f} from '../lib/time';

const Abs: React.FC<{x: number; y: number; children: React.ReactNode; style?: React.CSSProperties; center?: boolean}> = ({x, y, children, style, center = true}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: center ? 'translate(-50%,-50%)' : undefined, ...style}}>{children}</div>
);

/** Word-timed text helper: pass VO times for each word (seconds, original VO clock). */
const vt = (ts: number[]) => ts.map((t) => VF(t));

/* =============================================================== logo sting */
const Sting: React.FC = () => {
  const fr = useCurrentFrame();
  if (fr > 90) return null;
  const out = tween(fr, 62, 86, 0, 1, E.in);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: 1 - out}}>
      <div style={{transform: `scale(${1 + 0.04 * tween(fr, 0, 100, 0, 1, E.soft) - 0.08 * out})`, filter: out > 0.01 ? `blur(${out * 8}px)` : undefined}}>
        <Logo start={4} width={600} />
      </div>
    </AbsoluteFill>
  );
};

/* =============================================================== I1: overview */
const I1_A = f(3.0);
const I1_B = VF(8.7);
const Overview: React.FC = () => {
  const fr = useCurrentFrame();
  if (fr < I1_A - 4 || fr > I1_B + 18) return null;
  const up = tween(fr, VF(2.2), VF(2.9), 0, 1, E.inOut);
  const out = tween(fr, I1_B, I1_B + 16, 0, 1, E.in);
  const camX = -out * 140;
  const ringA = VF(2.96);
  const ringB = VF(4.84);
  const chip1 = VF(6.38);
  const chip2 = VF(7.84);
  const branch = tween(fr, chip1 - 10, chip1 + 6, 0, 1, E.inOut);
  const branch2 = tween(fr, chip2 - 10, chip2 + 6, 0, 1, E.inOut);
  return (
    <AbsoluteFill style={{transform: `translateX(${camX}px) scale(${1 + out * 0.06})`, opacity: 1 - out, filter: out > 0.01 ? `blur(${out * 6}px)` : undefined}}>
      <Abs x={960} y={540 - 330 * up}>
        <div style={{transform: `scale(${1 - 0.28 * up})`}}>
          <KText text="In this *walkthrough*" times={vt([0, 0.2, 0.42])} size={96} weight={700} />
        </div>
      </Abs>
      {/* topic A */}
      <Abs x={560} y={500}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <IconRing name="clipboardCheck" start={ringA} size={240} />
          <KText text="Initial asset / *health check*" start={VF(3.0)} stagger={3} size={44} style={{marginTop: 28}} />
        </div>
      </Abs>
      {/* plus */}
      <Abs x={960} y={420}>
        <div style={{opacity: tween(fr, VF(4.3), VF(4.6)), transform: `scale(${pop(fr, VF(4.3))}) rotate(${(1 - pop(fr, VF(4.3))) * 90}deg)`, color: C.blueLight, fontFamily: FONT, fontSize: 80, fontWeight: 300}}>+</div>
      </Abs>
      {/* topic B */}
      <Abs x={1360} y={500}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <IconRing name="users" start={ringB} size={240} />
          <KText text="Assign accountable / *stakeholders*" start={VF(4.95)} stagger={3} size={44} style={{marginTop: 28}} />
        </div>
      </Abs>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <path d="M1360 742 V780 Q1360 800 1340 800 H1210 Q1190 800 1190 820 V850" fill="none" stroke={C.blueLight} strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - branch} opacity={0.85} />
        <path d="M1360 742 V780 Q1360 800 1380 800 H1510 Q1530 800 1530 820 V850" fill="none" stroke={C.blueLight} strokeWidth={3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - branch2} opacity={0.85} />
      </svg>
      <Abs x={1190} y={900}>
        <Chip label="Individually" icon="user" start={chip1} variant="white" size={30} />
      </Abs>
      <Abs x={1530} y={900}>
        <Chip label="At scale" icon="layers" start={chip2} variant="blue" size={30} />
      </Abs>
    </AbsoluteFill>
  );
};

/* =============================================================== I2: the question */
const I2_A = VF(9.3);
const I2_B = VF(18.8);
const Question: React.FC = () => {
  const fr = useCurrentFrame();
  if (fr < I2_A - 2 || fr > I2_B + 16) return null;
  const inP = tween(fr, I2_A, I2_A + 20, 0, 1, E.out);
  const out = tween(fr, I2_B, I2_B + 14, 0, 1, E.in);
  const scanStart = VF(9.74);
  const land = VF(10.82);
  // floating scanned table
  const drop = tween(fr, scanStart - 6, scanStart + 10, 0, 1, E.out);
  const scanLine = ((fr - scanStart) / 18) % 1;
  const toSlot = tween(fr, land - 8, land + 8, 0, 1, E.inOut);
  const tx = 600 + (299 - 600) * toSlot;
  const ty = 210 + (502 - 210) * toSlot;
  const ts = 1 - 0.62 * toSlot;
  const flyFade = 1 - tween(fr, land + 2, land + 10);
  const analyst = VF(12.52);
  const qAt = VF(15.36);
  const link = tween(fr, VF(16.2), VF(17.2), 0, 1, E.inOut);
  return (
    <AbsoluteFill style={{opacity: inP * (1 - out), transform: `translateX(${(1 - inP) * 140 - out * 140}px) scale(${0.96 + 0.04 * inP + 0.05 * out})`, filter: out > 0.01 ? `blur(${out * 6}px)` : undefined}}>
      {/* catalog panel */}
      <div style={{position: 'absolute', left: 220, top: 330, transform: `translateY(${(1 - inP) * 30}px)`}}>
        <Panel glow style={{width: 760, height: 470, padding: 34}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <Icon name="catalog" size={56} strokePx={3.4} progress={tween(fr, I2_A, I2_A + 24)} />
            <div style={{fontFamily: FONT, fontSize: 34, fontWeight: 600, color: C.text}}>Data Catalog</div>
          </div>
          <div style={{height: 1.5, background: 'rgba(255,255,255,0.12)', margin: '24px 0 18px'}} />
          {[0, 1, 2, 3].map((r) => {
            const isNew = r === 0;
            const rowIn = isNew ? tween(fr, land, land + 10) : tween(fr, I2_A + 6 + r * 3, I2_A + 18 + r * 3);
            return (
              <div key={r} style={{display: 'flex', alignItems: 'center', gap: 22, height: 74, borderRadius: 16, padding: '0 16px', background: isNew ? `rgba(0,114,206,${0.18 * rowIn})` : 'transparent', border: isNew ? `1.5px solid rgba(90,169,234,${0.6 * rowIn})` : '1.5px solid transparent', marginBottom: 8, opacity: isNew ? 1 : rowIn}}>
                <div style={{width: 58, height: 58, transform: isNew ? `scale(${pop(fr, land + 2, 10, 0.6, 160)})` : undefined}}>
                  <Icon name="table" size={58} strokePx={2.8} progress={isNew ? tween(fr, land + 2, land + 12) : rowIn} />
                </div>
                <div style={{flex: 1}}>
                  <div style={{height: 14, width: `${[62, 48, 70, 55][r]}%`, borderRadius: 7, background: isNew ? `rgba(255,255,255,${0.75 * rowIn})` : 'rgba(255,255,255,0.22)'}} />
                  <div style={{height: 10, width: `${[38, 30, 44, 34][r]}%`, borderRadius: 5, background: 'rgba(255,255,255,0.12)', marginTop: 10}} />
                </div>
                {isNew ? <Chip label="New" start={land + 6} variant="blue" size={20} /> : null}
              </div>
            );
          })}
        </Panel>
      </div>
      {/* scanned table flying in */}
      {fr >= scanStart - 6 ? (
        <div style={{position: 'absolute', left: tx - 90, top: ty - 90 - (1 - drop) * 160, width: 180, height: 180, opacity: drop * flyFade, transform: `scale(${ts})`}}>
          <Icon name="scan" size={180} progress={tween(fr, scanStart - 4, scanStart + 18)} />
          {toSlot < 0.6 ? <div style={{position: 'absolute', left: 4, right: 4, top: 20 + 140 * scanLine, height: 3, background: C.blueLight, boxShadow: `0 0 18px ${C.blue}`, opacity: 1 - toSlot * 1.6}} /> : null}
        </div>
      ) : null}
      <Abs x={600} y={95}>
        <KText text="A newly scanned *table* lands in the catalog" times={vt([9.6, 9.74, 10.04, 10.36, 10.82, 11.18, 11.4, 11.54])} size={42} weight={500} color={C.muted} />
      </Abs>
      {/* link from analyst to the new row */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <path d="M1300 520 C1180 520 1120 440 1000 440" fill="none" stroke={C.blueLight} strokeWidth={3} strokeDasharray="8 9" strokeDashoffset={-fr * 0.9} opacity={link} />
        <circle cx={1000} cy={440} r={7} fill={C.blue} opacity={link} />
      </svg>
      {/* analyst */}
      <Abs x={1450} y={520}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <IconRing name="analyst" start={analyst} size={250} />
          <KText text="Analyst" start={VF(12.64)} size={38} style={{marginTop: 20}} />
          <div style={{marginTop: 16}}>
            <Chip label="Executive presentation" icon="chartDown" start={VF(13.84)} size={24} />
          </div>
        </div>
      </Abs>
      <Abs x={1640} y={300}>
        <div style={{transform: `scale(${pop(fr, qAt, 9, 0.7, 160)}) rotate(${Math.sin((fr - qAt) / 5) * 4 * Math.max(0, 1 - (fr - qAt) / 60)}deg)`, opacity: tween(fr, qAt, qAt + 6)}}>
          <Icon name="question" size={140} progress={tween(fr, qAt, qAt + 20)} />
        </div>
      </Abs>
      <Abs x={1640} y={186}>
        <Chip label="Urgent question" start={VF(15.6)} variant="white" size={22} />
      </Abs>
      <Abs x={960} y={930}>
        <KText text="Who do they *reach out to?*" times={vt([17.52, 17.64, 17.76, 17.92, 18.08, 18.3])} size={70} weight={700} />
      </Abs>
    </AbsoluteFill>
  );
};

/* =============================================================== I3: nobody knows -> bottleneck */
const I3_A = VF(19.3);
const I3_B = VF(28.1);
const PAN = VF(23.95);
const Nobody: React.FC = () => {
  const fr = useCurrentFrame();
  if (fr < I3_A - 2 || fr > I3_B + 18) return null;
  const inP = tween(fr, I3_A, I3_A + 20, 0, 1, E.out);
  const out = tween(fr, I3_B, I3_B + 16, 0, 1, E.in);
  const camX = keys(fr, [[PAN, 0], [PAN + 30, -1920]]);
  const unassigned = VF(20.6);
  const nobody = VF(22.58);
  const bottleneck = VF(25.0);
  const slow = VF(26.38);
  // funnel particles
  const parts = Array.from({length: 46}).map((_, i) => {
    const seed = i * 7.13;
    const start = bottleneck - 18 + i * 2.2;
    const t = Math.max(0, fr - start);
    const lane = rand(seed) * 2 - 1;
    // y progress: fall then jam near the neck
    const jamRow = Math.floor(i / 7);
    const passes = i % 9 === 0;
    const yFree = 300 + t * 7.5;
    const neckY = 560;
    const jamY = neckY - 34 - jamRow * 30;
    let y = yFree;
    let x = 560 + lane * Math.max(26, 230 - (yFree - 300) * 0.75);
    if (!passes && yFree > jamY) {
      y = jamY;
      x = 560 + ((i % 7) - 3) * 40 * Math.min(1, 0.4 + jamRow * 0.25);
    }
    if (passes && yFree > neckY) x = 560 + lane * 10;
    let op = t > 0 ? Math.min(1, t / 6) : 0;
    if (passes) op *= 1 - Math.min(1, Math.max(0, (yFree - neckY - 20) / 60));
    return {x, y: Math.min(y, 900), op, passes};
  });
  const needle = tween(fr, slow, slow + 40, 0, 1, E.inOut);
  const needleAng = -20 - 130 * needle; // degrees from right
  return (
    <AbsoluteFill style={{opacity: inP * (1 - out), transform: `scale(${0.96 + 0.04 * inP + 0.05 * out})`, filter: out > 0.01 ? `blur(${out * 6}px)` : undefined}}>
      <AbsoluteFill style={{transform: `translateX(${camX}px)`}}>
        {/* --- beat A: unassigned asset */}
        <div style={{position: 'absolute', left: 170, top: 270, transform: `translateY(${(1 - inP) * 40}px)`}}>
          <Panel glow style={{width: 780, padding: '40px 44px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
              <Icon name="table" size={84} progress={tween(fr, I3_A + 4, I3_A + 28)} />
              <div>
                <div style={{fontFamily: FONT, fontSize: 38, fontWeight: 600, color: C.text}}>Newly scanned table</div>
                <div style={{fontFamily: FONT, fontSize: 24, color: C.muted, marginTop: 4}}>Technical asset · Data Catalog</div>
              </div>
            </div>
            <div style={{height: 1.5, background: 'rgba(255,255,255,0.12)', margin: '30px 0 24px'}} />
            {['Data Owner', 'Data Steward'].map((r, i) => {
              const shake = fr > unassigned && fr < unassigned + 24 ? Math.sin((fr - unassigned) * 1.6 + i) * 5 * (1 - (fr - unassigned) / 24) : 0;
              return (
                <div key={r} style={{display: 'flex', alignItems: 'center', gap: 22, marginBottom: 18}}>
                  <div style={{width: 70, height: 70, borderRadius: '50%', border: '2.5px dashed rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `translateX(${shake}px)`, fontFamily: FONT, color: C.blueLight, fontSize: 34, fontWeight: 600}}>
                    {fr > unassigned ? '?' : ''}
                  </div>
                  <div style={{fontFamily: FONT, fontSize: 30, color: C.text, width: 220}}>{r}</div>
                  <div style={{fontFamily: FONT, fontSize: 30, color: C.muted}}>—</div>
                </div>
              );
            })}
          </Panel>
          <div style={{position: 'absolute', right: -30, top: -26}}>
            <Chip label="Unassigned" start={unassigned} variant="white" size={26} />
          </div>
        </div>
        <Abs x={1420} y={440}>
          <KText text="If no one is assigned…" times={vt([19.62, 20.34, 20.58, 20.7, 20.84])} size={44} weight={500} color={C.muted} />
        </Abs>
        <Abs x={1420} y={540}>
          <KText text="*Nobody knows.*" times={vt([22.58, 23.26])} size={104} weight={700} />
        </Abs>
        {[0, 1, 2, 3].map((i) => {
          const at = nobody + 4 + i * 4;
          const s = pop(fr, at, 10, 0.6, 150);
          const fl = Math.sin((fr - at) / 14 + i) * 8;
          return (
            <Abs key={i} x={[1110, 1740, 1170, 1690][i]} y={[330 + fl, 350 - fl, 690 - fl, 680 + fl][i]}>
              <div style={{fontFamily: FONT, fontSize: [70, 54, 46, 64][i], fontWeight: 700, color: i % 2 ? C.blueLight : 'rgba(255,255,255,0.5)', transform: `scale(${s}) rotate(${[-12, 10, 8, -6][i]}deg)`, opacity: s}}>?</div>
            </Abs>
          );
        })}
        {/* --- beat B: bottleneck & slower decisions (world x + 1920) */}
        <div style={{position: 'absolute', left: 1920, top: 0, width: 1920, height: 1080}}>
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            <path d="M300 260 H820 L600 540 V600 H520 V540 Z" fill="rgba(0,114,206,0.10)" stroke={C.white} strokeWidth={4} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - tween(fr, PAN + 6, PAN + 30)} />
            {parts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={11} fill={p.passes ? C.white : C.blue} opacity={p.op} />
            ))}
          </svg>
          <Abs x={560} y={760}>
            <Chip label="Requests pile up" icon="hourglass" start={VF(25.2)} size={30} />
          </Abs>
          {/* gauge */}
          <div style={{position: 'absolute', left: 1080, top: 250, width: 560, height: 380}}>
            <svg width={560} height={380} style={{overflow: 'visible'}}>
              <path d="M40 330 A240 240 0 0 1 520 330" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={26} strokeLinecap="round" />
              <path d="M40 330 A240 240 0 0 1 520 330" fill="none" stroke={C.blue} strokeWidth={26} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - (0.95 - 0.75 * needle) * tween(fr, PAN + 10, PAN + 34)} />
              {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                const a = Math.PI - (Math.PI * i) / 6;
                return <line key={i} x1={280 + Math.cos(a) * 200} y1={330 - Math.sin(a) * 200} x2={280 + Math.cos(a) * 178} y2={330 - Math.sin(a) * 178} stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.7} />;
              })}
              <g transform={`translate(280 330) rotate(${needleAng})`} opacity={tween(fr, PAN + 10, PAN + 24)}>
                <line x1={0} y1={0} x2={190} y2={0} stroke="#fff" strokeWidth={8} strokeLinecap="round" />
              </g>
              <circle cx={280} cy={330} r={22} fill={C.bg} stroke="#fff" strokeWidth={5} />
              <circle cx={280} cy={330} r={9} fill={C.blue} />
            </svg>
          </div>
          <Abs x={1360} y={760}>
            <Chip label="Decisions slow down" icon="chartDown" start={VF(26.6)} variant="blue" size={30} />
          </Abs>
          <Abs x={960} y={150}>
            <KText text="Creating an *immediate bottleneck*" times={vt([24.32, 24.72, 25.0, 25.52])} size={52} weight={600} exit={VF(25.6)} />
          </Abs>
          <Abs x={960} y={150}>
            <KText text="…and slowing down *business decisions*" times={vt([26.0, 26.38, 26.74, 27.1, 27.46])} size={52} weight={600} />
          </Abs>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* =============================================================== I4: what is a technical asset */
const I4_A = VF(28.65);
const I4_B = VF(39.7);
const NODES = [
  {x: 330, icon: 'mcc', label: 'Metadata / Command Center', at: VF(33.64)},
  {x: 800, icon: 'schema', label: 'Database / schema', at: VF(35.9)},
  {x: 1190, icon: 'table', label: 'Table', at: VF(37.04)},
  {x: 1580, icon: 'column', label: 'Individual / column', at: VF(37.94)},
];
const NODE_Y = 690;
const TechAsset: React.FC = () => {
  const fr = useCurrentFrame();
  if (fr < I4_A - 2 || fr > I4_B + 2) return null;
  const inP = tween(fr, I4_A, I4_A + 18, 0, 1, E.out);
  const labelsOut = tween(fr, I4_B - 16, I4_B - 2, 0, 1, E.in);
  return (
    <AbsoluteFill style={{opacity: inP}}>
      <div style={{opacity: 1 - tween(fr, I4_B - 14, I4_B, 0, 1, E.in)}}>
        <Abs x={960} y={140}>
          <Chip label="Remember" icon="bulb" start={VF(29.0)} variant="blue" size={26} />
        </Abs>
        <Abs x={960} y={262}>
          <KText text="A *technical asset* is any structural component" times={vt([30.08, 30.18, 30.52, 31.02, 31.26, 31.64, 32.1])} size={64} weight={700} />
        </Abs>
        <Abs x={960} y={350}>
          <KText text="extracted by *Metadata Command Center*" times={vt([32.7, 33.28, 33.64, 34.08, 34.48])} size={44} weight={500} color={C.muted} />
        </Abs>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        {NODES.slice(0, -1).map((n, i) => {
          const nx = NODES[i + 1];
          const a = nx.at - 14;
          const p = tween(fr, a, a + 14, 0, 1, E.inOut);
          const x1 = n.x + 92;
          const x2 = nx.x - 92;
          return (
            <g key={i} opacity={1 - labelsOut}>
              <line x1={x1} y1={NODE_Y} x2={x1 + (x2 - x1) * p} y2={NODE_Y} stroke={i === 0 ? C.blueLight : 'rgba(255,255,255,0.55)'} strokeWidth={3} strokeDasharray={i === 0 ? '8 9' : undefined} strokeDashoffset={-fr} />
              {p > 0.95 ? <path d={`M${x2 - 14} ${NODE_Y - 10} L${x2 - 2} ${NODE_Y} L${x2 - 14} ${NODE_Y + 10}`} fill="none" stroke={C.blueLight} strokeWidth={3} strokeLinecap="round" /> : null}
              {i === 0 && p > 0
                ? [0, 1, 2].map((k) => {
                    const q = ((fr - a) / 26 + k / 3) % 1;
                    return <circle key={k} cx={x1 + (x2 - x1) * q} cy={NODE_Y} r={6} fill={C.blueLight} opacity={p * Math.sin(q * Math.PI)} />;
                  })
                : null}
            </g>
          );
        })}
      </svg>
      {NODES.map((n, i) => (
        <Abs key={i} x={n.x} y={NODE_Y}>
          <IconRing name={n.icon} start={n.at} size={i === 0 ? 190 : 170} filled={i === 0} />
        </Abs>
      ))}
      {NODES.map((n, i) => (
        <Abs key={'l' + i} x={n.x} y={NODE_Y + 150}>
          <div style={{opacity: 1 - labelsOut}}>
            <KText text={n.label} start={n.at + 4} stagger={2} size={32} weight={500} />
          </div>
        </Abs>
      ))}
      <Abs x={1190} y={NODE_Y - 160}>
        <div style={{opacity: 1 - labelsOut}}>
          <Chip label="Technical assets" start={VF(37.2)} size={22} />
        </div>
      </Abs>
    </AbsoluteFill>
  );
};

/* =============================================================== I5: catalog -> governed */
const I5_A = I4_B;
const I5_B = f(54.0) + 4;
const ORBIT = [
  {icon: 'schema', a: -158},
  {icon: 'table', a: -90},
  {icon: 'column', a: -22},
];
const CatalogGov: React.FC = () => {
  const fr = useCurrentFrame();
  if (fr < I5_A || fr > I5_B + 16) return null;
  const hub = VF(40.7);
  const review = VF(43.18);
  const own = VF(44.54);
  const beatB = VF(45.45);
  const collapse = tween(fr, beatB, beatB + 20, 0, 1, E.inOut);
  const out = tween(fr, I5_B - 18, I5_B + 4, 0, 1, E.in);
  const R = 250;
  const cx = 960;
  const cy = 500;
  // magnifier sweep
  const sweep = tween(fr, review, review + 34, 0, 1, E.inOut);
  const magA = (-185 + 190 * sweep) * (Math.PI / 180);
  const raw = VF(46.46);
  const arrow = tween(fr, VF(47.6), VF(48.3), 0, 1, E.inOut);
  const gov = VF(48.3);
  return (
    <AbsoluteFill style={{opacity: 1 - out, transform: `scale(${1 + out * 0.08})`}}>
      {/* beat A */}
      <AbsoluteFill style={{opacity: 1 - collapse, transform: `scale(${1 - 0.25 * collapse})`}}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(90,169,234,0.25)" strokeWidth={2} strokeDasharray="6 10" strokeDashoffset={fr * 0.4} opacity={tween(fr, hub, hub + 20)} />
        </svg>
        <Abs x={cx} y={cy}>
          <IconRing name="catalog" start={hub} size={250} filled />
        </Abs>
        <Abs x={cx} y={cy + 196}>
          <KText text="Dominion’s *Data Catalog*" times={vt([41.38, 41.92, 42.08])} size={40} />
        </Abs>
        {ORBIT.map((o, i) => {
          const startX = NODES[i + 1].x;
          const p = tween(fr, I5_A + i * 3, I5_A + 30 + i * 3, 0, 1, E.inOut);
          const rad = (o.a * Math.PI) / 180;
          const ex = cx + Math.cos(rad) * R;
          const ey = cy + Math.sin(rad) * R;
          const x = startX + (ex - startX) * p;
          const y = NODE_Y + (ey - NODE_Y) * p;
          const sz = 170 + (120 - 170) * p;
          const badge = pop(fr, own + 4 + i * 4, 11, 0.6, 150);
          return (
            <div key={i} style={{position: 'absolute', left: x - sz / 2, top: y - sz / 2, width: sz, height: sz}}>
              <IconRing name={o.icon} start={-100} size={sz} />
              <div style={{position: 'absolute', right: -14, bottom: -6, width: 56, height: 56, borderRadius: '50%', background: C.blue, border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${badge})`, boxShadow: '0 0 18px rgba(0,114,206,0.8)'}}>
                <Icon name="user" size={34} strokePx={2.4} />
              </div>
            </div>
          );
        })}
        {fr >= review - 2 ? (
          <div style={{position: 'absolute', left: cx + Math.cos(magA) * R - 70, top: cy + Math.sin(magA) * R - 70, opacity: env(fr, review - 2, review + 46, 8, 10)}}>
            <Icon name="magnifier" size={140} />
          </div>
        ) : null}
        <Abs x={500} y={560}>
          <Chip label="Review" icon="magnifier" start={review} size={30} />
        </Abs>
        <Abs x={1440} y={560}>
          <Chip label="Clear ownership" icon="user" start={own} variant="blue" size={30} />
        </Abs>
      </AbsoluteFill>
      {/* beat B: raw -> governed */}
      {fr >= beatB ? (
        <AbsoluteFill>
          <div style={{position: 'absolute', left: 250, top: 290, width: 500, height: 360}}>
            <svg width={500} height={360} style={{overflow: 'visible'}}>
              {[
                [190, 10, 120, 70],
                [40, 150, 120, 70],
                [190, 150, 120, 70],
                [340, 150, 120, 70],
                [40, 280, 120, 70],
                [340, 280, 120, 70],
              ].map((r, i) => {
                const p = tween(fr, raw - 10 + i * 2, raw + 8 + i * 2);
                return <rect key={i} x={r[0]} y={r[1]} width={r[2]} height={r[3]} rx={12} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={3} strokeDasharray="10 9" opacity={p} />;
              })}
              <path d="M250 80 V115 M100 150 V115 H400 V150 M100 220 V280 M400 220 V280" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={3} strokeDasharray="6 8" opacity={tween(fr, raw, raw + 14)} />
            </svg>
          </div>
          <Abs x={500} y={720}>
            <KText text="Raw database / architecture" times={vt([46.46, 46.9, 47.36])} size={40} weight={500} color={C.muted} />
          </Abs>
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            <path d="M820 470 H1090" fill="none" stroke={C.blueLight} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - arrow} />
            {arrow > 0.9 ? <path d="M1070 452 L1092 470 L1070 488" fill="none" stroke={C.blueLight} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /> : null}
            {[0, 1, 2, 3].map((k) => {
              const q = ((fr - VF(47.6)) / 22 + k / 4) % 1;
              return arrow > 0.3 ? <circle key={k} cx={830 + 250 * q} cy={470} r={5} fill="#fff" opacity={Math.sin(q * Math.PI) * 0.9} /> : null;
            })}
          </svg>
          <Abs x={1400} y={470}>
            <IconRing name="shieldCheck" start={gov - 4} size={300} filled />
          </Abs>
          <Abs x={1400} y={720}>
            <KText text="Governed, trusted / *enterprise assets*" times={vt([48.56, 49.3, 49.76, 50.34])} size={46} weight={700} />
          </Abs>
          <Abs x={960} y={150}>
            <KText text="Ownership *transforms* the catalog" start={VF(45.58)} stagger={3} size={44} weight={500} color={C.muted} />
          </Abs>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

export const Intro: React.FC = () => (
  <>
    <Sting />
    <Overview />
    <Question />
    <Nobody />
    <TechAsset />
    <CatalogGov />
  </>
);
