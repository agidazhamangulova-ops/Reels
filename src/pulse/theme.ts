import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts so renders work offline.
export const fontFamily = "Inter";
export const monoFamily = "JetBrains Mono";

for (const w of ["400", "500", "600", "700"]) {
  loadFont({ family: fontFamily, url: staticFile(`fonts/inter-latin-${w}-normal.woff2`), weight: w });
}
for (const w of ["400", "500"]) {
  loadFont({ family: monoFamily, url: staticFile(`fonts/jetbrains-mono-latin-${w}-normal.woff2`), weight: w });
}

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
