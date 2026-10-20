import React from 'react';
import {AbsoluteFill} from 'remotion';
import {LogoLockup, LogoMark} from '../components/Logo';
import {At, Words, ws} from '../components/Kinetic';
import {Pill} from '../components/UI';
import {clamp01, ease, lerp} from '../lib/anim';

/** g: global seconds. Logo traces on in light, fills, catches a blue glint, then hands off. */
export const LogoOpen: React.FC<{g: number}> = ({g}) => {
  const draw = clamp01((g - 0.15) / 1.45);
  const fill = ease.inOut(clamp01((g - 1.25) / 0.7));
  const glow = clamp01((g - 0.3) / 0.6) * (1 - 0.75 * ease.inOut(clamp01((g - 1.8) / 0.8)));
  const shine = clamp01((g - 1.95) / 1.0);
  const exit = ease.in(clamp01((g - 3.25) / 0.7));
  const s = lerp(1.06, 1, ease.out(clamp01(g / 3.2))) * lerp(1, 0.94, exit);
  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1 - exit,
        transform: `scale(${s})`,
        filter: exit > 0.01 ? `blur(${(exit * 14).toFixed(2)}px)` : undefined,
      }}
    >
      <LogoLockup id="open" height={520} draw={draw} fill={fill} glow={glow} shine={shine} />
    </AbsoluteFill>
  );
};

/** Title card: course line + topic pill over a faint brand-mark watermark. */
export const TitleCard: React.FC<{g: number}> = ({g}) => {
  const t = g;
  const wm = ease.out(clamp01((g - 3.3) / 1.4));
  const exit = ease.in(clamp01((g - 7.85) / 0.7));
  const drift = (g - 3.3) * 0.012;
  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        transform: `scale(${lerp(1, 1.32, exit)})`,
        filter: exit > 0.01 ? `blur(${(exit * 16).toFixed(2)}px)` : undefined,
      }}
    >
      <At x={1920 + 40} y={1080} style={{transform: `translate(-50%,-50%) scale(${lerp(1.12, 1, wm) + drift})`}}>
        <LogoMark height={1380} opacity={0.045 * wm} />
      </At>
      <At x={1920} y={952}>
        <Words
          t={t}
          size={150}
          weight={500}
          words={ws('Cloud Data Governance & Catalog:', [3.55, 3.67, 3.79, 3.91, 4.03])}
        />
      </At>
      <At x={1920} y={1212}>
        <Pill text="Deleting Assets Correctly" t={t} at={4.45} size={138} dur={0.85} shineAt={5.55} />
      </At>
    </AbsoluteFill>
  );
};
