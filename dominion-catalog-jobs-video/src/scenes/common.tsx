import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { F, easeIn, easeOut, lerp, prog } from "../theme";

/**
 * Scene wrapper: mounts children between two voice-over times, gives every
 * scene the same "camera" language — content glides in from slightly below,
 * drifts forward slowly while on screen, then lifts away with a soft blur.
 */
export const Scene: React.FC<{
  from: number; // VO seconds
  to: number; // VO seconds
  children: React.ReactNode;
  inDur?: number;
  outDur?: number;
  drift?: number; // total scale drift over the scene
  enterY?: number;
  exitY?: number;
}> = ({ from, to, children, inDur = 20, outDur = 16, drift = 0.035, enterY = 140, exitY = -160 }) => {
  const frame = useCurrentFrame();
  const a = F(from);
  const b = F(to);
  if (frame < a - 1 || frame > b + 1) return null;
  const i = prog(frame, a, inDur, easeOut);
  const o = prog(frame, b - outDur, outDur, easeIn);
  const d = (frame - a) / Math.max(1, b - a);
  const scale = lerp(1, 1 + drift, d) * (1 - o * 0.04);
  const y = (1 - i) * enterY + o * exitY;
  const blur = (1 - i) * 18 + o * 22;
  return (
    <AbsoluteFill
      style={{
        opacity: i * (1 - o),
        transform: `translateY(${y}px) scale(${scale})`,
        filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Absolutely-positioned helper centred on (x, y). */
export const At: React.FC<{ x: number; y: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  x,
  y,
  children,
  style,
}) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", ...style }}>
    {children}
  </div>
);

/** Interpolated move between two states over a VO-time window. */
export const useMove = (v0: number, v1: number, easing = easeOut) => {
  const frame = useCurrentFrame();
  return prog(frame, F(v0), F(v1) - F(v0), easing);
};

/** Places an IconCircle so that the circle (not the label) is centred on (x, y). */
export const CircleAt: React.FC<{ x: number; y: number; size: number; children: React.ReactNode }> = ({
  x,
  y,
  size,
  children,
}) => <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size }}>{children}</div>;
