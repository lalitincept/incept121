import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import {
  C,
  F,
  FONT,
  clamp01,
  easeIn,
  easeInOut,
  easeOut,
  lerp,
  prog,
  voAt,
} from "../theme";
import { CaptionBox } from "../components/ui";
import {
  CAMERA,
  CAPTIONS,
  DIMS,
  FRAME_RANGES,
  HIGHLIGHTS,
  REDACTIONS,
  RIPPLES,
  SEGMENTS,
  Seg,
  Src,
} from "./timeline";
import { BottleneckInsert, CheckChips, PhasesInsert, RuntimeInsert, SubtaskChips } from "./Inserts";

// Crop space of the recordings and on-screen frame geometry
export const CW = 1660;
export const CH = 890;
export const FW = 3300;
export const FH = Math.round((FW * CH) / CW); // 1769
export const FX = (3840 - FW) / 2; // 270
export const FY = 166;
export const FRAME_BOTTOM = FY + FH;

const pad5 = (v: number) => String(v).padStart(5, "0");
const clampFrame = (src: Src, fr: number) => {
  const ranges = FRAME_RANGES[src];
  for (const [a, b] of ranges) if (fr >= a && fr <= b) return fr;
  // snap to nearest available
  let best = ranges[0][0];
  let d = Infinity;
  for (const [a, b] of ranges)
    for (const c of [a, b])
      if (Math.abs(c - fr) < d) {
        d = Math.abs(c - fr);
        best = c;
      }
  return best;
};

const segIndexAt = (vo: number) => {
  for (let i = 0; i < SEGMENTS.length; i++) if (vo < SEGMENTS[i].v1) return i;
  return SEGMENTS.length - 1;
};
const srcTimeAt = (seg: Seg, vo: number) =>
  seg.s0 + (seg.s1 - seg.s0) * clamp01((vo - seg.v0) / (seg.v1 - seg.v0));

// ── camera ────────────────────────────────────────────────────────────────
const cameraAt = (frame: number) => {
  let z = 1;
  let x = CW / 2;
  let y = CH / 2;
  for (const c of CAMERA) {
    const p = prog(frame, F(c.v0), F(c.v1) - F(c.v0), easeInOut);
    if (p <= 0) break;
    z = lerp(z, c.z, p);
    x = lerp(x, c.x, p);
    y = lerp(y, c.y, p);
  }
  const sc = (FW / CW) * z;
  let tx = FW / 2 - x * sc;
  let ty = FH / 2 - y * sc;
  tx = Math.min(0, Math.max(FW - CW * sc, tx));
  ty = Math.min(0, Math.max(FH - CH * sc, ty));
  return { sc, tx, ty, z };
};

// ── a single recording frame (+ privacy softening) ────────────────────────
const RecordingFrame: React.FC<{ src: Src; t: number; sc: number; opacity?: number }> = ({
  src,
  t,
  sc,
  opacity = 1,
}) => {
  const fr = clampFrame(src, Math.round(t * 16));
  const reds = REDACTIONS.filter((r) => r.src === src && t >= r.s0 && t < r.s1);
  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      <Img
        src={staticFile(`frames/${src}/${pad5(fr)}.jpg`)}
        style={{ position: "absolute", left: 0, top: 0, width: CW * sc, height: CH * sc }}
      />
      {reds.map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: r.r.x * sc,
            top: r.r.y * sc,
            width: r.r.w * sc,
            height: r.r.h * sc,
            backdropFilter: `blur(${7 * sc}px)`,
            WebkitBackdropFilter: `blur(${7 * sc}px)`,
            background: "rgba(246,247,249,0.35)",
            borderRadius: 6 * sc,
          }}
        />
      ))}
    </div>
  );
};

// ── highlight box with optional spotlight dim ─────────────────────────────
const HighlightBox: React.FC<{ h: (typeof HIGHLIGHTS)[number]; sc: number; frame: number }> = ({
  h,
  sc,
  frame,
}) => {
  const a = F(h.v0);
  const b = F(h.v1);
  if (frame < a || frame > b) return null;
  const i = prog(frame, a, 14, easeOut);
  const o = prog(frame, b - 10, 10, easeIn);
  const v = i * (1 - o);
  const grow = (1 - i) * 18;
  const pad = 6;
  const pulse = 0.5 + 0.5 * Math.sin(((frame - a) / 30) * Math.PI * 1.6);
  return (
    <div
      style={{
        position: "absolute",
        left: (h.x - pad - grow) * sc,
        top: (h.y - pad - grow) * sc,
        width: (h.w + 2 * pad + 2 * grow) * sc,
        height: (h.h + 2 * pad + 2 * grow) * sc,
        borderRadius: 10 * sc,
        border: `${2.4 * sc}px solid rgba(27,138,230,${v})`,
        boxShadow: [
          `0 0 ${(14 + pulse * 10) * sc}px rgba(0,114,206,${0.75 * v})`,
          `inset 0 0 ${10 * sc}px rgba(0,114,206,${0.25 * v})`,
          h.spot ? `0 0 0 ${4000 * sc}px rgba(12,14,22,${0.34 * v})` : "",
        ]
          .filter(Boolean)
          .join(", "),
      }}
    />
  );
};

const Ripple: React.FC<{ x: number; y: number; at: number; sc: number; frame: number }> = ({
  x,
  y,
  at,
  sc,
  frame,
}) => {
  const a = F(at) - 2;
  if (frame < a || frame > a + 26) return null;
  const rings = [0, 6];
  return (
    <>
      {rings.map((d, i) => {
        const p = prog(frame, a + d, 18, easeOut);
        if (p <= 0) return null;
        const r = (6 + p * 34) * sc;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x * sc - r,
              top: y * sc - r,
              width: 2 * r,
              height: 2 * r,
              borderRadius: "50%",
              border: `${2.2 * sc}px solid rgba(0,114,206,${(1 - p) * 0.95})`,
              background: i === 0 ? `rgba(0,114,206,${(1 - p) * 0.22})` : undefined,
            }}
          />
        );
      })}
    </>
  );
};

// ── breadcrumb caption for the navigation path ────────────────────────────
const Breadcrumb: React.FC<{ frame: number }> = ({ frame }) => {
  const a = F(37.15);
  const b = F(43.95);
  if (frame < a - 1 || frame > b + 1) return null;
  const i = prog(frame, a, 18, easeOut);
  const o = prog(frame, b - 12, 12, easeIn);
  const steps = [
    { t: "Left navigation", at: 37.42 },
    { t: "Explore", at: 40.72 },
    { t: "Catalog Sources", at: 42.48 },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: FX + 150,
        top: FRAME_BOTTOM - 120,
        display: "flex",
        alignItems: "center",
        gap: 46,
        padding: "52px 80px",
        borderRadius: 52,
        background: "linear-gradient(100deg, #0072CE 0%, #0A7FDE 60%, #1688E8 100%)",
        boxShadow: "0 30px 90px rgba(0,0,0,0.45), 0 0 80px rgba(0,114,206,0.35)",
        clipPath: `inset(0 ${(1 - i) * 100}% 0 0 round 52px)`,
        opacity: 1 - o,
        transform: `translateY(${(1 - i) * 30 + o * 26}px)`,
        fontFamily: FONT,
        fontSize: 84,
        whiteSpace: "nowrap",
      }}
    >
      {steps.map((s, idx) => {
        const on = prog(frame, F(s.at), 12, easeOut);
        const shown = prog(frame, a + 4 + idx * 4, 14, easeOut);
        return (
          <React.Fragment key={s.t}>
            {idx > 0 && (
              <svg width={44} height={70} viewBox="0 0 44 70" style={{ opacity: 0.55 + 0.45 * on }}>
                <path d="M10,10 L34,35 L10,60" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <span
              style={{
                color: "#fff",
                fontWeight: on > 0.5 ? 700 : 500,
                opacity: shown * (0.5 + 0.5 * on),
                letterSpacing: "-0.02em",
                transform: `translateY(${(1 - shown) * 20}px) scale(${1 + on * 0.02})`,
                display: "inline-block",
                textShadow: on > 0 ? `0 0 ${30 * on}px rgba(255,255,255,0.45)` : undefined,
              }}
            >
              {s.t}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ── main stage ────────────────────────────────────────────────────────────
export const ScreenStage: React.FC = () => {
  const frame = useCurrentFrame();
  const vo = voAt(frame);

  // entrance / exit of the whole device frame
  const pin = prog(frame, F(36.3), 34, easeOut);
  const pout = prog(frame, F(123.45), 22, easeIn);
  if (pin <= 0 || pout >= 1) return null;

  const idx = segIndexAt(vo);
  const seg = SEGMENTS[idx];
  const t = srcTimeAt(seg, vo);
  const cam = cameraAt(frame);

  // cross-dissolve across discontinuous cuts
  let prevLayer: React.ReactNode = null;
  let topOpacity = 1;
  if (seg.xf && idx > 0) {
    const local = frame - F(seg.v0);
    if (local >= 0 && local < seg.xf) {
      const prev = SEGMENTS[idx - 1];
      topOpacity = easeInOut(clamp01(local / seg.xf));
      prevLayer = <RecordingFrame src={prev.src} t={prev.s1} sc={cam.sc} />;
    }
  }

  // dim/blur for inserts
  let dim = 0;
  for (const d of DIMS) {
    const a = prog(frame, F(d.v0), 15, easeInOut);
    const b = prog(frame, F(d.v1) - 15, 15, easeInOut);
    dim = Math.max(dim, a * (1 - b));
  }

  const float = Math.sin(frame / 52) * 6;
  const frameTransform = `perspective(4200px) translateY(${(1 - pin) * 560 - pout * 140 + float}px) rotateX(${(1 - pin) * 16}deg) scale(${0.9 + 0.1 * pin - pout * 0.1})`;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: clamp01(pin * 1.8) * (1 - pout),
        filter: pout > 0.01 ? `blur(${pout * 22}px)` : undefined,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: FX,
          top: FY,
          width: FW,
          height: FH,
          transform: frameTransform,
          transformOrigin: "50% 60%",
        }}
      >
        {/* glow + shadow plate */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 48,
            boxShadow:
              "0 60px 160px rgba(0,0,0,0.6), 0 0 220px rgba(0,114,206,0.28), 0 0 0 3px rgba(255,255,255,0.10)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 48,
            overflow: "hidden",
            background: "#F4F5F7",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: cam.tx,
              top: cam.ty,
              width: CW * cam.sc,
              height: CH * cam.sc,
              filter:
                dim > 0.005
                  ? `blur(${dim * 16}px) brightness(${1 - dim * 0.62}) saturate(${1 - dim * 0.4})`
                  : undefined,
            }}
          >
            {prevLayer}
            <RecordingFrame src={seg.src} t={t} sc={cam.sc} opacity={topOpacity} />
            {HIGHLIGHTS.map((h, i) => (
              <HighlightBox key={i} h={h} sc={cam.sc} frame={frame} />
            ))}
            {RIPPLES.map((r, i) => (
              <Ripple key={i} x={r.x} y={r.y} at={r.v} sc={cam.sc} frame={frame} />
            ))}
          </div>
          {/* subtle glass sheen across the top edge */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 48,
              boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.35)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* concept inserts over the dimmed recording */}
        <RuntimeInsert />
        <PhasesInsert />
        <BottleneckInsert />
        <CheckChips />
        <SubtaskChips />
      </div>

      {/* captions live in screen space, overlapping the frame's bottom edge */}
      <Breadcrumb frame={frame} />
      {CAPTIONS.map((c, i) => (
        <CaptionBox
          key={i}
          text={c.text}
          at={c.v0}
          until={c.v1}
          style={{ left: FX + 150, top: FRAME_BOTTOM - 120 }}
        />
      ))}
      {/* keep the canvas colour consistent behind the frame */}
      <div style={{ display: "none", color: C.bg }} />
    </div>
  );
};
