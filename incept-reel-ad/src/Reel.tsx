import React from 'react';
import {AbsoluteFill, Audio, Img, spring, staticFile, useCurrentFrame, Easing, random} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {
  BadgeCheck, Database, BookOpen, UserCheck, ScanSearch, ListChecks, Route, CirclePause,
  CircleCheck, MousePointerClick, ChevronDown, CalendarDays, ArrowRight,
} from 'lucide-react';

// Fonts are bundled in public/fonts (Inter is a variable font, so one file covers every weight)
loadFont({family: 'Inter', url: staticFile('fonts/inter-latin.woff2'), weight: '100 900'});
loadFont({family: 'JetBrains Mono', url: staticFile('fonts/jetbrains-mono-latin.woff2'), weight: '500'});
const INTER = 'Inter, sans-serif';
const MONO = "'JetBrains Mono', monospace";

export const FPS = 30;
export const DURATION_S = 32;

// Palette from inceptds.com, plus a warning red for the problem beat
const C = {
  ink: '#0f0f0b', ink2: '#1c1b16', line: '#34332b', cream: '#f1efe6', sand: '#d7bca2',
  sandHi: '#f0dcc4', blue: '#98b7e1', warn: '#ff6a4d', tile: '#faf8f2',
};

// Voiceover word timings (seconds), from a transcription of public/vo.mp3
const V = {
  is: 0, governance: .64, stuck: 1.04, between: 1.44, strategy: 1.8, execution: 2.46,
  in: 3.5, five: 3.64, days: 3.94, get: 4.32, clear: 4.8, forward: 5.28,
  forOver: 6.22, twelve: 6.32, incept: 7.38, trusted: 8.42, informatica2: 8.8, platinum: 9.48,
  fortune: 10.9, fiveHundred: 11.28, companies: 11.7, solve: 12.26, complex: 12.68, powered: 13.56, dataGov: 13.72,
  from: 14.96, quality: 15.18, master: 16.06, cataloging: 17.14, ownership: 18.0,
  withOur: 19.22, free: 19.56, fiveDay: 19.94, discovery: 20.42,
  review: 21.44, uncover: 22.84, deliver: 24.38, roadmap: 25.24,
  noCost: 26.88, noCommit: 27.76, tap: 28.7, book: 29.6,
};

// ---------- timing helpers ----------
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const ease = Easing.bezier(.22, 1, .36, 1);
const pop = (t: number, at: number, cfg = {damping: 13, stiffness: 190, mass: .9}) =>
  spring({frame: Math.max(0, (t - at) * FPS), fps: FPS, config: cfg});
// visible window with quick fades at both ends
const win = (t: number, a: number, b: number, fade = .18) => clamp(Math.min((t - a) / fade, (b - t) / fade));

// ---------- building blocks ----------
const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', ...style}}>{children}</AbsoluteFill>
);

// A word or phrase that springs up into place at `at`
const Pop: React.FC<{t: number; at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number}> = ({t, at, children, style, from = 60}) => {
  const p = pop(t, at);
  if (t < at) return null;
  return (
    <div style={{transform: `translateY(${(1 - p) * from}px) scale(${.85 + .15 * p})`, opacity: clamp(p * 1.4), ...style}}>
      {children}
    </div>
  );
};

// RGB-split glitch wrapper; amount 0..1
const Glitch: React.FC<{amount: number; seed: string; children: React.ReactNode}> = ({amount, seed, children}) => {
  if (amount <= 0) return <>{children}</>;
  const dx = (random(seed + 'x') - .5) * 40 * amount;
  const slice = random(seed + 's') * 80;
  return (
    <div style={{position: 'relative'}}>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${dx}px)`, color: '#ff2e55', mixBlendMode: 'screen', opacity: .8,
        clipPath: `inset(${slice}% 0 ${Math.max(0, 70 - slice)}% 0)`}}>{children}</div>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${-dx}px)`, color: '#2ee6ff', mixBlendMode: 'screen', opacity: .8}}>{children}</div>
      <div style={{transform: `translateX(${dx * .3}px)`}}>{children}</div>
    </div>
  );
};

const Kicker: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = C.sand, style}) => (
  <div style={{fontFamily: MONO, fontSize: 34, letterSpacing: 10, color, textTransform: 'uppercase', ...style}}>{children}</div>
);

// ---------- background ----------
const ROWS = Array.from({length: 26}, (_, i) => i);
const DataWall: React.FC<{t: number; opacity: number; corrupt: number}> = ({t, opacity, corrupt}) => {
  if (opacity <= 0) return null;
  const off = (t * 38) % 74;
  return (
    <AbsoluteFill style={{opacity, fontFamily: MONO, fontSize: 30, color: '#4a483d', padding: '0 60px', transform: `translateY(${-off}px)`}}>
      {ROWS.map(r => (
        <div key={r} style={{display: 'flex', gap: 34, height: 74, alignItems: 'center', whiteSpace: 'nowrap'}}>
          {[0, 1, 2, 3].map(c => {
            const bad = random(`c${r}-${c}-${Math.floor(t * 6)}`) < corrupt * .35;
            const v = ['CUST_' + (1040 + r * 7 + c), ['ACME CORP', 'Acme Corp.', 'ACME', 'acme inc'][(r + c) % 4], '$' + (12 + r * 3 + c) + '.4K', ['NY', 'N.Y.', 'New York', '—'][(r * c) % 4]][c];
            return <span key={c} style={{width: 230, color: bad ? C.warn : undefined}}>{bad ? ['NULL', '#ERR', '???', 'DUP'][(r + c) % 4] : v}</span>;
          })}
        </div>
      ))}
    </AbsoluteFill>
  );
};

const Grain: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{opacity: .07, mixBlendMode: 'overlay', pointerEvents: 'none',
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' seed='${Math.floor(t * 12) % 8}'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`}} />
);

const big = {fontFamily: INTER, fontWeight: 900, lineHeight: 1, letterSpacing: -3, color: C.cream, textAlign: 'center' as const};

// ---------- scene 1: hook ----------
const Hook: React.FC<{t: number}> = ({t}) => {
  const vis = win(t, -1, 3.35, .15);
  if (vis <= 0) return null;
  const shake = t > V.stuck && t < V.stuck + .45 ? Math.sin(t * 80) * 12 * (1 - prog(t, V.stuck, V.stuck + .45)) : 0;
  // the bridge from strategy to execution draws, then jams halfway
  const bridge = ease(prog(t, V.strategy + .1, V.execution)) * .5;
  const jammed = t > V.execution;
  const blink = jammed && Math.floor(t * 5) % 2 === 0;
  return (
    <AbsoluteFill style={{opacity: vis}}>
      <div style={{position: 'absolute', top: 380, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
        <Pop t={t} at={V.is}><div style={{...big, fontSize: 92, fontWeight: 700}}>Is your data</div></Pop>
        <Pop t={t} at={V.governance}><div style={{...big, fontSize: 140, color: C.sand}}>governance</div></Pop>
        <div style={{transform: `translateX(${shake}px)`}}>
          <Pop t={t} at={V.stuck}><div style={{...big, fontSize: 250, color: C.warn, letterSpacing: 2, marginTop: 10}}>STUCK</div></Pop>
        </div>
        <Pop t={t} at={V.between}><div style={{...big, fontSize: 80, fontWeight: 700, marginTop: 10}}>between</div></Pop>
      </div>
      <div style={{position: 'absolute', top: 1180, left: 70, right: 70, height: 260}}>
        <svg width={940} height={260} style={{position: 'absolute', inset: 0}}>
          <line x1={140} y1={70} x2={800} y2={70} stroke={C.line} strokeWidth={8} strokeDasharray="4 18" strokeLinecap="round" />
          <line x1={140} y1={70} x2={140 + 660 * bridge} y2={70} stroke={jammed ? C.warn : C.sand} strokeWidth={8} strokeLinecap="round" />
        </svg>
        {[{at: V.strategy, label: 'STRATEGY', x: 140}, {at: V.execution, label: 'EXECUTION', x: 800}].map(n => (
          <div key={n.label} style={{position: 'absolute', left: n.x - 160, width: 320, top: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Pop t={t} at={n.at} from={30}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
                <div style={{width: 140, height: 140, borderRadius: 70, background: C.ink2, border: `4px solid ${C.sand}`, display: 'grid', placeItems: 'center'}}>
                  <div style={{width: 40, height: 40, borderRadius: 20, background: C.sand}} />
                </div>
                <div style={{fontFamily: MONO, fontSize: 36, letterSpacing: 6, color: C.cream}}>{n.label}</div>
              </div>
            </Pop>
          </div>
        ))}
        {jammed && <div style={{position: 'absolute', left: 140 + 330 - 50, top: 20, opacity: blink ? 1 : .55, transform: `scale(${.8 + .2 * pop(t, V.execution)})`}}>
          <CirclePause size={100} color={C.warn} strokeWidth={2.4} fill={C.ink} />
        </div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- scene 2: the promise ----------
const Promise5: React.FC<{t: number}> = ({t}) => {
  const vis = win(t, 3.35, 6.12, .15);
  if (vis <= 0) return null;
  const days = Array.from({length: 5}, (_, i) => clamp((t - V.days - i * .12) * 6));
  const arrow = ease(prog(t, V.clear - .1, V.forward + .3));
  return (
    <AbsoluteFill style={{opacity: vis}}>
      <div style={{position: 'absolute', top: 330, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Pop t={t} at={V.in}><Kicker>In just</Kicker></Pop>
        <Pop t={t} at={V.five}><div style={{...big, fontSize: 480, color: C.sand, letterSpacing: -10, marginTop: 10}}>5</div></Pop>
        <Pop t={t} at={V.days}><div style={{...big, fontSize: 130, letterSpacing: 8, marginTop: -20}}>DAYS</div></Pop>
        <div style={{display: 'flex', gap: 20, marginTop: 50}}>
          {days.map((d, i) => (
            <div key={i} style={{width: 150, height: 120, borderRadius: 24, border: `3px solid ${d > 0 ? C.sand : C.line}`, background: d >= 1 ? 'rgba(215,188,162,.16)' : 'transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${.8 + .2 * d})`, opacity: .3 + .7 * d}}>
              <CalendarDays size={40} color={C.sand} strokeWidth={2} />
              <div style={{fontFamily: MONO, fontSize: 26, color: C.cream, marginTop: 6}}>DAY {i + 1}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', top: 1270, width: '100%', textAlign: 'center'}}>
        <Pop t={t} at={V.get}><div style={{...big, fontSize: 92, fontWeight: 800}}>a <span style={{color: C.sand}}>clear</span> way forward</div></Pop>
        <div style={{position: 'relative', margin: '50px auto 0', width: 800, height: 80}}>
          <div style={{position: 'absolute', left: 0, top: 36, height: 8, borderRadius: 4, width: 700 * arrow, background: C.sand}} />
          {arrow > 0 && <div style={{position: 'absolute', left: 700 * arrow - 30, top: 0}}><ArrowRight size={80} color={C.sand} strokeWidth={3} /></div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- scene 3: authority ----------
const Authority: React.FC<{t: number}> = ({t}) => {
  if (t < 6 || t > 15.1) return null;
  const head = {fontFamily: INTER, fontWeight: 900, color: C.cream, letterSpacing: -4, lineHeight: .95, textAlign: 'center' as const};
  const a = win(t, 6.1, 7.35);
  const n = Math.round(12 * ease(prog(t, V.twelve - .1, V.twelve + .5)));
  const b = win(t, 7.3, 8.35);
  const wipe = ease(prog(t, V.incept - .05, V.incept + .6));
  const c = win(t, 8.3, 10.88);
  const d = win(t, 10.85, 12.25);
  const e = win(t, 12.2, 14.95);
  const untangle = ease(prog(t, V.complex, 14.2));
  return (
    <AbsoluteFill>
      {a > 0 && <Center style={{opacity: a}}>
        <Pop t={t} at={V.forOver}><Kicker style={{textAlign: 'center'}}>For</Kicker></Pop>
        <Pop t={t} at={V.twelve - .1}>
          <div style={{...head, fontSize: 420, color: C.sand, marginTop: 20}}>{n}</div>
        </Pop>
        <Pop t={t} at={V.twelve + .3}><div style={{...head, fontSize: 130, letterSpacing: 6}}>YEARS</div></Pop>
      </Center>}
      {b > 0 && <Center style={{opacity: b}}>
        <div style={{width: 900, position: 'relative', clipPath: `inset(0 ${100 - wipe * 100}% 0 0)`}}>
          <Img src={staticFile('incept-logo-white.png')} style={{width: 900}} />
        </div>
        <div style={{width: 6, height: 320, background: C.sand, position: 'absolute', left: 90 + 900 * wipe, opacity: Math.sin(wipe * Math.PI)}} />
      </Center>}
      {c > 0 && <Center style={{opacity: c}}>
        <Pop t={t} at={V.trusted}><Kicker style={{textAlign: 'center', marginBottom: 60}}>A trusted</Kicker></Pop>
        <PlatinumBadge t={t} />
      </Center>}
      {d > 0 && <Center style={{opacity: d}}>
        <Pop t={t} at={V.fortune - .05}><Kicker style={{textAlign: 'center'}}>Helping</Kicker></Pop>
        <Pop t={t} at={V.fortune}><div style={{...head, fontSize: 190, marginTop: 30}}>FORTUNE</div></Pop>
        <Pop t={t} at={V.fiveHundred}><div style={{...head, fontSize: 380, color: C.sand}}>500</div></Pop>
        <Pop t={t} at={V.companies}><div style={{...head, fontSize: 96, letterSpacing: 0, fontWeight: 700}}>companies</div></Pop>
      </Center>}
      {e > 0 && <Center style={{opacity: e}}>
        <Untangle p={untangle} t={t} />
        <Clients t={t} at={V.solve - .05} />
        <div style={{position: 'absolute', top: 1230, width: '100%', textAlign: 'center'}}>
          <Pop t={t} at={V.solve}><div style={{...head, fontSize: 96, letterSpacing: -2}}>advance</div></Pop>
          <Pop t={t} at={V.complex}><div style={{...head, fontSize: 88, letterSpacing: -2, color: C.sand, marginTop: 8}}>Informatica-powered</div></Pop>
          <Pop t={t} at={V.dataGov}><div style={{...head, fontSize: 96, letterSpacing: -2, marginTop: 8}}>data governance</div></Pop>
        </div>
      </Center>}
    </AbsoluteFill>
  );
};

// ---------- scene 4: services ----------
const SERVICES = [
  {at: V.quality, label: 'Data Quality', Icon: BadgeCheck},
  {at: V.master, label: 'Master Data', Icon: Database},
  {at: V.cataloging, label: 'Data Catalog', Icon: BookOpen},
  {at: V.ownership, label: 'Clear Ownership', Icon: UserCheck},
];
const Services: React.FC<{t: number}> = ({t}) => {
  const vis = win(t, 14.9, 19.15, .2);
  if (vis <= 0) return null;
  const active = SERVICES.reduce((a, s, i) => (t >= s.at ? i : a), -1);
  return (
    <AbsoluteFill style={{opacity: vis}}>
      <div style={{position: 'absolute', top: 360, width: '100%', textAlign: 'center'}}>
        <Pop t={t} at={V.from}><Kicker>End-to-end expertise</Kicker></Pop>
      </div>
      <div style={{position: 'absolute', top: 470, left: 80, right: 80, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40}}>
        {SERVICES.map(({at, label, Icon}, i) => {
          const p = pop(t, at - .05, {damping: 12, stiffness: 170, mass: .9});
          const on = i === active;
          return (
            <div key={label} style={{height: 440, borderRadius: 40, background: on ? C.sand : C.ink2, border: `2px solid ${on ? C.sand : C.line}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36,
              transform: `scale(${t < at - .05 ? .6 : .6 + .4 * p})`, opacity: t < at - .05 ? .18 : 1,
              boxShadow: on ? '0 0 90px rgba(215,188,162,.45)' : 'none'}}>
              <Icon size={150} strokeWidth={1.6} color={on ? C.ink : C.sand} />
              <div style={{fontFamily: INTER, fontWeight: 800, fontSize: 50, color: on ? C.ink : C.cream, letterSpacing: -1}}>{label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- scene 5: the offer ----------
const Offer: React.FC<{t: number}> = ({t}) => {
  const vis = win(t, 19.1, 21.2, .15);
  if (vis <= 0) return null;
  const slam = pop(t, V.free, {damping: 9, stiffness: 220, mass: .8});
  const days = Array.from({length: 5}, (_, i) => clamp((t - V.fiveDay - .1 - i * .12) * 6));
  return (
    <Center style={{opacity: vis}}>
      <Pop t={t} at={V.withOur}><div style={{...big, fontSize: 80, fontWeight: 700}}>With our</div></Pop>
      {t >= V.free && <div style={{...big, fontSize: 330, color: C.ink, background: C.sand, padding: '10px 60px 30px', borderRadius: 40, marginTop: 40,
        transform: `scale(${3 - 2 * slam}) rotate(${-6 * slam}deg)`, opacity: clamp(slam * 2), boxShadow: '0 30px 100px rgba(215,188,162,.35)'}}>FREE</div>}
      <Pop t={t} at={V.fiveDay}><div style={{...big, fontSize: 100, marginTop: 70}}>5-day discovery</div></Pop>
      <div style={{display: 'flex', gap: 22, marginTop: 50}}>
        {days.map((d, i) => (
          <div key={i} style={{width: 140, height: 120, borderRadius: 24, border: `3px solid ${d > 0 ? C.sand : C.line}`, background: d >= 1 ? 'rgba(215,188,162,.16)' : 'transparent',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${.8 + .2 * d})`, opacity: .3 + .7 * d}}>
            <CalendarDays size={40} color={C.sand} strokeWidth={2} />
            <div style={{fontFamily: MONO, fontSize: 26, color: C.cream, marginTop: 6}}>DAY {i + 1}</div>
          </div>
        ))}
      </div>
    </Center>
  );
};

// three steps of the discovery, each landing on its phrase
const STEPS = [
  {at: V.review, l1: 'Review your', l2: 'priorities', Icon: ListChecks},
  {at: V.uncover, l1: 'Uncover', l2: 'critical gaps', Icon: ScanSearch},
  {at: V.deliver, l1: 'Deliver a focused', l2: 'roadmap', Icon: Route},
];
const Steps: React.FC<{t: number}> = ({t}) => {
  const vis = win(t, 21.15, 26.7, .15);
  if (vis <= 0) return null;
  const active = STEPS.reduce((a, s, i) => (t >= s.at ? i : a), -1);
  const rail = ease(prog(t, V.review, V.deliver + .6));
  return (
    <AbsoluteFill style={{opacity: vis}}>
      <div style={{position: 'absolute', top: 330, width: '100%', textAlign: 'center'}}>
        <Pop t={t} at={21.2}><Kicker>In five days, we'll</Kicker></Pop>
      </div>
      <div style={{position: 'absolute', left: 150, top: 560, width: 8, height: 760 * rail, background: C.sand, borderRadius: 4}} />
      {STEPS.map(({at, l1, l2, Icon}, i) => {
        if (t < at - .05) return null;
        const p = pop(t, at - .05, {damping: 14, stiffness: 170, mass: .9});
        const on = i === active;
        const scan = i === 1 && on ? .5 + .5 * Math.sin((t - at) * 8) : 0;
        return (
          <div key={l2} style={{position: 'absolute', left: 80, right: 80, top: 470 + i * 380, height: 300, display: 'flex', alignItems: 'center', gap: 44,
            transform: `translateX(${(1 - p) * 300}px)`, opacity: clamp(p * 2)}}>
            <div style={{width: 148, height: 148, flex: 'none', borderRadius: 74, background: on ? C.sand : C.ink2, border: `4px solid ${C.sand}`,
              display: 'grid', placeItems: 'center', boxShadow: on ? `0 0 ${50 + 40 * scan}px rgba(215,188,162,.5)` : 'none'}}>
              <Icon size={74} color={on ? C.ink : C.sand} strokeWidth={2} />
            </div>
            <div>
              <div style={{fontFamily: MONO, fontSize: 30, color: C.sand, letterSpacing: 6}}>STEP {i + 1}</div>
              <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 64, color: C.cream, letterSpacing: -1.5, lineHeight: 1.1, marginTop: 10}}>{l1}</div>
              <div style={{fontFamily: INTER, fontWeight: 900, fontSize: 84, color: on ? C.sand : C.cream, letterSpacing: -2.5, lineHeight: 1}}>{l2}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- scene 6: reassurance ----------
const Reassure: React.FC<{t: number}> = ({t}) => {
  const vis = win(t, 26.65, 28.6, .15);
  if (vis <= 0) return null;
  const row = (at: number, text: string) => (
    <Pop t={t} at={at} from={80}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
        <CircleCheck size={130} color={C.sand} strokeWidth={2.2} />
        <div style={{fontFamily: INTER, fontWeight: 900, fontSize: 104, color: C.cream, letterSpacing: -3, whiteSpace: 'nowrap'}}>{text}</div>
      </div>
    </Pop>
  );
  return (
    <Center style={{opacity: vis, gap: 70}}>
      {row(V.noCost - .05, 'No cost.')}
      {row(V.noCommit - .05, 'No commitment.')}
    </Center>
  );
};

// ---------- scene 7: call to action ----------
const CTA: React.FC<{t: number}> = ({t}) => {
  const t0 = 28.55;
  if (t < t0) return null;
  const vis = clamp((t - t0) / .2);
  const press = t > V.book && t < V.book + .35 ? .94 : 1;
  const pulse = 1 + .03 * Math.sin((t - t0) * 6);
  const hand = ease(prog(t, t0 + .4, V.book));
  return (
    <AbsoluteFill style={{opacity: vis}}>
      <div style={{position: 'absolute', top: 300, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <Pop t={t} at={t0 + .02}><Img src={staticFile('incept-logo-white.png')} style={{width: 620}} /></Pop>
      </div>
      <div style={{position: 'absolute', top: 640, width: '100%', textAlign: 'center'}}>
        <Pop t={t} at={t0 + .1}><div style={{...big, fontSize: 104}}>Book your</div></Pop>
        <Pop t={t} at={t0 + .25}><div style={{...big, fontSize: 104, color: C.sand, lineHeight: 1.05}}>FREE 5-day</div></Pop>
        <Pop t={t} at={t0 + .4}><div style={{...big, fontSize: 104}}>discovery</div></Pop>
      </div>
      <div style={{position: 'absolute', top: 1130, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <Pop t={t} at={V.tap}>
          <div style={{background: C.sand, color: C.ink, fontFamily: INTER, fontWeight: 800, fontSize: 62, padding: '36px 80px', borderRadius: 100,
            transform: `scale(${pulse * press})`, boxShadow: '0 0 0 14px rgba(215,188,162,.18), 0 30px 90px rgba(215,188,162,.35)'}}>Book now →</div>
        </Pop>
      </div>
      <div style={{position: 'absolute', left: 640, top: 1240 + (1 - hand) * 260, opacity: hand, color: C.cream, transform: `scale(${press})`}}>
        <MousePointerClick size={110} strokeWidth={2} fill={C.ink} />
      </div>
      <div style={{position: 'absolute', top: 1420, width: '100%', textAlign: 'center', opacity: clamp((t - t0 - .7) * 4)}}>
        <div style={{fontFamily: MONO, fontSize: 34, color: C.cream, letterSpacing: 6}}>INCEPTDS.COM</div>
        <div style={{marginTop: 20, display: 'flex', justifyContent: 'center', transform: `translateY(${Math.abs(Math.sin((t - t0) * 5)) * 18}px)`}}>
          <ChevronDown size={80} color={C.sand} strokeWidth={2.5} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- composition ----------
export const Reel: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const wallOpacity = .5 * (1 - prog(t, 2.9, 3.5));
  // cold and stuck for the hook, warm from the promise onward
  const warm = prog(t, 3.2, 4.2);
  return (
    <AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(1200px 1400px at 50% 40%, rgba(255,106,77,${.10 * (1 - warm)}), transparent 70%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(1200px 1400px at 50% 45%, rgba(215,188,162,${.13 * warm}), transparent 70%)`}} />
      <DataWall t={t} opacity={wallOpacity} corrupt={prog(t, .8, 2.6)} />
      <Hook t={t} />
      <Promise5 t={t} />
      <Authority t={t} />
      <Services t={t} />
      <Offer t={t} />
      <Steps t={t} />
      <Reassure t={t} />
      <CTA t={t} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55) 100%)'}} />
      <Grain t={t} />
      <Audio src={staticFile('vo.mp3')} />
      <Audio src={staticFile('music.wav')} volume={.9} />
    </AbsoluteFill>
  );
};

// Official Informatica Platinum Partner badge: spins in, then a glint and a glow when "Platinum" is spoken
const PlatinumBadge: React.FC<{t: number}> = ({t}) => {
  const at = V.informatica2 - .15;
  if (t < at) return null;
  const p = pop(t, at, {damping: 14, stiffness: 120, mass: 1});
  const glint = prog(t, V.platinum - .05, V.platinum + .75);
  const glow = Math.sin(prog(t, V.platinum - .1, V.platinum + 1.2) * Math.PI);
  const size = 780;
  return (
    <div style={{width: size, height: size, position: 'relative', transform: `scale(${.4 + .6 * p}) rotate(${(1 - p) * -40}deg)`, opacity: clamp(p * 2)}}>
      <div style={{position: 'absolute', inset: -40, borderRadius: '50%', boxShadow: `0 0 ${60 + 80 * glow}px ${10 + 30 * glow}px rgba(215,188,162,${.18 + .3 * glow})`}} />
      <Img src={staticFile('informatica-platinum-badge.png')} style={{width: size, height: size, position: 'absolute', inset: 0}} />
      {glint > 0 && glint < 1 && (
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', mixBlendMode: 'screen'}}>
          <div style={{position: 'absolute', top: -200, bottom: -200, width: 160, left: -300 + glint * (size + 600),
            transform: 'rotate(20deg)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent)'}} />
        </div>
      )}
    </div>
  );
};

// Client logos, shown as one-colour marks under a "Trusted by" label
const CLIENTS = ['surescripts', 'dominion-energy', 'teradyne', 'beone'];
const Clients: React.FC<{t: number; at: number}> = ({t, at}) => (
  <div style={{position: 'absolute', top: 300, left: 80, right: 80}}>
    <Pop t={t} at={at}><Kicker style={{textAlign: 'center'}}>Trusted by</Kicker></Pop>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px 40px', marginTop: 44}}>
      {CLIENTS.map((c, i) => (
        <Pop key={c} t={t} at={at + .12 + i * .12} from={30}>
          <div style={{height: 130, borderRadius: 28, border: `2px solid ${C.line}`, background: 'rgba(28,27,22,.85)', display: 'grid', placeItems: 'center'}}>
            <Img src={staticFile(`clients/${c}.png`)} style={{maxWidth: 300, maxHeight: c === 'dominion-energy' ? 84 : 64, objectFit: 'contain', opacity: .92}} />
          </div>
        </Pop>
      ))}
    </div>
  </div>
);

// tangled strands that relax into straight, ordered lanes
const Untangle: React.FC<{p: number; t: number}> = ({p, t}) => {
  const lanes = 7, cols = [C.sand, C.blue, C.cream, C.warn, C.sand, C.blue, C.cream];
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      {Array.from({length: lanes}, (_, i) => {
        const yEnd = 790 + i * 55;
        const pts = Array.from({length: 7}, (_, k) => {
          const x = 90 + k * 150;
          const messy = 760 + (random(`u${i}-${k}`) * 380) + Math.sin(t * 2 + i + k) * 30;
          return [x, messy * (1 - p) + yEnd * p];
        });
        const d = pts.reduce((acc, [x, y], k) => {
          if (k === 0) return `M${x},${y}`;
          const [px, py] = pts[k - 1];
          return acc + ` C${px + 75},${py} ${x - 75},${y} ${x},${y}`;
        }, '');
        const col = p > .85 ? C.sand : cols[i];
        return <path key={i} d={d} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" opacity={.55 + .45 * p}
          strokeDasharray={2000} strokeDashoffset={2000 * (1 - ease(prog(t, V.solve - .2 + i * .04, V.solve + .5 + i * .04)))} />;
      })}
      {p > .9 && <circle cx={990} cy={955} r={14 * pop(t, 14.25)} fill={C.sand} />}
    </svg>
  );
};
