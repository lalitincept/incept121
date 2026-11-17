import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Icon} from '../components/Icons';
import {Logo} from '../components/Logo';
import {Chip, IconRing, KText, Panel} from '../components/UI';
import {pop, tween} from '../lib/anim';
import {C, E, FONT} from '../lib/theme';
import {TL, VF, shotById} from '../lib/time';

const W3 = shotById('W3');
const vt = (ts: number[]) => ts.map((t) => VF(t));
const Abs: React.FC<{x: number; y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', ...style}}>{children}</div>
);

/* =============================================================== beat 1+2: dead end -> conversation */
const C1_A = W3.to + 6;
const C1_B = VF(164.15);
const DeadEnd: React.FC = () => {
  const fr = useCurrentFrame();
  if (fr < C1_A - 2 || fr > C1_B + 22) return null;
  const inP = tween(fr, C1_A, C1_A + 20, 0, 1, E.out);
  const out = tween(fr, C1_B, C1_B + 12, 0, 1, E.in);
  const asset = Math.min(VF(157.05), W3.to + 16);
  const deadEnd = VF(159.13);
  const anyone = VF(159.87);
  const question = VF(160.67);
  const assign = VF(162.05);
  const moving = VF(163.21);
  const pathP = tween(fr, anyone - 4, anyone + 18, 0, 1, E.inOut);
  const lift = tween(fr, assign + 4, assign + 24, 0, 1, E.inOut);
  const solid = tween(fr, assign + 10, assign + 26);
  const y = 560;
  const xL = 470;
  const xR = 1450;
  const swap = tween(fr, assign, assign + 10);
  return (
    <AbsoluteFill style={{opacity: inP * (1 - out), transform: `translateY(${-out * 60}px) scale(${1 - out * 0.05})`}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <line x1={xL} y1={y} x2={xL + (xR - xL) * pathP} y2={y} stroke="rgba(255,255,255,0.4)" strokeWidth={4} strokeDasharray="10 12" strokeLinecap="round" />
        {solid > 0.01 ? <line x1={xL} y1={y} x2={xL + (xR - xL) * solid} y2={y} stroke={C.blue} strokeWidth={6} strokeLinecap="round" /> : null}
        {/* flowing conversation dots */}
        {solid > 0.5
          ? [0, 1, 2, 3, 4].map((k) => {
              const q = ((fr - assign) / 40 + k / 5) % 1;
              const dir = k % 2 === 0;
              const x = dir ? xL + (xR - xL) * q : xR - (xR - xL) * q;
              return <circle key={k} cx={x} cy={y + (dir ? -0 : 0)} r={9} fill={dir ? '#fff' : C.blueSoft} opacity={Math.sin(q * Math.PI)} />;
            })
          : null}
      </svg>
      {/* person with a question */}
      <Abs x={xL - 140} y={y}>
        <IconRing name="user" start={anyone - 2} size={210} />
      </Abs>
      <Abs x={xL - 30} y={y - 170}>
        <div style={{transform: `scale(${pop(fr, question, 10, 0.6, 150) * (1 - lift * 0.0)})`, opacity: tween(fr, question, question + 6) * (1 - tween(fr, moving + 20, moving + 30))}}>
          <Icon name="question" size={110} progress={tween(fr, question, question + 18)} />
        </div>
      </Abs>
      <Abs x={xL - 30} y={y - 170}>
        <div style={{transform: `scale(${pop(fr, moving + 22, 10, 0.6, 150)})`, opacity: tween(fr, moving + 22, moving + 28)}}>
          <Icon name="chat" size={120} progress={tween(fr, moving + 22, moving + 40)} />
        </div>
      </Abs>
      {/* asset */}
      <Abs x={xR + 130} y={y}>
        <div style={{position: 'relative'}}>
          <div style={{opacity: 1 - swap}}>
            <IconRing name="tableQuestion" start={asset} size={230} />
          </div>
          <div style={{position: 'absolute', inset: 0, opacity: swap}}>
            <IconRing name="tableUser" start={assign - 2} size={230} filled />
          </div>
        </div>
      </Abs>
      <Abs x={xR + 130} y={y + 170}>
        <div style={{opacity: 1 - swap}}>
          <KText text="No stakeholder" start={asset + 8} size={30} weight={500} color={C.muted} />
        </div>
      </Abs>
      <Abs x={xR + 130} y={y + 170}>
        <div style={{opacity: swap}}>
          <KText text="Stakeholder *assigned*" start={assign + 4} size={30} weight={600} />
        </div>
      </Abs>
      {/* barrier */}
      <Abs x={(xL + xR) / 2} y={y - 40}>
        <div
          style={{
            transform: `translateY(${-lift * 160}px) rotate(${-lift * 18}deg) scale(${pop(fr, deadEnd, 10, 0.6, 140)})`,
            opacity: tween(fr, deadEnd, deadEnd + 6) * (1 - lift),
          }}
        >
          <Icon name="barrier" size={200} progress={tween(fr, deadEnd, deadEnd + 18)} />
        </div>
      </Abs>
      <Abs x={(xL + xR) / 2} y={y + 110}>
        <div style={{opacity: 1 - lift}}>
          <Chip label="Dead end" start={deadEnd + 6} variant="white" size={26} />
        </div>
      </Abs>
      <Abs x={960} y={190}>
        <KText text="An asset without a stakeholder is a *dead end*" times={vt([156.92, 157.05, 157.47, 157.83, 157.97, 158.57, 158.91, 159.13, 159.35])} size={60} weight={700} exit={assign - 8} />
      </Abs>
      <Abs x={960} y={190}>
        <KText text="Assigning one keeps the *conversation moving*" times={vt([162.05, 162.37, 162.69, 162.99, 163.21, 163.67])} size={60} weight={700} />
      </Abs>
    </AbsoluteFill>
  );
};

/* =============================================================== beat 3: simplest, highest impact */
const C3_A = VF(164.4);
const C3_B = VF(168.35);
const Impact: React.FC = () => {
  const fr = useCurrentFrame();
  if (fr < C3_A - 2 || fr > C3_B + 22) return null;
  const inP = tween(fr, C3_A, C3_A + 18, 0, 1, E.out);
  const out = tween(fr, C3_B, C3_B + 12, 0, 1, E.in);
  const simplest = VF(165.23);
  const impact = VF(166.15);
  const meters = [
    {t: 'Effort', icon: 'stopwatch', v: 0.18, at: simplest, note: 'Simple'},
    {t: 'Impact', icon: 'target', v: 0.96, at: impact, note: 'High'},
  ];
  return (
    <AbsoluteFill style={{opacity: inP * (1 - out), transform: `translateY(${(1 - inP) * 50}px)`}}>
      <Abs x={560} y={470}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <IconRing name="steward" start={C3_A + 4} size={270} filled />
          <KText text="Data *steward*" start={VF(167.51)} size={40} style={{marginTop: 26}} />
        </div>
      </Abs>
      <div style={{position: 'absolute', left: 900, top: 290}}>
        <Panel glow style={{width: 760, padding: '44px 48px'}}>
          <div style={{fontFamily: FONT, fontSize: 26, fontWeight: 600, letterSpacing: '0.08em', color: C.blueSoft, textTransform: 'uppercase', opacity: tween(fr, C3_A + 8, C3_A + 20)}}>Stakeholder review</div>
          {meters.map((m, i) => {
            const p = tween(fr, m.at, m.at + 30, 0, 1, E.out);
            return (
              <div key={i} style={{marginTop: 34, opacity: tween(fr, m.at - 6, m.at + 4)}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT, fontSize: 32, fontWeight: 600, color: C.text}}>
                  <Icon name={m.icon} size={46} strokePx={3} progress={tween(fr, m.at - 4, m.at + 16)} />
                  {m.t}
                  <div style={{marginLeft: 'auto', fontSize: 26, color: i === 1 ? C.blueSoft : C.muted}}>{m.note}</div>
                </div>
                <div style={{marginTop: 16, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.1)', overflow: 'hidden'}}>
                  <div style={{width: `${m.v * p * 100}%`, height: '100%', borderRadius: 11, background: i === 1 ? 'linear-gradient(90deg,#0072CE,#5AA9EA)' : 'rgba(255,255,255,0.55)', boxShadow: i === 1 ? '0 0 20px rgba(0,114,206,0.8)' : 'none'}} />
                </div>
              </div>
            );
          })}
        </Panel>
      </div>
      <Abs x={960} y={860}>
        <KText text="One of the *simplest, highest‑impact* reviews / a steward can do" times={vt([164.89, 165.01, 165.15, 165.23, 166.15, 166.85, 167.25, 167.51, 167.85, 168.05])} size={50} weight={700} />
      </Abs>
    </AbsoluteFill>
  );
};

/* =============================================================== beat 4: minutes vs hours */
const C4_A = VF(168.65);
const C4_B = VF(173.95);
const Minutes: React.FC = () => {
  const fr = useCurrentFrame();
  if (fr < C4_A - 2 || fr > C4_B + 22) return null;
  const inP = tween(fr, C4_A, C4_A + 18, 0, 1, E.out);
  const out = tween(fr, C4_B, C4_B + 14, 0, 1, E.in);
  const minutes = VF(169.19);
  const save = VF(170.31);
  const hours = VF(171.15);
  const later = VF(173.27);
  const arrow = tween(fr, save - 6, save + 12, 0, 1, E.inOut);
  const strike = tween(fr, later - 6, later + 12, 0, 1, E.inOut);
  return (
    <AbsoluteFill style={{opacity: inP * (1 - out), transform: `scale(${1 + out * 0.06})`}}>
      <Abs x={520} y={460}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <IconRing name="stopwatch" start={minutes - 4} size={240} filled />
          <KText text="A few *minutes* here" times={vt([168.87, 168.99, 169.19, 169.73])} size={42} style={{marginTop: 28}} />
        </div>
      </Abs>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <path d="M700 460 H1180" fill="none" stroke={C.blueLight} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - arrow} />
        {arrow > 0.92 ? <path d="M1160 440 L1184 460 L1160 480" fill="none" stroke={C.blueLight} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /> : null}
      </svg>
      <Abs x={940} y={400}>
        <Chip label="saves" icon="bolt" start={save} variant="blue" size={30} />
      </Abs>
      <Abs x={1400} y={460}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'}}>
          <div style={{position: 'relative'}}>
            <IconRing name="route" start={hours - 4} size={240} />
            <svg width={240} height={240} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
              <line x1={20} y1={220} x2={20 + 200 * strike} y2={220 - 200 * strike} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={strike > 0 ? 1 : 0} />
            </svg>
          </div>
          <KText text="*Hours* of chasing / the right person" times={vt([171.15, 171.67, 171.93, 172.21, 172.53, 172.69, 172.91])} size={42} style={{marginTop: 28}} />
        </div>
      </Abs>
      <Abs x={1400} y={250}>
        <Chip label="Someone else’s time" icon="users" start={VF(170.57)} size={24} />
      </Abs>
    </AbsoluteFill>
  );
};

/* =============================================================== beat 5: tagline end card */
const C5_A = VF(174.5);
const Tagline: React.FC = () => {
  const fr = useCurrentFrame();
  if (fr < C5_A - 2) return null;
  const end = TL.durationInFrames;
  const inP = tween(fr, C5_A, C5_A + 20, 0, 1, E.out);
  const fadeEnd = tween(fr, end - 16, end - 1, 0, 1, E.in);
  const behind = VF(175.07);
  const divider = tween(fr, behind - 6, behind + 14, 0, 1, E.inOut);
  return (
    <AbsoluteFill style={{opacity: inP * (1 - fadeEnd)}}>
      <div style={{position: 'absolute', left: 300, top: 540, transform: 'translateY(-50%)'}}>
        <Logo start={C5_A + 2} width={470} />
      </div>
      <div style={{position: 'absolute', left: 860, top: 540 - 95, width: 2.5, height: 190, background: 'rgba(255,255,255,0.85)', transform: `scaleY(${divider})`}} />
      <div style={{position: 'absolute', left: 920, top: 540, transform: 'translateY(-50%)'}}>
        <KText
          text="Behind every asset is a name / *Dominion Energy* can count on."
          times={vt([175.07, 175.35, 175.81, 176.27, 176.53, 176.71, 176.97, 177.39, 177.85, 178.19, 178.47])}
          size={54}
          weight={500}
          align="left"
          lineHeight={1.22}
        />
      </div>
    </AbsoluteFill>
  );
};

export const Conclusion: React.FC = () => (
  <>
    <DeadEnd />
    <Impact />
    <Minutes />
    <Tagline />
  </>
);
