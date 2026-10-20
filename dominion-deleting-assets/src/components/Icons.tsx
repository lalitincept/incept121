import React from 'react';
import {C} from '../theme';
import {clamp01, ease} from '../lib/anim';

// Lineal-colour icon set drawn on a 512 grid: white outline strokes over
// brand-blue (#0072CE) shapes, in the style of Flaticon's "lineal color" family.
// Every stroke draws on, then the blue shapes settle in.

type Prim =
  | {k: 'path'; d: string; w?: number}
  | {k: 'circle'; cx: number; cy: number; r: number; w?: number}
  | {k: 'ellipse'; cx: number; cy: number; rx: number; ry: number; w?: number}
  | {k: 'rect'; x: number; y: number; w2: number; h: number; rx?: number; rot?: number; w?: number}
  | {k: 'line'; x1: number; y1: number; x2: number; y2: number; w?: number};

type Def = {
  fills?: Prim[]; // brand blue shapes
  darks?: Prim[]; // background-colour cut-outs drawn over the blue
  gaps?: Prim[]; // background-colour strokes that separate overlapping lines
  strokes: Prim[]; // white outline
  dots?: Prim[]; // small white solid details
};

const BOOK_OUTLINE =
  'M128 384 V128 a40 40 0 0 1 40 -40 H372 a20 20 0 0 1 20 20 V424 H168 a40 40 0 0 1 -40 -40 a40 40 0 0 1 40 -40 H392';
const BOOK_COVER =
  'M128 384 V128 a40 40 0 0 1 40 -40 H372 a20 20 0 0 1 20 20 V344 H168 a40 40 0 0 0 -40 40 Z';
const SHIELD = 'M256 64 L412 122 V240 C412 340 346 410 256 448 C166 410 100 340 100 240 V122 Z';

const ICONS = {
  catalog: {
    fills: [{k: 'path', d: 'M136 140 V372 A120 44 0 0 0 376 372 V140 Z'}],
    darks: [{k: 'ellipse', cx: 256, cy: 140, rx: 120, ry: 44}],
    strokes: [
      {k: 'ellipse', cx: 256, cy: 140, rx: 120, ry: 44},
      {k: 'path', d: 'M136 140 V372 A120 44 0 0 0 376 372 V140'},
      {k: 'path', d: 'M136 218 A120 44 0 0 0 376 218'},
      {k: 'path', d: 'M136 296 A120 44 0 0 0 376 296'},
    ],
  },
  term: {
    fills: [{k: 'path', d: BOOK_COVER}],
    strokes: [
      {k: 'path', d: BOOK_OUTLINE},
      {k: 'line', x1: 212, y1: 172, x2: 340, y2: 172},
      {k: 'line', x1: 212, y1: 236, x2: 300, y2: 236},
    ],
  },
  glossaryCrack: {
    fills: [{k: 'path', d: BOOK_COVER}],
    gaps: [{k: 'path', d: 'M262 88 L286 160 L244 214 L292 270 L262 344', w: 2.2}],
    strokes: [
      {k: 'path', d: BOOK_OUTLINE},
      {k: 'path', d: 'M262 88 L286 160 L244 214 L292 270 L262 344', w: 0.45},
    ],
  },
  columns: {
    fills: [{k: 'path', d: 'M96 196 V150 Q96 122 124 122 H388 Q416 122 416 150 V196 Z'}],
    strokes: [
      {k: 'rect', x: 96, y: 122, w2: 320, h: 268, rx: 28},
      {k: 'line', x1: 96, y1: 196, x2: 416, y2: 196},
      {k: 'line', x1: 203, y1: 196, x2: 203, y2: 390},
      {k: 'line', x1: 309, y1: 196, x2: 309, y2: 390},
      {k: 'line', x1: 96, y1: 293, x2: 416, y2: 293},
    ],
  },
  system: {
    fills: [
      {k: 'rect', x: 112, y: 92, w2: 288, h: 124, rx: 26},
      {k: 'rect', x: 112, y: 260, w2: 288, h: 124, rx: 26},
    ],
    strokes: [
      {k: 'rect', x: 112, y: 92, w2: 288, h: 124, rx: 26},
      {k: 'rect', x: 112, y: 260, w2: 288, h: 124, rx: 26},
      {k: 'line', x1: 164, y1: 154, x2: 260, y2: 154},
      {k: 'line', x1: 164, y1: 322, x2: 260, y2: 322},
      {k: 'line', x1: 256, y1: 384, x2: 256, y2: 432},
      {k: 'line', x1: 160, y1: 432, x2: 352, y2: 432},
    ],
    dots: [
      {k: 'circle', cx: 342, cy: 154, r: 18},
      {k: 'circle', cx: 342, cy: 322, r: 18},
    ],
  },
  dataset: {
    fills: [{k: 'path', d: 'M256 100 L428 186 L256 272 L84 186 Z'}],
    strokes: [
      {k: 'path', d: 'M256 100 L428 186 L256 272 L84 186 Z'},
      {k: 'path', d: 'M84 258 L256 344 L428 258'},
      {k: 'path', d: 'M84 330 L256 416 L428 330'},
    ],
  },
  shield: {
    fills: [{k: 'path', d: SHIELD}],
    strokes: [
      {k: 'path', d: SHIELD},
      {k: 'path', d: 'M180 258 L234 312 L336 206'},
    ],
  },
  lineage: {
    fills: [
      {k: 'circle', cx: 122, cy: 256, r: 54},
      {k: 'circle', cx: 392, cy: 132, r: 46},
      {k: 'circle', cx: 392, cy: 380, r: 46},
    ],
    strokes: [
      {k: 'circle', cx: 122, cy: 256, r: 54},
      {k: 'path', d: 'M176 256 C 266 256 262 132 346 132'},
      {k: 'path', d: 'M176 256 C 266 256 262 380 346 380'},
      {k: 'circle', cx: 392, cy: 132, r: 46},
      {k: 'circle', cx: 392, cy: 380, r: 46},
    ],
  },
  lineageBroken: {
    fills: [
      {k: 'circle', cx: 122, cy: 256, r: 54},
      {k: 'circle', cx: 392, cy: 132, r: 46},
      {k: 'circle', cx: 392, cy: 380, r: 46},
    ],
    strokes: [
      {k: 'circle', cx: 122, cy: 256, r: 54},
      {k: 'path', d: 'M176 256 C 220 256 236 222 246 196'},
      {k: 'path', d: 'M282 150 C 300 138 320 132 346 132'},
      {k: 'path', d: 'M176 256 C 266 256 262 380 346 380'},
      {k: 'path', d: 'M246 140 l16 -26'},
      {k: 'path', d: 'M286 196 l26 8'},
      {k: 'circle', cx: 392, cy: 132, r: 46},
      {k: 'circle', cx: 392, cy: 380, r: 46},
    ],
  },
  eyeSlash: {
    fills: [{k: 'circle', cx: 256, cy: 256, r: 78}],
    darks: [{k: 'circle', cx: 256, cy: 256, r: 26}],
    gaps: [{k: 'line', x1: 96, y1: 88, x2: 416, y2: 424, w: 2.6}],
    strokes: [
      {
        k: 'path',
        d: 'M44 256 C 120 150 194 118 256 118 C 318 118 392 150 468 256 C 392 362 318 394 256 394 C 194 394 120 362 44 256 Z',
      },
      {k: 'circle', cx: 256, cy: 256, r: 78},
      {k: 'line', x1: 96, y1: 88, x2: 416, y2: 424},
    ],
  },
  trace: {
    fills: [
      {k: 'circle', cx: 120, cy: 130, r: 46},
      {k: 'circle', cx: 312, cy: 314, r: 98},
    ],
    strokes: [
      {k: 'circle', cx: 120, cy: 130, r: 46},
      {k: 'circle', cx: 330, cy: 96, r: 30},
      {k: 'circle', cx: 112, cy: 360, r: 30},
      {k: 'line', x1: 166, y1: 122, x2: 300, y2: 101},
      {k: 'line', x1: 118, y1: 176, x2: 113, y2: 330},
      {k: 'circle', cx: 312, cy: 314, r: 98},
      {k: 'line', x1: 384, y1: 386, x2: 452, y2: 454, w: 1.5},
      {k: 'path', d: 'M270 336 L312 290 L354 318'},
    ],
  },
  unlink: {
    fills: [{k: 'rect', x: 66, y: 150, w2: 232, h: 120, rx: 60, rot: -45}],
    strokes: [
      {k: 'rect', x: 66, y: 150, w2: 232, h: 120, rx: 60, rot: -45},
      {k: 'rect', x: 214, y: 242, w2: 232, h: 120, rx: 60, rot: -45},
      {k: 'line', x1: 300, y1: 160, x2: 326, y2: 120},
      {k: 'line', x1: 330, y1: 196, x2: 380, y2: 190},
      {k: 'line', x1: 182, y1: 330, x2: 132, y2: 336},
      {k: 'line', x1: 212, y1: 366, x2: 186, y2: 404},
    ],
  },
  archive: {
    fills: [{k: 'rect', x: 84, y: 104, w2: 344, h: 96, rx: 22}],
    strokes: [
      {k: 'rect', x: 84, y: 104, w2: 344, h: 96, rx: 22},
      {k: 'path', d: 'M118 200 V380 a36 36 0 0 0 36 36 H358 a36 36 0 0 0 36 -36 V200'},
      {k: 'line', x1: 212, y1: 276, x2: 300, y2: 276},
    ],
  },
  trash: {
    fills: [{k: 'path', d: 'M136 150 L158 398 a34 34 0 0 0 34 30 H320 a34 34 0 0 0 34 -30 L376 150 Z'}],
    strokes: [
      {k: 'path', d: 'M136 150 L158 398 a34 34 0 0 0 34 30 H320 a34 34 0 0 0 34 -30 L376 150'},
      {k: 'line', x1: 92, y1: 150, x2: 420, y2: 150},
      {k: 'path', d: 'M198 150 V116 a20 20 0 0 1 20 -20 H294 a20 20 0 0 1 20 20 V150'},
      {k: 'line', x1: 218, y1: 222, x2: 224, y2: 360},
      {k: 'line', x1: 294, y1: 222, x2: 288, y2: 360},
    ],
  },
  relations: {
    fills: [{k: 'circle', cx: 256, cy: 256, r: 70}],
    strokes: [
      {k: 'circle', cx: 256, cy: 256, r: 70},
      {k: 'line', x1: 206, y1: 206, x2: 146, y2: 146},
      {k: 'line', x1: 306, y1: 206, x2: 366, y2: 146},
      {k: 'line', x1: 206, y1: 306, x2: 146, y2: 366},
      {k: 'line', x1: 306, y1: 306, x2: 366, y2: 366},
      {k: 'circle', cx: 112, cy: 112, r: 46},
      {k: 'circle', cx: 400, cy: 112, r: 46},
      {k: 'circle', cx: 112, cy: 400, r: 46},
      {k: 'circle', cx: 400, cy: 400, r: 46},
    ],
  },
  clipboard: {
    fills: [{k: 'rect', x: 108, y: 92, w2: 296, h: 360, rx: 30}],
    strokes: [
      {k: 'rect', x: 108, y: 92, w2: 296, h: 360, rx: 30},
      {k: 'rect', x: 190, y: 60, w2: 132, h: 66, rx: 18},
      {k: 'path', d: 'M164 226 l26 26 l44 -46'},
      {k: 'line', x1: 268, y1: 230, x2: 352, y2: 230},
      {k: 'path', d: 'M164 330 l26 26 l44 -46'},
      {k: 'line', x1: 268, y1: 334, x2: 352, y2: 334},
    ],
    darks: [{k: 'rect', x: 190, y: 60, w2: 132, h: 66, rx: 18}],
  },
  lock: {
    fills: [{k: 'rect', x: 116, y: 228, w2: 280, h: 216, rx: 34}],
    strokes: [
      {k: 'path', d: 'M168 228 V172 a88 88 0 0 1 176 0 V228'},
      {k: 'rect', x: 116, y: 228, w2: 280, h: 216, rx: 34},
      {k: 'line', x1: 256, y1: 340, x2: 256, y2: 386},
    ],
    dots: [{k: 'circle', cx: 256, cy: 324, r: 24}],
  },
  report: {
    fills: [
      {k: 'rect', x: 152, y: 276, w2: 52, h: 92, rx: 10},
      {k: 'rect', x: 230, y: 212, w2: 52, h: 156, rx: 10},
      {k: 'rect', x: 308, y: 160, w2: 52, h: 208, rx: 10},
    ],
    strokes: [
      {k: 'rect', x: 92, y: 96, w2: 328, h: 328, rx: 30},
      {k: 'rect', x: 152, y: 276, w2: 52, h: 92, rx: 10},
      {k: 'rect', x: 230, y: 212, w2: 52, h: 156, rx: 10},
      {k: 'rect', x: 308, y: 160, w2: 52, h: 208, rx: 10},
    ],
  },
  check: {
    fills: [{k: 'circle', cx: 256, cy: 256, r: 176}],
    strokes: [
      {k: 'circle', cx: 256, cy: 256, r: 176},
      {k: 'path', d: 'M172 262 L232 322 L344 208'},
    ],
  },
  warning: {
    fills: [{k: 'path', d: 'M256 72 L460 424 H52 Z'}],
    strokes: [
      {k: 'path', d: 'M256 72 L460 424 H52 Z'},
      {k: 'line', x1: 256, y1: 196, x2: 256, y2: 300},
    ],
    dots: [{k: 'circle', cx: 256, cy: 362, r: 22}],
  },
} satisfies Record<string, Def>;

export type IconName = keyof typeof ICONS;

const shape = (p: Prim, key: string, props: React.SVGProps<SVGElement>) => {
  const common = props as Record<string, unknown>;
  switch (p.k) {
    case 'path':
      return <path key={key} {...common} d={p.d} />;
    case 'circle':
      return <circle key={key} {...common} cx={p.cx} cy={p.cy} r={p.r} />;
    case 'ellipse':
      return <ellipse key={key} {...common} cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} />;
    case 'rect':
      return (
        <rect
          key={key}
          {...common}
          x={p.x}
          y={p.y}
          width={p.w2}
          height={p.h}
          rx={p.rx ?? 0}
          transform={p.rot ? `rotate(${p.rot} ${p.x + p.w2 / 2} ${p.y + p.h / 2})` : undefined}
        />
      );
    case 'line':
      return <line key={key} {...common} x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} />;
  }
};

/** Stroke-draw props for a primitive at local progress q (0..1). */
const drawProps = (q: number): React.SVGProps<SVGElement> =>
  q >= 1
    ? {}
    : {pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - q, opacity: q > 0.002 ? 1 : 0};

export const Icon: React.FC<{
  name: IconName;
  size: number;
  /** Draw-on progress 0..1. */
  p?: number;
  /** Rendered stroke width in px at camera scale 1. */
  strokePx?: number;
  style?: React.CSSProperties;
}> = ({name, size, p = 1, strokePx = 10, style}) => {
  const def: Def = ICONS[name];
  const sw = (strokePx * 512) / size;
  const n = def.strokes.length;
  const span = 0.55;
  const local = (i: number) => ease.inOut(clamp01((p - (n > 1 ? (0.45 * i) / (n - 1) : 0)) / span));
  const fp = clamp01((p - 0.3) / 0.5);
  const fillScale = 0.55 + 0.45 * ease.outBack(fp);
  const fillStyle: React.CSSProperties = {
    transformBox: 'fill-box',
    transformOrigin: 'center',
    transform: `scale(${fillScale})`,
    opacity: ease.out(fp),
  };
  const dp = ease.out(clamp01((p - 0.7) / 0.3));
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" style={{overflow: 'visible', display: 'block', ...style}}>
      <g style={fillStyle}>
        {(def.fills ?? []).map((f, i) => shape(f, `f${i}`, {fill: C.blue}))}
        {(def.darks ?? []).map((f, i) => shape(f, `d${i}`, {fill: C.bg}))}
      </g>
      {(def.gaps ?? []).map((g, i) =>
        shape(g, `g${i}`, {
          fill: 'none',
          stroke: C.bg,
          strokeWidth: sw * (g.w ?? 2.2),
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          opacity: fp,
        }),
      )}
      {def.strokes.map((s, i) =>
        shape(s, `s${i}`, {
          fill: 'none',
          stroke: C.white,
          strokeWidth: sw * (s.w ?? 1),
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          ...drawProps(local(i)),
        }),
      )}
      {(def.dots ?? []).map((d, i) =>
        shape(d, `o${i}`, {
          fill: C.white,
          style: {transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${dp})`},
        }),
      )}
    </svg>
  );
};
