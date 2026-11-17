import React from "react";
import { getLength, getPointAtLength } from "@remotion/paths";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, FONT, TOTAL_FRAMES, clamp01, easeIn, easeInOut, easeOut, lerp, prog } from "../theme";
import { Icon } from "../components/Icons";
import { KText, k } from "../components/Kinetic";
import { Glass, IconCircle, Logo, StatusBadge } from "../components/ui";
import { CircleAt, Scene, useMove } from "./common";
import { GlowDefs } from "./Intro";

// A calm "vital signs" trace: almost flat, with gentle regular beats.
const calmTrace = (() => {
  const pts: string[] = [];
  const x0 = 0;
  const w = 1700;
  for (let i = 0; i <= 340; i++) {
    const x = x0 + (i / 340) * w;
    const ph = (i % 85) / 85;
    let y = Math.sin(i / 9) * 6;
    if (ph > 0.42 && ph < 0.58) y -= Math.sin(((ph - 0.42) / 0.16) * Math.PI) * 70;
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${(150 + y).toFixed(1)}`);
  }
  return pts.join(" ");
})();

// ── 1 · A healthy job is quiet and boring ─────────────────────────────────
export const HealthyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame: frame - F(124.2), fps, config: { damping: 18, stiffness: 100 } });
  const len = getLength(calmTrace);
  const draw = prog(frame, F(124.5), F(127.0) - F(124.5), (t) => t);
  const head = getPointAtLength(calmTrace, Math.max(1, draw * len)) ?? { x: 0, y: 0 };
  const badge = spring({ frame: frame - F(126.4), fps, config: { damping: 13, stiffness: 140 } });
  return (
    <Scene from={124.0} to={129.38}>
      <div style={{ position: "absolute", top: 300, width: "100%" }}>
        <KText tokens={k("A@124.1 healthy@124.66 job@125.0 is@125.32 *quiet@125.6 and@126.04 *boring.@126.4")} size={150} weight={600} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 1920,
          top: 1170,
          transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * card})`,
          opacity: clamp01(card * 1.5),
        }}
      >
        <Glass style={{ width: 3120, height: 640, display: "flex", alignItems: "center", gap: 80, padding: "0 110px" }} glow={0.5}>
          <Icon name="heartPulse" size={330} p={prog(frame, F(124.66), 28)} />
          <svg width={1560} height={275} viewBox="0 0 1700 300" style={{ overflow: "visible" }}>
            <GlowDefs />
            <path d={calmTrace} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={8} />
            <path
              d={calmTrace}
              fill="none"
              stroke="#1B8AE6"
              strokeWidth={10}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={`${len} ${len}`}
              strokeDashoffset={len * (1 - draw)}
            />
            {draw > 0 && <circle cx={head.x} cy={head.y} r={22} fill="#CFE7FF" filter="url(#dotGlow)" />}
          </svg>
          <div style={{ opacity: clamp01(badge * 1.6), transform: `scale(${0.6 + 0.4 * badge})` }}>
            <StatusBadge status="completed" size={70} glow={0.6} />
          </div>
        </Glass>
      </div>
      <div style={{ position: "absolute", top: 1700, width: "100%" }}>
        <KText
          tokens={k("And@127.14 that’s@127.4 exactly@127.62 what@128.08 you@128.26 *want@128.38 *to@128.54 *see.@128.66")}
          size={116}
          weight={500}
        />
      </div>
    </Scene>
  );
};

// ── 2 · Read status now → troubleshoot with less stress later ─────────────
export const ComfortScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shift = useMove(131.45, 132.3, easeInOut);
  const statuses = ["starting", "running", "completed", "failed"] as const;
  return (
    <Scene from={129.22} to={135.33}>
      <div style={{ position: "absolute", top: 300, width: "100%" }}>
        <KText tokens={k("Get@129.42 comfortable@129.64 reading@130.06 job@130.44 *status@130.78 *now@131.06")} size={150} weight={600} exitAt={131.3} exitDur={10} />
      </div>
      <div style={{ position: "absolute", top: 260, width: "100%" }}>
        <KText
          tokens={k("Troubleshooting@132.02 a@132.48 scan@132.7 later@132.9 | feels@133.54 a@133.76 lot@134.1 *less@134.26 *intimidating@134.52")}
          size={136}
          weight={600}
        />
      </div>
      {/* status badges row */}
      <div
        style={{
          position: "absolute",
          left: 1920,
          top: lerp(1130, 980, shift),
          transform: `translate(-50%,-50%) scale(${lerp(1, 0.72, shift)})`,
          display: "flex",
          gap: 90,
          opacity: 1 - shift * 0.55,
        }}
      >
        {statuses.map((s, i) => {
          const at = 129.95 + i * 0.28;
          const sp = spring({ frame: frame - F(at), fps, config: { damping: 13, stiffness: 140 } });
          return (
            <div key={s} style={{ opacity: clamp01(sp * 1.6), transform: `translateY(${(1 - sp) * 80}px) scale(${0.7 + 0.3 * sp})` }}>
              <StatusBadge status={s} size={96} glow={0.6} />
            </div>
          );
        })}
      </div>
      <CircleAt x={1920} y={1480} size={520}>
        <IconCircle icon="troubleshoot" at={132.02} size={520} glow={prog(frame, F(134.26), 14)} />
      </CircleAt>
    </Scene>
  );
};

// ── 3 · What looks alarming is usually perfectly normal ───────────────────
export const NormalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame: frame - F(135.4), fps, config: { damping: 18, stiffness: 110 } });
  const flip = prog(frame, F(137.9), 24, easeInOut);
  const shake = frame >= F(136.64) && frame < F(137.3) ? Math.sin((frame - F(136.64)) * 1.9) * 4 * (1 - prog(frame, F(136.64), 20)) : 0;
  const eye = prog(frame, F(139.72), 16);
  const front = flip < 0.5;
  return (
    <Scene from={135.18} to={141.66}>
      <div style={{ position: "absolute", top: 270, width: "100%" }}>
        <KText tokens={k("Most@135.82 of@136.1 what@136.3 looks@136.44 *alarming…@136.64")} size={136} weight={600} exitAt={137.45} exitDur={10} />
      </div>
      <div style={{ position: "absolute", top: 270, width: "100%" }}>
        <KText tokens={k("…turns@137.94 out@138.28 to@138.48 be@138.6 *perfectly@138.76 *normal@139.28")} size={136} weight={600} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 1920,
          top: 1150,
          transform: `translate(-50%,-50%) perspective(3000px) rotateY(${flip * 180}deg) rotateZ(${shake}deg) scale(${0.8 + 0.2 * card})`,
          opacity: clamp01(card * 1.6),
        }}
      >
        <Glass
          style={{
            width: 1500,
            height: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 70,
            transform: front ? undefined : "rotateY(180deg)",
            boxShadow: front
              ? "0 40px 120px rgba(0,0,0,0.45), 0 0 160px rgba(200,40,46,0.28)"
              : "0 40px 120px rgba(0,0,0,0.45), 0 0 160px rgba(0,114,206,0.55)",
          }}
        >
          {front ? (
            <>
              <Icon name="warning" size={420} p={prog(frame, F(135.6), 30)} />
              <span style={{ fontFamily: FONT, fontSize: 104, fontWeight: 600, color: C.text }}>Looks alarming</span>
            </>
          ) : (
            <>
              <Icon name="checkCircle" size={420} p={prog(frame, F(138.3), 26)} />
              <span style={{ fontFamily: FONT, fontSize: 104, fontWeight: 600, color: C.text }}>Perfectly normal</span>
            </>
          )}
        </Glass>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1800,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 50,
        }}
      >
        <div style={{ opacity: eye, transform: `scale(${0.6 + 0.4 * eye})` }}>
          <Icon name="eye" size={170} p={eye} />
        </div>
        <KText tokens={k("Once@139.72 you@140.1 know@140.24 what@140.38 you’re@140.52 *looking@140.7 *at.@140.9")} size={104} weight={500} />
      </div>
    </Scene>
  );
};

// ── 4 · Tagline + end card ─────────────────────────────────────────────────
export const TaglineScene: React.FC = () => (
  <Scene from={141.5} to={145.3} drift={0.04}>
    <AbsoluteFill style={{ justifyContent: "center" }}>
      <KText
        tokens={k("Every@141.72 job@141.98 run@142.3 keeps@142.52 | Dominion@142.84 Energy’s@143.26 catalog@143.92 *current@144.22")}
        size={176}
        weight={600}
        lineHeight={1.2}
      />
    </AbsoluteFill>
  </Scene>
);

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const a = F(145.2);
  if (frame < a - 1) return null;
  const i = prog(frame, a, 20, easeOut);
  const stripes = prog(frame, a, 30, easeOut);
  const word = prog(frame, a + 8, 26, easeOut);
  const div = prog(frame, a + 10, 20, easeOut);
  const drift = (frame - a) / Math.max(1, TOTAL_FRAMES - a);
  const fadeOut = prog(frame, TOTAL_FRAMES - 16, 15, easeIn);
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        opacity: (0.4 + 0.6 * i) * (1 - fadeOut * 0.0),
        transform: `scale(${1 + drift * 0.025})`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 130 }}>
        <Logo width={1360} stripes={stripes} word={word} />
        <div
          style={{
            width: 5,
            height: 420 * div,
            background: "rgba(255,255,255,0.75)",
            borderRadius: 3,
          }}
        />
        <KText
          tokens={k("Current@145.4 is@145.84 what@146.26 makes@146.4 | it@146.64 *trustworthy.@146.82")}
          size={124}
          weight={500}
          align="left"
          lineHeight={1.2}
          style={{ width: 1350 }}
        />
      </div>
    </AbsoluteFill>
  );
};
