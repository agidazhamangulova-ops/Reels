import { Composition } from "remotion";
import { PULSE_DURATION, PulsePromo } from "./PulsePromo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PulsePromo"
      component={PulsePromo}
      durationInFrames={PULSE_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
