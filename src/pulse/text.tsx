import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, fontFamily } from "./theme";

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export type Token =
  | { text: string; at: number; color?: string; weight?: number }
  | { pill: React.ReactNode; at: number; color?: string; textColor?: string };

/**
 * A single line of kinetic type. Each token fades in from a blur at its own
 * frame, and the line stays centred as it grows (each token's box widens
 * from 0 as it enters).
 */
export const KineticLine: React.FC<{
  tokens: Token[];
  size?: number;
  color?: string;
  align?: "center" | "left";
  weight?: number;
  style?: React.CSSProperties;
}> = ({ tokens, size = 64, color = "#fff", align = "center", weight = 500, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: align === "center" ? "center" : "flex-start",
        fontFamily,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: "-0.035em",
        color,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {tokens.map((t, i) => {
        const p = interpolate(frame - t.at, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease,
        });
        const grow = interpolate(frame - t.at, [0, 7], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: ease,
        });
        if (frame < t.at) return null;
        const isPill = "pill" in t;
        const est = isPill ? 6 : t.text.length * 0.56 + 0.3;
        return (
          <span
            key={i}
            style={{
              display: "inline-flex",
              maxWidth: `${est * grow + (grow >= 1 ? 99 : 0)}em`,
              marginLeft: i === 0 ? 0 : `${0.26 * grow}em`,
              opacity: p,
              filter: `blur(${(1 - p) * 10}px)`,
              transform: `translateY(${(1 - p) * 0.12}em)`,
              color: isPill ? undefined : (t.color ?? color),
              fontWeight: isPill ? undefined : (t.weight ?? weight),
            }}
          >
            {isPill ? (
              <Pill bg={t.color} textColor={t.textColor} start={t.at}>
                {t.pill}
              </Pill>
            ) : (
              t.text
            )}
          </span>
        );
      })}
    </div>
  );
};

/** The green highlight chip used all through the video ("views.", "Free trial."). */
export const Pill: React.FC<{
  children: React.ReactNode;
  start: number;
  bg?: string;
  textColor?: string;
}> = ({ children, start, bg = C.green, textColor = "#fff" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - start, fps, config: { damping: 14, mass: 0.6 } });
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: bg,
        color: textColor,
        fontWeight: 600,
        fontSize: "0.82em",
        letterSpacing: "-0.03em",
        padding: "0.08em 0.28em 0.12em",
        borderRadius: "0.16em",
        transform: `scale(${0.6 + 0.4 * sp})`,
        lineHeight: 1.1,
      }}
    >
      {children}
    </span>
  );
};

/** Typewriter: characters appear one by one, fresh ones tinted green, with a caret. */
export const Typewriter: React.FC<{
  text: string;
  start: number;
  cps?: number; // frames per character
  size?: number;
  caret?: boolean;
  after?: React.ReactNode;
  afterAt?: number;
}> = ({ text, start, cps = 1.6, size = 52, caret = true, after, afterAt = 0 }) => {
  const frame = useCurrentFrame();
  const typed = Math.max(0, Math.min(text.length, Math.floor((frame - start) / cps)));
  const done = typed >= text.length;
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
        fontSize: size,
        fontWeight: 400,
        letterSpacing: "-0.035em",
        color: "#fff",
        whiteSpace: "pre",
      }}
    >
      {text
        .slice(0, typed)
        .split("")
        .map((ch, i) => {
          const age = (frame - start) / cps - i;
          const g = interpolate(age, [0, 6], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <span key={i} style={{ color: g > 0.05 ? mix(C.greenBright, "#ffffff", 1 - g) : "#fff" }}>
              {ch}
            </span>
          );
        })}
      {caret && !(done && frame > afterAt) ? (
        <span
          style={{
            display: "inline-block",
            width: 3,
            height: "1.05em",
            marginLeft: 2,
            background: "#fff",
            opacity: done ? (blink ? 1 : 0) : 1,
          }}
        />
      ) : null}
      {after && frame >= afterAt ? (
        <span style={{ marginLeft: "0.25em", display: "inline-flex" }}>{after}</span>
      ) : null}
    </div>
  );
};

/** Text that types into a pill: the pill's width follows the typed text. */
export const TypingPill: React.FC<{ text: string; start: number; cps?: number }> = ({
  text,
  start,
  cps = 1.4,
}) => {
  const frame = useCurrentFrame();
  const typed = Math.max(0, Math.min(text.length, Math.floor((frame - start) / cps)));
  const p = interpolate(frame - start, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: C.green,
        color: "#fff",
        fontWeight: 600,
        fontSize: "0.82em",
        padding: "0.08em 0.3em 0.12em",
        borderRadius: "0.18em",
        minWidth: `${(1 - (typed >= text.length ? 1 : 0)) * 3}em`,
        opacity: p,
        transform: `scaleX(${0.7 + 0.3 * p})`,
        transformOrigin: "left center",
        whiteSpace: "pre",
      }}
    >
      {text.slice(0, typed)}
    </span>
  );
};

/** Counting number inside a pill ("You just got [22]"). */
export const CountPill: React.FC<{ from: number; to: number; start: number; dur: number }> = ({
  from,
  to,
  start,
  dur,
}) => {
  const frame = useCurrentFrame();
  const v = Math.round(
    interpolate(frame - start, [0, dur], [from, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }),
  );
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{v}</span>;
};

export function mix(a: string, b: string, t: number) {
  const pa = hex(a);
  const pb = hex(b);
  const r = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${r[0]},${r[1]},${r[2]})`;
}
function hex(h: string) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export const useEase = (start: number, dur: number, from = 0, to = 1, e = ease) => {
  const frame = useCurrentFrame();
  return interpolate(frame - start, [0, dur], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: e,
  });
};
