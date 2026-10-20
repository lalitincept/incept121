import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Shell} from '../components/Shell';
import {At, Words, ws} from '../components/Kinetic';
import {Badge, Camera, Glass, Particles, Pill} from '../components/UI';
import {Icon, IconName} from '../components/Icons';
import {CamKey, camAt, clamp01, ease, lerp} from '../lib/anim';
import {C, FONT} from '../theme';

// c = seconds from the start of the conclusion VO clip.
// "So 'deleting correctly' really means checking first: the connections in the Relationships tab,
//  clear what's attached, and only then delete, or choose Obsolete Lifecycle if retiring the asset is enough."

const STEP_Y = 1250;
const STEPS: {x: number; icon: IconName; at: number; done: number; l1: ReturnType<typeof ws>; l2?: ReturnType<typeof ws>}[] = [
  {
    x: 920,
    icon: 'relations',
    at: 4.05,
    done: 6.3,
    l1: ws('Check the connections', [4.07, 4.07, 4.17]),
    l2: ws('in the *Relationships* *tab*', [4.55, 4.89, 5.01, 5.51]),
  },
  {x: 1920, icon: 'unlink', at: 6.25, done: 7.75, l1: ws("Clear what's *attached*", [6.35, 6.67, 7.0])},
  {x: 2920, icon: 'trash', at: 7.7, done: 9.15, l1: ws('Only then, *delete*', [7.93, 8.35, 8.75])},
];

const CAM: CamKey[] = [
  {t: -0.6, x: 1920, y: 1080, s: 1.0},
  {t: 3.7, x: 1920, y: 1080, s: 1.035, e: ease.outSoft},
  {t: 4.5, x: 1920, y: 1100, s: 1.0, e: ease.inOut},
  {t: 9.2, x: 1940, y: 1100, s: 1.03, e: ease.outSoft},
  {t: 10.15, x: 1920, y: 1530, s: 0.94, e: ease.inOut},
  {t: 14.3, x: 1920, y: 1540, s: 0.985, e: ease.outSoft},
];

const StepDone: React.FC<{p: number}> = ({p}) => {
  const e = ease.outBack(clamp01(p));
  return (
    <div style={{transform: `scale(${e})`, opacity: clamp01(p * 2)}}>
      <Icon name="check" size={104} p={clamp01(p * 1.4)} strokePx={7} />
    </div>
  );
};

export const SceneConclusion: React.FC<{c: number; g: number}> = ({c, g}) => {
  const cam = camAt(c, CAM);
  // Phase 1 headline lifts into a header once the steps begin.
  const lift = ease.inOut(clamp01((c - 3.65) / 0.8));
  const alt = ease.out(clamp01((c - 9.4) / 0.8));
  const stepsDim = lerp(1, 0.55, ease.inOut(clamp01((c - 9.6) / 0.8)));

  return (
    <Shell t={c} a={-0.6} b={14.3} enter="zoomThrough" exit="fade" enterDur={0.75} exitDur={0.7}>
      <Particles g={g} cam={cam} seed={17} />
      <Camera cam={cam} id="f">
        {/* Phase 1: the takeaway, then it becomes the header */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 3840,
            height: 2160,
            transformOrigin: '1920px 1060px',
            transform: `translateY(${lerp(0, -667, lift)}px) scale(${lerp(1, 0.66, lift)})`,
            opacity: 1 - alt,
          }}
        >
          <At x={1920} y={790} style={{opacity: 1 - lift}}>
            <Words
              t={c}
              size={58}
              weight={600}
              color={C.eyebrow}
              letterSpacing="0.22em"
              words={ws('KEY TAKEAWAY', [-0.3, -0.22])}
            />
          </At>
          <At x={1920} y={1045}>
            <Pill text="Deleting correctly" t={c} at={0.42} size={150} dur={0.8} shineAt={1.5} />
          </At>
          <At x={1920} y={1295}>
            <Words t={c} size={128} words={ws('really means *checking* *first*', [1.67, 2.17, 2.63, 3.07])} />
          </At>
        </div>

        {/* Phase 2: the three-step routine */}
        <svg width={3840} height={2160} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: stepsDim}}>
          {[0, 1].map((i) => {
            const a = STEPS[i];
            const b = STEPS[i + 1];
            const p = ease.inOut(clamp01((c - (b.at - 0.35)) / 0.5));
            if (p <= 0) return null;
            const x1 = a.x + 205;
            const x2 = b.x - 205;
            const xe = lerp(x1, x2, p);
            return (
              <g key={i}>
                <line x1={x1} y1={STEP_Y} x2={xe} y2={STEP_Y} stroke={C.line} strokeWidth={6} strokeLinecap="round" />
                {p >= 1 ? (
                  <path
                    d={`M ${x2 - 30} ${STEP_Y - 30} L ${x2} ${STEP_Y} L ${x2 - 30} ${STEP_Y + 30}`}
                    fill="none"
                    stroke={C.ring}
                    strokeWidth={6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <circle cx={xe} cy={STEP_Y} r={14} fill="#CFE6FA" />
                )}
              </g>
            );
          })}
        </svg>
        {STEPS.map((s, i) => {
          const p = clamp01((c - s.at) / 1.0);
          return (
            <React.Fragment key={i}>
              <At x={s.x} y={STEP_Y} style={{opacity: stepsDim}}>
                <div style={{position: 'relative'}}>
                  <Badge size={380} icon={s.icon} p={p} />
                  <div
                    style={{
                      position: 'absolute',
                      left: -18,
                      top: -18,
                      width: 96,
                      height: 96,
                      borderRadius: '50%',
                      background: C.bg,
                      border: `4px solid ${C.ring}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: FONT,
                      fontSize: 50,
                      fontWeight: 700,
                      color: C.text,
                      opacity: clamp01(p * 3),
                      transform: `scale(${ease.outBack(clamp01(p * 2))})`,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{position: 'absolute', right: -24, bottom: -14}}>
                    <StepDone p={(c - s.done) / 0.45} />
                  </div>
                </div>
              </At>
              <At x={s.x} y={STEP_Y + 300} style={{opacity: stepsDim}}>
                <Words t={c} size={70} weight={600} words={s.l1} />
              </At>
              {s.l2 ? (
                <At x={s.x} y={STEP_Y + 392} style={{opacity: stepsDim}}>
                  <Words t={c} size={70} weight={600} words={s.l2} />
                </At>
              ) : null}
            </React.Fragment>
          );
        })}

        {/* Phase 3: the alternative path */}
        <At x={1920} y={1880} style={{opacity: alt}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 50}}>
            <div style={{width: 900 * alt, height: 4, background: 'linear-gradient(90deg, rgba(125,185,238,0), rgba(125,185,238,0.6))'}} />
            <div
              style={{
                padding: '14px 54px 18px',
                borderRadius: 999,
                border: `4px solid ${C.ring}`,
                fontFamily: FONT,
                fontSize: 64,
                fontWeight: 600,
                color: C.text,
                letterSpacing: '0.06em',
              }}
            >
              OR
            </div>
            <div style={{width: 900 * alt, height: 4, background: 'linear-gradient(90deg, rgba(125,185,238,0.6), rgba(125,185,238,0))'}} />
          </div>
        </At>
        <At
          x={1920}
          y={2270}
          style={{
            opacity: ease.out(clamp01((c - 9.6) / 0.7)),
            transform: `translate(-50%,-50%) translateY(${(1 - ease.out(clamp01((c - 9.6) / 0.8))) * 120}px)`,
          }}
        >
          <Glass w={2500} h={460} r={80} glow={0.35 + 0.35 * ease.out(clamp01((c - 10.6) / 0.6))}>
            <div style={{position: 'absolute', left: 90, top: 65}}>
              <Badge size={330} icon="archive" p={clamp01((c - 9.75) / 1.0)} />
            </div>
            <div style={{position: 'absolute', left: 500, top: 92}}>
              <Words t={c} size={104} weight={600} align="flex-start" words={ws('Choose *Obsolete* *Lifecycle*', [9.67, 10.03, 10.61])} />
            </div>
            <div style={{position: 'absolute', left: 500, top: 250}}>
              <Words
                t={c}
                size={70}
                weight={500}
                color={C.dim}
                align="flex-start"
                words={ws('if retiring the asset is enough', [11.23, 11.61, 12.13, 12.43, 12.79, 13.03])}
              />
            </div>
          </Glass>
        </At>
      </Camera>
    </Shell>
  );
};
