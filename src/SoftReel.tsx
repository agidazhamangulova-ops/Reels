import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

/**
 * "Soft aesthetic" reel: white background, photos cut on the beat at
 * varying sizes, a fixed centred list of affirmations on top.
 * Cut times are taken from the reference reel so they land on its music.
 */

const FONT = "Montserrat";
loadFont({ family: FONT, url: staticFile("fonts/montserrat-latin-600-normal.woff2"), weight: "600" });
loadFont({
  family: FONT,
  url: staticFile("fonts/montserrat-cyrillic-600-normal.woff2"),
  weight: "600",
  unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
});

export const SOFT_FPS = 30;
const BG = "#FFFFFF";

// Beat cuts (seconds) measured from the reference video.
const BEATS = [
  0, 0.233, 0.367, 0.6, 1.1, 1.3, 1.5, 2.0, 2.267, 2.6, 2.933, 3.167, 3.3, 3.533, 4.033, 4.233, 4.433, 4.933, 5.2, 5.533, 5.867, 6.1,
  6.233, 6.467, 6.967, 7.167, 7.367, 7.867, 8.133, 8.467, 8.93,
];
// Every other beat: 15 shots, each photo once.
const CUTS = BEATS.filter((_, i) => i % 2 === 0);
export const SOFT_DURATION = Math.round(CUTS[CUTS.length - 1] * SOFT_FPS);

// 15 shots: every photo once.
const ORDER = [9, 13, 1, 12, 5, 11, 15, 4, 2, 14, 6, 10, 3, 8, 7];
// Size of each shot as a share of the frame width; varied like the reference.
const SIZES = [0.86, 0.74, 0.92, 0.8, 0.7, 0.9, 0.78, 0.95, 0.82, 0.72, 0.88, 0.76];
const OFFSETS = [0, -30, 20, -10, 40, -40, 10, 30, -20, 0, 25, -15];

const WORDS = ["speak less", "do more", "small circle", "private life", "feminine energy", "peaceful mind", "kind heart", "no competition", "secure"];

const Shot: React.FC<{ n: number; i: number }> = ({ n, i }) => {
  const w = SIZES[i % SIZES.length];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Img
        src={staticFile(`soft/photos/p${String(n).padStart(2, "0")}.jpg`)}
        style={{
          maxWidth: `${w * 100}%`,
          maxHeight: `${w * 86}%`,
          objectFit: "contain",
          transform: `translateY(${OFFSETS[i % OFFSETS.length]}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const SoftReel: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    {ORDER.map((n, i) => {
      const from = Math.round(CUTS[i] * SOFT_FPS);
      const to = Math.round(CUTS[i + 1] * SOFT_FPS);
      return (
        <Sequence key={i} from={from} durationInFrames={to - from} name={`shot ${i + 1} · p${n}`}>
          <Shot n={n} i={i} />
        </Sequence>
      );
    })}
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 130 }}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 42,
          lineHeight: "52px",
          color: "#fff",
          textAlign: "center",
          textShadow: "0 1px 3px rgba(0,0,0,0.35), 0 0 1px rgba(0,0,0,0.4)",
          letterSpacing: "0.005em",
        }}
      >
        {WORDS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
    </AbsoluteFill>
    <Audio src={staticFile("soft/music.m4a")} />
  </AbsoluteFill>
);
