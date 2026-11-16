import React from "react";
import { C, clamp01 } from "../theme";

/*
 * Line-and-fill icon set in the "lineal color" style: white outlines over
 * brand-blue (#0072CE) shapes, drawn on a 512×512 grid. Outlines are rendered
 * at exactly 10px on screen regardless of icon size, and every icon supports
 * a draw-on animation via `p` (0→1).
 */

type Kind = "stroke" | "fill" | "fillStroke" | "knock";
type Layer = { d: string; k: Kind; w?: number; evenodd?: boolean };

// ── geometry helpers ──────────────────────────────────────────────────────
const n = (v: number) => Math.round(v * 100) / 100;
const circ = (cx: number, cy: number, r: number) =>
  `M${n(cx - r)},${n(cy)}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`;
const ell = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx},${cy}A${rx},${ry} 0 1,1 ${cx + rx},${cy}A${rx},${ry} 0 1,1 ${cx - rx},${cy}Z`;
const rr = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r},${y}H${x + w - r}A${r},${r} 0 0 1 ${x + w},${y + r}V${y + h - r}A${r},${r} 0 0 1 ${x + w - r},${y + h}H${x + r}A${r},${r} 0 0 1 ${x},${y + h - r}V${y + r}A${r},${r} 0 0 1 ${x + r},${y}Z`;
const pt = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};
/** Clockwise (on screen) arc from a0° to a1°. */
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const [x0, y0] = pt(cx, cy, r, a0);
  const [x1, y1] = pt(cx, cy, r, a1);
  return `M${n(x0)},${n(y0)}A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${n(x1)},${n(y1)}`;
};
/** Arrow head at the clockwise end of an arc. */
const arcHead = (cx: number, cy: number, r: number, a: number, len = 46, spread = 32) => {
  const [tx, ty] = pt(cx, cy, r, a);
  const rad = (a * Math.PI) / 180;
  const dir = Math.atan2(Math.cos(rad), -Math.sin(rad)); // tangent (cw)
  const b1 = dir + Math.PI - (spread * Math.PI) / 180;
  const b2 = dir + Math.PI + (spread * Math.PI) / 180;
  return `M${n(tx + len * Math.cos(b1))},${n(ty + len * Math.sin(b1))}L${n(tx)},${n(ty)}L${n(tx + len * Math.cos(b2))},${n(ty + len * Math.sin(b2))}`;
};
const poly = (pts: number[][]) =>
  "M" + pts.map((p) => `${n(p[0])},${n(p[1])}`).join("L") + "Z";
const gear = (cx: number, cy: number, ro: number, ri: number, teeth: number) => {
  const pts: number[][] = [];
  const w = 360 / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * w - 90;
    pts.push(pt(cx, cy, ri, a - w * 0.42));
    pts.push(pt(cx, cy, ro, a - w * 0.2));
    pts.push(pt(cx, cy, ro, a + w * 0.2));
    pts.push(pt(cx, cy, ri, a + w * 0.42));
  }
  return poly(pts);
};
/** Database cylinder layers. */
const db = (cx: number, top: number, rx: number, ry: number, h: number, bands: number): Layer[] => {
  const l = cx - rx;
  const r = cx + rx;
  const bot = top + h;
  const out: Layer[] = [
    { d: `M${l},${top}A${rx},${ry} 0 0 0 ${r},${top}V${bot}A${rx},${ry} 0 0 1 ${l},${bot}Z`, k: "fillStroke" },
  ];
  for (let i = 1; i <= bands; i++) {
    const y = top + (h * i) / (bands + 1);
    out.push({ d: `M${l},${y}A${rx},${ry} 0 0 0 ${r},${y}`, k: "stroke" });
  }
  out.push({ d: ell(cx, top, rx, ry), k: "knock" });
  return out;
};
const capsule = (x0: number, y0: number, x1: number, y1: number, hw: number) => {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const L = Math.hypot(dx, dy);
  const px = (-dy / L) * hw;
  const py = (dx / L) * hw;
  return poly([
    [x0 + px, y0 + py],
    [x1 + px, y1 + py],
    [x1 - px, y1 - py],
    [x0 - px, y0 - py],
  ]);
};
const doc = (x: number, y: number, w: number, h: number, fold = 86): Layer[] => [
  {
    d: `M${x + 26},${y}H${x + w - fold}L${x + w},${y + fold}V${y + h - 26}A26,26 0 0 1 ${x + w - 26},${y + h}H${x + 26}A26,26 0 0 1 ${x},${y + h - 26}V${y + 26}A26,26 0 0 1 ${x + 26},${y}Z`,
    k: "knock",
  },
  { d: `M${x + w - fold},${y}V${y + fold - 24}A24,24 0 0 0 ${x + w - fold + 24},${y + fold}H${x + w}`, k: "stroke" },
];
const cube = (cx: number, cy: number, s: number): Layer[] => {
  const h = s * 0.866;
  return [
    { d: poly([[cx - h, cy - s / 2], [cx, cy], [cx, cy + s], [cx - h, cy + s / 2]]), k: "fillStroke" },
    { d: poly([[cx, cy], [cx + h, cy - s / 2], [cx + h, cy + s / 2], [cx, cy + s]]), k: "fillStroke" },
    { d: poly([[cx, cy - s], [cx + h, cy - s / 2], [cx, cy], [cx - h, cy - s / 2]]), k: "knock" },
  ];
};
const rhombus = (cy: number, hw = 196, hh = 92) =>
  poly([[256, cy - hh], [256 + hw, cy], [256, cy + hh], [256 - hw, cy]]);

// ── icon definitions ──────────────────────────────────────────────────────
export const ICONS = {
  scan: [
    ...db(200, 118, 136, 48, 262, 2),
    { d: circ(346, 330, 94), k: "knock" },
    { d: "M322,290L394,330L322,370Z", k: "fillStroke" },
    { d: capsule(414, 398, 474, 458, 19), k: "fillStroke" },
  ],
  milestones: [
    { d: "M40,392H472", k: "stroke" },
    { d: circ(104, 392, 32), k: "fillStroke" },
    { d: circ(248, 392, 32), k: "fillStroke" },
    { d: circ(392, 392, 32), k: "knock" },
    { d: "M82,300l20,20l40,-42", k: "stroke" },
    { d: "M226,300l20,20l40,-42", k: "stroke" },
    { d: "M392,360V92", k: "stroke" },
    { d: "M392,96H486L460,144L486,192H392Z", k: "fillStroke" },
  ],
  logs: [
    { d: rr(132, 100, 316, 392, 28), k: "fill" },
    ...doc(76, 52, 330, 408),
    { d: "M136,214H346M136,278H346M136,342H300M136,404H236", k: "stroke" },
  ],
  report: [
    ...doc(86, 40, 340, 432),
    { d: "M134,128H262", k: "stroke" },
    { d: rr(134, 304, 58, 116, 10), k: "fillStroke" },
    { d: rr(224, 236, 58, 184, 10), k: "fillStroke" },
    { d: rr(314, 182, 58, 238, 10), k: "fillStroke" },
  ],
  dashboard: [
    { d: rr(40, 64, 432, 312, 30), k: "knock" },
    { d: "M40,128H472", k: "stroke" },
    { d: circ(84, 96, 8) + circ(116, 96, 8) + circ(148, 96, 8), k: "stroke" },
    { d: "M100,316A86,86 0 0 1 272,316Z", k: "fillStroke" },
    { d: "M186,316L228,262", k: "stroke" },
    { d: rr(310, 240, 44, 76, 8), k: "fillStroke" },
    { d: rr(376, 190, 44, 126, 8), k: "fillStroke" },
    { d: "M214,376L200,436M298,376L312,436M152,442H360", k: "stroke" },
  ],
  governance: [
    { d: "M256,36L440,102V246C440,362 360,440 256,476C152,440 72,362 72,246V102Z", k: "knock" },
    { d: "M256,92L392,140V246C392,330 336,392 256,422C176,392 120,330 120,246V140Z", k: "fillStroke" },
    { d: "M184,252L236,304L334,202", k: "stroke", w: 1.35 },
  ],
  freshData: [
    ...db(256, 186, 92, 32, 150, 1),
    { d: arc(256, 256, 206, 200, 318), k: "stroke" },
    { d: arcHead(256, 256, 206, 318), k: "stroke" },
    { d: arc(256, 256, 206, 20, 138), k: "stroke" },
    { d: arcHead(256, 256, 206, 138), k: "stroke" },
  ],
  catalogSource: [
    ...db(206, 104, 134, 46, 256, 2),
    { d: gear(378, 382, 96, 74, 8), k: "fillStroke" },
    { d: circ(378, 382, 30), k: "knock" },
  ],
  play: [
    { d: circ(276, 276, 196), k: "fill" },
    { d: circ(256, 256, 196), k: "knock" },
    { d: "M214,168L358,256L214,344Z", k: "fillStroke" },
  ],
  monitorPulse: [
    { d: rr(40, 62, 432, 306, 30), k: "fillStroke" },
    { d: "M84,224H160L190,160L236,300L276,186L300,230H428", k: "stroke" },
    { d: "M214,368L202,432M298,368L310,432M152,438H360", k: "stroke" },
  ],
  calendar: [
    { d: rr(56, 92, 400, 364, 32), k: "knock" },
    { d: "M56,124A32,32 0 0 1 88,92H424A32,32 0 0 1 456,124V190H56Z", k: "fillStroke" },
    { d: "M160,52V130M352,52V130", k: "stroke" },
    { d: rr(110, 238, 64, 64, 12) + rr(224, 238, 64, 64, 12) + rr(338, 238, 64, 64, 12) + rr(110, 342, 64, 64, 12) + rr(224, 342, 64, 64, 12), k: "stroke" },
    { d: rr(338, 342, 64, 64, 12), k: "fillStroke" },
    { d: "M352,374l14,14l24,-26", k: "stroke" },
  ],
  plug: [
    { d: "M150,196H362", k: "stroke" },
    { d: "M212,196V96M300,196V96", k: "stroke" },
    { d: "M168,196H344V258A88,88 0 0 1 256,346A88,88 0 0 1 168,258Z", k: "fillStroke" },
    { d: "M256,346V396A50,50 0 0 1 206,446H64", k: "stroke" },
  ],
  inventory: [
    ...cube(172, 330, 98),
    ...cube(340, 330, 98),
    ...cube(256, 186, 98),
  ],
  table: [
    { d: rr(52, 84, 408, 348, 28), k: "knock" },
    { d: "M52,112A28,28 0 0 1 80,84H432A28,28 0 0 1 460,112V172H52Z", k: "fillStroke" },
    { d: "M188,258H324V346H188Z", k: "fill" },
    { d: "M52,258H460M52,346H460M188,172V432M324,172V432", k: "stroke" },
  ],
  columnStats: [
    { d: "M74,60V438H460", k: "stroke" },
    { d: rr(124, 300, 62, 138, 10), k: "fillStroke" },
    { d: rr(216, 220, 62, 218, 10), k: "fillStroke" },
    { d: rr(308, 268, 62, 170, 10), k: "fillStroke" },
    { d: circ(376, 146, 78), k: "knock" },
    { d: "M334,172L358,148L380,162L410,128", k: "stroke" },
    { d: capsule(432, 202, 478, 248, 15), k: "fillStroke" },
  ],
  lineage: [
    { d: "M139,222L223,149M139,290L223,363M289,149L373,222M289,363L373,290", k: "stroke" },
    { d: circ(100, 256, 54), k: "fillStroke" },
    { d: circ(256, 120, 46), k: "knock" },
    { d: circ(256, 392, 46), k: "knock" },
    { d: circ(412, 256, 54), k: "fillStroke" },
    { d: circ(100, 256, 14) + circ(412, 256, 14), k: "stroke" },
  ],
  key: [
    { d: rr(392, 262, 34, 70, 8), k: "fillStroke" },
    { d: rr(438, 262, 28, 52, 8), k: "fillStroke" },
    { d: rr(262, 234, 206, 44, 12), k: "fillStroke" },
    { d: circ(166, 256, 108) + circ(166, 256, 38), k: "fillStroke", evenodd: true },
  ],
  network: [
    { d: circ(276, 276, 190), k: "fill" },
    { d: circ(256, 256, 190), k: "knock" },
    { d: "M66,256H446M94,160H418M94,352H418", k: "stroke" },
    { d: "M256,66A92,190 0 0 1 256,446A92,190 0 0 1 256,66Z", k: "stroke" },
  ],
  dbSmall: db(256, 196, 124, 42, 150, 1),
  dbLarge: db(256, 74, 156, 50, 346, 3),
  stopwatch: [
    { d: rr(222, 36, 68, 40, 10), k: "fillStroke" },
    { d: "M256,76V114M392,134L424,102", k: "stroke" },
    { d: circ(256, 292, 178), k: "knock" },
    { d: "M256,292L256,142A150,150 0 0 1 385.9,367Z", k: "fill" },
    { d: "M256,292L322,214", k: "stroke" },
    { d: circ(256, 292, 14), k: "knock" },
  ],
  layers: [
    { d: rhombus(352), k: "knock" },
    { d: rhombus(276), k: "knock" },
    { d: rhombus(200), k: "fillStroke" },
  ],
  hourglass: [
    { d: "M196,150H316C300,196 270,214 256,226C242,214 212,196 196,150Z", k: "fill" },
    { d: "M178,424C192,366 238,344 256,344C274,344 320,366 334,424Z", k: "fill" },
    { d: "M156,88C156,200 240,226 240,256C240,286 156,312 156,424M356,88C356,200 272,226 272,256C272,286 356,312 356,424", k: "stroke" },
    { d: rr(118, 48, 276, 42, 14), k: "fillStroke" },
    { d: rr(118, 422, 276, 42, 14), k: "fillStroke" },
  ],
  subtasks: [
    { d: rr(92, 72, 328, 404, 32), k: "knock" },
    { d: rr(186, 42, 140, 64, 16), k: "fillStroke" },
    { d: rr(140, 162, 54, 54, 12), k: "fillStroke" },
    { d: "M153,189l13,13l20,-23", k: "stroke" },
    { d: rr(140, 254, 54, 54, 12), k: "fillStroke" },
    { d: "M153,281l13,13l20,-23", k: "stroke" },
    { d: rr(140, 346, 54, 54, 12), k: "stroke" },
    { d: "M226,189H372M226,281H372M226,373H330", k: "stroke" },
  ],
  warning: [
    { d: "M256,54L468,428A22,22 0 0 1 449,460H63A22,22 0 0 1 44,428Z", k: "knock" },
    { d: "M256,132L408,408H104Z", k: "fillStroke" },
    { d: "M256,214V316", k: "stroke", w: 1.5 },
    { d: circ(256, 364, 7), k: "stroke", w: 1.5 },
  ],
  download: [
    ...doc(60, 34, 300, 380, 78),
    { d: "M116,180H300M116,240H300M116,300H230", k: "stroke" },
    { d: circ(372, 384, 96), k: "fillStroke" },
    { d: "M372,330V436M330,396L372,438L414,396", k: "stroke" },
  ],
  lock: [
    { d: "M168,236V170A88,88 0 0 1 344,170V236", k: "stroke" },
    { d: rr(112, 232, 288, 232, 36), k: "fillStroke" },
    { d: circ(256, 324, 28), k: "knock" },
    { d: "M256,352V398", k: "stroke" },
  ],
  admin: [
    { d: "M44,460V418A156,124 0 0 1 356,418V460Z", k: "knock" },
    { d: circ(200, 160, 84), k: "knock" },
    { d: gear(380, 372, 100, 78, 8), k: "fillStroke" },
    { d: circ(380, 372, 32), k: "knock" },
  ],
  audit: [
    { d: circ(272, 256, 132), k: "fill" },
    { d: arc(272, 256, 182, 215, 505), k: "stroke" },
    { d: "M84,112L122,156L176,128", k: "stroke" },
    { d: "M272,256V162M272,256L338,300", k: "stroke" },
    { d: circ(272, 256, 12), k: "knock" },
  ],
  heartPulse: [
    { d: "M256,446C126,360 56,282 56,196C56,124 112,70 180,70C220,70 244,92 256,118C268,92 292,70 332,70C400,70 456,124 456,196C456,282 386,360 256,446Z", k: "fillStroke" },
    { d: "M20,262H150L182,196L226,330L262,222L286,262H492", k: "stroke" },
  ],
  eye: [
    { d: "M34,256C114,134 398,134 478,256C398,378 114,378 34,256Z", k: "knock" },
    { d: circ(256, 256, 90), k: "fillStroke" },
    { d: circ(256, 256, 34), k: "knock" },
  ],
  troubleshoot: [
    { d: capsule(318, 318, 456, 456, 26), k: "fillStroke" },
    { d: circ(208, 208, 152), k: "knock" },
    { d: gear(208, 208, 74, 56, 7), k: "fillStroke" },
    { d: circ(208, 208, 22), k: "knock" },
  ],
  checkCircle: [
    { d: circ(256, 256, 196), k: "fillStroke" },
    { d: "M162,262L228,328L354,196", k: "stroke", w: 1.6 },
  ],
  compass: [
    { d: circ(276, 276, 194), k: "fill" },
    { d: circ(256, 256, 194), k: "knock" },
    { d: "M330,182L290,290L182,330L222,222Z", k: "fillStroke" },
    { d: circ(256, 256, 16), k: "knock" },
  ],
  cloudRun: [
    { d: "M140,372C88,372 52,334 52,286C52,240 88,204 134,202C146,140 198,96 262,96C330,96 384,146 392,210C434,216 464,250 464,292C464,336 428,372 384,372Z", k: "knock" },
    { d: circ(258, 290, 84), k: "fillStroke" },
    { d: "M236,252L296,290L236,328Z", k: "stroke" },
  ],
} satisfies Record<string, Layer[]>;

export type IconName = keyof typeof ICONS;

export const Icon: React.FC<{
  name: IconName;
  size: number;
  p?: number; // draw-on progress
  fill?: string;
  stroke?: string;
  knock?: string;
  strokePx?: number;
  style?: React.CSSProperties;
}> = ({
  name,
  size,
  p = 1,
  fill = C.blue,
  stroke = "#FFFFFF",
  knock = "#1E1C1D",
  strokePx = 10,
  style,
}) => {
  const layers = ICONS[name] as Layer[];
  const sw = (strokePx * 512) / size;
  const N = layers.length;
  const stag = 0.5 / Math.max(1, N);
  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      style={{ overflow: "visible", ...style }}
    >
      {layers.map((L, i) => {
        const ps = clamp01((p - i * stag) / 0.5);
        const pf = clamp01((p - 0.22 - i * stag * 0.6) / 0.38);
        const hasStroke = L.k !== "fill";
        const fillCol =
          L.k === "fill" || L.k === "fillStroke" ? fill : L.k === "knock" ? knock : "none";
        const strokeDraw = hasStroke && ps < 1;
        return (
          <g key={i}>
            {fillCol !== "none" && (
              <path
                d={L.d}
                fill={fillCol}
                fillRule={L.evenodd ? "evenodd" : "nonzero"}
                opacity={L.k === "knock" ? clamp01(ps * 2) : pf}
              />
            )}
            {hasStroke && ps > 0.001 && (
              <path
                d={L.d}
                fill="none"
                stroke={stroke}
                strokeWidth={sw * (L.w ?? 1)}
                strokeLinecap="round"
                strokeLinejoin="round"
                fillRule={L.evenodd ? "evenodd" : "nonzero"}
                {...(strokeDraw
                  ? { pathLength: 1, strokeDasharray: "1 1", strokeDashoffset: 1 - ps }
                  : {})}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};
