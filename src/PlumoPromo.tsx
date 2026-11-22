import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { P, s } from "./pulse/theme";
import { BrandChip } from "./plumo/ui";
import {
  PBranches,
  PChannelsMost,
  PChips,
  PCTA,
  PDarkPulse,
  PEveryDetail,
  PFirstMessage,
  PGraph,
  PHook,
  PLanguages,
  PLine,
  PLockup,
  PLogo,
  PMeet,
  PNewBusiness,
  PNewRequest,
  PNightMan,
  POffline,
  POpenRequest,
  PQuestion,
  PReady,
  PReplies,
  PRequests,
  PSidebarClick,
  PWhatWanted,
  PYoursToo,
  PlumoInline,
} from "./plumo/scenes";

export const PLUMO_DURATION = s(52.1);

/** Same beat grid as the Pulse cut, so the soundtrack lands identically. */
type Cut = { from: number; to: number; dark: boolean; chip?: boolean; render: (dur: number) => React.ReactNode };

const TIMELINE: Cut[] = [
  { from: 0, to: 2.0, dark: true, render: (d) => <PHook dur={d} /> },
  { from: 2.0, to: 3.6, dark: true, render: (d) => <PNightMan dur={d} /> },
  { from: 3.6, to: 6.1, dark: true, render: (d) => <PQuestion dur={d} /> },
  { from: 6.1, to: 8.3, dark: true, render: (d) => <POffline dur={d} /> },
  { from: 8.3, to: 9.0, dark: true, chip: false, render: (d) => <PMeet dur={d} /> },
  { from: 9.0, to: 10.7, dark: true, chip: false, render: (d) => <PLogo dur={d} /> },
  { from: 10.7, to: 12.0, dark: false, render: (d) => <PReplies dur={d} /> },
  { from: 12.0, to: 13.3, dark: false, render: (d) => <PLanguages dur={d} /> },
  { from: 13.3, to: 15.5, dark: false, render: (d) => <PFirstMessage dur={d} /> },
  {
    from: 15.5,
    to: 17.0,
    dark: false,
    render: (d) => (
      <PLine
        dur={d}
        size={84}
        lines={[
          [
            { text: "Всё", at: 0 },
            { text: "это", at: 4 },
            { text: "делает", at: 8 },
          ],
          [{ pill: <PlumoInline />, at: 13, color: "transparent" }],
        ]}
      />
    ),
  },
  { from: 17.0, to: 19.0, dark: false, render: (d) => <PGraph dur={d} /> },
  {
    from: 19.0,
    to: 20.0,
    dark: false,
    render: (d) => (
      <PLine
        dur={d}
        size={130}
        weight={800}
        lines={[
          [
            { text: "И", at: 0 },
            { text: "всё!", at: 12 },
          ],
        ]}
      />
    ),
  },
  { from: 20.0, to: 21.0, dark: false, render: (d) => <PReady dur={d} /> },
  {
    from: 21.0,
    to: 23.3,
    dark: true,
    render: (d) => (
      <PLine
        dur={d}
        dark
        size={92}
        weight={800}
        exitBlur
        lines={[
          [{ text: "Хватит", at: 0 }],
          [{ text: "терять", at: 12 }, { text: "клиентов", at: 22 }],
          [{ pill: "ночью.", at: 34, color: P.blue, textColor: "#fff" }],
        ]}
      />
    ),
  },
  {
    from: 23.3,
    to: 25.0,
    dark: false,
    render: (d) => <PSidebarClick dur={d} target="dialogs" lineA="Смотри, кто" lineB="тебе написал" title="Диалоги" sub="Кто написал и что хотел" />,
  },
  { from: 25.0, to: 26.5, dark: false, render: (d) => <PWhatWanted dur={d} /> },
  {
    from: 26.5,
    to: 27.5,
    dark: false,
    render: (d) => <PSidebarClick dur={d} target="channels" lineA="И знай, какой" lineB="канал" title="Каналы" sub="Откуда приходят клиенты" />,
  },
  { from: 27.5, to: 29.0, dark: false, render: (d) => <PChannelsMost dur={d} /> },
  { from: 29.0, to: 30.0, dark: false, render: (d) => <PRequests dur={d} /> },
  { from: 30.0, to: 31.5, dark: false, render: (d) => <PNewRequest dur={d} /> },
  { from: 31.5, to: 34.5, dark: false, render: (d) => <POpenRequest dur={d} /> },
  { from: 34.5, to: 38.5, dark: true, render: (d) => <PEveryDetail dur={d} /> },
  { from: 38.5, to: 40.4, dark: false, render: (d) => <PChips dur={d} /> },
  { from: 40.4, to: 42.0, dark: false, render: (d) => <PBranches dur={d} /> },
  { from: 42.0, to: 45.3, dark: false, render: (d) => <PNewBusiness dur={d} /> },
  { from: 45.3, to: 46.5, dark: false, render: (d) => <PYoursToo dur={d} /> },
  { from: 46.5, to: 47.4, dark: true, chip: false, render: (d) => <PDarkPulse dur={d} /> },
  { from: 47.4, to: 49.4, dark: true, chip: false, render: (d) => <PLockup dur={d} /> },
  { from: 49.4, to: 52.1, dark: true, chip: false, render: (d) => <PCTA dur={d} /> },
];

/** "plumo.ai" chip pinned at the top, like in the Plumo reels. */
const TopChip: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const cut = TIMELINE.find((c) => t >= c.from && t < c.to) ?? TIMELINE[0];
  const show = cut.chip !== false;
  const o = show ? interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }) : 0;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 70, opacity: o, pointerEvents: "none" }}>
      <BrandChip dark={cut.dark} />
    </AbsoluteFill>
  );
};

export const PlumoPromo: React.FC = () => (
  <AbsoluteFill style={{ background: "#02030C" }}>
    {TIMELINE.map((cut, i) => {
      const from = s(cut.from);
      const dur = s(cut.to) - from;
      return (
        <Sequence key={i} from={from} durationInFrames={dur} name={`${String(i + 1).padStart(2, "0")} @${cut.from}s`}>
          {cut.render(dur)}
        </Sequence>
      );
    })}
    <TopChip />
    <Audio src={staticFile("soundtrack.m4a")} />
  </AbsoluteFill>
);
