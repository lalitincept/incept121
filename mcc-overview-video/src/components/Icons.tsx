import React from 'react';

// Lineal-colour icon set (Flaticon "detailed mixed / lineal color" look):
// white outline strokes (10px at rendered size) + #0072CE filled shapes.
// All icons are drawn on a 512 x 512 grid.

export const ICON_BLUE = '#0072CE';
const B = ICON_BLUE;
const B2 = '#2E8FE6'; // lighter tint of the brand blue for secondary planes
const W = '#FFFFFF';

type P = { sw: number };

const gearPath = (
  cx: number,
  cy: number,
  rOut: number,
  rIn: number,
  teeth: number,
): string => {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a0 = i * step;
    const a1 = a0 + step * 0.18;
    const a2 = a0 + step * 0.32;
    const a3 = a0 + step * 0.68;
    const a4 = a0 + step * 0.82;
    const p = (r: number, a: number) =>
      `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
    pts.push(
      `${i === 0 ? 'M' : 'L'}${p(rIn, a0)}`,
      `L${p(rIn, a1)}`,
      `L${p(rOut, a2)}`,
      `L${p(rOut, a3)}`,
      `L${p(rIn, a4)}`,
    );
  }
  return pts.join(' ') + ' Z';
};

const S = (sw: number) => ({
  stroke: W,
  strokeWidth: sw,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
});

const ICONS: Record<string, (p: P) => React.ReactNode> = {
  database: ({ sw }) => (
    <g>
      <path d="M116 120 V392 A140 44 0 0 0 396 392 V120 Z" fill={B} />
      <ellipse cx={256} cy={120} rx={140} ry={44} fill={B2} />
      <ellipse cx={256} cy={120} rx={140} ry={44} {...S(sw)} />
      <path d="M116 120 V392 A140 44 0 0 0 396 392 V120" {...S(sw)} />
      <path d="M116 210 A140 44 0 0 0 396 210" {...S(sw)} />
      <path d="M116 300 A140 44 0 0 0 396 300" {...S(sw)} />
      <circle cx={170} cy={272} r={10} fill={W} />
      <circle cx={170} cy={362} r={10} fill={W} />
      <path d="M210 272 H260 M210 362 H260" {...S(sw)} />
    </g>
  ),
  cloud: ({ sw }) => (
    <g>
      <path
        d="M146 372 H372 C424 372 462 334 462 284 C462 238 428 202 384 197 C374 141 326 100 270 100 C222 100 182 129 166 172 C118 176 82 216 82 266 C82 324 112 372 146 372 Z"
        fill={B}
      />
      <path
        d="M146 372 H372 C424 372 462 334 462 284 C462 238 428 202 384 197 C374 141 326 100 270 100 C222 100 182 129 166 172 C118 176 82 216 82 266 C82 324 112 372 146 372 Z"
        {...S(sw)}
      />
      <path d="M256 330 V210 M212 254 L256 210 L300 254" {...S(sw)} />
      <path d="M150 430 H362" {...S(sw)} />
      <circle cx={186} cy={430} r={9} fill={W} />
    </g>
  ),
  chart: ({ sw }) => (
    <g>
      <rect x={70} y={96} width={372} height={284} rx={28} fill="rgba(0,114,206,0.18)" />
      <rect x={130} y={262} width={56} height={84} rx={8} fill={B} />
      <rect x={228} y={206} width={56} height={140} rx={8} fill={B} />
      <rect x={326} y={150} width={56} height={196} rx={8} fill={B2} />
      <rect x={70} y={96} width={372} height={284} rx={28} {...S(sw)} />
      <path d="M150 220 L250 160 L350 112" {...S(sw)} />
      <circle cx={150} cy={220} r={14} fill={W} />
      <circle cx={250} cy={160} r={14} fill={W} />
      <circle cx={350} cy={112} r={14} fill={W} />
      <path d="M256 380 V432 M176 432 H336" {...S(sw)} />
    </g>
  ),
  table: ({ sw }) => (
    <g>
      <rect x={76} y={110} width={360} height={292} rx={26} fill="rgba(0,114,206,0.16)" />
      <path d="M76 136 A26 26 0 0 1 102 110 H410 A26 26 0 0 1 436 136 V184 H76 Z" fill={B} />
      <rect x={76} y={110} width={360} height={292} rx={26} {...S(sw)} />
      <path d="M76 184 H436 M76 256 H436 M76 328 H436 M196 184 V402 M316 184 V402" {...S(sw)} />
      <circle cx={124} cy={147} r={9} fill={W} />
      <circle cx={156} cy={147} r={9} fill={W} />
    </g>
  ),
  column: ({ sw }) => (
    <g>
      <rect x={76} y={110} width={360} height={292} rx={26} fill="rgba(0,114,206,0.14)" />
      <rect x={196} y={110} width={120} height={292} fill={B} />
      <rect x={76} y={110} width={360} height={292} rx={26} {...S(sw)} />
      <path d="M76 184 H436 M76 256 H436 M76 328 H436 M196 110 V402 M316 110 V402" {...S(sw)} />
    </g>
  ),
  tag: ({ sw }) => (
    <g>
      <path d="M92 108 H262 L420 266 A26 26 0 0 1 420 302 L302 420 A26 26 0 0 1 266 420 L108 262 V124 A16 16 0 0 1 92 108 Z" fill={B} />
      <path d="M100 100 H262 L420 258 A26 26 0 0 1 420 294 L294 420 A26 26 0 0 1 258 420 L100 262 Z" {...S(sw)} />
      <circle cx={184} cy={184} r={30} {...S(sw)} />
      <path d="M244 320 L320 244 M282 352 L352 282" {...S(sw)} />
    </g>
  ),
  relationship: ({ sw }) => (
    <g>
      <path d="M176 176 L232 330 M336 176 L280 330 M186 150 H326" {...S(sw)} />
      <circle cx={130} cy={150} r={58} fill={B} />
      <circle cx={382} cy={150} r={58} fill={B2} />
      <circle cx={256} cy={376} r={58} fill={B} />
      <circle cx={130} cy={150} r={58} {...S(sw)} />
      <circle cx={382} cy={150} r={58} {...S(sw)} />
      <circle cx={256} cy={376} r={58} {...S(sw)} />
      <circle cx={130} cy={150} r={14} fill={W} />
      <circle cx={382} cy={150} r={14} fill={W} />
      <circle cx={256} cy={376} r={14} fill={W} />
    </g>
  ),
  sync: ({ sw }) => (
    <g>
      <circle cx={256} cy={256} r={84} fill={B} />
      <path d="M268 196 L224 262 H284 L244 318" {...S(sw)} />
      <path d="M402 214 A152 152 0 0 0 124 182" {...S(sw)} />
      <path d="M110 298 A152 152 0 0 0 388 330" {...S(sw)} />
      <path d="M412 150 L404 218 L340 200" {...S(sw)} />
      <path d="M100 362 L108 294 L172 312" {...S(sw)} />
    </g>
  ),
  meter: ({ sw }) => (
    <g>
      <rect x={96} y={86} width={320} height={340} rx={60} fill="rgba(0,114,206,0.18)" />
      <circle cx={256} cy={226} r={104} fill={B} />
      <rect x={96} y={86} width={320} height={340} rx={60} {...S(sw)} />
      <circle cx={256} cy={226} r={104} {...S(sw)} />
      <path d="M256 226 L318 180" {...S(sw)} />
      <circle cx={256} cy={226} r={14} fill={W} />
      <path d="M184 226 H200 M256 154 V170 M312 226 H328" {...S(sw)} />
      <rect x={176} y={354} width={160} height={36} rx={10} {...S(sw)} />
      <path d="M214 372 H226 M250 372 H262 M286 372 H298" {...S(sw)} />
    </g>
  ),
  coin: ({ sw }) => (
    <g>
      <circle cx={256} cy={256} r={170} fill={B} />
      <circle cx={256} cy={256} r={170} {...S(sw)} />
      <circle cx={256} cy={256} r={126} stroke={W} strokeWidth={sw} strokeDasharray={`${sw * 0.1} ${sw * 2.2}`} strokeLinecap="round" fill="none" />
      <path d="M306 202 C296 180 276 172 256 172 C226 172 206 188 206 210 C206 262 306 242 306 296 C306 320 284 338 256 338 C232 338 210 328 202 306 M256 146 V172 M256 338 V366" {...S(sw)} />
    </g>
  ),
  scan: ({ sw }) => (
    <g>
      <rect x={150} y={150} width={212} height={56} rx={12} fill={B} />
      <rect x={150} y={228} width={212} height={56} rx={12} fill={B2} />
      <rect x={150} y={306} width={212} height={56} rx={12} fill={B} />
      <path d="M150 150 H362 V362 H150 Z" stroke="none" fill="none" />
      <path d="M86 170 V110 A24 24 0 0 1 110 86 H170 M342 86 H402 A24 24 0 0 1 426 110 V170 M426 342 V402 A24 24 0 0 1 402 426 H342 M170 426 H110 A24 24 0 0 1 86 402 V342" {...S(sw)} />
      <path d="M100 256 H412" {...S(sw)} />
    </g>
  ),
  lock: ({ sw }) => (
    <g>
      <rect x={110} y={226} width={292} height={220} rx={34} fill={B} />
      <rect x={110} y={226} width={292} height={220} rx={34} {...S(sw)} />
      <path d="M170 226 V176 A86 86 0 0 1 342 176 V226" {...S(sw)} />
      <circle cx={256} cy={318} r={24} fill={W} />
      <path d="M256 338 V384" {...S(sw)} />
    </g>
  ),
  pin: ({ sw }) => (
    <g>
      <path d="M256 456 C256 456 400 312 400 210 A144 144 0 0 0 112 210 C112 312 256 456 256 456 Z" fill={B} />
      <path d="M256 456 C256 456 400 312 400 210 A144 144 0 0 0 112 210 C112 312 256 456 256 456 Z" {...S(sw)} />
      <circle cx={256} cy={208} r={54} {...S(sw)} />
    </g>
  ),
  compass: ({ sw }) => (
    <g>
      <circle cx={256} cy={256} r={180} fill="rgba(0,114,206,0.2)" />
      <path d="M256 256 L340 172 L292 292 Z" fill={B2} />
      <path d="M256 256 L172 340 L220 220 Z" fill={B} />
      <circle cx={256} cy={256} r={180} {...S(sw)} />
      <path d="M340 172 L292 292 L172 340 L220 220 Z" {...S(sw)} />
      <circle cx={256} cy={256} r={14} fill={W} />
      <path d="M256 76 V104 M256 408 V436 M76 256 H104 M408 256 H436" {...S(sw)} />
    </g>
  ),
  plug: ({ sw }) => (
    <g>
      <path d="M150 196 H362 V266 A106 106 0 0 1 150 266 Z" fill={B} />
      <path d="M150 196 H362 V266 A106 106 0 0 1 150 266 Z" {...S(sw)} />
      <path d="M206 196 V104 M306 196 V104" {...S(sw)} />
      <path d="M256 372 V420 A40 40 0 0 0 296 460 H360" {...S(sw)} />
      <path d="M224 266 H288" {...S(sw)} />
    </g>
  ),
  warehouse: ({ sw }) => (
    <g>
      <path d="M86 210 L256 104 L426 210 V420 H86 Z" fill={B} />
      <path d="M86 210 L256 104 L426 210 V420 H86 Z" {...S(sw)} />
      <path d="M256 236 V380 M194 272 L318 344 M318 272 L194 344" {...S(sw)} />
      <path d="M234 246 L256 268 L278 246 M234 370 L256 348 L278 370" {...S(sw)} />
    </g>
  ),
  layers: ({ sw }) => (
    <g>
      <path d="M256 92 L446 186 L256 280 L66 186 Z" fill={B2} />
      <path d="M66 262 L256 356 L446 262" fill="none" />
      <path d="M100 280 L256 358 L412 280 L446 296 L256 390 L66 296 Z" fill={B} opacity={0.75} />
      <path d="M256 92 L446 186 L256 280 L66 186 Z" {...S(sw)} />
      <path d="M66 262 L256 356 L446 262" {...S(sw)} />
      <path d="M66 338 L256 432 L446 338" {...S(sw)} />
    </g>
  ),
  shield: ({ sw }) => (
    <g>
      <path d="M256 70 L420 128 V244 C420 344 350 414 256 446 C162 414 92 344 92 244 V128 Z" fill={B} />
      <path d="M256 70 L420 128 V244 C420 344 350 414 256 446 C162 414 92 344 92 244 V128 Z" {...S(sw)} />
      <path d="M182 254 L236 306 L334 206" {...S(sw)} />
    </g>
  ),
  search: ({ sw }) => (
    <g>
      <circle cx={222} cy={222} r={132} fill={B} />
      <circle cx={222} cy={222} r={132} {...S(sw)} />
      <path d="M152 196 A76 76 0 0 1 222 146" {...S(sw)} />
      <path d="M318 318 L430 430" stroke={W} strokeWidth={sw * 3.4} strokeLinecap="round" />
    </g>
  ),
  user: ({ sw }) => (
    <g>
      <path d="M96 440 V410 A110 110 0 0 1 206 300 H306 A110 110 0 0 1 416 410 V440 Z" fill={B} />
      <circle cx={256} cy={172} r={96} fill={B2} />
      <circle cx={256} cy={172} r={96} {...S(sw)} />
      <path d="M96 440 V410 A110 110 0 0 1 206 300 H306 A110 110 0 0 1 416 410 V440" {...S(sw)} />
    </g>
  ),
  badge: ({ sw }) => (
    <g>
      <rect x={72} y={120} width={368} height={272} rx={30} fill="rgba(0,114,206,0.2)" />
      <rect x={110} y={176} width={120} height={150} rx={16} fill={B} />
      <rect x={72} y={120} width={368} height={272} rx={30} {...S(sw)} />
      <circle cx={170} cy={228} r={30} {...S(sw)} />
      <path d="M126 316 A44 44 0 0 1 214 316" {...S(sw)} />
      <path d="M268 206 H392 M268 256 H372 M268 306 H340" {...S(sw)} />
      <path d="M216 120 V88 H296 V120" {...S(sw)} />
    </g>
  ),
  key: ({ sw }) => (
    <g>
      <circle cx={168} cy={256} r={100} fill={B} />
      <circle cx={168} cy={256} r={100} {...S(sw)} />
      <circle cx={150} cy={256} r={30} {...S(sw)} />
      <path d="M268 256 H440 M392 256 V318 M340 256 V300" {...S(sw)} />
    </g>
  ),
  admin: ({ sw }) => (
    <g>
      <path d="M70 440 V414 A104 104 0 0 1 174 310 H250 A110 110 0 0 1 282 316 L282 440 Z" fill={B} />
      <circle cx={210} cy={176} r={92} fill={B2} />
      <circle cx={210} cy={176} r={92} {...S(sw)} />
      <path d="M70 440 V414 A104 104 0 0 1 174 310 H262" {...S(sw)} />
      <path d={gearPath(366, 370, 92, 70, 8)} fill={B} />
      <path d={gearPath(366, 370, 92, 70, 8)} {...S(sw)} />
      <circle cx={366} cy={370} r={28} {...S(sw)} />
    </g>
  ),
  apps: ({ sw }) => (
    <g>
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => {
          const x = 86 + c * 120;
          const y = 86 + r * 120;
          const filled = (r + c) % 2 === 0;
          return (
            <g key={`${r}-${c}`}>
              {filled && <rect x={x} y={y} width={100} height={100} rx={22} fill={r === 1 && c === 1 ? B2 : B} />}
              <rect x={x} y={y} width={100} height={100} rx={22} {...S(sw)} />
            </g>
          );
        }),
      )}
    </g>
  ),
  warning: ({ sw }) => (
    <g>
      <path d="M256 76 L456 420 H56 Z" fill={B} />
      <path d="M232 92 A28 28 0 0 1 280 92 L448 386 A28 28 0 0 1 424 428 H88 A28 28 0 0 1 64 386 Z" {...S(sw)} />
      <path d="M256 196 V302" {...S(sw)} />
      <circle cx={256} cy={358} r={14} fill={W} />
    </g>
  ),
  chat: ({ sw }) => (
    <g>
      <path d="M70 120 A40 40 0 0 1 110 80 H322 A40 40 0 0 1 362 120 V250 A40 40 0 0 1 322 290 H180 L110 350 V290 A40 40 0 0 1 70 250 Z" fill={B} />
      <path d="M70 120 A40 40 0 0 1 110 80 H322 A40 40 0 0 1 362 120 V250 A40 40 0 0 1 322 290 H180 L110 350 V290 A40 40 0 0 1 70 250 Z" {...S(sw)} />
      <path d="M362 196 H402 A40 40 0 0 1 442 236 V356 A40 40 0 0 1 402 396 V446 L340 396 H250 A40 40 0 0 1 210 356 V330" {...S(sw)} />
      <circle cx={156} cy={186} r={14} fill={W} />
      <circle cx={216} cy={186} r={14} fill={W} />
      <circle cx={276} cy={186} r={14} fill={W} />
    </g>
  ),
  wrench: ({ sw }) => (
    <g>
      <path d="M318 82 A110 110 0 0 0 214 220 L92 342 A44 44 0 0 0 154 404 L276 282 A110 110 0 0 0 414 178 L346 226 L290 206 L270 150 Z" fill={B} />
      <path d="M318 82 A110 110 0 0 0 214 220 L92 342 A44 44 0 0 0 154 404 L276 282 A110 110 0 0 0 414 178 L346 226 L290 206 L270 150 Z" {...S(sw)} />
      <circle cx={124} cy={372} r={12} fill={W} />
    </g>
  ),
  door: ({ sw }) => (
    <g>
      <path d="M150 78 L322 122 V438 L150 470 Z" fill={B} />
      <rect x={150} y={78} width={240} height={360} rx={8} {...S(sw)} />
      <path d="M150 78 L322 122 V438 L150 470 Z" {...S(sw)} />
      <circle cx={286} cy={290} r={13} fill={W} />
      <path d="M80 438 H452" {...S(sw)} />
    </g>
  ),
  route: ({ sw }) => (
    <g>
      <path d="M126 350 C126 350 196 282 196 232 A70 70 0 0 0 56 232 C56 282 126 350 126 350 Z" fill={B} />
      <path d="M126 350 C126 350 196 282 196 232 A70 70 0 0 0 56 232 C56 282 126 350 126 350 Z" {...S(sw)} />
      <circle cx={126} cy={232} r={24} {...S(sw)} />
      <path d="M126 420 C220 420 220 300 300 300 C380 300 380 180 420 140" stroke={W} strokeWidth={sw} strokeLinecap="round" strokeDasharray={`${sw * 0.1} ${sw * 3}`} fill="none" />
      <circle cx={420} cy={132} r={36} fill={B2} />
      <circle cx={420} cy={132} r={36} {...S(sw)} />
    </g>
  ),
  history: ({ sw }) => (
    <g>
      <circle cx={268} cy={260} r={150} fill={B} />
      <path d="M118 260 A150 150 0 1 0 162 154" {...S(sw)} />
      <path d="M150 92 L156 162 L226 156" {...S(sw)} />
      <path d="M268 170 V262 L330 300" {...S(sw)} />
    </g>
  ),
  people: ({ sw }) => (
    <g>
      <circle cx={352} cy={168} r={64} fill={B2} />
      <path d="M300 300 A96 96 0 0 1 452 380 V420 H330" fill={B2} opacity={0.7} />
      <path d="M60 430 V400 A100 100 0 0 1 160 300 H232 A100 100 0 0 1 332 400 V430 Z" fill={B} />
      <circle cx={196} cy={172} r={84} fill={B} />
      <circle cx={196} cy={172} r={84} {...S(sw)} />
      <path d="M60 430 V400 A100 100 0 0 1 160 300 H232 A100 100 0 0 1 332 400 V430" {...S(sw)} />
      <path d="M318 112 A64 64 0 1 1 352 232" {...S(sw)} />
      <path d="M380 296 A82 82 0 0 1 452 378 V420" {...S(sw)} />
    </g>
  ),
  book: ({ sw }) => (
    <g>
      <path d="M256 128 C206 96 132 92 66 108 V412 C132 396 206 400 256 432 Z" fill={B} />
      <path d="M256 128 C306 96 380 92 446 108 V412 C380 396 306 400 256 432 Z" fill={B2} />
      <path d="M256 128 C206 96 132 92 66 108 V412 C132 396 206 400 256 432 C306 400 380 396 446 412 V108 C380 92 306 96 256 128 Z" {...S(sw)} />
      <path d="M256 128 V432" {...S(sw)} />
      <path d="M118 184 C150 176 182 176 210 186 M118 244 C150 236 182 236 210 246 M302 186 C330 176 362 176 394 184 M302 246 C330 236 362 236 394 244" {...S(sw)} />
    </g>
  ),
  catalog: ({ sw }) => (
    <g>
      <rect x={120} y={70} width={292} height={372} rx={30} fill={B} />
      <rect x={96} y={96} width={292} height={372} rx={30} fill="rgba(0,114,206,0.25)" />
      <rect x={96} y={96} width={292} height={372} rx={30} {...S(sw)} />
      <path d="M150 96 V70 A0 0 0 0 1 150 70 H382 A30 30 0 0 1 412 100 V414 A0 0 0 0 1 412 414 H388" {...S(sw)} />
      <path d="M152 186 H332 M152 252 H332 M152 318 H272" {...S(sw)} />
      <path d="M300 96 V170 L326 150 L352 170 V96" fill={W} stroke={W} strokeWidth={sw} strokeLinejoin="round" />
    </g>
  ),
  report: ({ sw }) => (
    <g>
      <path d="M100 72 H302 L392 162 V440 H100 Z" fill="rgba(0,114,206,0.22)" />
      <rect x={150} y={300} width={44} height={84} rx={6} fill={B} />
      <rect x={224} y={252} width={44} height={132} rx={6} fill={B} />
      <rect x={298} y={210} width={44} height={174} rx={6} fill={B2} />
      <path d="M100 72 H302 L392 162 V440 H100 Z" {...S(sw)} />
      <path d="M302 72 V162 H392" {...S(sw)} />
      <path d="M150 140 H240" {...S(sw)} />
      <circle cx={392} cy={402} r={70} fill={B} />
      <circle cx={392} cy={402} r={70} {...S(sw)} />
      <path d="M360 402 L384 426 L426 382" {...S(sw)} />
    </g>
  ),
  check: ({ sw }) => (
    <g>
      <circle cx={256} cy={256} r={180} fill={B} />
      <circle cx={256} cy={256} r={180} {...S(sw)} />
      <path d="M170 260 L232 320 L346 200" {...S(sw)} />
    </g>
  ),
  cross: ({ sw }) => (
    <g>
      <circle cx={256} cy={256} r={180} fill={B} />
      <circle cx={256} cy={256} r={180} {...S(sw)} />
      <path d="M190 190 L322 322 M322 190 L190 322" {...S(sw)} />
    </g>
  ),
  gear: ({ sw }) => (
    <g>
      <path d={gearPath(256, 256, 190, 152, 10)} fill={B} />
      <path d={gearPath(256, 256, 190, 152, 10)} {...S(sw)} />
      <circle cx={256} cy={256} r={64} fill={B2} />
      <circle cx={256} cy={256} r={64} {...S(sw)} />
    </g>
  ),
  play: ({ sw }) => (
    <g>
      <circle cx={256} cy={256} r={180} fill={B} />
      <circle cx={256} cy={256} r={180} {...S(sw)} />
      <path d="M216 176 L346 256 L216 336 Z" fill={W} stroke={W} strokeWidth={sw} strokeLinejoin="round" />
    </g>
  ),
  pulse: ({ sw }) => (
    <g>
      <rect x={66} y={96} width={380} height={270} rx={28} fill={B} />
      <rect x={66} y={96} width={380} height={270} rx={28} {...S(sw)} />
      <path d="M100 236 H176 L206 172 L250 296 L288 206 L310 236 H412" {...S(sw)} />
      <path d="M256 366 V420 M176 420 H336" {...S(sw)} />
    </g>
  ),
  keyboard: ({ sw }) => (
    <g>
      <rect x={56} y={140} width={400} height={232} rx={30} fill={B} />
      <rect x={56} y={140} width={400} height={232} rx={30} {...S(sw)} />
      {[0, 1].map((r) =>
        [0, 1, 2, 3, 4, 5].map((c) => (
          <rect key={`${r}${c}`} x={98 + c * 56} y={180 + r * 56} width={36} height={34} rx={7} fill={W} />
        )),
      )}
      <path d="M150 324 H362" {...S(sw)} />
    </g>
  ),
  question: ({ sw }) => (
    <g>
      <path d="M256 56 A190 190 0 1 1 112 380 L66 440 L86 352 A190 190 0 0 1 256 56 Z" fill={B} />
      <path d="M256 56 A190 190 0 1 1 112 380 L66 440 L86 352 A190 190 0 0 1 256 56 Z" {...S(sw)} />
      <path d="M200 196 A58 58 0 1 1 286 248 C266 260 256 272 256 300 V314" {...S(sw)} />
      <circle cx={256} cy={370} r={15} fill={W} />
    </g>
  ),
  hourglass: ({ sw }) => (
    <g>
      <path d="M170 110 H342 C342 190 256 220 256 256 C256 220 170 190 170 110 Z" fill={B2} />
      <path d="M170 402 H342 C342 330 300 300 256 300 C212 300 170 330 170 402 Z" fill={B} />
      <path d="M140 70 H372 M140 442 H372" {...S(sw)} />
      <path d="M170 70 C170 180 236 210 236 256 C236 302 170 332 170 442 M342 70 C342 180 276 210 276 256 C276 302 342 332 342 442" {...S(sw)} />
    </g>
  ),
  upgrade: ({ sw }) => (
    <g>
      <circle cx={256} cy={256} r={180} fill={B} />
      <circle cx={256} cy={256} r={180} {...S(sw)} />
      <path d="M256 352 V164 M180 236 L256 160 L332 236" {...S(sw)} />
    </g>
  ),
  steward: ({ sw }) => (
    <g>
      <path d="M70 446 V420 A110 110 0 0 1 180 310 H262 L270 446 Z" fill={B} />
      <circle cx={210} cy={170} r={94} fill={B2} />
      <circle cx={210} cy={170} r={94} {...S(sw)} />
      <path d="M70 446 V420 A110 110 0 0 1 180 310 H272" {...S(sw)} />
      <path d="M364 262 L452 292 V346 C452 396 416 428 364 446 C312 428 276 396 276 346 V292 Z" fill={B} />
      <path d="M364 262 L452 292 V346 C452 396 416 428 364 446 C312 428 276 396 276 346 V292 Z" {...S(sw)} />
      <path d="M326 352 L354 380 L404 330" {...S(sw)} />
    </g>
  ),
  bolt: ({ sw }) => (
    <g>
      <path d="M290 56 L110 296 H246 L216 456 L402 206 H262 Z" fill={B} />
      <path d="M290 56 L110 296 H246 L216 456 L402 206 H262 Z" {...S(sw)} />
    </g>
  ),
  clock: ({ sw }) => (
    <g>
      <circle cx={256} cy={256} r={180} fill={B} />
      <circle cx={256} cy={256} r={180} {...S(sw)} />
      <path d="M256 146 V262 L330 310" {...S(sw)} />
      <circle cx={256} cy={262} r={14} fill={W} />
    </g>
  ),
  copy: ({ sw }) => (
    <g>
      <rect x={176} y={70} width={260} height={300} rx={28} fill={B} />
      <rect x={176} y={70} width={260} height={300} rx={28} {...S(sw)} />
      <path d="M130 140 H110 A34 34 0 0 0 76 174 V412 A34 34 0 0 0 110 446 H312 A34 34 0 0 0 346 412 V390" {...S(sw)} />
      <path d="M226 160 H386 M226 220 H386 M226 280 H330" {...S(sw)} />
    </g>
  ),
  move: ({ sw }) => (
    <g>
      <rect x={66} y={150} width={180} height={212} rx={24} fill={B} />
      <rect x={66} y={150} width={180} height={212} rx={24} {...S(sw)} />
      <path d="M290 256 H446 M396 206 L446 256 L396 306" {...S(sw)} />
      <path d="M110 214 H202 M110 256 H202 M110 298 H170" {...S(sw)} />
    </g>
  ),
  link: ({ sw }) => (
    <g>
      <rect x={60} y={190} width={220} height={132} rx={66} fill={B} />
      <rect x={60} y={190} width={220} height={132} rx={66} {...S(sw)} />
      <rect x={232} y={190} width={220} height={132} rx={66} {...S(sw)} />
      <path d="M190 256 H322" {...S(sw)} />
    </g>
  ),
};

export type IconName = keyof typeof ICONS;

export const Icon: React.FC<{
  name: IconName | string;
  size: number;
  stroke?: number; // stroke width in rendered px
  style?: React.CSSProperties;
}> = ({ name, size, stroke = 10, style }) => {
  // 10px white stroke at regular icon sizes; tiny inline icons (chips/labels)
  // scale the stroke down proportionally so they don't clog.
  const px = size >= 180 ? stroke : Math.max(4, (stroke * size) / 180);
  const sw = (px * 512) / size;
  const draw = ICONS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      style={{ overflow: 'visible', display: 'block', ...style }}
    >
      {draw ? draw({ sw }) : null}
    </svg>
  );
};
