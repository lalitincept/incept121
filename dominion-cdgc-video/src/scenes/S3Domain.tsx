import React from 'react';
import { C } from '../theme';
import { O, ti } from '../timing';
import { E, lerp, line, prog, spring, useT } from '../lib/anim';
import { At, FlowPath, KText, Panel, Pill, PopIcon, Scene, ws } from '../components/Kit';
import { IconName } from '../components/Icons';

const SubCard: React.FC<{ x: number; y: number; at: number; icon: IconName; label: string }> = ({ x, y, at, icon, label }) => {
  const t = useT();
  if (t < at) return null;
  const s = spring(t, at, 1.5, 0.55);
  const lit = E.outCubic(prog(t, at + 0.1, 0.6));
  return (
    <At x={x} y={y} s={0.7 + 0.3 * s} o={Math.min(1, s * 1.4)}>
      <Panel w={590} h={660} radius={48} active={0.55 * lit} style={{ background: 'rgba(34,31,32,0.92)' }}>
        <At x={295} y={270}>
          <PopIcon name={icon} size={300} at={at + 0.05} glow />
        </At>
        <At x={295} y={545}>
          <div style={{ fontSize: 76, fontWeight: 800, whiteSpace: 'nowrap', opacity: lit }}>{label}</div>
        </At>
      </Panel>
    </At>
  );
};

export const S3Domain: React.FC = () => {
  const t = useT();

  // Business Glossary panel: lit first, then we "step outside" of it.
  const gIn = spring(t, ti(16.95), 1.3, 0.62);
  const gOut = E.inOutCubic(prog(t, ti(18.22), 0.9));
  const gActive = E.outCubic(prog(t, ti(17.2), 0.5)) * (1 - gOut);

  // Business Data panel: dim placeholder, then lights up as we move into it.
  const dIn = E.outCubic(prog(t, ti(17.4), 0.7));
  const dLit = E.inOutCubic(prog(t, ti(19.98), 0.7));
  const layersOut = ti(22.62);

  return (
    <Scene x={O.s3[0]} y={O.s3[1]} from={ti(15.6)} to={ti(26.4)}>
      <Pill x={0} y={-880} text="IN THIS MODULE" at={ti(16.7)} out={ti(19.6)} size={52} />

      {/* Business Glossary */}
      {t >= ti(16.95) && (
        <At x={-900} y={120} s={(0.9 + 0.1 * gIn) * (1 - 0.06 * gOut)} o={Math.min(1, gIn * 1.4) * (1 - 0.62 * gOut)}>
          <Panel w={1400} h={1250} active={gActive}>
            <At x={700} y={120}>
              <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: '0.3em', color: C.text3 }}>CDGC</div>
            </At>
            <At x={700} y={215}>
              <div style={{ fontSize: 96, fontWeight: 800, whiteSpace: 'nowrap' }}>Business Glossary</div>
            </At>
            <At x={700} y={680}>
              <PopIcon name="glossary" size={420} at={ti(17.1)} glow />
            </At>
          </Panel>
        </At>
      )}

      {/* Step outside → */}
      <FlowPath id="s3-step" c={line([-150, 120], [170, 120])} at={ti(18.45)} dur={0.55} width={14} dashed={false} arrow pulses={1} pulseSpeed={0.9} color="rgba(255,255,255,0.85)" />

      {/* Business Data domain */}
      {t >= ti(17.4) && (
        <At x={900} y={120} s={lerp(0.94, 1, dIn) * (1 + 0.02 * dLit)} o={lerp(0, 0.42, dIn) + 0.58 * dLit}>
          <Panel w={1400} h={1250} active={dLit} dashed={dLit < 0.5}>
            <At x={700} y={120} o={E.outCubic(prog(t, ti(20.34), 0.5))}>
              <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: '0.3em', color: C.text2, whiteSpace: 'nowrap', marginRight: '-0.3em' }}>
                CDGC · DOMAIN
              </div>
            </At>
            <At x={700} y={680} s={1 - 0.6 * E.inCubic(prog(t, layersOut, 0.45))} o={1 - E.inCubic(prog(t, layersOut, 0.45))}>
              <PopIcon name="layers" size={420} at={ti(17.7)} glow />
            </At>
          </Panel>
        </At>
      )}
      <KText x={900} y={-290} anchor="center" size={96} words={ws('Business Data', [ti(21.2), ti(21.54)])} />
      <SubCard x={560} y={310} at={ti(23.02)} icon="server" label="System" />
      <SubCard x={1240} y={310} at={ti(23.9)} icon="table" label="Data Set" />
    </Scene>
  );
};
