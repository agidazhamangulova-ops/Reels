import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts so renders work offline.
export const fontFamily = "Inter";
export const monoFamily = "JetBrains Mono";

const LATIN = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const CYRILLIC = "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+04A2-04A3, U+04AE-04AF, U+04E8-04E9, U+2116";

for (const w of ["400", "500", "600", "700", "800"]) {
  loadFont({ family: fontFamily, url: staticFile(`fonts/inter-latin-${w}-normal.woff2`), weight: w, unicodeRange: LATIN });
  loadFont({ family: fontFamily, url: staticFile(`fonts/inter-cyrillic-${w}-normal.woff2`), weight: w, unicodeRange: CYRILLIC });
}
for (const w of ["400", "500"]) {
  loadFont({ family: monoFamily, url: staticFile(`fonts/jetbrains-mono-latin-${w}-normal.woff2`), weight: w, unicodeRange: LATIN });
}
loadFont({ family: monoFamily, url: staticFile("fonts/jetbrains-mono-cyrillic-400-normal.woff2"), weight: "400", unicodeRange: CYRILLIC });

export const FPS = 30;
export const s = (seconds: number) => Math.round(seconds * FPS);

export const C = {
  green: "#15C45A",
  greenBright: "#22D86A",
  greenDark: "#0B7A37",
  ink: "#111111",
  text: "#1A1A1A",
  muted: "#8A8A8A",
  faint: "#B9B9B9",
  line: "#ECECEC",
  bg: "#FFFFFF",
  black: "#000000",
  youtube: "#FF2D2D",
  insta: "#D63CA8",
  linkedin: "#2F7BD9",
};

/** Plumo brand palette (from the Plumo reels). */
export const P = {
  blue: "#3352FF",
  blueBright: "#5C78FF",
  blueSoft: "#E8ECFF",
  navy: "#0A0F3D",
  ink: "#0B0B14",
};
