import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, Easing, random} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {
  Users, BarChart3, Loader, BadgeCheck, Database, BookOpen, ShieldCheck, ScanSearch,
  CircleCheck, MousePointerClick, ChevronDown, CalendarDays, TriangleAlert,
} from 'lucide-react';

// Fonts are bundled in public/fonts (Inter is a variable font, so one file covers every weight)
loadFont({family: 'Inter', url: staticFile('fonts/inter-latin.woff2'), weight: '100 900'});
loadFont({family: 'JetBrains Mono', url: staticFile('fonts/jetbrains-mono-latin.woff2'), weight: '500'});
const INTER = 'Inter, sans-serif';
const MONO = "'JetBrains Mono', monospace";

export const FPS = 30;
export const DURATION_S = 39;

// Palette from inceptds.com, plus a warning red for the problem beats
const C = {
  ink: '#0f0f0b', ink2: '#1c1b16', line: '#34332b', cream: '#f1efe6', sand: '#d7bca2',
  sandHi: '#f0dcc4', blue: '#98b7e1', warn: '#ff6a4d', tile: '#faf8f2',
};

// Voiceover word timings (seconds), from a transcription of the narration file
const V = {
  paying: 0, informatica: .54, but: 1.58, still: 1.66, cant: 2.12, trust: 2.6, data: 2.98,
  duplicate: 4.48, conflicting: 5.84, governance: 7.9, stalling: 8.7,
  forOver: 10.32, twelve: 10.76, incept: 11.82, trusted: 13.3, informatica2: 13.76, platinum: 14.6,
  fortune: 16.24, companies: 17.14, solve: 17.84, complex: 18.3,
  from: 20.4, quality: 20.62, master: 21.72, cataloging: 23.02, governance2: 24.02,
  now: 25.28, free: 26.58, five: 26.92, discovery: 27.48, assess: 28.8, environment: 29.32,
  deliver: 30.24, prioritized: 31.0, roadmap: 31.82,
  noCost: 33.0, noCommit: 34.2, tap: 35.84, book: 36.54,
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

// ---------- scene 1: hook ----------
const Hook: React.FC<{t: number}> = ({t}) => {
  const vis = win(t, -1, 3.95, .12);
  if (vis <= 0) return null;
  const out = prog(t, 3.35, 3.95);
  const g = out > 0 ? out : (t > V.still && t < V.still + .25 ? .6 : 0);
  const shake = t > V.still && t < V.still + .4 ? Math.sin(t * 90) * 10 * (1 - prog(t, V.still, V.still + .4)) : 0;
  const big = {fontFamily: INTER, fontWeight: 900, lineHeight: 1, letterSpacing: -3, color: C.cream, textAlign: 'center' as const};
  return (
    <Center style={{opacity: vis * (1 - out * .8), transform: `translateX(${shake}px) scale(${1 + out * .15})`}}>
      <Glitch amount={g} seed={'h' + Math.floor(t * 20)}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
          <Pop t={t} at={V.paying}><div style={{...big, fontSize: 96, fontWeight: 700}}>Paying for</div></Pop>
          <Pop t={t} at={V.informatica}><div style={{...big, fontSize: 136, color: C.sand}}>Informatica</div></Pop>
          <div style={{height: 40}} />
          <Pop t={t} at={V.but}><div style={{...big, fontSize: 104}}>but <span style={{color: C.warn}}>STILL</span></div></Pop>
          <Pop t={t} at={V.cant}><div style={{...big, fontSize: 104}}>can't trust</div></Pop>
          <Pop t={t} at={V.trust + .3}>
            <div style={{...big, fontSize: 150, position: 'relative'}}>
              your data<span style={{color: C.warn}}>?</span>
              <div style={{position: 'absolute', left: 0, right: 0, bottom: -18, height: 10, background: C.warn,
                transform: `scaleX(${ease(prog(t, V.data + .1, V.data + .5))})`, transformOrigin: 'left'}} />
            </div>
          </Pop>
        </div>
      </Glitch>
    </Center>
  );
};

// ---------- scene 2: pain points ----------
const PainCard: React.FC<{t: number; at: number; i: number; icon: React.ReactNode; title: string; children: React.ReactNode}> = ({t, at, i, icon, title, children}) => {
  if (t < at) return null;
  const p = pop(t, at, {damping: 15, stiffness: 160, mass: 1});
  const out = ease(prog(t, 9.5 + i * .06, 9.95 + i * .06));
  return (
    <div style={{position: 'absolute', left: 80, right: 80, top: 430 + i * 385, height: 340,
      transform: `translateX(${(1 - p) * 900 - out * 1200}px) rotate(${(1 - p) * 4}deg)`, opacity: clamp(p * 2) * (1 - out),
      background: C.ink2, border: `2px solid ${C.line}`, borderRadius: 36, padding: '40px 48px', boxSizing: 'border-box',
      boxShadow: '0 30px 80px rgba(0,0,0,.5)'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
        <div style={{width: 96, height: 96, borderRadius: 26, background: 'rgba(255,106,77,.14)', display: 'grid', placeItems: 'center', color: C.warn}}>{icon}</div>
        <div style={{fontFamily: INTER, fontWeight: 800, fontSize: 58, color: C.cream, letterSpacing: -1.5, lineHeight: 1.05}}>{title}</div>
      </div>
      <div style={{marginTop: 34}}>{children}</div>
    </div>
  );
};
const Pain: React.FC<{t: number}> = ({t}) => {
  if (t < 3.9 || t > 10.3) return null;
  const mono = {fontFamily: MONO, fontSize: 30, color: '#b9b5a6'};
  const dupNames = ['John Smith', 'Jon Smith', 'J. Smith'];
  const spin = t < V.stalling + .2 ? t * 360 : (V.stalling + .2) * 360; // spinner freezes when "stalling" lands
  const bar = Math.min(.62, ease(prog(t, V.governance, V.stalling)) * .62);
  const blink = t > V.stalling && Math.floor(t * 4) % 2 === 0;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 290, width: '100%', textAlign: 'center', opacity: win(t, 4.1, 9.7)}}>
        <Kicker color={C.warn}>Sound familiar?</Kicker>
      </div>
      <PainCard t={t} at={V.duplicate} i={0} icon={<Users size={56} strokeWidth={2.2} />} title="Duplicate customers">
        <div style={{display: 'flex', gap: 14}}>
          {dupNames.map((n, k) => (
            <div key={n} style={{...mono, padding: '12px 18px', borderRadius: 14, border: `2px solid ${k === 0 ? C.line : C.warn}`,
              opacity: clamp((t - V.duplicate - .15 - k * .18) * 5), transform: `translateY(${(1 - clamp((t - V.duplicate - .15 - k * .18) * 4)) * 20}px)`}}>{n}</div>
          ))}
        </div>
      </PainCard>
      <PainCard t={t} at={V.conflicting} i={1} icon={<BarChart3 size={56} strokeWidth={2.2} />} title="Conflicting reports">
        <div style={{display: 'flex', alignItems: 'center', gap: 30, fontFamily: INTER, fontWeight: 800, fontSize: 64, color: C.cream}}>
          <span>$4.2M</span>
          <span style={{color: C.warn, fontSize: 80, transform: `scale(${1 + .2 * Math.sin(t * 12)})`}}>≠</span>
          <span>$3.7M</span>
          <span style={{...mono, fontSize: 26}}>same quarter</span>
        </div>
      </PainCard>
      <PainCard t={t} at={V.governance} i={2} icon={<Loader size={56} strokeWidth={2.2} style={{transform: `rotate(${spin}deg)`}} />} title="Governance that keeps stalling">
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <div style={{flex: 1, height: 22, borderRadius: 11, background: C.line, overflow: 'hidden'}}>
            <div style={{width: `${bar * 100}%`, height: '100%', background: blink ? C.warn : C.sand}} />
          </div>
          <span style={{...mono, color: blink ? C.warn : '#b9b5a6'}}>{Math.round(bar * 100)}%</span>
        </div>
      </PainCard>
    </AbsoluteFill>
  );
};

// ---------- scene 3: authority ----------
const Authority: React.FC<{t: number}> = ({t}) => {
  if (t < 10 || t > 20.4) return null;
  const head = {fontFamily: INTER, fontWeight: 900, color: C.cream, letterSpacing: -4, lineHeight: .95, textAlign: 'center' as const};
  // 3a: 12+ years
  const a = win(t, 10.1, 11.75);
  const n = Math.round(12 * ease(prog(t, V.twelve - .3, V.twelve + .5)));
  // 3b: Incept logo wipe
  const b = win(t, 11.7, 13.15);
  const wipe = ease(prog(t, V.incept - .05, V.incept + .7));
  // 3c: Informatica Platinum Partner
  const c = win(t, 13.1, 16.15);
  // 3d: Fortune 500
  const d = win(t, 16.1, 17.85);
  // 3e: complex data challenges, untangling
  const e = win(t, 17.8, 20.35);
  const untangle = ease(prog(t, V.complex + .5, 19.9));
  return (
    <AbsoluteFill>
      {a > 0 && <Center style={{opacity: a}}>
        <Pop t={t} at={V.forOver}><Kicker style={{textAlign: 'center'}}>For over</Kicker></Pop>
        <Pop t={t} at={V.twelve - .3}>
          <div style={{...head, fontSize: 420, color: C.sand, marginTop: 20}}>{n}<span style={{fontSize: 260}}>+</span></div>
        </Pop>
        <Pop t={t} at={V.twelve + .2}><div style={{...head, fontSize: 130, letterSpacing: 6}}>YEARS</div></Pop>
      </Center>}
      {b > 0 && <Center style={{opacity: b}}>
        <div style={{width: 900, position: 'relative', clipPath: `inset(0 ${100 - wipe * 100}% 0 0)`}}>
          <Img src={staticFile('incept-logo-white.png')} style={{width: 900}} />
        </div>
        <div style={{width: 6, height: 320, background: C.sand, position: 'absolute', left: 90 + 900 * wipe, opacity: Math.sin(wipe * Math.PI)}} />
      </Center>}
      {c > 0 && <Center style={{opacity: c}}>
        <Pop t={t} at={V.trusted}><Kicker style={{textAlign: 'center', marginBottom: 40}}>A trusted</Kicker></Pop>
        <PlatinumBadge t={t} />
      </Center>}
      {d > 0 && <Center style={{opacity: d}}>
        <Pop t={t} at={V.fortune - .05}><Kicker style={{textAlign: 'center'}}>Helping</Kicker></Pop>
        <Pop t={t} at={V.fortune}><div style={{...head, fontSize: 190, marginTop: 30}}>FORTUNE</div></Pop>
        <Pop t={t} at={V.fortune + .45}><div style={{...head, fontSize: 380, color: C.sand}}>500</div></Pop>
        <Pop t={t} at={V.companies}><div style={{...head, fontSize: 96, letterSpacing: 0, fontWeight: 700}}>companies</div></Pop>
      </Center>}
      {e > 0 && <Center style={{opacity: e}}>
        <Untangle p={untangle} t={t} />
        <Clients t={t} at={V.solve - .05} />
        <div style={{position: 'absolute', top: 1260, width: '100%', textAlign: 'center'}}>
          <Pop t={t} at={V.solve}><div style={{...head, fontSize: 110}}>solve <span style={{color: C.sand}}>complex</span></div></Pop>
          <Pop t={t} at={V.complex + .5}><div style={{...head, fontSize: 110, marginTop: 10}}>data challenges</div></Pop>
        </div>
      </Center>}
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
      {p > .9 && <circle cx={990} cy={955} r={14 * pop(t, 19.75)} fill={C.sand} />}
    </svg>
  );
};

// ---------- scene 4: services ----------
const SERVICES = [
  {at: V.quality, label: 'Data Quality', Icon: BadgeCheck},
  {at: V.master, label: 'Master Data', Icon: Database},
  {at: V.cataloging, label: 'Data Catalog', Icon: BookOpen},
  {at: V.governance2, label: 'Governance', Icon: ShieldCheck},
];
const Services: React.FC<{t: number}> = ({t}) => {
  const vis = win(t, 20.2, 25.1, .2);
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
              <div style={{fontFamily: INTER, fontWeight: 800, fontSize: 52, color: on ? C.ink : C.cream, letterSpacing: -1}}>{label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- scene 5: offer ----------
const Offer: React.FC<{t: number}> = ({t}) => {
  if (t < 25 || t > 33) return null;
  const head = {fontFamily: INTER, fontWeight: 900, color: C.cream, letterSpacing: -3, lineHeight: 1, textAlign: 'center' as const};
  const a = win(t, 25.05, 28.65, .15);
  const b = win(t, 28.6, 30.15, .15);
  const c = win(t, 30.1, 32.85, .15);
  const slam = pop(t, V.free, {damping: 9, stiffness: 220, mass: .8});
  const days = Array.from({length: 5}, (_, i) => clamp((t - V.five - .15 - i * .14) * 6));
  return (
    <AbsoluteFill>
      {a > 0 && <Center style={{opacity: a}}>
        <Pop t={t} at={V.now}><div style={{...head, fontSize: 110, color: C.sand}}>Now,</div></Pop>
        <Pop t={t} at={V.now + .55}><div style={{...head, fontSize: 70, fontWeight: 700, marginTop: 20}}>start with a</div></Pop>
        {t >= V.free && <div style={{...head, fontSize: 330, color: C.ink, background: C.sand, padding: '10px 60px 30px', borderRadius: 40, marginTop: 40,
          transform: `scale(${3 - 2 * slam}) rotate(${-6 * slam}deg)`, opacity: clamp(slam * 2), boxShadow: '0 30px 100px rgba(215,188,162,.35)'}}>FREE</div>}
        <Pop t={t} at={V.five}><div style={{...head, fontSize: 100, marginTop: 70}}>5-day discovery</div></Pop>
        <div style={{display: 'flex', gap: 22, marginTop: 50}}>
          {days.map((d, i) => (
            <div key={i} style={{width: 140, height: 120, borderRadius: 24, border: `3px solid ${d > 0 ? C.sand : C.line}`, background: d >= 1 ? 'rgba(215,188,162,.16)' : 'transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${.8 + .2 * d})`, opacity: .3 + .7 * d}}>
              <CalendarDays size={40} color={C.sand} strokeWidth={2} />
              <div style={{fontFamily: MONO, fontSize: 26, color: C.cream, marginTop: 6}}>DAY {i + 1}</div>
            </div>
          ))}
        </div>
      </Center>}
      {b > 0 && <Center style={{opacity: b}}>
        <Radar t={t} />
        <div style={{position: 'absolute', top: 1300, width: '100%'}}>
          <Pop t={t} at={V.assess - .2}><div style={{...head, fontSize: 96}}>We assess</div></Pop>
          <Pop t={t} at={V.environment - .1}><div style={{...head, fontSize: 96, color: C.sand}}>your environment</div></Pop>
        </div>
      </Center>}
      {c > 0 && <Center style={{opacity: c}}>
        <Roadmap t={t} />
        <div style={{position: 'absolute', top: 330, width: '100%'}}>
          <Pop t={t} at={V.deliver}><Kicker style={{textAlign: 'center'}}>And deliver a</Kicker></Pop>
          <Pop t={t} at={V.prioritized}><div style={{...head, fontSize: 110, marginTop: 24}}>prioritized</div></Pop>
          <Pop t={t} at={V.roadmap}><div style={{...head, fontSize: 150, color: C.sand}}>roadmap</div></Pop>
        </div>
      </Center>}
    </AbsoluteFill>
  );
};
const Radar: React.FC<{t: number}> = ({t}) => {
  const a = (t - V.assess) * 260;
  const nodes = [[-230, -120], [180, -210], [260, 120], [-120, 210], [40, 30], [-300, 80], [120, -40]];
  const appear = ease(prog(t, V.assess - .4, V.assess + .2));
  return (
    <div style={{position: 'absolute', left: 540 - 380, top: 820 - 380, width: 760, height: 760, transform: `scale(${.7 + .3 * appear})`, opacity: appear}}>
      {[1, .7, .4].map(r => <div key={r} style={{position: 'absolute', inset: `${(1 - r) * 50}%`, borderRadius: '50%', border: `2px solid ${C.line}`}} />)}
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%',
        background: `conic-gradient(from ${a}deg, rgba(215,188,162,.55), rgba(215,188,162,0) 70deg, transparent 360deg)`}} />
      {nodes.map(([x, y], i) => {
        const ang = (Math.atan2(y, x) * 180 / Math.PI + 450) % 360;
        const swept = ((a % 360) + 360) % 360;
        const lit = t > V.assess && ((swept - ang + 360) % 360) < 120;
        return <div key={i} style={{position: 'absolute', left: 380 + x - 16, top: 380 + y - 16, width: 32, height: 32, borderRadius: 10,
          background: lit ? C.sand : C.ink2, border: `2px solid ${C.sand}`, transition: 'none'}} />;
      })}
      <div style={{position: 'absolute', left: 380 - 60, top: 380 - 60, width: 120, height: 120, borderRadius: 60, background: C.sand, display: 'grid', placeItems: 'center'}}>
        <ScanSearch size={64} color={C.ink} strokeWidth={2.2} />
      </div>
    </div>
  );
};
const Roadmap: React.FC<{t: number}> = ({t}) => {
  const d = ease(prog(t, V.prioritized - .3, V.roadmap + .4));
  const stops = [{y: 900, x: 300, n: 1}, {y: 1170, x: 760, n: 2}, {y: 1440, x: 340, n: 3}];
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <path d="M140,780 C140,900 300,840 300,900 S760,1020 760,1170 S340,1300 340,1440 S600,1600 900,1600" fill="none" stroke={C.line} strokeWidth={10} strokeLinecap="round" />
      <path d="M140,780 C140,900 300,840 300,900 S760,1020 760,1170 S340,1300 340,1440 S600,1600 900,1600" fill="none" stroke={C.sand} strokeWidth={10} strokeLinecap="round"
        strokeDasharray={1800} strokeDashoffset={1800 * (1 - d)} />
      {stops.map((s, i) => {
        const p = pop(t, V.prioritized - .1 + i * .35);
        return <g key={i} transform={`translate(${s.x},${s.y}) scale(${p})`}>
          <circle r={62} fill={C.sand} />
          <text textAnchor="middle" dy={22} fontFamily={INTER} fontWeight={900} fontSize={64} fill={C.ink}>{s.n}</text>
          <text x={i === 1 ? -100 : 100} textAnchor={i === 1 ? 'end' : 'start'} dy={14} fontFamily={MONO} fontSize={34} fill={C.cream} letterSpacing={4}>PRIORITY {s.n}</text>
        </g>;
      })}
    </svg>
  );
};

// ---------- scene 6: reassurance ----------
const Reassure: React.FC<{t: number}> = ({t}) => {
  const vis = win(t, 32.85, 35.75, .15);
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
  if (t < 35.6) return null;
  const vis = clamp((t - 35.6) / .2);
  const press = t > V.book && t < V.book + .35 ? .94 : 1;
  const pulse = 1 + .03 * Math.sin((t - 35.6) * 6);
  const hand = ease(prog(t, 36.0, V.book));
  return (
    <AbsoluteFill style={{opacity: vis}}>
      <div style={{position: 'absolute', top: 300, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <Pop t={t} at={35.62}><Img src={staticFile('incept-logo-white.png')} style={{width: 620}} /></Pop>
      </div>
      <div style={{position: 'absolute', top: 640, width: '100%', textAlign: 'center'}}>
        <Pop t={t} at={35.7}><div style={{fontFamily: INTER, fontWeight: 900, fontSize: 104, color: C.cream, letterSpacing: -3, lineHeight: 1}}>Book your</div></Pop>
        <Pop t={t} at={35.85}><div style={{fontFamily: INTER, fontWeight: 900, fontSize: 104, color: C.sand, letterSpacing: -3, lineHeight: 1.05}}>FREE 5-day</div></Pop>
        <Pop t={t} at={36.0}><div style={{fontFamily: INTER, fontWeight: 900, fontSize: 104, color: C.cream, letterSpacing: -3, lineHeight: 1}}>discovery</div></Pop>
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
      <div style={{position: 'absolute', top: 1420, width: '100%', textAlign: 'center', opacity: clamp((t - 36.3) * 4)}}>
        <div style={{fontFamily: MONO, fontSize: 34, color: C.cream, letterSpacing: 6}}>INCEPTDS.COM</div>
        <div style={{marginTop: 20, display: 'flex', justifyContent: 'center', transform: `translateY(${Math.abs(Math.sin((t - 36) * 5)) * 18}px)`}}>
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
  const wallOpacity = t < 10 ? .55 * (1 - prog(t, 9.4, 10)) : 0;
  // the scene swaps from a cold, broken mood to warm once Incept enters
  const warm = prog(t, 10, 11);
  return (
    <AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(1200px 1400px at 50% 40%, rgba(255,106,77,${.10 * (1 - warm)}), transparent 70%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(1200px 1400px at 50% 45%, rgba(215,188,162,${.13 * warm}), transparent 70%)`}} />
      <DataWall t={t} opacity={wallOpacity} corrupt={t < 3.9 ? prog(t, 1.5, 3.3) : 1} />
      <Hook t={t} />
      <Pain t={t} />
      <Authority t={t} />
      <Services t={t} />
      <Offer t={t} />
      <Reassure t={t} />
      <CTA t={t} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55) 100%)'}} />
      <Grain t={t} />
      <Audio src={staticFile('vo.mp3')} />
      <Audio src={staticFile('music.wav')} volume={.9} />
    </AbsoluteFill>
  );
};
