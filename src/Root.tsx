import { Composition } from "remotion";
import { PULSE_DURATION, PulsePromo } from "./PulsePromo";
import { PLUMO_DURATION, PlumoPromo } from "./PlumoPromo";
import { SOFT_DURATION, SOFT_FPS, SoftReel } from "./SoftReel";
import { LottiePreview } from "./LottieClip";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="PulsePromo" component={PulsePromo} durationInFrames={PULSE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="SoftReel" component={SoftReel} durationInFrames={SOFT_DURATION} fps={SOFT_FPS} width={1080} height={1920} />
      <Composition
        id="LottiePreview"
        component={LottiePreview}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ file: "lottie/plumo-pulse.json" }}
      />
      <Composition id="PlumoPromo" component={PlumoPromo} durationInFrames={PLUMO_DURATION} fps={30} width={1080} height={1920} />
    </>
  );
};
