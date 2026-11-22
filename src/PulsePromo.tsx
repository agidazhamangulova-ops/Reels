import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { C, s } from "./pulse/theme";
import {
  SceneAgency,
  SceneCallBooked,
  SceneChips,
  SceneCTA,
  SceneDarkPulse,
  SceneEveryStep,
  SceneFirstTouch,
  SceneFootage,
  SceneFunnel,
  SceneHook,
  SceneLine,
  SceneLockup,
  SceneLogo,
  SceneMadeMoney,
  SceneMeet,
  SceneMostPlatform,
  SceneOpenContact,
  SceneOrganic,
  SceneQuestion,
  SceneReady,
  SceneSidebarClick,
  SceneTrackConversions,
  SceneTrackLeads,
  SceneWorkspace,
  SceneYoursToo,
} from "./pulse/scenes";

export const PULSE_DURATION = s(52.1);

/** Timeline in seconds, matched to the reference edit. */
type Cut = { from: number; to: number; render: (dur: number) => React.ReactNode };

const TIMELINE: Cut[] = [
  { from: 0, to: 2.0, render: (d) => <SceneHook dur={d} /> },
  { from: 2.0, to: 3.6, render: () => <SceneFootage src="footage-organic.mp4" /> },
  { from: 3.6, to: 6.1, render: (d) => <SceneQuestion dur={d} /> },
  { from: 6.1, to: 8.3, render: () => <SceneFootage src="footage-creators.mp4" /> },
  { from: 8.3, to: 9.0, render: (d) => <SceneMeet dur={d} /> },
  { from: 9.0, to: 10.7, render: (d) => <SceneLogo dur={d} /> },
  { from: 10.7, to: 12.0, render: (d) => <SceneTrackConversions dur={d} /> },
  { from: 12.0, to: 13.3, render: (d) => <SceneOrganic dur={d} /> },
  { from: 13.3, to: 15.5, render: (d) => <SceneFirstTouch dur={d} /> },
  {
    from: 15.5,
    to: 17.0,
    render: (d) => (
      <SceneLine
        dur={d}
        size={50}
        tokens={[
          { text: "Everything", at: 0 },
          { text: "is", at: 5 },
          { text: "in", at: 8 },
          { pill: <PulseInline />, at: 13, color: "transparent", textColor: C.ink },
        ]}
      />
    ),
  },
  { from: 17.0, to: 19.0, render: (d) => <SceneFunnel dur={d} /> },
  {
    from: 19.0,
    to: 20.0,
    render: (d) => (
      <SceneLine
        dur={d}
        size={78}
        weight={600}
        tokens={[
          { text: "And", at: 0 },
          { text: "that's", at: 12 },
          { text: "it!", at: 16 },
        ]}
      />
    ),
  },
  { from: 20.0, to: 21.0, render: (d) => <SceneReady dur={d} /> },
  {
    from: 21.0,
    to: 23.3,
    render: (d) => (
      <SceneLine
        dur={d}
        size={52}
        weight={600}
        exitBlur
        tokens={[
          { text: "Stop", at: 0 },
          { text: "making", at: 12 },
          { text: "content", at: 22 },
          { text: "for", at: 32 },
          { pill: "views.", at: 36 },
        ]}
      />
    ),
  },
  {
    from: 23.3,
    to: 25.0,
    render: (d) => (
      <SceneSidebarClick
        dur={d}
        target="content"
        lineA="Double down on"
        lineB="the content"
        titleAfter="Content"
        subAfter="Which piece of content actually made you money"
      />
    ),
  },
  { from: 25.0, to: 26.5, render: (d) => <SceneMadeMoney dur={d} /> },
  {
    from: 26.5,
    to: 27.5,
    render: (d) => (
      <SceneSidebarClick
        dur={d}
        target="sources"
        lineA="And know"
        lineB="which platform"
        titleAfter="Sources"
        subAfter="How each channel feeds your funnel"
      />
    ),
  },
  { from: 27.5, to: 29.0, render: (d) => <SceneMostPlatform dur={d} /> },
  { from: 29.0, to: 30.0, render: (d) => <SceneTrackLeads dur={d} /> },
  { from: 30.0, to: 31.5, render: (d) => <SceneCallBooked dur={d} /> },
  { from: 31.5, to: 34.5, render: (d) => <SceneOpenContact dur={d} /> },
  { from: 34.5, to: 38.5, render: (d) => <SceneEveryStep dur={d} /> },
  { from: 38.5, to: 40.4, render: (d) => <SceneChips dur={d} /> },
  { from: 40.4, to: 42.0, render: (d) => <SceneAgency dur={d} /> },
  { from: 42.0, to: 45.3, render: (d) => <SceneWorkspace dur={d} /> },
  { from: 45.3, to: 46.5, render: (d) => <SceneYoursToo dur={d} /> },
  { from: 46.5, to: 47.4, render: (d) => <SceneDarkPulse dur={d} /> },
  { from: 47.4, to: 49.4, render: (d) => <SceneLockup dur={d} /> },
  { from: 49.4, to: 52.1, render: (d) => <SceneCTA dur={d} /> },
];

const PulseInline: React.FC = () => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.22em", fontWeight: 500, fontSize: "1.22em", color: C.ink }}>
    <span
      style={{
        width: "0.82em",
        height: "0.82em",
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, ${C.greenBright}, ${C.green} 60%, #0FA74B)`,
        display: "inline-block",
      }}
    />
    Pulse
  </span>
);

export const PulsePromo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {TIMELINE.map((cut, i) => {
      const from = s(cut.from);
      const dur = s(cut.to) - from;
      return (
        <Sequence key={i} from={from} durationInFrames={dur} name={`${String(i + 1).padStart(2, "0")} @${cut.from}s`}>
          {cut.render(dur)}
        </Sequence>
      );
    })}
    <Audio src={staticFile("soundtrack.m4a")} />
  </AbsoluteFill>
);
