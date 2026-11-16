import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, FONT, clamp01, easeIn, easeInOut, easeOut, lerp, prog } from "../theme";
import { Icon, IconName } from "../components/Icons";
import { KText, k } from "../components/Kinetic";
import { Glass, IconCircle, StatusBadge } from "../components/ui";

// All inserts are positioned inside the device frame (3300 × 1769).
const FWI = 3300;

const useWindow = (v0: number, v1: number, inDur = 16, outDur = 14) => {
  const frame = useCurrentFrame();
  const a = F(v0);
  const b = F(v1);
  const i = prog(frame, a, inDur, easeOut);
  const o = prog(frame, b - outDur, outDur, easeIn);
  return { frame, a, b, i, o, on: frame >= a - 1 && frame <= b + 1 };
};

const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number }> = ({
  at,
  children,
  style,
  from = 0.6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - F(at), fps, config: { damping: 15, stiffness: 130, mass: 0.8 } });
  const o = prog(frame, F(at), 8);
  return (
    <div style={{ opacity: o, transform: `scale(${lerp(from, 1, s)})`, ...style }}>{children}</div>
  );
};

// ── "Runtime varies with repository size" ─────────────────────────────────
const Bar: React.FC<{ fill: number; shimmer?: boolean; width: number; done?: number }> = ({
  fill,
  shimmer,
  width,
  done = 0,
}) => {
  const frame = useCurrentFrame();
  const sx = ((frame * 18) % (width + 600)) - 300;
  return (
    <div
      style={{
        position: "relative",
        width,
        height: 34,
        borderRadius: 17,
        background: "rgba(255,255,255,0.10)",
        overflow: "hidden",
        boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: width * fill,
          borderRadius: 17,
          background: done > 0.5 ? "linear-gradient(90deg,#1B8AE6,#6FB4F2)" : "linear-gradient(90deg,#0072CE,#1B8AE6)",
          boxShadow: "0 0 40px rgba(0,114,206,0.8)",
        }}
      />
      {shimmer && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: sx,
            width: 220,
            background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.45), rgba(255,255,255,0))",
            clipPath: `inset(0 ${Math.max(0, sx + 220 - width * fill)}px 0 0)`,
          }}
        />
      )}
    </div>
  );
};

export const RuntimeInsert: React.FC = () => {
  const { frame, i, o, on } = useWindow(57.52, 63.45, 16, 16);
  if (!on) return null;
  const small = prog(frame, F(58.45), 26, easeInOut);
  const large = prog(frame, F(59.6), F(63.2) - F(59.6), (t) => t);
  const smallDone = prog(frame, F(59.3), 10);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: i * (1 - o), transform: `translateY(${(1 - i) * 40 - o * 30}px)` }}>
      <KText
        tokens={k("Runtime@57.6 varies@57.76 with@57.92 *repository@58.14 *size@58.32")}
        size={128}
        weight={600}
        style={{ position: "absolute", top: 190, width: FWI }}
      />
      <Glass style={{ position: "absolute", left: 420, top: 520, width: 2460, height: 960 }}>
        {/* small repository */}
        <div style={{ position: "absolute", left: 120, top: 70, display: "flex", alignItems: "center", gap: 90 }}>
          <Pop at={58.2}>
            <Icon name="dbSmall" size={300} p={prog(frame, F(58.2), 24)} />
          </Pop>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 84, fontWeight: 600, color: C.text, opacity: prog(frame, F(58.3), 12), marginBottom: 40 }}>
              Smaller repository
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 50 }}>
              <Bar width={1620} fill={small} done={smallDone} />
              <div style={{ opacity: smallDone, transform: `scale(${0.6 + 0.4 * smallDone})` }}>
                <Icon name="checkCircle" size={110} p={smallDone} />
              </div>
            </div>
          </div>
        </div>
        {/* large database */}
        <div style={{ position: "absolute", left: 100, top: 470, display: "flex", alignItems: "center", gap: 70 }}>
          <Pop at={59.38}>
            <Icon name="dbLarge" size={340} p={prog(frame, F(59.38), 26)} />
          </Pop>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 84, fontWeight: 600, color: C.text, opacity: prog(frame, F(59.5), 12), marginBottom: 40 }}>
              Large database
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 50 }}>
              <Bar width={1620} fill={0.04 + 0.62 * large} shimmer />
              <div style={{ opacity: prog(frame, F(59.8), 12) }}>
                <Icon name="stopwatch" size={120} p={prog(frame, F(59.8), 20)} />
              </div>
            </div>
            <KText
              tokens={k("More@62.08 time@62.2 to@62.3 *extract@62.38 *&@62.5 *profile@62.7")}
              size={72}
              weight={500}
              align="left"
              color={C.muted}
              style={{ marginTop: 40 }}
            />
          </div>
        </div>
      </Glass>
    </div>
  );
};

// ── "Each job moves through defined phases" ───────────────────────────────
const Connector: React.FC<{ d: string; p: number }> = ({ d, p }) => (
  <path
    d={d}
    fill="none"
    stroke="url(#phaseGrad)"
    strokeWidth={10}
    strokeLinecap="round"
    pathLength={1}
    strokeDasharray="1 1"
    strokeDashoffset={1 - p}
    opacity={p > 0 ? 1 : 0}
  />
);

const Phase: React.FC<{ at: number; status: "starting" | "running" | "completed" | "failed"; icon: IconName; x: number; y: number }> = ({
  at,
  status,
  icon,
  x,
  y,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)" }}>
      <Pop at={at}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 46 }}>
          <Icon name={icon} size={230} p={prog(frame, F(at), 26)} />
          <StatusBadge status={status} size={74} glow={0.55} />
        </div>
      </Pop>
    </div>
  );
};

export const PhasesInsert: React.FC = () => {
  const { frame, i, o, on } = useWindow(72.25, 79.05, 16, 14);
  if (!on) return null;
  const c1 = prog(frame, F(75.2), 16, easeInOut);
  const c2 = prog(frame, F(76.6), 16, easeInOut);
  const c3 = prog(frame, F(77.7), 16, easeInOut);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: i * (1 - o), transform: `translateY(${(1 - i) * 40 - o * 30}px)` }}>
      <KText
        tokens={k("Each@72.32 job@72.45 moves@72.72 through@73.02 *defined@73.24 *phases@73.72")}
        size={128}
        weight={600}
        style={{ position: "absolute", top: 190, width: FWI }}
      />
      <svg width={FWI} height={1769} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="phaseGrad" x1="0" x2="1">
            <stop offset="0" stopColor="#6FB4F2" />
            <stop offset="1" stopColor="#0072CE" />
          </linearGradient>
        </defs>
        <Connector d="M860,1000 L1330,1000" p={c1} />
        <Connector d="M1830,1000 C2080,1000 2120,760 2390,760" p={c2} />
        <Connector d="M1830,1000 C2080,1000 2120,1250 2390,1250" p={c3} />
      </svg>
      <Phase at={74.78} status="starting" icon="hourglass" x={640} y={960} />
      <Phase at={75.66} status="running" icon="play" x={1580} y={960} />
      <Phase at={77.02} status="completed" icon="checkCircle" x={2660} y={700} />
      <Phase at={78.12} status="failed" icon="warning" x={2660} y={1230} />
    </div>
  );
};

// ── "Common bottlenecks … documented in detail … system administrator" ────
const LogLine: React.FC<{ at: number; level: "INFO" | "ERROR"; time: string; msg: string; strong?: boolean }> = ({
  at,
  level,
  time,
  msg,
  strong,
}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, F(at), 14);
  const err = level === "ERROR";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 44,
        padding: "26px 40px",
        borderRadius: 24,
        fontFamily: FONT,
        fontSize: 60,
        color: err ? "#FFE3E3" : "#C9D2DC",
        background: err && strong ? `rgba(200,40,46,${0.22 * p})` : "transparent",
        boxShadow: err && strong ? `inset 0 0 0 3px rgba(232,80,86,${0.7 * p}), 0 0 60px rgba(200,40,46,${0.35 * p})` : undefined,
        opacity: p,
        transform: `translateX(${(1 - p) * -40}px)`,
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: "#8E99A6", width: 230 }}>{time}</span>
      <span
        style={{
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: "0.06em",
          padding: "10px 24px",
          borderRadius: 30,
          background: err ? C.failed : "#2D5D8E",
          color: "#fff",
          width: 190,
          textAlign: "center",
        }}
      >
        {level}
      </span>
      <span style={{ fontWeight: err ? 600 : 400 }}>{msg}</span>
    </div>
  );
};

export const BottleneckInsert: React.FC = () => {
  const { frame, i, o, on } = useWindow(107.0, 116.7, 16, 16);
  if (!on) return null;
  const detail = prog(frame, F(111.32), 22, easeInOut);
  const arrow = prog(frame, F(113.3), 22, easeInOut);
  const resolved = prog(frame, F(115.9), 14, easeOut);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: i * (1 - o), transform: `translateY(${(1 - i) * 40 - o * 30}px)` }}>
      <KText
        tokens={k("Common@107.38 *bottlenecks@107.6 are@111.16 documented@111.32 in@111.8 detail@111.98")}
        size={124}
        weight={600}
        style={{ position: "absolute", top: 170, width: FWI }}
      />
      <Glass style={{ position: "absolute", left: 200, top: 450, width: 2050, height: 1080, padding: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30, marginBottom: 30, marginLeft: 20 }}>
          <Icon name="logs" size={110} p={prog(frame, F(107.15), 20)} />
          <span style={{ fontFamily: FONT, fontSize: 64, fontWeight: 600, color: C.text }}>Task log</span>
        </div>
        <LogLine at={107.4} level="INFO" time="10:07:41" msg="Connection established" />
        <LogLine at={107.7} level="INFO" time="10:07:44" msg="Metadata extraction started" />
        <LogLine at={108.66} level="ERROR" time="10:08:02" msg="Insufficient read permission on source schema" strong />
        <div
          style={{
            marginTop: 26,
            marginLeft: 40,
            paddingLeft: 50,
            borderLeft: `6px solid rgba(232,80,86,${0.8 * detail})`,
            height: 330 * detail,
            overflow: "hidden",
            opacity: detail,
            fontFamily: FONT,
            fontSize: 56,
            color: "#C9D2DC",
            lineHeight: 1.75,
          }}
        >
          <div><span style={{ color: "#8E99A6", display: "inline-block", width: 330 }}>Cause</span>Missing SELECT privilege</div>
          <div><span style={{ color: "#8E99A6", display: "inline-block", width: 330 }}>Scope</span>Source schema · read access</div>
          <div><span style={{ color: "#8E99A6", display: "inline-block", width: 330 }}>Next step</span>Request the grant from your admin</div>
        </div>
        <div style={{ position: "absolute", right: 60, top: 70, opacity: prog(frame, F(108.9), 12), transform: `scale(${0.6 + 0.4 * prog(frame, F(108.9), 16)})` }}>
          <Icon name="lock" size={170} p={prog(frame, F(108.9), 22)} />
        </div>
      </Glass>
      {/* hand-off to the system administrator */}
      <svg width={FWI} height={1769} style={{ position: "absolute", left: 0, top: 0 }}>
        <path
          d="M2290,990 C2400,990 2430,990 2540,990"
          fill="none"
          stroke="#1B8AE6"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray="1 1"
          pathLength={1}
          strokeDashoffset={1 - arrow}
          opacity={arrow > 0 ? 1 : 0}
        />
        <path d="M2510,960 L2545,990 L2510,1020" fill="none" stroke="#1B8AE6" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={clamp01((arrow - 0.85) * 7)} />
      </svg>
      <div style={{ position: "absolute", left: 2560, top: 640 }}>
        <IconCircle icon="admin" at={113.6} size={560} label="System | administrator" labelSize={76} labelGap={50} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 2980,
          top: 650,
          opacity: resolved,
          transform: `scale(${0.5 + 0.5 * resolved})`,
        }}
      >
        <Icon name="checkCircle" size={170} p={resolved} />
      </div>
    </div>
  );
};

// ── floating chips: credentials / network paths ───────────────────────────
const Chip: React.FC<{ at: number; until: number; icon: IconName; label: string; check?: boolean; style?: React.CSSProperties }> = ({
  at,
  until,
  icon,
  label,
  check = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - F(at), fps, config: { damping: 16, stiffness: 120 } });
  const o = prog(frame, F(until) - 12, 12, easeIn);
  const ck = prog(frame, F(at) + 12, 16);
  if (frame < F(at) - 1 || frame > F(until) + 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 40,
        padding: "34px 56px 34px 40px",
        borderRadius: 120,
        background: "linear-gradient(160deg, rgba(48,45,47,0.94), rgba(30,28,29,0.94))",
        border: "3px solid rgba(255,255,255,0.14)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.45), 0 0 80px rgba(0,114,206,0.35)",
        opacity: clamp01(s * 1.5) * (1 - o),
        transform: `translateX(${(1 - s) * 160}px) scale(${0.85 + 0.15 * s})`,
        fontFamily: FONT,
        fontSize: 76,
        fontWeight: 600,
        color: C.text,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <Icon name={icon} size={140} p={prog(frame, F(at), 22)} />
      {label}
      {check && (
        <div style={{ opacity: ck, transform: `scale(${0.5 + 0.5 * ck})` }}>
          <Icon name="checkCircle" size={96} p={ck} />
        </div>
      )}
    </div>
  );
};

export const CheckChips: React.FC = () => (
  <>
    <Chip at={49.9} until={52.55} icon="key" label="Credentials" style={{ left: 2150, top: 760 }} />
    <Chip at={50.74} until={52.55} icon="network" label="Network paths" style={{ left: 2150, top: 1030 }} />
  </>
);

export const SubtaskChips: React.FC = () => (
  <>
    <Chip at={90.44} until={92.35} icon="table" label="Extraction" check={false} style={{ left: 1080, top: 1300 }} />
    <Chip at={91.26} until={92.35} icon="columnStats" label="Data profiling" check={false} style={{ left: 1980, top: 1300 }} />
  </>
);
