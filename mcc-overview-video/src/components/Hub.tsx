import React from 'react';
import { useCurrentFrame } from 'remotion';
import { E, prog } from '../anim';
import { FONT } from '../theme';
import { Icon } from './Icons';

/**
 * The "MCC engine" node: glowing rounded tile with a turning gear,
 * an orbiting dashed ring and periodic pulse rings.
 */
export const Hub: React.FC<{
  size: number;
  at?: number;
  label?: string;
  icon?: string;
  pulse?: number; // 0..1 intensity of an extra receive-pulse
  sub?: string;
  labelAt?: number;
}> = ({ size, at = 0, label = 'MCC', icon = 'gear', pulse = 0, sub, labelAt }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 30, E.outBack);
  const pf = prog(f, at, 18, E.outCubic);
  const rot = (f - at) * 0.6;
  const ring = prog(f, at + 6, 40, E.outExpo);
  const cyc = ((f - at) % 70) / 70;
  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        transform: `scale(${0.55 + 0.45 * p})`,
        opacity: pf,
      }}
    >
      {/* pulse rings */}
      {[0, 0.5].map((o, i) => {
        const c = (cyc + o) % 1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: size * (1.0 + c * 0.9),
              height: size * (1.0 + c * 0.9),
              transform: 'translate(-50%,-50%)',
              borderRadius: size * 0.3 * (1 + c),
              border: `${4}px solid rgba(64,158,245,${(1 - c) * 0.45 * ring})`,
            }}
          />
        );
      })}
      {/* orbit ring */}
      <svg
        width={size * 1.7}
        height={size * 1.7}
        style={{
          position: 'absolute',
          left: -size * 0.35,
          top: -size * 0.35,
          transform: `rotate(${rot}deg)`,
          opacity: ring,
          overflow: 'visible',
        }}
      >
        <circle
          cx={size * 0.85}
          cy={size * 0.85}
          r={size * 0.8}
          stroke="rgba(111,181,242,0.55)"
          strokeWidth={5}
          fill="none"
          strokeDasharray={`${size * 0.04} ${size * 0.06}`}
        />
        <circle cx={size * 0.85 + size * 0.8} cy={size * 0.85} r={12} fill="#fff" />
      </svg>
      {/* glow */}
      <div
        style={{
          position: 'absolute',
          inset: -size * 0.25,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(0,114,206,${0.55 + pulse * 0.4}) 0%, rgba(0,114,206,0) 65%)`,
          filter: 'blur(20px)',
        }}
      />
      {/* tile */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: size * 0.24,
          background: 'linear-gradient(155deg, #1D4E86 0%, #0F2C52 55%, #0A1D38 100%)',
          border: `5px solid rgba(90,170,245,${0.85 + pulse * 0.15})`,
          boxShadow: `0 0 ${size * (0.35 + pulse * 0.3)}px rgba(0,114,206,${0.7 + pulse * 0.3}), inset 0 0 ${size * 0.2}px rgba(43,142,240,0.4)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: size * 0.03,
        }}
      >
        <div style={{ transform: `rotate(${rot * 0.6}deg)` }}>
          <Icon name={icon} size={size * 0.46} />
        </div>
        {label ? (
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: size * 0.15,
              color: '#fff',
              letterSpacing: '0.04em',
              opacity: labelAt !== undefined ? prog(f, labelAt, 6) : 1,
            }}
          >
            {label}
          </div>
        ) : null}
      </div>
      {sub ? (
        <div
          style={{
            position: 'absolute',
            top: size * 1.12,
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: Math.max(52, size * 0.12),
            color: 'rgba(244,247,251,0.85)',
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

/** Label under an icon / badge. */
export const Caption: React.FC<{ text: string; size?: number; color?: string; weight?: number }> = ({
  text,
  size = 58,
  color = 'rgba(244,247,251,0.9)',
  weight = 500,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: size,
      fontWeight: weight,
      color,
      textAlign: 'center',
      whiteSpace: 'nowrap',
      letterSpacing: '-0.01em',
    }}
  >
    {text}
  </div>
);
