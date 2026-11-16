import React, { useEffect, useState } from "react";
import {
  continueRender,
  delayRender,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  C,
  F,
  FONT,
  clamp01,
  easeIn,
  easeOut,
  prog,
} from "../theme";
import { Icon, IconName } from "./Icons";
import { KText, k } from "./Kinetic";

// ── Icon in a glowing ring (matches reference circle treatment) ───────────
export const IconCircle: React.FC<{
  icon: IconName;
  at: number; // VO seconds
  size?: number;
  label?: string; // kinetic syntax allowed (no timings needed)
  labelSize?: number;
  exitAt?: number;
  muted?: number; // 0..1 → greyed-out treatment
  glow?: number; // extra glow 0..1
  style?: React.CSSProperties;
  labelGap?: number;
  labelExitAt?: number;
}> = ({
  icon,
  at,
  size = 620,
  label,
  labelSize = 84,
  exitAt,
  muted = 0,
  glow = 0,
  style,
  labelGap = 70,
  labelExitAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = F(at);
  const s = spring({ frame: frame - start, fps, config: { damping: 16, mass: 0.9, stiffness: 120 } });
  const o = prog(frame, start, 10);
  const e = exitAt !== undefined ? prog(frame, F(exitAt), 14, easeIn) : 0;
  const draw = prog(frame, start + 5, 30, easeOut);
  const ring = 0.55 + 0.45 * glow;
  const grey = muted;
  if (o * (1 - e) <= 0.001) return <div style={{ width: size, ...style }} />;

  const labelTokens = label
    ? k(
        label
          .split(" ")
          .map((w, i) => (w === "|" ? w : `${w}@${(at + 0.22 + i * 0.07).toFixed(2)}`))
          .join(" "),
      )
    : [];

  return (
    <div
      style={{
        width: size,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: o * (1 - e),
        transform: `translateY(${-e * 60}px) scale(${1 - e * 0.08})`,
        filter: e > 0.01 ? `blur(${e * 14}px)` : undefined,
        ...style,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          transform: `scale(${0.55 + 0.45 * s})`,
          border: `${Math.round(size * 0.011)}px solid ${grey > 0.5 ? "#5C6066" : "#1D86E0"}`,
          background: `radial-gradient(circle at 50% 50%, #1E1C1D 0%, #1E1C1D 50%, rgba(0,114,206,${0.3 * ring * (1 - grey)}) 78%, rgba(0,114,206,${0.7 * ring * (1 - grey)}) 100%)`,
          boxShadow: `0 0 ${size * 0.14}px rgba(0,114,206,${0.42 * ring * (1 - grey)}), inset 0 0 ${size * 0.07}px rgba(0,114,206,${0.5 * ring * (1 - grey)})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: grey > 0.01 ? `grayscale(${grey}) brightness(${1 - grey * 0.25})` : undefined,
        }}
      >
        <Icon name={icon} size={Math.round(size * 0.5)} p={draw} />
      </div>
      {label && (
        <KText
          tokens={labelTokens}
          size={labelSize}
          weight={500}
          style={{ marginTop: labelGap, width: size * 1.5 }}
          lineHeight={1.18}
          exitAt={labelExitAt}
        />
      )}
    </div>
  );
};

// ── Dominion Energy logo (vector traced from brand material) ──────────────
type LogoData = { viewBox: number[]; markStripes: string[]; word: string };
let logoCache: LogoData | null = null;

export const useLogo = () => {
  const [data, setData] = useState<LogoData | null>(logoCache);
  const [handle] = useState(() => (logoCache ? null : delayRender("logo")));
  useEffect(() => {
    if (logoCache) return;
    fetch(staticFile("brand/dominion-logo.json"))
      .then((r) => r.json())
      .then((d: LogoData) => {
        logoCache = d;
        setData(d);
        if (handle !== null) continueRender(handle);
      });
  }, [handle]);
  return data;
};

/**
 * stripes: 0→1 reveal of the four D-mark stripes (staggered slide-in)
 * word: 0→1 reveal of the wordmark (wipe + de-blur)
 */
export const Logo: React.FC<{
  width: number;
  stripes?: number;
  word?: number;
  markColor?: string;
  wordColor?: string;
  showWord?: boolean;
}> = ({
  width,
  stripes = 1,
  word = 1,
  markColor = C.blue,
  wordColor = "#FFFFFF",
  showWord = true,
}) => {
  const data = useLogo();
  const ids = React.useId();
  if (!data) return null;
  const vb = showWord ? [0, 0, 1040, 420] : [0, 0, 340, 420];
  const height = (width * vb[3]) / vb[2];
  const clipId = `wclip-${ids.replace(/:/g, "")}`;
  return (
    <svg viewBox={vb.join(" ")} width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={clipId}>
          <rect x={370} y={0} width={680 * clamp01(word)} height={420} />
        </clipPath>
      </defs>
      {data.markStripes.map((d, i) => {
        // stripes are stored bottom→top; animate top→bottom
        const order = data.markStripes.length - 1 - i;
        const p = clamp01((stripes - order * 0.14) / 0.58);
        const ep = easeOut(p);
        return (
          <path
            key={i}
            d={d}
            fill={markColor}
            opacity={ep}
            transform={`translate(${(1 - ep) * -90} ${(1 - ep) * 28})`}
          />
        );
      })}
      {showWord && (
        <g clipPath={`url(#${clipId})`}>
          <path
            d={data.word}
            fill={wordColor}
            fillRule="evenodd"
            opacity={clamp01(word * 1.6)}
            transform={`translate(${(1 - easeOut(clamp01(word))) * -40} 0)`}
          />
        </g>
      )}
    </svg>
  );
};

// ── Gradient pill (title tag) ──────────────────────────────────────────────
export const GradientPill: React.FC<{
  text: string;
  at: number;
  size?: number;
  exitAt?: number;
}> = ({ text, at, size = 96, exitAt }) => {
  const frame = useCurrentFrame();
  const g = prog(frame, F(at), 20, easeOut);
  const t = prog(frame, F(at) + 8, 18, easeOut);
  const e = exitAt !== undefined ? prog(frame, F(exitAt), 14, easeIn) : 0;
  return (
    <div
      style={{
        display: "inline-flex",
        position: "relative",
        padding: `${size * 0.22}px ${size * 0.62}px`,
        borderRadius: size,
        opacity: clamp01(g * 3) * (1 - e),
        transform: `translateY(${-e * 40}px)`,
        filter: e > 0.01 ? `blur(${e * 14}px)` : undefined,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: size,
          background: "linear-gradient(90deg, #F2F8FF 0%, #A9D2F7 42%, #2F90E6 100%)",
          boxShadow: "0 0 80px rgba(0,114,206,0.45)",
          transform: `scaleX(${0.2 + 0.8 * g})`,
        }}
      />
      <span
        style={{
          position: "relative",
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: size,
          color: "#0E2A47",
          letterSpacing: "-0.02em",
          opacity: t,
          filter: t < 0.99 ? `blur(${(1 - t) * 10}px)` : undefined,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ── MCC-style status badge ─────────────────────────────────────────────────
export const STATUS = {
  starting: { label: "STARTING", bg: C.starting, fg: "#062A30" },
  running: { label: "RUNNING", bg: C.running, fg: "#FFFFFF" },
  completed: { label: "COMPLETED", bg: C.completed, fg: "#FFFFFF" },
  failed: { label: "FAILED", bg: C.failed, fg: "#FFFFFF" },
} as const;

export const StatusBadge: React.FC<{
  status: keyof typeof STATUS;
  size?: number;
  style?: React.CSSProperties;
  glow?: number;
}> = ({ status, size = 64, style, glow = 0.5 }) => {
  const s = STATUS[status];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.4,
        padding: `${size * 0.32}px ${size * 0.7}px`,
        borderRadius: size,
        background: s.bg,
        color: s.fg,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: "0.06em",
        boxShadow: `0 0 ${size * 1.2}px ${s.bg}${Math.round(glow * 160)
          .toString(16)
          .padStart(2, "0")}`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {s.label}
    </div>
  );
};

// ── Glass card ─────────────────────────────────────────────────────────────
export const Glass: React.FC<{
  style?: React.CSSProperties;
  children?: React.ReactNode;
  glow?: number;
}> = ({ style, children, glow = 0.35 }) => (
  <div
    style={{
      borderRadius: 64,
      background:
        "linear-gradient(160deg, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.025) 100%), rgba(30,28,29,0.78)",
      border: "3px solid rgba(255,255,255,0.13)",
      boxShadow: `0 40px 120px rgba(0,0,0,0.45), 0 0 140px rgba(0,114,206,${glow * 0.5}), inset 0 0 0 1px rgba(0,114,206,${glow * 0.6})`,
      ...style,
    }}
  >
    {children}
  </div>
);

// ── Mouse cursor with brand tag (reference style) ──────────────────────────
export const Cursor: React.FC<{ size?: number; press?: number; style?: React.CSSProperties }> = ({
  size = 150,
  press = 0,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>
    <g transform={`scale(${1 - press * 0.12})`} style={{ transformOrigin: "10px 8px" }}>
      <path
        d="M10,6 L10,74 L28,58 L40,86 L52,80 L40,53 L64,52 Z"
        fill="#DCEEFF"
        stroke="#0072CE"
        strokeWidth={4}
        strokeLinejoin="round"
      />
    </g>
    <rect x={52} y={72} width={54} height={18} rx={9} fill="#8EC5F5" opacity={0.95} />
    <rect x={60} y={79} width={32} height={4} rx={2} fill="#FFFFFF" />
  </svg>
);

// ── Screen caption (blue lower-third box) ──────────────────────────────────
export const CaptionBox: React.FC<{
  text: string; // kinetic syntax; first word time = box entrance
  at: number;
  until: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({ text, at, until, size = 84, style }) => {
  const frame = useCurrentFrame();
  const a = F(at);
  const b = F(until);
  const i = prog(frame, a, 18, easeOut);
  const o = prog(frame, b - 12, 12, easeIn);
  if (frame < a - 1 || frame > b + 1) return null;
  const toks = k(
    text
      .split(" ")
      .map((w, idx) => (w.includes("@") || w === "|" ? w : `${w}${idx === 0 ? `@${at + 0.12}` : ""}`))
      .join(" "),
    0.06,
  );
  return (
    <div
      style={{
        position: "absolute",
        padding: `${size * 0.62}px ${size * 0.95}px`,
        borderRadius: 52,
        background: "linear-gradient(100deg, #0072CE 0%, #0A7FDE 60%, #1688E8 100%)",
        boxShadow: "0 30px 90px rgba(0,0,0,0.45), 0 0 80px rgba(0,114,206,0.35)",
        clipPath: `inset(0 ${(1 - i) * 100}% 0 0 round 52px)`,
        opacity: 1 - o,
        transform: `translateY(${(1 - i) * 30 + o * 26}px)`,
        ...style,
      }}
    >
      <KText
        tokens={toks}
        size={size}
        weight={500}
        align="left"
        color="#EAF4FF"
        dur={14}
        hlGradient="linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 100%)"
        hlWeight={700}
        style={{ whiteSpace: "nowrap" }}
      />
    </div>
  );
};
