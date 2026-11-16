import React from "react";
import { useCurrentFrame } from "remotion";
import { C, F, FONT, HL_GRADIENT, easeIn, easeOut, prog } from "../theme";

export type Tok = { text: string; at: number; hl?: boolean; br?: boolean };

/**
 * Compact kinetic-text syntax, timed to the voice-over:
 *   "Every@9.26 reliable@9.52 *report,@10.06 | next-line"
 * `@t` = voice-over second the word lands, `*` = emphasised (blue gradient),
 * `|` = line break. Words without a time follow the previous one by `gap`.
 */
export const k = (src: string, gap = 0.09): Tok[] => {
  const out: Tok[] = [];
  let last = 0;
  for (const raw of src.trim().split(/\s+/)) {
    if (raw === "|") {
      out.push({ text: "", at: last, br: true });
      continue;
    }
    let s = raw;
    let hl = false;
    if (s.startsWith("*")) {
      hl = true;
      s = s.slice(1);
    }
    let at = last + gap;
    const m = s.match(/^(.*)@(-?[\d.]+)$/);
    if (m) {
      s = m[1];
      at = parseFloat(m[2]);
    }
    last = at;
    out.push({ text: s.replace(/_/g, " "), at, hl });
  }
  return out;
};

type KProps = {
  tokens: Tok[];
  size: number;
  weight?: number;
  color?: string;
  align?: "left" | "center" | "right";
  lineHeight?: number;
  exitAt?: number; // voice-over seconds
  exitDur?: number; // frames
  dur?: number; // frames for each word to settle
  style?: React.CSSProperties;
  hlGradient?: string;
  hlWeight?: number;
  letterSpacing?: string;
};

/** Word-by-word reveal: rise + de-blur + fade, synced to voice-over timings. */
export const KText: React.FC<KProps> = ({
  tokens,
  size,
  weight = 500,
  color = C.text,
  align = "center",
  lineHeight = 1.14,
  exitAt,
  exitDur = 14,
  dur = 16,
  style,
  hlGradient = HL_GRADIENT,
  hlWeight,
  letterSpacing = "-0.02em",
}) => {
  const frame = useCurrentFrame();
  const lines: Tok[][] = [[]];
  tokens.forEach((t) => (t.br ? lines.push([]) : lines[lines.length - 1].push(t)));

  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        lineHeight,
        color,
        textAlign: align,
        letterSpacing,
        ...style,
      }}
    >
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent:
              align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
          }}
        >
          {line.map((t, i) => {
            const start = F(t.at);
            const p = prog(frame, start, dur, easeOut);
            const e =
              exitAt !== undefined
                ? prog(frame, F(exitAt) + (li * 2 + i) * 0.6, exitDur, easeIn)
                : 0;
            const blur = (1 - p) * 18 + e * 16;
            const op = p * (1 - e);
            if (op <= 0.001) {
              return (
                <span key={i} style={{ opacity: 0, marginRight: "0.26em", whiteSpace: "pre" }}>
                  {t.text}
                </span>
              );
            }
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  marginRight: i === line.length - 1 ? 0 : "0.26em",
                  opacity: op,
                  transform: `translateY(${(1 - p) * 0.42 - e * 0.32}em)`,
                  filter: blur > 0.15 ? `blur(${blur}px)` : undefined,
                  ...(t.hl
                    ? {
                        backgroundImage: hlGradient,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        paddingBottom: "0.08em",
                        ...(hlWeight ? { fontWeight: hlWeight } : {}),
                      }
                    : {}),
                }}
              >
                {t.text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
