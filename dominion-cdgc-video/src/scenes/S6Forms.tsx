import React from 'react';
import { C } from '../theme';
import { O, tc, END_AT } from '../timing';
import { E, prog, spring, useT } from '../lib/anim';
import { At, KText, Panel, PopIcon, Scene } from '../components/Kit';
import { IconName } from '../components/Icons';

type Kind = 'text' | 'select' | 'search' | 'grid';
type FieldDef = { label: string; kind: Kind; req?: boolean };

const SYSTEM_FIELDS: FieldDef[] = [
  { label: 'Name', kind: 'text' },
  { label: 'System Type', kind: 'select' },
  { label: 'System Purpose', kind: 'select' },
  { label: 'Long Name', kind: 'text' },
  { label: 'Catalog Sources', kind: 'search' },
];
const DATASET_FIELDS: FieldDef[] = [
  { label: 'Name', kind: 'text' },
  { label: 'Parent', kind: 'select', req: true },
  { label: 'Description', kind: 'text' },
  { label: 'Reference ID', kind: 'text' },
  { label: 'Data Elements', kind: 'grid' },
];

const FW = 1360;
const FH = 1300;
const ROW0 = 250;
const ROWH = 150;
const BOXW = 1220;

const Glyph: React.FC<{ kind: Kind; x: number; y: number }> = ({ kind, x, y }) => {
  if (kind === 'text') return null;
  return (
    <svg width={1} height={1} style={{ position: 'absolute', left: x, top: y, overflow: 'visible' }}>
      {kind === 'select' && (
        <path d="M-16 -7 L0 9 L16 -7" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      )}
      {kind === 'search' && (
        <>
          <circle cx={-4} cy={-4} r={14} fill="none" stroke="#fff" strokeWidth={8} />
          <path d="M7 7 L18 18" stroke="#fff" strokeWidth={8} strokeLinecap="round" />
        </>
      )}
      {kind === 'grid' && (
        <>
          <rect x={-20} y={-16} width={40} height={32} rx={5} fill="none" stroke="#fff" strokeWidth={6} />
          <path d="M-20 -3 H20 M-20 7 H20 M-6 -16 V16 M7 -16 V16" stroke="#fff" strokeWidth={5} />
        </>
      )}
    </svg>
  );
};

const FieldRow: React.FC<{ f: FieldDef; i: number; at: number }> = ({ f, i, at }) => {
  const t = useT();
  const p = E.outExpo(prog(t, at, 0.7));
  if (p <= 0) return null;
  const y = ROW0 + i * ROWH;
  const fill = E.outCubic(prog(t, at + 0.2, 0.6));
  return (
    <div style={{ position: 'absolute', left: 70 - (1 - p) * 120, top: y, opacity: Math.min(1, p * 1.3) }}>
      <div style={{ fontSize: 40, fontWeight: 650, color: C.text2, whiteSpace: 'nowrap', lineHeight: 1 }}>
        {f.label}
        {f.req && <span style={{ color: '#fff', marginLeft: 10, fontWeight: 800, textShadow: '0 0 20px rgba(0,114,206,0.9)' }}>*</span>}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 54,
          width: BOXW,
          height: 72,
          borderRadius: 18,
          border: '4px solid rgba(255,255,255,0.22)',
          background: 'rgba(255,255,255,0.04)',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 26,
            top: 26,
            height: 12,
            width: (f.kind === 'grid' ? 360 : 220 + ((i * 97) % 260)) * fill,
            borderRadius: 6,
            background: 'rgba(255,255,255,0.18)',
          }}
        />
      </div>
      <Glyph kind={f.kind} x={BOXW - 50} y={90} />
    </div>
  );
};

const Avatar: React.FC<{ x: number; y: number; at: number; dark?: boolean }> = ({ x, y, at, dark }) => {
  const t = useT();
  if (t < at) return null;
  const s = spring(t, at, 2, 0.5);
  return (
    <At x={x} y={y} s={s}>
      <svg width={100} height={100} viewBox="0 0 100 100" style={{ overflow: 'visible', display: 'block' }}>
        <circle cx={50} cy={50} r={46} fill={dark ? C.bg : C.blue} stroke="#fff" strokeWidth={7} />
        <circle cx={50} cy={40} r={13} fill="#fff" />
        <path d="M26 78 A24 22 0 0 1 74 78 Z" fill="#fff" />
      </svg>
    </At>
  );
};

const Stakeholders: React.FC<{ at: number }> = ({ at }) => {
  const t = useT();
  const p = E.outExpo(prog(t, at, 0.8));
  if (p <= 0) return null;
  const sweep = prog(t, tc(204.54), 0.9);
  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        top: 1030 + (1 - p) * 120,
        width: BOXW,
        height: 210,
        borderRadius: 32,
        border: `5px solid ${C.blue}`,
        background: 'rgba(0,114,206,0.16)',
        boxShadow: '0 0 90px rgba(0,114,206,0.35)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        opacity: Math.min(1, p * 1.3),
      }}
    >
      {sweep > 0 && sweep < 1 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: -400 + sweep * (BOXW + 800),
            width: 400,
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0) 100%)',
          }}
        />
      )}
      <At x={110} y={103}>
        <PopIcon name="people" size={150} at={at + 0.1} />
      </At>
      <At x={215} y={103} anchor="left">
        <div style={{ fontSize: 62, fontWeight: 800, whiteSpace: 'nowrap' }}>Stakeholders</div>
      </At>
      {[0, 1, 2, 3].map((k) => (
        <Avatar key={k} x={830 + k * 92} y={103} at={at + 0.35 + k * 0.08} dark={k % 2 === 1} />
      ))}
    </div>
  );
};

const FormCard: React.FC<{
  x: number;
  title: string;
  icon: IconName;
  fields: FieldDef[];
  at: number;
}> = ({ x, title, icon, fields, at }) => {
  const t = useT();
  const s = spring(t, at, 1.2, 0.68);
  if (t < at) return null;
  const same = E.outCubic(prog(t, tc(204.54), 0.5));
  return (
    <At x={x} y={120 + (1 - s) * 260} o={Math.min(1, s * 1.4)}>
      <Panel w={FW} h={FH} active={0.25 + 0.5 * same} style={{ background: 'rgba(34,31,32,0.93)' }}>
        <At x={115} y={112}>
          <PopIcon name={icon} size={150} at={at + 0.1} />
        </At>
        <At x={215} y={112} anchor="left">
          <div style={{ fontSize: 72, fontWeight: 800, whiteSpace: 'nowrap' }}>{title}</div>
        </At>
        <div style={{ position: 'absolute', left: 70, right: 70, top: 212, height: 4, background: 'rgba(255,255,255,0.14)' }} />
        {fields.map((f, i) => (
          <FieldRow key={f.label} f={f} i={i} at={tc(200.36) + i * 0.3 + (x > 0 ? 0.12 : 0)} />
        ))}
        <Stakeholders at={tc(202.92) + (x > 0 ? 0.04 : 0)} />
      </Panel>
    </At>
  );
};

const Equals: React.FC = () => {
  const t = useT();
  const at = tc(204.5);
  if (t < at) return null;
  const s = spring(t, at, 1.9, 0.5);
  return (
    <At x={0} y={120 - FH / 2 + 1135} s={s}>
      <div
        style={{
          width: 170,
          height: 170,
          borderRadius: '50%',
          background: C.blue,
          border: '10px solid #fff',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          boxShadow: '0 0 80px rgba(0,114,206,0.8)',
        }}
      >
        <div style={{ width: 70, height: 12, borderRadius: 6, background: '#fff' }} />
        <div style={{ width: 70, height: 12, borderRadius: 6, background: '#fff' }} />
      </div>
    </At>
  );
};

export const S6Forms: React.FC = () => (
  <Scene x={O.s6[0]} y={O.s6[1]} from={tc(198.3)} to={END_AT + 1.9}>
    <KText
      x={0}
      y={-880}
      anchor="center"
      size={112}
      words={[
        { w: 'Each', at: tc(200.1) },
        { w: 'form', at: tc(200.36) },
        { w: 'has', at: tc(200.7) },
        { w: 'its', at: tc(200.96) },
        { w: 'own', at: tc(201.14) },
        { w: 'handful', at: tc(201.4) },
        { w: 'of', at: tc(201.8) },
        { w: 'fields', at: tc(201.98), hl: 'box' },
      ]}
      out={tc(202.55)}
    />
    <KText
      x={0}
      y={-880}
      anchor="center"
      size={112}
      words={[
        { w: 'Stakeholders:', at: tc(202.92), hl: 'box' },
        { w: 'the', at: tc(204.36) },
        { w: 'same,', at: tc(204.54) },
        { w: 'every', at: tc(205.16) },
        { w: 'time', at: tc(205.58) },
      ]}
    />
    <FormCard x={-760} title="New System" icon="server" fields={SYSTEM_FIELDS} at={tc(199.36)} />
    <FormCard x={760} title="New Data Set" icon="table" fields={DATASET_FIELDS} at={tc(199.52)} />
    <Equals />
  </Scene>
);
