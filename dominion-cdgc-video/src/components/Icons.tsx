import React, { createContext, useContext } from 'react';
import { C, ICON_STROKE_PX } from '../theme';
import { clamp, E } from '../lib/anim';

/*
 * Lineal-colour icon set (Flaticon "detailed mixed / lineal color" style):
 * white outlines (10px at native size) over #0072CE shapes, with the dark
 * background colour used for inner contrast areas. Every primitive supports a
 * draw-on animation driven by the icon's progress value.
 */

type F = 'b' | 'd' | 'w' | 'n';
type Ctx = { p: number; f: number; sw: number };
const IconCtx = createContext<Ctx>({ p: 1, f: 1, sw: 2.5 });

const fc = (f: F) => (f === 'b' ? C.blue : f === 'd' ? C.bg : f === 'w' ? '#ffffff' : 'none');

const useStroke = (f: F) => {
  const c = useContext(IconCtx);
  const done = c.p >= 0.999;
  return {
    fill: fc(f),
    fillOpacity: f === 'n' ? 0 : c.f,
    stroke: '#ffffff',
    strokeWidth: c.sw,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    pathLength: 1,
    strokeDasharray: done ? undefined : '1 1',
    strokeDashoffset: done ? undefined : 1 - c.p,
    strokeOpacity: c.p <= 0.002 ? 0 : 1,
  };
};

const P: React.FC<{ d: string; f?: F }> = ({ d, f = 'n' }) => <path d={d} {...useStroke(f)} />;
const R: React.FC<{ x: number; y: number; w: number; h: number; rx?: number; f?: F }> = ({
  x,
  y,
  w,
  h,
  rx = 0,
  f = 'n',
}) => <rect x={x} y={y} width={w} height={h} rx={rx} {...useStroke(f)} />;
const Ci: React.FC<{ cx: number; cy: number; r: number; f?: F }> = ({ cx, cy, r, f = 'n' }) => (
  <circle cx={cx} cy={cy} r={r} {...useStroke(f)} />
);
const El: React.FC<{ cx: number; cy: number; rx: number; ry: number; f?: F }> = ({ cx, cy, rx, ry, f = 'n' }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} {...useStroke(f)} />
);
const Dot: React.FC<{ cx: number; cy: number; r: number; c?: F }> = ({ cx, cy, r, c = 'w' }) => {
  const ctx = useContext(IconCtx);
  return <circle cx={cx} cy={cy} r={r} fill={fc(c)} opacity={ctx.f} />;
};

// ── Icon drawings (100 × 100 design grid) ──────────────────────────────────

const Catalog = () => (
  <>
    <R x={24} y={14} w={60} h={80} rx={7} f="d" />
    <P d="M78 24 V86" />
    <R x={14} y={6} w={62} h={80} rx={7} f="b" />
    <P d="M26 6 V86" />
    <P d="M38 30 V60 A14 5 0 0 0 66 60 V30" f="b" />
    <El cx={52} cy={30} rx={14} ry={5} f="b" />
    <P d="M38 40 A14 5 0 0 0 66 40" />
    <P d="M38 50 A14 5 0 0 0 66 50" />
    <P d="M58 86 V98 L64 93 L70 98 V86" f="b" />
  </>
);

const Gem = () => (
  <>
    <P d="M30 20 H70 L88 40 L50 86 L12 40 Z" f="b" />
    <P d="M12 40 H88" />
    <P d="M30 20 L40 40 L50 86 L60 40 L70 20" />
    <P d="M40 40 L50 20 L60 40" />
  </>
);

const User = () => (
  <>
    <Ci cx={50} cy={31} r={17} f="b" />
    <P d="M16 92 V84 A24 24 0 0 1 40 60 H60 A24 24 0 0 1 84 84 V92 Z" f="b" />
  </>
);

const Database = () => (
  <>
    <P d="M20 22 V78 A30 10 0 0 0 80 78 V22" f="b" />
    <El cx={50} cy={22} rx={30} ry={10} f="b" />
    <P d="M20 41 A30 10 0 0 0 80 41" />
    <P d="M20 60 A30 10 0 0 0 80 60" />
    <Dot cx={30} cy={53} r={3} />
    <Dot cx={39} cy={55} r={3} />
    <Dot cx={30} cy={72} r={3} />
    <Dot cx={39} cy={74} r={3} />
  </>
);

const Pin = () => (
  <>
    <P d="M50 94 C50 94 18 62 18 38 A32 32 0 0 1 82 38 C82 62 50 94 50 94 Z" f="b" />
    <Ci cx={50} cy={38} r={12} f="d" />
  </>
);

const Building = () => (
  <>
    <R x={62} y={36} w={24} h={54} rx={3} f="d" />
    <R x={18} y={10} w={44} h={80} rx={3} f="b" />
    <R x={27} y={20} w={10} h={10} rx={2} f="d" />
    <R x={43} y={20} w={10} h={10} rx={2} f="d" />
    <R x={27} y={38} w={10} h={10} rx={2} f="d" />
    <R x={43} y={38} w={10} h={10} rx={2} f="d" />
    <R x={27} y={56} w={10} h={10} rx={2} f="d" />
    <R x={43} y={56} w={10} h={10} rx={2} f="d" />
    <P d="M70 50 H78 M70 64 H78" />
    <R x={35} y={74} w={10} h={16} rx={2} f="d" />
    <P d="M8 90 H92" />
  </>
);

const Cloud = () => (
  <>
    <P d="M30 78 H72 A17 17 0 0 0 74 44 A23 23 0 0 0 30 40 A19 19 0 0 0 30 78 Z" f="b" />
    <P d="M38 55 A11 11 0 0 1 48 45" />
  </>
);

const Server = () => (
  <>
    <R x={16} y={10} w={68} h={80} rx={8} f="b" />
    <P d="M16 36.7 H84" />
    <P d="M16 63.3 H84" />
    <Dot cx={28} cy={23.3} r={3.6} />
    <Dot cx={28} cy={50} r={3.6} />
    <Dot cx={28} cy={76.6} r={3.6} />
    <P d="M52 23.3 H72" />
    <P d="M52 50 H72" />
    <P d="M52 76.6 H72" />
  </>
);

const App = () => (
  <>
    <R x={8} y={14} w={84} h={72} rx={7} f="d" />
    <P d="M8 32 V21 A7 7 0 0 1 15 14 H85 A7 7 0 0 1 92 21 V32 Z" f="b" />
    <Dot cx={18} cy={23} r={2.8} />
    <Dot cx={27} cy={23} r={2.8} />
    <Dot cx={36} cy={23} r={2.8} />
    <R x={18} y={42} w={28} h={34} rx={4} f="b" />
    <P d="M56 46 H82" />
    <P d="M56 58 H82" />
    <P d="M56 70 H72" />
  </>
);

const Hierarchy = () => (
  <>
    <P d="M50 30 V48" />
    <P d="M20 66 V48 H80 V66" />
    <P d="M50 48 V66" />
    <R x={34} y={8} w={32} h={22} rx={5} f="b" />
    <R x={8} y={66} w={24} h={22} rx={5} f="b" />
    <R x={38} y={66} w={24} h={22} rx={5} f="b" />
    <R x={68} y={66} w={24} h={22} rx={5} f="b" />
  </>
);

const Cube = () => (
  <>
    <P d="M14 29 V71 L50 90 V48 Z" f="b" />
    <P d="M86 29 V71 L50 90 V48 Z" f="d" />
    <P d="M50 10 L86 29 L50 48 L14 29 Z" f="b" />
    <P d="M64 58 V74" />
  </>
);

const Search = () => (
  <>
    <P d="M61 67 L67 61 L90 84 A4.24 4.24 0 0 1 84 90 Z" f="b" />
    <Ci cx={42} cy={42} r={29} f="b" />
    <Ci cx={42} cy={42} r={19} f="d" />
    <P d="M31 38 A12 12 0 0 1 40 30" />
  </>
);

const Shield = () => (
  <>
    <P d="M50 8 L84 20 V46 C84 68 68 84 50 92 C32 84 16 68 16 46 V20 Z" f="b" />
    <P d="M34 50 L46 62 L67 38" />
  </>
);

const Warn = () => (
  <>
    <P d="M50 12 L92 86 H8 Z" f="b" />
    <P d="M50 38 V60" />
    <Dot cx={50} cy={72} r={4.2} />
  </>
);

const Glossary = () => (
  <>
    <P d="M50 26 C42 18 26 15 8 18 V80 C26 77 42 80 50 88 Z" f="b" />
    <P d="M50 26 C58 18 74 15 92 18 V80 C74 77 58 80 50 88 Z" f="b" />
    <P d="M18 34 C26 32 34 33 40 37" />
    <P d="M18 48 C26 46 34 47 40 51" />
    <P d="M18 62 C26 60 34 61 40 65" />
    <P d="M60 37 C66 33 74 32 82 34" />
    <P d="M60 51 C66 47 74 46 82 48" />
  </>
);

const Layers = () => (
  <>
    <P d="M50 50 L90 70 L50 90 L10 70 Z" f="b" />
    <P d="M50 30 L90 50 L50 70 L10 50 Z" f="d" />
    <P d="M50 10 L90 30 L50 50 L10 30 Z" f="b" />
  </>
);

const Table = () => (
  <>
    <R x={8} y={14} w={84} h={72} rx={7} f="d" />
    <P d="M8 34 H36 V86 H15 A7 7 0 0 1 8 79 Z" f="b" />
    <P d="M8 34 V21 A7 7 0 0 1 15 14 H85 A7 7 0 0 1 92 21 V34 Z" f="b" />
    <P d="M8 51.3 H92" />
    <P d="M8 68.6 H92" />
    <P d="M36 34 V86" />
    <P d="M64 34 V86" />
  </>
);

const Link = () => (
  <g transform="rotate(-40 50 50)">
    <R x={4} y={36} w={52} h={28} rx={14} f="b" />
    <R x={16} y={45} w={28} h={10} rx={5} f="d" />
    <R x={44} y={36} w={52} h={28} rx={14} f="b" />
    <R x={56} y={45} w={28} h={10} rx={5} f="d" />
  </g>
);

const Form = () => (
  <>
    <R x={18} y={10} w={64} h={84} rx={7} f="b" />
    <R x={36} y={4} w={28} h={13} rx={4} f="d" />
    <R x={28} y={28} w={44} h={11} rx={3} f="d" />
    <R x={28} y={46} w={44} h={11} rx={3} f="d" />
    <R x={28} y={64} w={24} h={11} rx={3} f="d" />
    <P d="M60 71 L65 76 L74 65" />
  </>
);

const sealPath = (() => {
  const n = 14;
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const r = i % 2 === 0 ? 40 : 34.5;
    d += `${i === 0 ? 'M' : 'L'}${(50 + r * Math.cos(a)).toFixed(2)} ${(44 + r * Math.sin(a)).toFixed(2)} `;
  }
  return d + 'Z';
})();

const Badge = () => (
  <>
    <P d="M34 66 L26 94 L37 89 L43 99 L50 76 Z" f="b" />
    <P d="M66 66 L74 94 L63 89 L57 99 L50 76 Z" f="b" />
    <P d={sealPath} f="b" />
    <Ci cx={50} cy={44} r={24} f="d" />
    <P d="M39 44 L47 52 L62 36" />
  </>
);

const Asterisk = () => (
  <>
    <Ci cx={50} cy={50} r={42} f="b" />
    <P d="M50 26 V74" />
    <P d="M29.2 38 L70.8 62" />
    <P d="M70.8 38 L29.2 62" />
  </>
);

const People = () => (
  <>
    <Ci cx={23} cy={40} r={10} f="d" />
    <P d="M5 80 V76 A14 14 0 0 1 19 62 H27 A14 14 0 0 1 41 76 V80 Z" f="d" />
    <Ci cx={77} cy={40} r={10} f="d" />
    <P d="M59 80 V76 A14 14 0 0 1 73 62 H81 A14 14 0 0 1 95 76 V80 Z" f="d" />
    <Ci cx={50} cy={34} r={14} f="b" />
    <P d="M24 92 V86 A20 20 0 0 1 44 66 H56 A20 20 0 0 1 76 86 V92 Z" f="b" />
  </>
);

const Check = () => (
  <>
    <Ci cx={50} cy={50} r={42} f="b" />
    <P d="M30 51 L44 65 L71 36" />
  </>
);

const Folder = () => (
  <>
    <P d="M8 28 A6 6 0 0 1 14 22 H36 L44 30 H86 A6 6 0 0 1 92 36 V78 A6 6 0 0 1 86 84 H14 A6 6 0 0 1 8 78 Z" f="b" />
    <P d="M8 42 H92" />
  </>
);

export const ICONS = {
  catalog: Catalog,
  gem: Gem,
  user: User,
  database: Database,
  pin: Pin,
  building: Building,
  cloud: Cloud,
  server: Server,
  app: App,
  hierarchy: Hierarchy,
  cube: Cube,
  search: Search,
  shield: Shield,
  warn: Warn,
  glossary: Glossary,
  layers: Layers,
  table: Table,
  link: Link,
  form: Form,
  badge: Badge,
  asterisk: Asterisk,
  people: People,
  check: Check,
  folder: Folder,
};
export type IconName = keyof typeof ICONS;

/** Static icon. `p` (0..1) drives the draw-on: strokes first, fills follow. */
export const Icon: React.FC<{ name: IconName; size: number; p?: number }> = ({ name, size, p = 1 }) => {
  const draw = E.inOutCubic(clamp(p / 0.72));
  const fill = E.outCubic(clamp((p - 0.28) / 0.55));
  const sw = (ICON_STROKE_PX * 100) / size;
  const G = ICONS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: 'visible', display: 'block' }}
    >
      <IconCtx.Provider value={{ p: draw, f: fill, sw }}>
        <G />
      </IconCtx.Provider>
    </svg>
  );
};
