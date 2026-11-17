import React from 'react';
import { C } from '../theme';

/**
 * Lineal-color icon set (Flaticon "lineal color" look): white outline strokes over
 * offset brand-blue (#0072CE) fill shapes. Drawn on a 96×96 grid; the stroke is
 * converted so it always renders at exactly STROKE_PX on the final 4K frame.
 * `progress` (0→1) animates the outlines drawing on and the fills popping in.
 */
export const STROKE_PX = 10;

type El = React.ReactElement;
type Def = { fills: El[]; strokes: El[] };

const gearPath = (() => {
  const cx = 48, cy = 48, teeth = 8, rOut = 38, rIn = 30;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2;
    const step = (Math.PI * 2) / teeth;
    const angles = [a0 - step * 0.18, a0 - step * 0.1, a0 + step * 0.1, a0 + step * 0.18, a0 + step * 0.32, a0 + step * 0.68];
    const radii = [rIn, rOut, rOut, rIn, rIn, rIn];
    angles.forEach((a, k) => pts.push(`${(cx + Math.cos(a) * radii[k]).toFixed(2)} ${(cy + Math.sin(a) * radii[k]).toFixed(2)}`));
  }
  return `M${pts.join(' L')} Z`;
})();

const cube = (x: number, y: number, s: number) => ({
  top: `M${x} ${y} L${x + s} ${y + s / 2} L${x} ${y + s} L${x - s} ${y + s / 2} Z`,
  left: `M${x - s} ${y + s / 2} L${x} ${y + s} L${x} ${y + 2 * s} L${x - s} ${y + 1.5 * s} Z`,
  right: `M${x} ${y + s} L${x + s} ${y + s / 2} L${x + s} ${y + 1.5 * s} L${x} ${y + 2 * s} Z`,
});

const p = (d: string, k?: string) => <path key={k ?? d} d={d} />;
const r = (x: number, y: number, w: number, h: number, rx = 0) => <rect key={`r${x}-${y}-${w}-${h}`} x={x} y={y} width={w} height={h} rx={rx} />;
const c = (cx: number, cy: number, rr: number) => <circle key={`c${cx}-${cy}-${rr}`} cx={cx} cy={cy} r={rr} />;
const l = (x1: number, y1: number, x2: number, y2: number) => <line key={`l${x1}-${y1}-${x2}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
const e = (cx: number, cy: number, rx: number, ry: number) => <ellipse key={`e${cx}-${cy}-${rx}`} cx={cx} cy={cy} rx={rx} ry={ry} />;

export const ICONS: Record<string, Def> = {
  searchDoc: {
    fills: [r(14, 18, 40, 62, 4), c(64, 64, 11)],
    strokes: [p('M44 82 H20 V10 H48 L60 22 V44'), p('M48 10 V22 H60'), l(28, 32, 50, 32), l(28, 42, 50, 42), l(28, 52, 42, 52), c(62, 62, 14), l(72, 72, 86, 86)],
  },
  shieldCheck: {
    fills: [p('M43 18 L72 28 V47 C72 64 60 75 43 81 C27 75 15 64 15 47 V28 Z')],
    strokes: [p('M48 10 L80 21 V45 C80 66 66 80 48 87 C30 80 16 66 16 45 V21 Z'), p('M33 47 L44 58 L64 37')],
  },
  compareCheck: {
    fills: [r(8, 42, 34, 18, 4), r(54, 42, 34, 18, 4), c(50, 74, 13)],
    strokes: [r(8, 14, 34, 46, 4), r(54, 14, 34, 46, 4), l(15, 26, 34, 26), l(15, 34, 30, 34), l(61, 26, 80, 26), l(61, 34, 76, 34), l(44, 30, 52, 30), c(48, 72, 14), p('M41 72 L46 77 L56 67')],
  },
  check: {
    fills: [c(52, 52, 32)],
    strokes: [c(48, 48, 36), p('M30 49 L43 62 L67 36')],
  },
  database: {
    fills: [p('M20 40 C20 46 32 50 48 50 C64 50 76 46 76 40 V57 C76 63 64 67 48 67 C32 67 20 63 20 57 Z')],
    strokes: [e(48, 22, 28, 10), p('M20 22 V74 C20 80 32 85 48 85 C64 85 76 80 76 74 V22'), p('M20 40 C20 46 32 50 48 50 C64 50 76 46 76 40'), p('M20 57 C20 63 32 67 48 67 C64 67 76 63 76 57')],
  },
  catalog: {
    fills: [r(14, 16, 58, 72, 5)],
    strokes: [r(20, 10, 58, 72, 5), l(31, 10, 31, 82), l(39, 28, 68, 28), l(39, 38, 68, 38), l(39, 48, 58, 48), p('M58 10 V30 L64 25 L70 30 V10')],
  },
  team: {
    fills: [p('M28 76 C28 62 37 54 48 54 C59 54 68 62 68 76 Z'), c(50, 34, 9)],
    strokes: [c(48, 31, 11), p('M28 76 C28 61 37 52 48 52 C59 52 68 61 68 76'), c(21, 40, 8), p('M7 72 C7 62 13 56 21 56 C25 56 28 57 30 59'), c(75, 40, 8), p('M89 72 C89 62 83 56 75 56 C71 56 68 57 66 59')],
  },
  table: {
    fills: [p('M12 36 V22 a6 6 0 0 1 6 -6 H78 a6 6 0 0 1 6 6 V36 Z'), r(16, 62, 24, 14)],
    strokes: [r(12, 16, 72, 64, 6), l(12, 36, 84, 36), l(12, 58, 84, 58), l(44, 36, 44, 80)],
  },
  schemaTree: {
    fills: [r(36, 8, 24, 18, 3), r(66, 48, 24, 18, 3)],
    strokes: [r(36, 8, 24, 18, 3), l(48, 26, 48, 37), p('M18 48 V37 H78 V48'), l(48, 37, 48, 48), r(6, 48, 24, 18, 3), r(36, 48, 24, 18, 3), r(66, 48, 24, 18, 3), l(48, 66, 48, 74), r(36, 74, 24, 16, 3)],
  },
  folderSchema: {
    fills: [p('M14 38 H84 V76 a4 4 0 0 1 -4 4 H18 a4 4 0 0 1 -4 -4 Z')],
    strokes: [p('M10 24 a4 4 0 0 1 4 -4 H36 L44 28 H82 a4 4 0 0 1 4 4 V72 a4 4 0 0 1 -4 4 H14 a4 4 0 0 1 -4 -4 Z'), c(30, 52, 7), c(66, 52, 7), l(37, 52, 59, 52)],
  },
  column: {
    fills: [r(34, 14, 28, 70)],
    strokes: [r(12, 12, 72, 72, 6), l(12, 34, 84, 34), l(12, 58, 84, 58), l(34, 12, 34, 84), l(62, 12, 62, 84)],
  },
  governance: {
    fills: [p('M16 34 L48 15 L80 34 Z'), r(10, 76, 76, 9)],
    strokes: [p('M10 34 L48 12 L86 34 Z'), l(14, 40, 82, 40), l(22, 46, 22, 70), l(40, 46, 40, 70), l(56, 46, 56, 70), l(74, 46, 74, 70), l(12, 76, 84, 76), l(8, 86, 88, 86)],
  },
  lineage: {
    fills: [c(20, 50, 10), r(58, 40, 28, 18, 4)],
    strokes: [c(18, 48, 10), r(56, 10, 30, 18, 4), r(56, 39, 30, 18, 4), r(56, 68, 30, 18, 4), p('M28 48 H40'), p('M40 19 V77'), p('M40 19 H54'), p('M40 48 H54'), p('M40 77 H54'), p('M49 14 L54 19 L49 24'), p('M49 72 L54 77 L49 82')],
  },
  report: {
    fills: [r(24, 48, 12, 22, 2), r(40, 30, 12, 40, 2), r(56, 42, 12, 28, 2)],
    strokes: [r(12, 12, 72, 72, 6), r(24, 48, 12, 22, 2), r(40, 30, 12, 40, 2), r(56, 42, 12, 28, 2), l(20, 74, 76, 74)],
  },
  warning: {
    fills: [p('M43 22 L76 82 H10 Z')],
    strokes: [p('M48 12 L86 80 H10 Z'), l(48, 36, 48, 58), l(48, 68, 48, 69)],
  },
  search: {
    fills: [c(44, 44, 22)],
    strokes: [c(40, 40, 26), l(59, 59, 84, 84), p('M27 34 a14 14 0 0 1 11 -9')],
  },
  profile: {
    fills: [r(18, 38, 9, 18, 1), r(31, 28, 9, 28, 1), r(44, 42, 9, 14, 1), c(68, 64, 10)],
    strokes: [r(8, 14, 58, 50, 5), l(16, 56, 58, 56), c(66, 62, 14), l(76, 72, 88, 84)],
  },
  nullSet: {
    fills: [c(51, 51, 21)],
    strokes: [r(10, 10, 76, 76, 12), c(48, 48, 21), l(30, 70, 66, 26)],
  },
  distinct: {
    fills: [p('M68 52 L84 68 L68 84 L52 68 Z'), c(30, 30, 10)],
    strokes: [c(28, 28, 13), c(68, 28, 13), c(28, 68, 13), p('M68 52 L84 68 L68 84 L52 68 Z')],
  },
  gauge: {
    fills: [p('M12 68 A36 36 0 0 1 48 32 V46 A22 22 0 0 0 26 68 Z')],
    strokes: [p('M12 68 A36 36 0 0 1 84 68'), l(48, 68, 66, 46), c(48, 68, 5), l(30, 40, 34, 45), l(48, 32, 48, 38), l(66, 40, 62, 45), l(8, 80, 88, 80)],
  },
  ruleDoc: {
    fills: [p('M50 80 L76 54 L82 60 L56 86 Z'), r(12, 16, 36, 30, 3)],
    strokes: [p('M46 84 H16 V10 H50 L62 22 V40'), p('M50 10 V22 H62'), l(24, 32, 50, 32), l(24, 42, 46, 42), l(24, 52, 40, 52), p('M46 80 L74 52 L84 62 L56 90 L44 92 Z'), l(70, 56, 80, 66)],
  },
  rows: {
    fills: [p('M10 30 V19 a5 5 0 0 1 5 -5 H81 a5 5 0 0 1 5 5 V30 Z'), r(10, 58, 76, 14)],
    strokes: [r(10, 14, 76, 68, 5), l(10, 30, 86, 30), l(10, 44, 86, 44), l(10, 58, 86, 58), l(10, 72, 86, 72), l(28, 30, 28, 82)],
  },
  clipboard: {
    fills: [r(34, 9, 28, 14, 4), r(14, 22, 58, 68, 5), r(28, 56, 10, 10, 2)],
    strokes: [r(18, 16, 60, 72, 5), r(34, 9, 28, 14, 4), r(28, 36, 10, 10, 2), r(28, 56, 10, 10, 2), l(46, 41, 66, 41), l(46, 61, 66, 61), p('M29 40 L33 44 L41 35')],
  },
  loop: {
    fills: [c(48, 48, 14)],
    strokes: [p('M18 52 A30 30 0 0 1 72 26'), p('M74 12 L73 27 L58 26'), p('M78 44 A30 30 0 0 1 24 70'), p('M22 84 L23 69 L38 70'), p('M40 48 L46 54 L57 42')],
  },
  scale: {
    fills: [p('M4 52 A12 9 0 0 0 28 52 Z'), p('M68 52 A12 9 0 0 0 92 52 Z')],
    strokes: [l(48, 16, 48, 82), l(30, 86, 66, 86), l(14, 24, 82, 24), p('M16 24 L6 52 H26 Z'), p('M80 24 L70 52 H90 Z'), c(48, 14, 4)],
  },
  sliders: {
    fills: [r(16, 28, 16, 12, 4), r(40, 56, 16, 12, 4), r(64, 20, 16, 12, 4)],
    strokes: [l(24, 10, 24, 86), l(48, 10, 48, 86), l(72, 10, 72, 86), r(16, 28, 16, 12, 4), r(40, 56, 16, 12, 4), r(64, 20, 16, 12, 4)],
  },
  lock: {
    fills: [r(13, 48, 60, 42, 6)],
    strokes: [r(18, 42, 60, 44, 6), p('M30 42 V30 a18 18 0 0 1 36 0 V42'), c(48, 60, 5), l(48, 65, 48, 74)],
  },
  bug: {
    fills: [e(51, 59, 16, 22)],
    strokes: [e(48, 56, 18, 24), l(48, 34, 48, 80), p('M37 36 a11 11 0 0 1 22 0'), l(30, 48, 16, 42), l(30, 60, 13, 60), l(31, 71, 17, 80), l(66, 48, 80, 42), l(66, 60, 83, 60), l(65, 71, 79, 80), l(42, 28, 36, 17), l(54, 28, 60, 17)],
  },
  calendar: {
    fills: [p('M12 36 V24 a6 6 0 0 1 6 -6 H78 a6 6 0 0 1 6 6 V36 Z'), r(52, 58, 16, 13, 2)],
    strokes: [r(12, 18, 72, 66, 6), l(12, 36, 84, 36), l(30, 10, 30, 24), l(66, 10, 66, 24), r(24, 46, 12, 10, 2), r(42, 46, 12, 10, 2), r(60, 46, 12, 10, 2), r(24, 62, 12, 10, 2), r(42, 62, 12, 10, 2)],
  },
  stopwatch: {
    fills: [p('M48 54 L48 22 A32 32 0 0 1 79 46 Z')],
    strokes: [c(48, 54, 32), r(39, 6, 18, 9, 3), l(48, 15, 48, 22), l(48, 54, 48, 34), l(48, 54, 61, 62), l(73, 24, 80, 18)],
  },
  chat: {
    fills: [p('M88 46 a6 6 0 0 0 -6 -6 H42 a6 6 0 0 0 -6 6 V68 a6 6 0 0 0 6 6 H70 L82 84 V74 a6 6 0 0 0 6 -6 Z')],
    strokes: [p('M8 18 a6 6 0 0 1 6 -6 H58 a6 6 0 0 1 6 6 V40 a6 6 0 0 1 -6 6 H28 L16 56 V46 a6 6 0 0 1 -8 -6 Z'), p('M86 44 a6 6 0 0 0 -6 -6 H40 a6 6 0 0 0 -6 6 V66 a6 6 0 0 0 6 6 H68 L80 82 V72 a6 6 0 0 0 6 -6 Z'), l(20, 26, 50, 26), l(20, 34, 40, 34)],
  },
  steward: {
    fills: [p('M70 52 L86 58 V68 C86 78 78 84 70 87 C62 84 54 78 54 68 V58 Z'), c(42, 32, 12)],
    strokes: [c(40, 30, 14), p('M12 86 C12 66 24 55 40 55 C46 55 51 57 55 60'), p('M70 50 L88 57 V68 C88 79 79 86 70 89 C61 86 52 79 52 68 V57 Z'), p('M63 69 L68 74 L77 64')],
  },
  glossary: {
    fills: [p('M48 22 C56 14 70 12 86 14 V78 C70 76 56 78 48 86 Z')],
    strokes: [p('M48 22 C40 14 26 12 10 14 V78 C26 76 40 78 48 86 C56 78 70 76 86 78 V14 C70 12 56 14 48 22 Z'), l(48, 22, 48, 86), p('M19 58 L28 32 L37 58'), l(22, 49, 34, 49), l(58, 34, 76, 32), l(58, 44, 76, 42), l(58, 54, 72, 53)],
  },
  review: {
    fills: [p('M58 12 H86 a4 4 0 0 1 4 4 V38 a4 4 0 0 1 -4 4 H72 L64 50 V42 H58 a4 4 0 0 1 -4 -4 V16 a4 4 0 0 1 4 -4 Z'), c(34, 38, 11)],
    strokes: [c(32, 36, 12), p('M10 86 C10 67 20 57 32 57 C44 57 54 67 54 86'), p('M58 12 H86 a4 4 0 0 1 4 4 V38 a4 4 0 0 1 -4 4 H72 L64 50 V42 H58 a4 4 0 0 1 -4 -4 V16 a4 4 0 0 1 4 -4 Z'), p('M64 27 L70 33 L80 22')],
  },
  cubes: (() => {
    const a = cube(48, 6, 19), b = cube(29, 44, 19), d = cube(67, 44, 19);
    return {
      fills: [p(a.right, 'fa'), p(b.right, 'fb'), p(d.right, 'fd'), p(a.top, 'fat')],
      strokes: [p(a.top, 'sa1'), p(a.left, 'sa2'), p(a.right, 'sa3'), p(b.top, 'sb1'), p(b.left, 'sb2'), p(b.right, 'sb3'), p(d.top, 'sd1'), p(d.left, 'sd2'), p(d.right, 'sd3')],
    };
  })(),
  cube: (() => {
    const a = cube(48, 10, 36);
    return {
      fills: [p(a.right, 'cr')],
      strokes: [p(a.top, 'ct'), p(a.left, 'cl'), p(a.right, 'crs')],
    };
  })(),
  eye: {
    fills: [c(51, 51, 14)],
    strokes: [p('M6 48 C18 26 32 18 48 18 C64 18 78 26 90 48 C78 70 64 78 48 78 C32 78 18 70 6 48 Z'), c(48, 48, 14), c(48, 48, 4)],
  },
  bolt: {
    fills: [p('M50 12 L16 58 H42 L34 90 Z')],
    strokes: [p('M54 6 L20 54 H46 L40 90 L78 38 H52 Z')],
  },
  server: {
    fills: [r(8, 41, 72, 22, 5), r(8, 14, 72, 22, 5)],
    strokes: [r(12, 10, 72, 22, 5), r(12, 37, 72, 22, 5), r(12, 64, 72, 22, 5), l(22, 21, 36, 21), l(22, 48, 36, 48), l(22, 75, 36, 75), c(70, 21, 3), c(70, 48, 3), c(70, 75, 3)],
  },
  pointer: {
    fills: [p('M26 22 L26 78 L40 66 L50 88 L60 84 L50 62 L68 62 Z')],
    strokes: [p('M30 18 L30 74 L44 62 L54 84 L64 80 L54 58 L72 58 Z'), l(18, 10, 12, 4), l(12, 26, 4, 26), l(30, 6, 30, 0)],
  },
  layers: {
    fills: [p('M48 14 L84 33 L48 52 L12 33 Z')],
    strokes: [p('M48 12 L86 32 L48 52 L10 32 Z'), p('M10 48 L48 68 L86 48'), p('M10 64 L48 84 L86 64')],
  },
  gear: {
    fills: [c(50, 50, 20)],
    strokes: [p(gearPath, 'gear'), c(48, 48, 11)],
  },
  pin: {
    fills: [p('M44 86 C44 86 18 58 18 40 a26 26 0 0 1 52 0 C70 58 44 86 44 86 Z')],
    strokes: [p('M48 88 C48 88 20 58 20 38 a28 28 0 0 1 56 0 C76 58 48 88 48 88 Z'), c(48, 38, 10)],
  },
  clockCheck: {
    fills: [c(72, 72, 15), c(46, 50, 26)],
    strokes: [c(44, 48, 32), l(44, 48, 44, 30), l(44, 48, 56, 54), c(72, 72, 14), p('M65 72 L70 77 L79 67')],
  },
  docStack: {
    fills: [r(26, 10, 50, 16, 4), r(14, 22, 52, 62, 4)],
    strokes: [r(26, 10, 50, 62, 4), p('M18 22 V82 H66'), l(34, 36, 66, 36), l(34, 46, 66, 46), l(34, 56, 54, 56)],
  },
  extract: {
    fills: [p('M14 30 C14 35 24 38 36 38 C48 38 58 35 58 30 V52 C58 57 48 60 36 60 C24 60 14 57 14 52 Z'), r(66, 50, 24, 30, 3)],
    strokes: [e(36, 22, 22, 8), p('M14 22 V70 C14 75 24 78 36 78 C48 78 58 75 58 70 V22'), p('M14 46 C14 51 24 54 36 54 C48 54 58 51 58 46'), p('M62 30 H80 V44'), p('M74 38 L80 44 L86 38'), r(68, 50, 22, 32, 3)],
  },
};

export type IconName = keyof typeof ICONS;

export const Icon: React.FC<{
  name: IconName;
  size: number;
  progress?: number;
  stroke?: string;
  fill?: string;
  strokePx?: number;
  style?: React.CSSProperties;
}> = ({ name, size, progress = 1, stroke = C.white, fill = C.blue, strokePx = STROKE_PX, style }) => {
  const def = ICONS[name];
  // viewBox spans 108 units (96 grid + 6 padding each side) across `size` px.
  const sw = (strokePx * 108) / size;
  const pr = Math.max(0, Math.min(1, progress));
  const strokePhase = Math.min(1, pr / 0.75);
  const fillPhase = Math.max(0, Math.min(1, (pr - 0.3) / 0.6));
  const n = def.strokes.length;
  return (
    <svg width={size} height={size} viewBox="-6 -6 108 108" style={{ overflow: 'visible', ...style }}>
      <g fill={fill} stroke="none" style={{ transformOrigin: '48px 48px', transform: `scale(${0.6 + 0.4 * fillPhase})` }} opacity={fillPhase}>
        {def.fills}
      </g>
      <g fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        {def.strokes.map((el, i) => {
          const start = n > 1 ? (i / n) * 0.45 : 0;
          const local = Math.max(0, Math.min(1, (strokePhase - start) / 0.55));
          return React.cloneElement(el, {
            key: i,
            pathLength: 1,
            strokeDasharray: '1 1',
            strokeDashoffset: 1 - local,
            opacity: local <= 0.001 ? 0 : 1,
          } as React.SVGProps<SVGElement>);
        })}
      </g>
    </svg>
  );
};
