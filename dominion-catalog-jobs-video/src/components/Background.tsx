import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, H, W } from "../theme";

/**
 * #221F20 canvas with soft brand-blue light pools in the top-left and
 * bottom-right corners. The pools breathe and drift very slowly so the frame
 * never feels static; a fine grain layer prevents gradient banding.
 */
export const Background: React.FC<{ intensity?: number }> = ({
  intensity = 1,
}) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const driftA = Math.sin(t * 0.21) * 70;
  const driftB = Math.cos(t * 0.17) * 80;
  const breathe = 0.92 + Math.sin(t * 0.35) * 0.06;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      {/* Top-left pool */}
      <div
        style={{
          position: "absolute",
          left: -1500 + driftA,
          top: -1050 + driftA * 0.4,
          width: 3600,
          height: 1750,
          borderRadius: "50%",
          background:
            "radial-gradient(closest-side, rgba(0,114,206,0.95) 0%, rgba(0,114,206,0.55) 38%, rgba(0,114,206,0.18) 68%, rgba(0,114,206,0) 100%)",
          opacity: 0.78 * intensity * breathe,
          transform: "rotate(-8deg)",
        }}
      />
      {/* Bottom-right pool */}
      <div
        style={{
          position: "absolute",
          left: W - 2050 + driftB,
          top: H - 760 - driftB * 0.3,
          width: 3700,
          height: 1800,
          borderRadius: "50%",
          background:
            "radial-gradient(closest-side, rgba(0,114,206,1) 0%, rgba(0,114,206,0.6) 36%, rgba(0,114,206,0.2) 66%, rgba(0,114,206,0) 100%)",
          opacity: 0.85 * intensity * (2 - breathe),
          transform: "rotate(-14deg)",
        }}
      />
      {/* Gentle vignette keeps the eye centred */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.28) 100%)",
        }}
      />
      {/* Grain / dither */}
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile("brand/noise.png")})`,
          backgroundSize: "256px 256px",
          opacity: 0.045,
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};

// Preload helper so the grain texture is ready before first paint.
export const BackgroundPreload: React.FC = () => (
  <Img
    src={staticFile("brand/noise.png")}
    style={{ width: 1, height: 1, opacity: 0, position: "absolute" }}
  />
);
