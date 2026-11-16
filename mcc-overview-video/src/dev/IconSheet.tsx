import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Background } from '../components/Background';
import { Icon } from '../components/Icons';
import { FONT } from '../theme';
import { loadFonts } from '../fonts';

loadFonts();

const NAMES = [
  'database', 'cloud', 'chart', 'table', 'column', 'tag', 'relationship', 'sync', 'meter', 'coin',
  'scan', 'lock', 'pin', 'compass', 'plug', 'warehouse', 'layers', 'shield', 'search', 'user',
  'badge', 'key', 'admin', 'apps', 'warning', 'chat', 'wrench', 'door', 'route', 'history',
  'people', 'book', 'catalog', 'report', 'check', 'cross', 'gear', 'play', 'pulse', 'keyboard',
  'question', 'hourglass', 'upgrade', 'steward', 'bolt', 'clock', 'copy', 'move', 'link',
];

// Dev-only contact sheet of the icon set.
export const IconSheet: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexWrap: 'wrap', gap: 50, padding: 90 }}>
      {NAMES.map((n) => (
        <div key={n} style={{ width: 300, textAlign: 'center', color: '#fff', fontFamily: FONT, fontSize: 34 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}><Icon name={n} size={240} /></div>
          <div style={{ marginTop: 14, opacity: 0.7 }}>{n}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
