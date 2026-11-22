import { Composition } from "remotion";
import { PULSE_DURATION, PulsePromo } from "./PulsePromo";
import { PLUMO_DURATION, PlumoPromo } from "./PlumoPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="PulsePromo" component={PulsePromo} durationInFrames={PULSE_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="PlumoPromo" component={PlumoPromo} durationInFrames={PLUMO_DURATION} fps={30} width={1080} height={1920} />
    </>
  );
};
