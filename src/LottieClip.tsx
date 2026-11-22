import React, { useEffect, useState } from "react";
import { AbsoluteFill, cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { Lottie, LottieAnimationData } from "@remotion/lottie";

/**
 * Plays a Lottie animation (JSON from lottiefiles.com, After Effects/Bodymovin, etc.)
 * inside any Remotion scene. Put the .json into public/lottie/ and pass its name.
 *
 *   <LottieClip file="lottie/confetti.json" style={{ width: 600 }} />
 */
export const LottieClip: React.FC<{
  file: string;
  loop?: boolean;
  playbackRate?: number;
  style?: React.CSSProperties;
}> = ({ file, loop = true, playbackRate = 1, style }) => {
  const [handle] = useState(() => delayRender(`Loading Lottie ${file}`));
  const [data, setData] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch(staticFile(file))
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [file, handle]);

  if (!data) return null;
  return <Lottie animationData={data} loop={loop} playbackRate={playbackRate} style={style} />;
};

/** Preview composition: shows one Lottie file centred on a light background. */
export const LottiePreview: React.FC<{ file: string }> = ({ file }) => (
  <AbsoluteFill style={{ background: "#F4F6FF", alignItems: "center", justifyContent: "center" }}>
    <LottieClip file={file} style={{ width: 700, height: 700 }} />
  </AbsoluteFill>
);
