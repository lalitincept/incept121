import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Shell} from '../components/Shell';
import {At, Words, ws} from '../components/Kinetic';
import {Badge, Camera, Cursor, Glass, Particles, Ripple} from '../components/UI';
import {Icon, IconName} from '../components/Icons';
import {CamKey, camAt, clamp01, ease, lerp} from '../lib/anim';
import {C, FONT} from '../theme';

// "That's why CDGC enforces strict dependency guardrails to prevent accidental deletions."

const CAM: CamKey[] = [
  {t: 23.8, x: 1920, y: 1150, s: 1.14, r: 1.6},
  {t: 26.2, x: 1920, y: 1150, s: 1.0, r: 0, e: ease.glide},
  {t: 28.0, x: 1920, y: 1150, s: 1.025, e: ease.outSoft},
  {t: 29.0, x: 1950, y: 1150, s: 1.0, e: ease.inOut},
  {t: 31.4, x: 1990, y: 1140, s: 1.045, e: ease.outSoft},
];

const CARD = {x: 2700, y: 1140, w: 1560, h: 820};
const BTN = {x: CARD.x + CARD.w / 2 - 70 - 280, y: CARD.y + CARD.h / 2 - 70 - 70};
const CLICK = 29.55;

const Chip: React.FC<{icon: IconName; label: string; p: number}> = ({icon, label, p}) => {
  const e = ease.out(clamp01(p));
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '18px 36px 18px 24px',
        borderRadius: 999,
        border: '3px solid rgba(125,185,238,0.5)',
        background: 'rgba(0,114,206,0.12)',
        opacity: clamp01(p * 1.5),
        transform: `translateY(${(1 - e) * 30}px)`,
      }}
    >
      <Icon name={icon} size={68} p={clamp01(p * 1.2)} strokePx={6} />
      <div style={{fontFamily: FONT, fontSize: 46, fontWeight: 600, color: C.text}}>{label}</div>
    </div>
  );
};

export const SceneGuardrails: React.FC<{t: number; g: number}> = ({t, g}) => {
  const cam = camAt(t, CAM);
  const shift = ease.inOut(clamp01((t - 27.95) / 0.85));
  const sx = lerp(1920, 1130, shift);
  const sy = 1140;
  const ss = lerp(1, 0.84, shift);
  const ringP = ease.inOut(clamp01((t - 26.9) / 0.9));
  const rot = t * 9;
  const card = ease.out(clamp01((t - 28.15) / 0.75));

  const cm = ease.inOut(clamp01((t - 28.85) / 0.6));
  const cx = lerp(3560, BTN.x + 40, cm);
  const cy = lerp(2060, BTN.y + 20, cm);
  const press = clamp01((t - CLICK) / 0.08) * (1 - clamp01((t - CLICK - 0.16) / 0.1));
  const cursorOp = clamp01((t - 28.85) / 0.2) * (1 - clamp01((t - 30.5) / 0.3));
  const blocked = ease.inOut(clamp01((t - (CLICK + 0.14)) / 0.25));
  const shakeK = clamp01((t - (CLICK + 0.08)) / 0.5);
  const shake = shakeK > 0 && shakeK < 1 ? Math.sin(shakeK * Math.PI * 7) * 22 * (1 - shakeK) : 0;
  const beam = ease.inOut(clamp01((t - (CLICK + 0.05)) / 0.4));
  const beamFade = 1 - clamp01((t - 30.6) / 0.4);

  return (
    <Shell t={t} a={23.8} b={31.4} enter="fromBig" exit="up" enterDur={0.65} exitDur={0.6}>
      <Particles g={g} cam={cam} seed={11} />
      <Camera cam={cam} id="d">
        {/* Guardrail beam from shield to the blocked action */}
        {beam > 0 ? (
          <svg width={3840} height={2160} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: beamFade}}>
            <defs>
              <linearGradient id="beamG" gradientUnits="userSpaceOnUse" x1={sx + 290 * ss} y1={sy} x2={CARD.x - CARD.w / 2} y2={CARD.y}>
                <stop offset="0" stopColor="#4C9DE3" stopOpacity="0.2" />
                <stop offset="1" stopColor="#CFE6FA" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            <path
              d={`M ${sx + 290 * ss} ${sy} L ${CARD.x - CARD.w / 2 - 14} ${CARD.y}`}
              fill="none"
              stroke="url(#beamG)"
              strokeWidth={7}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - beam}
            />
          </svg>
        ) : null}

        <At x={sx} y={sy} style={{transform: `translate(-50%,-50%) scale(${ss})`}}>
          <div style={{position: 'relative', width: 1000, height: 1000}}>
            <svg width={1000} height={1000} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
              <circle
                cx={500}
                cy={500}
                r={385}
                fill="none"
                stroke="rgba(140,195,240,0.35)"
                strokeWidth={4}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - ringP}
                transform="rotate(-90 500 500)"
              />
              <g transform={`rotate(${rot} 500 500)`} opacity={ringP}>
                <circle cx={500} cy={500} r={462} fill="none" stroke="rgba(140,195,240,0.6)" strokeWidth={6} strokeDasharray="34 26" />
                {new Array(6).fill(0).map((_, i) => {
                  const a = (i / 6) * Math.PI * 2;
                  const k = ease.outBack(clamp01((t - (27.2 + i * 0.08)) / 0.4));
                  return (
                    <circle
                      key={i}
                      cx={500 + Math.cos(a) * 462}
                      cy={500 + Math.sin(a) * 462}
                      r={26 * k}
                      fill={C.blue}
                      stroke="#FFFFFF"
                      strokeWidth={6}
                    />
                  );
                })}
              </g>
            </svg>
            <div style={{position: 'absolute', left: 220, top: 220}}>
              <Badge size={560} icon="shield" p={clamp01((t - 24.3) / 1.1)} glow={1 + 0.8 * beam * beamFade} />
            </div>
          </div>
        </At>
        <Ripple x={sx} y={sy} t={t} at={CLICK + 0.1} r0={240} r1={560} dur={0.8} width={6} />

        <At
          x={CARD.x}
          y={CARD.y}
          style={{opacity: card, transform: `translate(-50%,-50%) translateX(${(1 - card) * 320}px)`}}
        >
          <Glass w={CARD.w} h={CARD.h} r={60}>
            <div style={{position: 'absolute', left: 70, top: 66}}>
              <Badge size={180} icon="term" p={clamp01((t - 28.3) / 0.9)} iconScale={0.52} />
            </div>
            <div style={{position: 'absolute', left: 290, top: 84, fontFamily: FONT}}>
              <div style={{fontSize: 74, fontWeight: 600, color: C.text, letterSpacing: '-0.02em'}}>Business Term</div>
              <div style={{fontSize: 46, fontWeight: 500, color: C.dim, marginTop: 12}}>3 incoming related assets</div>
            </div>
            <div style={{position: 'absolute', left: 70, top: 330, display: 'flex', gap: 26}}>
              <Chip icon="columns" label="Column" p={(t - 28.55) / 0.5} />
              <Chip icon="dataset" label="Data Set" p={(t - 28.67) / 0.5} />
              <Chip icon="report" label="View" p={(t - 28.79) / 0.5} />
            </div>
            <div style={{position: 'absolute', left: 70, right: 70, top: 520, height: 3, background: 'rgba(125,185,238,0.25)'}} />
          </Glass>
        </At>

        {/* Delete action: click is refused by the guardrail */}
        <At
          x={BTN.x + shake + (1 - card) * 320}
          y={BTN.y}
          style={{opacity: ease.out(clamp01((t - 28.6) / 0.5))}}
        >
          <div
            style={{
              position: 'relative',
              width: 560,
              height: 140,
              borderRadius: 70,
              border: `4px solid ${blocked > 0.5 ? '#8CC3F0' : 'rgba(255,255,255,0.85)'}`,
              background: blocked > 0.01 ? `rgba(0,114,206,${0.35 * blocked})` : 'rgba(255,255,255,0.04)',
              boxShadow: `0 0 ${80 * blocked}px rgba(0,114,206,${0.6 * blocked})`,
              transform: `scale(${1 - 0.05 * press})`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 22,
                opacity: 1 - blocked,
              }}
            >
              <Icon name="trash" size={74} strokePx={6} />
              <div style={{fontFamily: FONT, fontSize: 52, fontWeight: 600, color: C.text}}>Delete Asset</div>
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 22,
                opacity: blocked,
              }}
            >
              <Icon name="lock" size={74} strokePx={6} p={clamp01((t - (CLICK + 0.14)) / 0.5)} />
              <div style={{fontFamily: FONT, fontSize: 52, fontWeight: 600, color: C.text}}>Blocked</div>
            </div>
          </div>
        </At>
        <Ripple x={cx} y={cy} t={t} at={CLICK + 0.04} r0={16} r1={90} dur={0.45} />
        <Cursor x={cx - 12} y={cy - 6} press={press} opacity={cursorOp} size={128} />

        <At
          x={1920}
          y={1880}
          style={{
            opacity: ease.out(clamp01((t - 28.15) / 0.5)),
            transform: `translate(-50%,-50%) translateY(${(1 - ease.out(clamp01((t - 28.15) / 0.6))) * 60}px)`,
          }}
        >
          <Glass w={2300} h={200} r={100} style={{background: 'linear-gradient(90deg, rgba(0,114,206,0.30), rgba(0,114,206,0.12))'}}>
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Words t={t} size={86} weight={500} words={ws('to prevent *accidental* *deletions*', [28.36, 28.6, 28.94, 29.6])} />
            </div>
          </Glass>
        </At>
      </Camera>
      <AbsoluteFill>
        <At x={1920} y={250}>
          <Words t={t} size={112} words={ws("That's why *CDGC* enforces", [24.42, 24.86, 25.02, 25.9])} />
        </At>
        <At x={1920} y={396}>
          <Words t={t} size={112} words={ws('*strict* *dependency* *guardrails*', [26.62, 27.12, 27.72])} />
        </At>
      </AbsoluteFill>
    </Shell>
  );
};
