import React from 'react';
import {
  LOGO_H,
  LOGO_OFFSET,
  LOGO_W,
  MARK_STRIPES,
  WORD_DOMINION,
  WORD_ENERGY,
} from '../logoPaths';
import { clamp01 } from '../anim';

type Props = {
  width: number;
  markColor?: string;
  wordColor?: string;
  /** 0..1 progress for each of the four stripes (slides in diagonally) */
  stripes?: number[];
  /** 0..1 reveal of the wordmark (left-to-right wipe) */
  word?: number;
  showWord?: boolean;
  markOnly?: boolean;
};

export const MARK_W = 290; // approx width of the D mark inside the logo box

export const Logo: React.FC<Props> = ({
  width,
  markColor = '#2F74C8',
  wordColor = '#FFFFFF',
  stripes = [1, 1, 1, 1],
  word = 1,
  showWord = true,
  markOnly = false,
}) => {
  const vbW = markOnly ? MARK_W : LOGO_W;
  const h = (width / vbW) * LOGO_H;
  const id = React.useId().replace(/:/g, '');
  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${vbW} ${LOGO_H}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={`mk${id}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={markColor} stopOpacity={1} />
          <stop offset="1" stopColor={markColor} stopOpacity={1} />
        </linearGradient>
        <clipPath id={`wc${id}`}>
          <rect x={300} y={-20} width={clamp01(word) * 700} height={400} />
        </clipPath>
      </defs>
      <g transform={`translate(${LOGO_OFFSET.x} ${LOGO_OFFSET.y})`}>
        {MARK_STRIPES.map((d, i) => {
          const p = clamp01(stripes[i] ?? 1);
          // slide along the stripe direction (up-right, ~ -18deg)
          const dx = (1 - p) * -160;
          const dy = (1 - p) * 52;
          return (
            <path
              key={i}
              d={d}
              fill={`url(#mk${id})`}
              opacity={p}
              transform={`translate(${dx} ${dy})`}
            />
          );
        })}
        {showWord && !markOnly && (
          <g clipPath={`url(#wc${id})`} fill={wordColor}>
            <path d={WORD_DOMINION} fillRule="evenodd" />
            <path d={WORD_ENERGY} fillRule="evenodd" />
          </g>
        )}
      </g>
    </svg>
  );
};
