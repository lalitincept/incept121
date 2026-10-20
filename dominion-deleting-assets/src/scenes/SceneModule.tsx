import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Shell} from '../components/Shell';
import {At, Word, Words, ws} from '../components/Kinetic';
import {Badge, Camera, Glass, Particles} from '../components/UI';
import {IconName} from '../components/Icons';
import {CamKey, camAt, camSpeed, clamp01, ease, lerp} from '../lib/anim';
import {C, FONT} from '../theme';

// "In this module, we'll explore how this built-in safety net protects our catalog, how to trace
//  and untangle active relationships before removal, and when moving an asset to an Obsolete
//  lifecycle is the safer and smarter choice."

type Card = {x: number; icon: IconName; n: string; at: number; l1: Word[]; l2: Word[]; sub: Word[]; focus: [number, number]};

const CARDS: Card[] = [
  {
    x: 760,
    icon: 'shield',
    n: '01',
    at: 32.3,
    l1: ws('The built-in', [32.98, 33.2]),
    l2: ws('*safety* *net*', [33.74, 34.08]),
    sub: ws('How it protects our catalog', [34.26, 34.32, 34.38, 34.86, 35.12]),
    focus: [32.4, 35.9],
  },
  {
    x: 1920,
    icon: 'trace',
    n: '02',
    at: 35.8,
    l1: ws('Trace & untangle', [36.36, 36.66, 36.88]),
    l2: ws('*active* *relationships*', [37.34, 37.8]),
    sub: ws('Before removal', [38.44, 38.88]),
    focus: [35.9, 39.7],
  },
  {
    x: 3080,
    icon: 'archive',
    n: '03',
    at: 39.65,
    l1: ws('Move to an', [40.16, 41.02, 41.3]),
    l2: ws('*Obsolete* *lifecycle*', [41.46, 42.04]),
    sub: ws('The safer, smarter choice', [43.02, 43.22, 43.88, 44.24]),
    focus: [39.7, 43.1],
  },
];
const CARD_W = 1020;
const CARD_H = 1120;
const CARD_Y = 1250;

const CAM: CamKey[] = [
  {t: 30.8, x: 1920, y: 1170, s: 0.97},
  {t: 32.3, x: 1920, y: 1165, s: 0.99, e: ease.outSoft},
  {t: 33.35, x: 900, y: 1185, s: 1.08, e: ease.inOut},
  {t: 35.85, x: 930, y: 1185, s: 1.1, e: ease.outSoft},
  {t: 36.85, x: 1920, y: 1185, s: 1.08, e: ease.inOut},
  {t: 39.65, x: 1950, y: 1185, s: 1.1, e: ease.outSoft},
  {t: 40.65, x: 2950, y: 1185, s: 1.08, e: ease.inOut},
  {t: 43.0, x: 2980, y: 1185, s: 1.1, e: ease.outSoft},
  {t: 44.2, x: 1920, y: 1160, s: 0.96, e: ease.inOut},
  {t: 45.6, x: 1920, y: 1160, s: 0.985, e: ease.outSoft},
];

export const SceneModule: React.FC<{t: number; g: number}> = ({t, g}) => {
  const cam = camAt(t, CAM);
  const {vx} = camSpeed(t, CAM);
  const blurX = Math.min(18, Math.abs(vx) / 170);
  const overview = ease.inOut(clamp01((t - 43.05) / 1.0));

  return (
    <Shell t={t} a={30.8} b={45.6} enter="up" exit="zoomThrough" enterDur={0.65} exitDur={0.65}>
      <Particles g={g} cam={cam} seed={13} />
      <Camera cam={cam} id="e" blurX={blurX}>
        {CARDS.map((c, i) => {
          const p = ease.out(clamp01((t - c.at) / 0.8));
          const inFocus = ease.inOut(clamp01((t - (c.focus[0] - 0.2)) / 0.6)) * (1 - ease.inOut(clamp01((t - (c.focus[1] - 0.1)) / 0.6)));
          const emphasis = Math.max(inFocus, overview);
          const op = p * lerp(0.36, 1, emphasis);
          const finalGlow = i === 2 ? ease.out(clamp01((t - 43.2) / 0.6)) * 0.4 : 0;
          return (
            <At
              key={i}
              x={c.x}
              y={CARD_Y}
              style={{
                opacity: op,
                transform: `translate(-50%,-50%) translateY(${(1 - p) * 140}px) scale(${lerp(0.94, 1, p)})`,
              }}
            >
              <Glass w={CARD_W} h={CARD_H} r={64} glow={inFocus * 0.5 + finalGlow}>
                <div
                  style={{
                    position: 'absolute',
                    left: 72,
                    top: 62,
                    fontFamily: FONT,
                    fontSize: 58,
                    fontWeight: 600,
                    color: C.eyebrow,
                    letterSpacing: '0.04em',
                  }}
                >
                  {c.n}
                </div>
                <div style={{position: 'absolute', left: (CARD_W - 330) / 2, top: 140}}>
                  <Badge size={330} icon={c.icon} p={clamp01((t - (c.at + 0.15)) / 1.0)} />
                </div>
                <At x={CARD_W / 2} y={610}>
                  <Words t={t} size={84} weight={600} words={c.l1} />
                </At>
                <At x={CARD_W / 2} y={712}>
                  <Words t={t} size={84} weight={600} words={c.l2} />
                </At>
                <div
                  style={{
                    position: 'absolute',
                    left: 120,
                    right: 120,
                    top: 820,
                    height: 3,
                    background: 'rgba(125,185,238,0.25)',
                    transformOrigin: 'center',
                    transform: `scaleX(${ease.out(clamp01((t - (c.at + 0.4)) / 0.8))})`,
                  }}
                />
                <At x={CARD_W / 2} y={922}>
                  <Words t={t} size={56} weight={500} color={C.dim} words={c.sub} />
                </At>
              </Glass>
            </At>
          );
        })}
      </Camera>
      <AbsoluteFill>
        <At x={1920} y={300}>
          <Words t={t} size={124} words={ws("In this module, we'll *explore*", [31.18, 31.3, 31.5, 32.22, 32.38])} />
        </At>
      </AbsoluteFill>
    </Shell>
  );
};
