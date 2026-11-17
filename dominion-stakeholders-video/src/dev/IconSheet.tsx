import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Background} from '../components/Background';
import {ICONS, Icon} from '../components/Icons';
import {IconRing} from '../components/UI';
import {FONT, fontFace} from '../lib/theme';

export const IconSheet: React.FC = () => {
  const names = Object.keys(ICONS);
  return (
    <AbsoluteFill>
      <style>{fontFace}</style>
      <Background />
      <div style={{position: 'absolute', inset: 40, display: 'flex', flexWrap: 'wrap', gap: 26}}>
        {names.map((n) => (
          <div key={n} style={{width: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', fontFamily: FONT, fontSize: 18}}>
            <Icon name={n} size={110} />
            <div style={{marginTop: 8}}>{n}</div>
          </div>
        ))}
        <IconRing name="users" start={-60} size={200} />
        <IconRing name="shieldCheck" start={-60} size={200} />
      </div>
    </AbsoluteFill>
  );
};
