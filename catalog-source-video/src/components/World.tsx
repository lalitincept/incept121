import React from 'react';
import { H, W, useT } from '../lib/constants';
import { ease, keyframes } from '../lib/anim';

export type WorldKey = { t: number; x: number; y: number; s: number; r?: number };

/** A large canvas viewed through an eased camera: (x, y) is the world point at screen centre. */
export const World: React.FC<{ cam: WorldKey[]; children: React.ReactNode; opacity?: number }> = ({ cam, children, opacity = 1 }) => {
  const t = useT();
  const k = keyframes(t, cam as any, ease.inOut) as unknown as { x: number; y: number; s: number; r?: number };
  const r = k.r ?? 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: W,
        height: H,
        transformOrigin: '0 0',
        transform: `translate(${W / 2}px, ${H / 2}px) rotate(${r}deg) scale(${k.s}) translate(${-k.x}px, ${-k.y}px)`,
        opacity,
      }}
    >
      {children}
    </div>
  );
};
