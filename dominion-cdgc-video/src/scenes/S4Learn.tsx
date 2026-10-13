import React from 'react';
import { C } from '../theme';
import { O, ti } from '../timing';
import { E, prog, useT } from '../lib/anim';
import { At, KText, Panel, Pill, PopIcon, Scene, Word, ws } from '../components/Kit';
import { IconName } from '../components/Icons';

type CardDef = {
  x: number;
  num: string;
  key: string;
  keyAt: number;
  icon: IconName;
  iconAt: number;
  body1: Word[];
  body2: Word[];
  on: number;
  off: number;
};

const CW = 1100;
const CH = 1380;

const CARDS: CardDef[] = [
  {
    x: -1220,
    num: '01',
    key: 'WHY',
    keyAt: ti(25.46),
    icon: 'hierarchy',
    iconAt: ti(25.7),
    body1: ws('Structure is the backbone', [ti(25.7), ti(27.72), ti(28.22), ti(28.48)], { 3: 'box' }),
    body2: ws('of catalog organization', [ti(28.92), ti(29.2), ti(29.6)]),
    on: ti(25.46),
    off: ti(30.6),
  },
  {
    x: 0,
    num: '02',
    key: 'HOW',
    keyAt: ti(30.72),
    icon: 'link',
    iconAt: ti(31.0),
    body1: ws('Systems & Data Sets', [ti(31.02), ti(31.06), ti(31.1), ti(31.14)]),
    body2: ws('relate to one another', [ti(31.18), ti(31.46), ti(31.64), ti(31.76)], { 0: 'box' }),
    on: ti(30.72),
    off: ti(32.3),
  },
  {
    x: 1220,
    num: '03',
    key: 'WHICH',
    keyAt: ti(32.58),
    icon: 'form',
    iconAt: ti(32.86),
    body1: ws('Key fields that deserve', [ti(32.86), ti(33.18), ti(33.6), ti(33.6)], { 1: 'box' }),
    body2: ws('your attention', [ti(33.98), ti(34.2)]),
    on: ti(32.42),
    off: ti(99),
  },
];

const Card: React.FC<{ c: CardDef; i: number }> = ({ c, i }) => {
  const t = useT();
  const appear = E.outCubic(prog(t, ti(24.86) + i * 0.12, 0.8));
  if (appear <= 0) return null;
  const lit = E.outCubic(prog(t, c.on, 0.5));
  const finale = E.inOutCubic(prog(t, ti(34.75), 0.6));
  const active = Math.max(Math.min(lit, 1 - E.inOutCubic(prog(t, c.off, 0.5))), 0.6 * finale);
  const bar = E.outExpo(prog(t, c.on, 0.8));
  return (
    <At x={c.x} y={120 + (1 - appear) * 160} o={appear * (0.4 + 0.6 * lit)}>
      <Panel w={CW} h={CH} active={active}>
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 0,
            width: 280,
            height: 14,
            borderRadius: '0 0 10px 10px',
            background: C.blue,
            transform: `scaleX(${bar})`,
            transformOrigin: '0 50%',
            boxShadow: '0 0 40px rgba(0,114,206,0.8)',
          }}
        />
        <At x={90} y={120} anchor="left">
          <div style={{ fontSize: 64, fontWeight: 800, color: C.blue, letterSpacing: '0.04em' }}>{c.num}</div>
        </At>
        <KText x={84} y={265} size={170} words={[{ w: c.key, at: c.keyAt }]} tracking={0.01} />
        <At x={CW / 2} y={650}>
          <PopIcon name={c.icon} size={400} at={c.iconAt} glow />
        </At>
        <KText x={90} y={1075} size={62} weight={700} words={c.body1} shadow={false} />
        <KText x={90} y={1170} size={62} weight={700} words={c.body2} shadow={false} color={C.text2} />
      </Panel>
    </At>
  );
};

export const S4Learn: React.FC = () => {
  return (
    <Scene x={O.s4[0]} y={O.s4[1]} from={ti(23.8)} to={42.2}>
      <Pill x={0} y={-860} text="WHAT YOU'LL SEE" at={ti(24.86)} size={52} />
      {CARDS.map((c, i) => (
        <Card key={c.num} c={c} i={i} />
      ))}
    </Scene>
  );
};
