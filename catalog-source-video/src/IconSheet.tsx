import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Background } from './components/Background';
import { Icon } from './components/Icon';
import { ICONS } from './components/icons';
import { FONT } from './lib/constants';
import { loadFonts } from './lib/fonts';

loadFonts();

/** Dev-only: every icon, fully drawn, for visual QA. */
export const IconSheet: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, padding: 80 }}>
      {Object.keys(ICONS).map((k) => (
        <div key={k} style={{ width: 420, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Icon name={k as keyof typeof ICONS} size={300} at={-10} />
          <div style={{ fontFamily: FONT, color: '#fff', fontSize: 40, marginTop: 10 }}>{k}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
