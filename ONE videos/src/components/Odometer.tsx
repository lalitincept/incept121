import {ease, tween} from '../motion/easing';
import {useTime} from '../motion/time';

const STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

// A number that rolls into place digit by digit, like a mechanical counter.
// Digits settle left to right; the lower a digit, the more it spins.
export const Odometer: React.FC<{
  value: number;
  decimals?: number;
  start?: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({value, decimals = 0, start = 0, duration = 54, style}) => {
  const frame = useTime();
  const text = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  let k = 0;

  return (
    <div style={{display: 'flex', alignItems: 'flex-end', lineHeight: 1, fontVariantNumeric: 'tabular-nums', ...style}}>
      {[...text].map((ch, i) => {
        if (!/\d/.test(ch)) {
          const p = tween(frame, start + duration * 0.45, 14);
          return (
            <span key={i} style={{opacity: p, height: '1em'}}>
              {ch}
            </span>
          );
        }
        const at = start + k * 3;
        const target = Number(ch) + 10 * (1 + k);
        k++;
        const pos = target * tween(frame, at, duration, ease.out);
        const prev = target * tween(frame - 1, at, duration, ease.out);
        const speed = Math.abs(pos - prev);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              height: '1em',
              overflow: 'hidden',
              maskImage: 'linear-gradient(transparent, black 12%, black 88%, transparent)',
            }}
          >
            <span
              style={{
                display: 'block',
                transform: `translateY(${-(pos % 10)}em)`,
                filter: speed > 0.04 ? `blur(${Math.min(speed * 0.03, 0.05)}em)` : undefined,
              }}
            >
              {STRIP.map((d, j) => (
                <span key={j} style={{display: 'block', height: '1em'}}>
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </div>
  );
};
