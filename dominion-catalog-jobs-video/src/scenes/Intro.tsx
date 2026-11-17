import React from "react";
import { getLength, getPointAtLength } from "@remotion/paths";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, FONT, clamp01, easeIn, easeInOut, easeOut, lerp, prog } from "../theme";
import { Icon } from "../components/Icons";
import { KText, k } from "../components/Kinetic";
import { Cursor, Glass, GradientPill, IconCircle, Logo } from "../components/ui";
import { At, CircleAt, Scene, useMove } from "./common";

// ── shared: animated connector with travelling light pulses ───────────────
export const FlowPath: React.FC<{
  d: string;
  draw: number;
  pulses?: number;
  speed?: number;
  width?: number;
  dashed?: boolean;
  color?: string;
}> = ({ d, draw, pulses = 2, speed = 0.012, width = 8, dashed = false, color = "#1B8AE6" }) => {
  const frame = useCurrentFrame();
  const len = getLength(d);
  const dots = [];
  if (draw >= 1) {
    for (let i = 0; i < pulses; i++) {
      const t = (frame * speed + i / pulses) % 1;
      const pnt = getPointAtLength(d, t * len) ?? { x: 0, y: 0 };
      const fade = Math.sin(t * Math.PI);
      dots.push(
        <circle key={i} cx={pnt.x} cy={pnt.y} r={width * 1.7} fill="#BFE0FF" opacity={0.9 * fade} filter="url(#dotGlow)" />,
      );
    }
  }
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeOpacity={0.85}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? `${width * 0.1} ${width * 3}` : `${len} ${len}`}
        strokeDashoffset={dashed ? -frame * 2 : len * (1 - draw)}
        opacity={draw > 0 ? (dashed ? draw : 1) : 0}
      />
      {dots}
    </g>
  );
};

export const GlowDefs: React.FC = () => (
  <defs>
    <filter id="dotGlow" x="-200%" y="-200%" width="500%" height="500%">
      <feGaussianBlur stdDeviation="8" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

// ── 0 · Logo sting ─────────────────────────────────────────────────────────
export const LogoSting: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > 70) return null;
  const stripes = prog(frame, 2, 30, easeOut);
  const word = prog(frame, 10, 24, easeOut);
  const out = prog(frame, 46, 18, easeIn);
  const glow = prog(frame, 4, 30) * (1 - out);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          width: 2400,
          height: 1200,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(0,114,206,0.22), rgba(0,114,206,0))",
          opacity: glow,
        }}
      />
      <div
        style={{
          transform: `scale(${1 + out * 0.08 + (1 - stripes) * 0.03})`,
          opacity: 1 - out,
          filter: out > 0.01 ? `blur(${out * 26}px)` : undefined,
        }}
      >
        <Logo width={1320} stripes={stripes} word={word} />
      </div>
    </AbsoluteFill>
  );
};

// ── 1 · Module title + three objectives ───────────────────────────────────
export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const up = useMove(2.0, 2.95, easeInOut);
  const titleY = lerp(1000, 380, up);
  const titleS = lerp(1, 0.74, up);
  const xs = [800, 1920, 3040];
  const glowAt = (i: number) => {
    const p = prog(frame, F(7.45 + i * 0.14), 10) * (1 - prog(frame, F(7.95 + i * 0.14), 22));
    return p;
  };
  const l1 = prog(frame, F(4.3), 16, easeInOut);
  const l2 = prog(frame, F(6.3), 16, easeInOut);
  return (
    <Scene from={-0.05} to={9.05} drift={0.03}>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: "100%",
          top: titleY,
          transform: `translateY(-50%) scale(${titleS})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 56,
        }}
      >
        <KText tokens={k("Running@0.12 &@0.28 Monitoring@0.42")} size={196} weight={600} />
        <GradientPill text="Catalog Source Jobs" at={0.8} size={104} />
      </div>
      <svg width={3840} height={2160} style={{ position: "absolute", inset: 0 }}>
        <GlowDefs />
        <FlowPath d={`M${xs[0] + 300},1290 L${xs[1] - 300},1290`} draw={l1} pulses={2} />
        <FlowPath d={`M${xs[1] + 300},1290 L${xs[2] - 300},1290`} draw={l2} pulses={2} />
      </svg>
      <CircleAt x={xs[0]} y={1290} size={560}>
        <IconCircle icon="scan" at={2.64} size={560} label="Initiate a | catalog scan" glow={glowAt(0)} />
      </CircleAt>
      <CircleAt x={xs[1]} y={1290} size={560}>
        <IconCircle icon="milestones" at={4.58} size={560} label="Track execution | milestones" glow={glowAt(1)} />
      </CircleAt>
      <CircleAt x={xs[2]} y={1290} size={560}>
        <IconCircle icon="logs" at={6.62} size={560} label="Read job logs | with confidence" glow={glowAt(2)} />
      </CircleAt>
    </Scene>
  );
};

// ── 2 · Everything depends on fresh data ───────────────────────────────────
export const FoundationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const lift = useMove(13.55, 14.45, easeInOut);
  const draw = prog(frame, F(14.35), 26, easeInOut);
  const slab = prog(frame, F(15.45), 22, easeOut);
  const xs = [870, 1920, 2970];
  const cy = lerp(1050, 860, lift);
  return (
    <Scene from={8.8} to={18.85}>
      <div style={{ position: "absolute", top: 250, width: "100%" }}>
        <KText
          tokens={k("Every@9.26 reliable@9.52 *report,@10.06 *dashboard@11.1 &@11.68 *governance@11.94 *decision@12.3")}
          size={124}
          weight={600}
          exitAt={13.22}
        />
      </div>
      <div style={{ position: "absolute", top: 250, width: "100%" }}>
        <KText tokens={k("Depends@13.88 on@14.4 one@14.66 *fundamental@15.02 *thing@15.64")} size={124} weight={600} />
      </div>
      <svg width={3840} height={2160} style={{ position: "absolute", inset: 0 }}>
        <GlowDefs />
        <FlowPath d={`M${xs[0]},${cy + 220} C${xs[0]},${cy + 470} 1480,1270 1480,1470`} draw={draw} pulses={2} />
        <FlowPath d={`M${xs[1]},${cy + 220} L1920,1470`} draw={draw} pulses={2} />
        <FlowPath d={`M${xs[2]},${cy + 220} C${xs[2]},${cy + 470} 2360,1270 2360,1470`} draw={draw} pulses={2} />
      </svg>
      {[
        { icon: "report" as const, at: 10.06, label: "Report" },
        { icon: "dashboard" as const, at: 11.1, label: "Dashboard" },
        { icon: "governance" as const, at: 11.94, label: "Governance | decision" },
      ].map((c, i) => (
        <div key={i} style={{ position: "absolute", left: xs[i], top: cy, transform: "translate(-50%, -220px)" }}>
          <IconCircle icon={c.icon} at={c.at} size={440} label={c.label} labelSize={76} labelGap={54} labelExitAt={13.45} />
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 1920 - 1300,
          top: 1470 + (1 - slab) * 160,
          opacity: slab,
        }}
      >
        <Glass style={{ width: 2600, height: 430, display: "flex", alignItems: "center", gap: 90, padding: "0 140px" }} glow={0.6 * slab}>
          <Icon name="freshData" size={300} p={prog(frame, F(15.7), 30)} />
          <KText
            tokens={k("Fresh,@16.68 *up-to-date@17.4 *data@17.88")}
            size={168}
            weight={600}
            align="left"
          />
        </Glass>
      </div>
    </Scene>
  );
};

// ── 3 · Regular scan jobs keep the foundation solid ───────────────────────
const IsoSlab: React.FC<{ cy: number; p: number; glow: number }> = ({ cy, p, glow }) => {
  const cx = 1920;
  const hw = 1180;
  const hh = 190;
  const t = 64;
  const y = cy + (1 - p) * 260;
  return (
    <g opacity={p}>
      <path d={`M${cx - hw},${y} L${cx},${y + hh} L${cx},${y + hh + t} L${cx - hw},${y + t} Z`} fill="#0067BA" />
      <path d={`M${cx + hw},${y} L${cx},${y + hh} L${cx},${y + hh + t} L${cx + hw},${y + t} Z`} fill="#005AA3" />
      <path
        d={`M${cx - hw},${y} L${cx},${y - hh} L${cx + hw},${y} L${cx},${y + hh} Z`}
        fill={`rgba(0,114,206,${0.32 + glow * 0.4})`}
        stroke="#FFFFFF"
        strokeOpacity={0.75}
        strokeWidth={6}
        strokeLinejoin="round"
      />
    </g>
  );
};

export const SolidScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame: frame - F(19.3), fps, config: { damping: 18, stiffness: 110 } });
  const configured = prog(frame, F(20.2), 14);
  const lineL = prog(frame, F(21.2), 16, easeInOut);
  const lineR = prog(frame, F(21.96), 16, easeInOut);
  const strip = prog(frame, F(22.35), 14) * (1 - prog(frame, F(23.85), 14, easeIn));
  const s1 = prog(frame, F(24.02), 18);
  const s2 = prog(frame, F(24.3), 18);
  const s3 = prog(frame, F(24.58), 18);
  const solid = prog(frame, F(25.06), 8) * (1 - prog(frame, F(25.3), 24));
  const settle = useMove(23.95, 24.9, easeInOut);
  const cardY = lerp(1000, 940, settle);
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <Scene from={18.62} to={26.1}>
      <div style={{ position: "absolute", top: 250, width: "100%" }}>
        <KText tokens={k("Once@18.92 your@19.1 catalog@19.3 source@19.68 is@19.96 *configured@20.2")} size={124} weight={600} exitAt={20.8} exitDur={9} />
      </div>
      <div style={{ position: "absolute", top: 250, width: "100%" }}>
        <KText tokens={k("*Executing@21.2 &@21.68 *monitoring@21.96 regular@22.4 scan@22.92 jobs@23.26")} size={124} weight={600} exitAt={23.6} exitDur={9} />
      </div>
      <div style={{ position: "absolute", top: 250, width: "100%" }}>
        <KText tokens={k("Keeps@24.02 that@24.34 *foundation@24.58 *solid@25.06")} size={124} weight={600} />
      </div>

      <svg width={3840} height={2160} style={{ position: "absolute", inset: 0 }}>
        <GlowDefs />
        <IsoSlab cy={1830} p={s1} glow={solid} />
        <IsoSlab cy={1700} p={s2} glow={solid} />
        <IsoSlab cy={1570} p={s3} glow={solid} />
        <FlowPath d={`M1150,${cardY} L760,${cardY}`} draw={lineL} dashed width={10} />
        <FlowPath d={`M2690,${cardY} L3080,${cardY}`} draw={lineR} dashed width={10} />
      </svg>

      {/* catalog source card */}
      <div
        style={{
          position: "absolute",
          left: 1920,
          top: cardY,
          transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * card})`,
          opacity: clamp01(card * 1.6),
        }}
      >
        <Glass style={{ width: 1520, height: 470, display: "flex", alignItems: "center", gap: 70, padding: "0 110px" }} glow={0.45 + solid * 0.6}>
          <Icon name="catalogSource" size={290} p={prog(frame, F(19.4), 30)} />
          <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
            <span style={{ fontFamily: FONT, fontSize: 104, fontWeight: 600, color: C.text, letterSpacing: "-0.02em" }}>Catalog source</span>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 22,
                alignSelf: "flex-start",
                padding: "16px 40px 16px 20px",
                borderRadius: 60,
                background: "rgba(0,114,206,0.22)",
                border: "3px solid rgba(27,138,230,0.8)",
                opacity: configured,
                transform: `translateY(${(1 - configured) * 20}px)`,
              }}
            >
              <Icon name="checkCircle" size={78} p={configured} />
              <span style={{ fontFamily: FONT, fontSize: 64, fontWeight: 600, color: "#DCEEFF" }}>Configured</span>
            </div>
          </div>
        </Glass>
      </div>

      {/* execute / monitor satellites */}
      {[
        { at: 21.2, icon: "play" as const, label: "Execute", x: 520 },
        { at: 21.96, icon: "monitorPulse" as const, label: "Monitor", x: 3320 },
      ].map((s) => {
        const sp = spring({ frame: frame - F(s.at), fps, config: { damping: 15, stiffness: 120 } });
        return (
          <div
            key={s.label}
            style={{
              position: "absolute",
              left: s.x,
              top: cardY,
              transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * sp})`,
              opacity: clamp01(sp * 1.6),
            }}
          >
            <Glass style={{ display: "flex", alignItems: "center", gap: 40, padding: "44px 70px 44px 50px", borderRadius: 140 }}>
              <Icon name={s.icon} size={170} p={prog(frame, F(s.at), 24)} />
              <span style={{ fontFamily: FONT, fontSize: 88, fontWeight: 600, color: C.text }}>{s.label}</span>
            </Glass>
          </div>
        );
      })}

      {/* scan cadence */}
      <div
        style={{
          position: "absolute",
          left: 1920,
          top: 1470,
          transform: "translate(-50%,-50%)",
          display: "flex",
          alignItems: "center",
          gap: 34,
          opacity: strip,
        }}
      >
        <Icon name="calendar" size={150} p={strip} />
        {days.map((d, i) => {
          const on = prog(frame, F(22.45 + i * 0.13), 8);
          return (
            <div
              key={i}
              style={{
                width: 130,
                height: 130,
                borderRadius: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: on > 0 ? `rgba(0,114,206,${0.85 * on})` : "rgba(255,255,255,0.06)",
                border: "3px solid rgba(255,255,255,0.2)",
                boxShadow: on > 0 ? `0 0 ${50 * on}px rgba(0,114,206,0.7)` : undefined,
                fontFamily: FONT,
                fontSize: 56,
                fontWeight: 600,
                color: "#fff",
                transform: `scale(${1 + (on > 0 && on < 1 ? 0.12 * Math.sin(on * Math.PI) : 0)})`,
              }}
            >
              {on > 0.6 ? (
                <svg width={64} height={64} viewBox="0 0 64 64">
                  <path d="M14,33 l12,12 l24,-26" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                d
              )}
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

// ── 4 · Running a job: static connection → active inventory ───────────────
const RunButton: React.FC<{ at: number; press: number }> = ({ at, press }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - F(at), fps, config: { damping: 14, stiffness: 120 } });
  const ring = prog(frame, F(27.18), 22, easeOut);
  return (
    <div style={{ position: "relative", opacity: clamp01(s * 1.6), transform: `scale(${(0.6 + 0.4 * s) * (1 - press * 0.07)})` }}>
      {ring > 0 && ring < 1 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 640 + ring * 500,
            height: 220 + ring * 500,
            transform: "translate(-50%,-50%)",
            borderRadius: 400,
            border: `8px solid rgba(27,138,230,${1 - ring})`,
          }}
        />
      )}
      <div
        style={{
          width: 640,
          height: 220,
          borderRadius: 110,
          background: "linear-gradient(180deg, #1B8AE6 0%, #0072CE 100%)",
          boxShadow: `0 30px 80px rgba(0,0,0,0.45), 0 0 ${120 + press * 80}px rgba(0,114,206,0.7)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          border: "4px solid rgba(255,255,255,0.35)",
        }}
      >
        <svg width={86} height={86} viewBox="0 0 100 100">
          <path d="M28,16 L82,50 L28,84 Z" fill="#fff" stroke="#fff" strokeWidth={8} strokeLinejoin="round" />
        </svg>
        <span style={{ fontFamily: FONT, fontSize: 116, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>Run</span>
      </div>
    </div>
  );
};

export const RunJobScene: React.FC = () => {
  const frame = useCurrentFrame();
  // cursor path toward the Run button
  const cm = prog(frame, F(26.62), 18, easeInOut);
  const press = prog(frame, F(27.08), 4) * (1 - prog(frame, F(27.24), 6));
  const cursorOut = prog(frame, F(27.6), 12, easeIn);
  const cx = lerp(2700, 2010, cm);
  const cy = lerp(1900, 1300, cm);
  const f1 = prog(frame, F(28.3), 14, easeInOut);
  const f2 = prog(frame, F(28.6), 14, easeInOut);
  const lin = prog(frame, F(34.8), 26, easeInOut);
  const phaseA = frame < F(30.35);
  return (
    <>
      <Scene from={25.92} to={30.4} drift={0.025}>
        <div style={{ position: "absolute", top: 230, width: "100%" }}>
          <KText
            tokens={k("Running@26.28 a@26.46 job@26.68 turns@27.26 a@27.52 static@27.78 connection@28.04 | into@28.5 *active@28.88 *inventory@29.38")}
            size={120}
            weight={600}
          />
        </div>
        <svg width={3840} height={2160} style={{ position: "absolute", inset: 0 }}>
          <GlowDefs />
          <FlowPath d="M1190,1240 L1580,1240" draw={f1} pulses={2} speed={0.03} />
          <FlowPath d="M2260,1240 L2650,1240" draw={f2} pulses={2} speed={0.03} />
        </svg>
        <CircleAt x={900} y={1240} size={560}>
          <IconCircle icon="plug" at={27.78} size={560} label="Static | connection" muted={1 - 0.4 * f1} />
        </CircleAt>
        <At x={1920} y={1240}>
          <RunButton at={26.68} press={press} />
        </At>
        <CircleAt x={2940} y={1240} size={560}>
          <IconCircle icon="inventory" at={28.88} size={560} label="Active | inventory" glow={1} />
        </CircleAt>
        {phaseA && cm > 0 && (
          <div style={{ position: "absolute", left: cx, top: cy, opacity: 1 - cursorOut }}>
            <Cursor size={170} press={press} />
          </div>
        )}
      </Scene>

      <Scene from={30.22} to={36.7} drift={0.03}>
        <svg width={3840} height={2160} style={{ position: "absolute", inset: 0 }}>
          <GlowDefs />
          <FlowPath d="M240,1000 L3600,1000" draw={lin} pulses={4} speed={0.008} width={10} />
          {[240, 3600].map((x, i) => {
            const p = prog(frame, F(35.24 + i * 0.5), 12);
            return (
              <g key={x} opacity={p}>
                <circle cx={x} cy={1000} r={46} fill="#1E1C1D" stroke="#fff" strokeWidth={10} />
                <circle cx={x} cy={1000} r={18} fill={C.blue} />
              </g>
            );
          })}
        </svg>
        <CircleAt x={850} y={1000} size={560}>
          <IconCircle icon="table" at={30.48} size={560} label="Extracting | tables" />
        </CircleAt>
        <CircleAt x={1920} y={1000} size={560}>
          <IconCircle icon="columnStats" at={31.9} size={560} label="Profiling column | statistics" />
        </CircleAt>
        <CircleAt x={2990} y={1000} size={560}>
          <IconCircle icon="lineage" at={33.84} size={560} label="Mapping end-to-end | lineage" glow={lin} />
        </CircleAt>
        <div style={{ position: "absolute", top: 1900, width: "100%" }}>
          <KText tokens={k("…across@35.24 your@35.7 *systems@35.96")} size={104} weight={500} />
        </div>
      </Scene>
    </>
  );
};
