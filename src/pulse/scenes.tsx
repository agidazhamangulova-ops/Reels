import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, fontFamily } from "./theme";
import { CountPill, KineticLine, Token, Typewriter, TypingPill } from "./text";
import {
  AppWindow,
  ContactsPage,
  ContentTable,
  Cursor,
  Dot,
  FunnelCanvas,
  JourneyPanel,
  Notification,
  NotifIcon,
  OverviewPage,
  PageTitle,
  SOURCES,
  SourceCard,
  SourcesPage,
  Sidebar,
  StatsCard,
  RevenueCard,
  WorkspaceDropdown,
  WorkspaceModal,
  useCursorPath,
} from "./ui";
import { CalMark, IconArrowRight, IconMail } from "./icons";

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

/** Keyframed interpolation helper: k([[frame, value], ...]) */
const useK = (keys: [number, number][], e = Easing.inOut(Easing.cubic)) => {
  const frame = useCurrentFrame();
  return interpolate(frame, keys.map((k) => k[0]), keys.map((k) => k[1]), { ...clamp, easing: e });
};

const Center: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", ...style }}>{children}</AbsoluteFill>
);

const Black: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: C.black }}>{children}</AbsoluteFill>
);
const White: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "#fff" }}>{children}</AbsoluteFill>
);

/** Fade a whole scene out over its last frames. */
const useExit = (dur: number, len = 6) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [dur - len, dur], [1, 0], clamp);
};

const words = (text: string, start: number, step: number, color?: string): Token[] =>
  text.split(" ").map((w, i) => ({ text: w, at: start + i * step, color }));

/* ================================================================== */
/* 1. "You just got [22] warm leads"                                   */
/* ================================================================== */
export const SceneHook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  // final beat: the pill grows into the green card that becomes the footage
  const grow = interpolate(frame, [dur - 8, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const textOut = interpolate(frame, [dur - 10, dur - 2], [1, 0], clamp);
  return (
    <Black>
      <Center>
        <div style={{ transform: `scale(${1 + grow * 0.15})`, opacity: textOut }}>
          <KineticLine
            size={46}
            tokens={[
              { text: "You", at: 0 },
              { text: "just", at: 9 },
              { text: "got", at: 12 },
              { pill: <CountPill from={0} to={22} start={15} dur={18} />, at: 15 },
              { text: "warm", at: 40 },
              { text: "leads", at: 44 },
            ]}
          />
        </div>
      </Center>
      <Center>
        <div
          style={{
            width: interpolate(grow, [0, 1], [40, 1500]),
            height: interpolate(grow, [0, 1], [40, 900]),
            borderRadius: interpolate(grow, [0, 1], [8, 60]),
            background: `linear-gradient(180deg, ${C.green}, #0A3D1F)`,
            opacity: grow > 0 ? 1 : 0,
          }}
        />
      </Center>
    </Black>
  );
};

/* ================================================================== */
/* 2/4. Live-action footage taken from the source edit                  */
/* ================================================================== */
export const SceneFootage: React.FC<{ src: string }> = ({ src }) => (
  <Black>
    <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </Black>
);

/* ================================================================== */
/* 3. "But which video actually [sent them?]"                           */
/* ================================================================== */
export const SceneQuestion: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const circle = interpolate(frame, [0, 7], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const exit = useExit(dur, 4);
  return (
    <Black>
      {circle > 0 ? (
        <Center>
          <Dot size={360 * circle + 20} style={{ opacity: Math.min(1, circle * 3) }} />
        </Center>
      ) : null}
      <Center style={{ opacity: exit }}>
        {frame >= 6 ? (
          <Typewriter
            text="But which video actually"
            start={8}
            cps={1.45}
            size={46}
            afterAt={45}
            after={<TypingPill text="sent them?" start={45} cps={1.3} />}
          />
        ) : null}
      </Center>
    </Black>
  );
};

/* ================================================================== */
/* 5. "Meet"                                                            */
/* ================================================================== */
export const SceneMeet: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, dur], [1.25, 1.0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const blur = interpolate(frame, [0, 10], [24, 3], clamp);
  const glow = interpolate(frame, [0, dur], [0.3, 1], clamp);
  return (
    <Black>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 70% at ${30 + frame * 0.6}% 95%, rgba(34,216,106,${0.75 * glow}) 0%, rgba(10,80,40,${0.5 * glow}) 35%, #000 70%)`,
        }}
      />
      <Center>
        <div
          style={{
            fontFamily,
            fontWeight: 600,
            fontSize: 380,
            letterSpacing: "-0.06em",
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)`,
            background: `linear-gradient(90deg, ${C.greenBright} 0%, #2B6B47 55%, #9AE8B9 100%)`,
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          {"Meet".split("").map((ch, i) => {
            const o = interpolate(frame, [i * 2, i * 2 + 6], [0, 1], clamp);
            return (
              <span key={i} style={{ opacity: o }}>
                {ch}
              </span>
            );
          })}
        </div>
      </Center>
    </Black>
  );
};

/* ================================================================== */
/* 6. Pulse logo reveal (rings → dot → wordmark)                        */
/* ================================================================== */
const Rings: React.FC<{ t: number; base?: number }> = ({ t, base = 900 }) => (
  <>
    {[0, 1, 2].map((i) => {
      const s = (t + i * 0.33) % 1;
      return (
        <Center key={i}>
          <div
            style={{
              width: base * (0.35 + s),
              height: base * (0.35 + s),
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(0,0,0,0) 45%, rgba(21,196,90,${0.55 * (1 - s)}) 62%, rgba(0,0,0,0) 72%)`,
            }}
          />
        </Center>
      );
    })}
  </>
);

export const SceneLogo: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ringT = frame / 30;
  const ringsOpacity = interpolate(frame, [0, 4, 12, 18], [0, 1, 1, 0], clamp);
  const pop = spring({ frame, fps, config: { damping: 12 } });
  const dotSize = interpolate(frame, [0, 14], [230, 90], { ...clamp, easing: ease });
  const slide = interpolate(frame, [12, 22], [0, 1], { ...clamp, easing: ease });
  const letters = "Pulse".split("");
  return (
    <Black>
      <div style={{ opacity: ringsOpacity }}>
        <Rings t={ringT} />
      </div>
      <Center>
        <div style={{ display: "flex", alignItems: "center", gap: 26 * slide }}>
          <Dot size={dotSize * (0.6 + 0.4 * pop)} />
          <div
            style={{
              fontFamily,
              fontSize: 96,
              fontWeight: 500,
              letterSpacing: "-0.04em",
              color: "#fff",
              display: "flex",
              maxWidth: 400 * slide,
              overflow: "visible",
            }}
          >
            {letters.map((ch, i) => {
              const o = interpolate(frame, [14 + i * 2, 20 + i * 2], [0, 1], clamp);
              return (
                <span key={i} style={{ opacity: o, filter: `blur(${(1 - o) * 8}px)` }}>
                  {ch}
                </span>
              );
            })}
          </div>
        </div>
      </Center>
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [dur - 3, dur], [0, 1], clamp) }} />
    </Black>
  );
};

/* ================================================================== */
/* 7. "It lets you [track conversions]" + overview                      */
/* ================================================================== */
const STATS_A = { revenue: "$30,797.00", customers: "19", calls: "44", leads: "212", days: "19.7" };

export const SceneTrackConversions: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const scale = useK([[0, 1.5], [12, 1.02], [dur, 0.98]], ease);
  const y = useK([[0, -40], [12, 170], [dur, 180]], ease);
  const x = useK([[0, 220], [12, 0]], ease);
  const chart = interpolate(frame, [8, dur], [0.15, 1], clamp);
  const n = Math.round(interpolate(frame, [0, 12], [29003, 30797], clamp));
  return (
    <White>
      <Center>
        <div style={{ transform: `translate(${x}px, ${y}px) scale(${scale})` }}>
          <AppWindow active="overview" height={900}>
            <OverviewPage stats={{ ...STATS_A, revenue: `$${n.toLocaleString("en-US")}.00` }} chart={chart} seed="a" />
          </AppWindow>
        </div>
      </Center>
      <AbsoluteFill style={{ top: 34, height: 80 }}>
        <KineticLine
          size={44}
          color={C.ink}
          tokens={[
            { text: "It", at: 6 },
            { text: "lets", at: 8 },
            { text: "you", at: 10 },
            { pill: "track conversions", at: 13 },
          ]}
        />
      </AbsoluteFill>
    </White>
  );
};

/* ================================================================== */
/* 8. "from your / organic content."                                    */
/* ================================================================== */
const TwoLine: React.FC<{
  a: Token[];
  b: Token[];
  size?: number;
  align?: "left" | "center";
  style?: React.CSSProperties;
}> = ({ a, b, size = 46, align = "left", style }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: align === "left" ? "flex-start" : "center", gap: 0, lineHeight: 1.05, ...style }}>
    <KineticLine size={size} color={C.ink} tokens={a} align={align} />
    <KineticLine size={size} color={C.green} tokens={b} align={align} />
  </div>
);

export const SceneOrganic: React.FC<{ dur: number }> = ({ dur }) => {
  const x = useK([[0, -80], [dur, -160]], Easing.linear);
  const y = useK([[0, -360], [14, -500]], ease);
  return (
    <White>
      <div style={{ position: "absolute", left: 120, top: 0, transform: `translate(${x}px, ${y}px) scale(1.0)` }}>
        <AppWindow active="overview" width={1300} height={1500} dots={false}>
          <OverviewPage stats={STATS_A} chart={1} seed="a" />
        </AppWindow>
      </div>
      <div style={{ position: "absolute", left: 1330, top: 470 }}>
        <TwoLine a={[{ text: "from", at: 0 }, { text: "your", at: 6 }]} b={words("organic content.", 10, 4, C.green)} size={50} />
      </div>
    </White>
  );
};

/* ================================================================== */
/* 9. "From first touch … to conversion." (sources column)              */
/* ================================================================== */
export const SceneFirstTouch: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const y = useK([[0, 60], [dur, -330]], Easing.inOut(Easing.quad));
  const draw = interpolate(frame, [0, 20], [0.3, 1], clamp);
  return (
    <White>
      <div style={{ position: "absolute", left: 960 - 280, top: 0, transform: `translateY(${y}px)`, display: "flex", flexDirection: "column", gap: 22 }}>
        {[SOURCES[0], SOURCES[0], SOURCES[2], SOURCES[4]].map((d, i) => (
          <div key={i} style={{ opacity: i === 0 ? 0.35 : 1 }}>
            <SourceCard d={{ ...d, stats: i === 0 ? ["171 Clicks", "9 Leads", "0 Calls", "0 Customers"] : d.stats }} width={560} draw={draw} />
          </div>
        ))}
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#fff 0%,rgba(255,255,255,0) 18%,rgba(255,255,255,0) 82%,#fff 100%)" }} />
      <div style={{ position: "absolute", left: 120, top: 510 }}>
        <KineticLine size={40} color={C.ink} weight={400} tokens={words("From first touch", 2, 4)} align="left" />
      </div>
      <div style={{ position: "absolute", right: 140, top: 510 }}>
        <KineticLine size={40} color={C.ink} weight={400} tokens={words("to conversion.", 26, 5)} align="left" />
      </div>
    </White>
  );
};

/* ================================================================== */
/* Simple centred kinetic line on white / black                         */
/* ================================================================== */
export const SceneLine: React.FC<{
  dur: number;
  tokens: Token[];
  dark?: boolean;
  size?: number;
  weight?: number;
  exitBlur?: boolean;
}> = ({ dur, tokens, dark, size = 50, weight = 500, exitBlur }) => {
  const frame = useCurrentFrame();
  const out = exitBlur ? interpolate(frame, [dur - 6, dur], [0, 1], clamp) : 0;
  const Bg = dark ? Black : White;
  return (
    <Bg>
      <Center style={{ opacity: 1 - out, filter: `blur(${out * 10}px)` }}>
        <KineticLine size={size} weight={weight} color={dark ? "#fff" : C.ink} tokens={tokens} />
      </Center>
    </Bg>
  );
};

/* ================================================================== */
/* 11. Funnel builder in perspective                                    */
/* ================================================================== */
export const SceneFunnel: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [4, 30], [0, 1], { ...clamp, easing: ease });
  const rotY = useK([[0, -28], [dur, -16]], Easing.out(Easing.quad));
  const scale = useK([[0, 2.1], [dur, 1.65]], Easing.out(Easing.quad));
  const cur = useCursorPath([
    { f: 0, x: 860, y: 420 },
    { f: 20, x: 700, y: 330 },
    { f: 40, x: 820, y: 520 },
    { f: dur, x: 760, y: 560 },
  ]);
  return (
    <White>
      <AbsoluteFill style={{ perspective: 1800 }}>
        <Center>
          <div style={{ transform: `rotateY(${rotY}deg) rotateX(8deg) scale(${scale})`, transformStyle: "preserve-3d" }}>
            <div style={{ display: "flex", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden", fontFamily }}>
              <Sidebar active="funnel" />
              <div>
                <div style={{ height: 50, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 18px", fontSize: 13 }}>
                  Creator Funnel
                </div>
                <FunnelCanvas draw={draw} width={1000} height={620} />
              </div>
            </div>
          </div>
        </Center>
      </AbsoluteFill>
      <Cursor x={cur.x} y={cur.y} size={44} />
    </White>
  );
};

/* ================================================================== */
/* 13. "You're ready to go." + overview                                 */
/* ================================================================== */
export const SceneReady: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const y = useK([[0, 380], [12, 230]], ease);
  const chart = interpolate(frame, [0, dur], [0.4, 1], clamp);
  return (
    <White>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70 }}>
        <KineticLine size={44} color={C.ink} weight={500} tokens={words("You're ready to go.", 0, 4)} />
      </div>
      <div style={{ position: "absolute", left: 960 - 700 * 0.82, top: y, transform: "scale(0.82)", transformOrigin: "0 0" }}>
        <AppWindow active="overview" height={1000}>
          <OverviewPage stats={{ revenue: "$30,534.82", customers: "18", calls: "43", leads: "209", days: "18.8" }} chart={chart} seed="b" />
        </AppWindow>
      </div>
    </White>
  );
};

/* ================================================================== */
/* 15/17. Sidebar close-up with cursor + left text                      */
/* ================================================================== */
export const SceneSidebarClick: React.FC<{
  dur: number;
  target: "content" | "sources";
  lineA: string;
  lineB: string;
  titleAfter: string;
  subAfter: string;
}> = ({ dur, target, lineA, lineB, titleAfter, subAfter }) => {
  const frame = useCurrentFrame();
  const targetY = target === "content" ? 452 : 500;
  const cur = useCursorPath([
    { f: 0, x: 980, y: 760 },
    { f: Math.round(dur * 0.55), x: 640, y: targetY },
    { f: dur, x: 650, y: targetY + 6 },
  ]);
  const clickF = Math.round(dur * 0.6);
  const clicked = frame >= clickF;
  const press = interpolate(frame, [clickF - 2, clickF, clickF + 3], [0, 1, 0], clamp);
  const scale = useK([[0, 2.0], [dur, 1.85]], Easing.linear);
  return (
    <White>
      <div style={{ position: "absolute", left: 420, top: 120, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
        <div style={{ display: "flex", background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden", fontFamily, height: 460 }}>
          <Sidebar active={clicked ? target : "overview"} />
          <div style={{ width: 600, padding: "0 0 0 0" }}>
            <div style={{ height: 50, borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 18px", fontSize: 13 }}>
              Creator Funnel
            </div>
            <div style={{ padding: "20px 22px" }}>
              <PageTitle title={clicked ? titleAfter : "Overview"} sub={clicked ? subAfter : "What your content earned in this period"} />
              <div style={{ width: 600 }}>
                <StatsCard stats={STATS_A} height={130} />
              </div>
              <RevenueCard progress={1} seed="a" height={180} />
            </div>
          </div>
        </div>
      </div>
      <Cursor x={cur.x} y={cur.y} size={48} press={press} />
      <div style={{ position: "absolute", left: 90, top: 470 }}>
        <TwoLine a={words(lineA, 0, 3)} b={words(lineB, 9, 3, C.green)} size={44} />
      </div>
    </White>
  );
};

/* ================================================================== */
/* 16. "that actually made you money." + content table                  */
/* ================================================================== */
export const SceneMadeMoney: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const hp = interpolate(frame, [8, 18], [0, 1], { ...clamp, easing: ease });
  const scale = useK([[0, 1.05], [dur, 1.12]], Easing.linear);
  return (
    <White>
      <div style={{ position: "absolute", left: 0, right: 0, top: 22 }}>
        <KineticLine
          size={42}
          color={C.ink}
          weight={500}
          tokens={[
            { text: "that", at: 0 },
            { text: "actually", at: 3 },
            { text: "made", at: 7, color: C.green },
            { text: "you", at: 10, color: C.green },
            { text: "money.", at: 13, color: C.green },
          ]}
        />
      </div>
      <div style={{ position: "absolute", left: 960 - 700 * scale, top: 110, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
        <AppWindow active="content" height={980}>
          <ContentTable highlight={0} highlightProgress={hp} />
        </AppWindow>
      </div>
    </White>
  );
};

/* ================================================================== */
/* 18. Sources grid + "makes you / the most."                           */
/* ================================================================== */
export const SceneMostPlatform: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const x = useK([[0, -360], [dur, -420]], Easing.linear);
  const draw = interpolate(frame, [0, 24], [0, 1], clamp);
  return (
    <White>
      <div style={{ position: "absolute", left: 0, top: -40, transform: `translateX(${x}px) scale(1.25)`, transformOrigin: "0 0" }}>
        <AppWindow active="sources" width={1400} height={900}>
          <SourcesPage draw={draw} />
        </AppWindow>
      </div>
      <div style={{ position: "absolute", left: 1330, top: 440, background: "rgba(255,255,255,0.85)", padding: 20 }}>
        <TwoLine a={words("makes you", 2, 4)} b={words("the most.", 10, 4, C.green)} size={50} />
      </div>
    </White>
  );
};

/* ================================================================== */
/* 19. "[Track] your leads." + contacts                                 */
/* ================================================================== */
export const SceneTrackLeads: React.FC<{ dur: number }> = ({ dur }) => {
  const y = useK([[0, 300], [12, 200], [dur, 190]], ease);
  return (
    <White>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70 }}>
        <KineticLine
          size={44}
          color={C.ink}
          tokens={[
            { pill: "Track", at: 0 },
            { text: "your", at: 5 },
            { text: "leads.", at: 8 },
          ]}
        />
      </div>
      <div style={{ position: "absolute", left: 960 - 700 * 0.9, top: y, transform: "scale(0.9)", transformOrigin: "0 0" }}>
        <AppWindow active="contacts" height={980}>
          <ContactsPage />
        </AppWindow>
      </div>
    </White>
  );
};

/* ================================================================== */
/* 20. Call Booked notification over blurred contacts                    */
/* ================================================================== */
export const SceneCallBooked: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 4, fps, config: { damping: 13 } });
  const g = interpolate(frame, [0, dur], [0.4, 1], clamp);
  return (
    <White>
      <div style={{ position: "absolute", left: 960 - 700 * 0.9, top: 190, transform: "scale(0.9)", transformOrigin: "0 0", filter: "blur(3px)", opacity: 0.6 }}>
        <AppWindow active="contacts" height={980}>
          <ContactsPage />
        </AppWindow>
      </div>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,0) 35%, rgba(255,255,255,0.6) 55%, rgba(34,216,106,${0.55 * g}) 85%, rgba(21,196,90,${0.9 * g}) 100%)`,
        }}
      />
      <Center>
        <div style={{ transform: `translateY(${(1 - pop) * 60}px) scale(${0.9 + 0.1 * pop})`, opacity: pop }}>
          <Notification
            width={560}
            icon={<CalMark size={52} />}
            title="Call Booked"
            body="Someone booked a call with you?"
            style={{ padding: "18px 22px", borderRadius: 20 }}
          />
        </div>
      </Center>
    </White>
  );
};

/* ================================================================== */
/* 21. Contacts table → open Rachel Simmons                             */
/* ================================================================== */
export const SceneOpenContact: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cur = useCursorPath([
    { f: 0, x: 520, y: 760 },
    { f: 20, x: 480, y: 545 },
    { f: dur, x: 490, y: 552 },
  ]);
  const clickF = 24;
  const panel = spring({ frame: frame - clickF, fps, config: { damping: 16 } });
  const scale = useK([[0, 1.55], [dur, 1.7]], Easing.linear);
  const press = interpolate(frame, [clickF - 2, clickF, clickF + 3], [0, 1, 0], clamp);
  return (
    <White>
      <div style={{ position: "absolute", left: -260, top: -420, transform: `scale(${scale})`, transformOrigin: "35% 45%" }}>
        <AppWindow active="contacts" height={1080}>
          <ContactsPage hoverRow={frame > 14 ? 2 : -1} />
          {frame >= clickF ? (
            <div style={{ position: "absolute", left: 140, top: 300, transform: `translateY(${(1 - panel) * 30}px)`, opacity: panel }}>
              <JourneyPanel width={480} scroll={interpolate(frame, [clickF + 20, dur], [0, 40], clamp)} />
            </div>
          ) : null}
        </AppWindow>
      </div>
      <Cursor x={cur.x} y={cur.y} size={46} press={press} />
    </White>
  );
};

/* ================================================================== */
/* 22. "See every single step they took before deciding to reach out."  */
/* ================================================================== */
export const SceneEveryStep: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const x = useK([[0, 520], [14, 0]], ease);
  const g = interpolate(frame, [0, 30], [0, 1], clamp);
  const scroll = interpolate(frame, [10, dur], [40, 160], clamp);
  return (
    <White>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 80% at 100% 100%, rgba(21,196,90,${0.95 * g}) 0%, rgba(34,216,106,${0.45 * g}) 35%, rgba(255,255,255,0) 70%)`,
        }}
      />
      <div style={{ position: "absolute", left: 1000 + x, top: 90 }}>
        <div style={{ transform: "scale(1.45)", transformOrigin: "0 0" }}>
          <JourneyPanel width={520} scroll={scroll} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 100, top: 455 }}>
        <KineticLine
          size={44}
          color={C.ink}
          align="left"
          tokens={[
            { text: "See", at: 0 },
            { text: "every", at: 12, color: C.green },
            { text: "single", at: 15, color: C.green },
            { text: "step", at: 20, color: C.green },
            { text: "they", at: 26 },
            { text: "took", at: 30 },
          ]}
        />
        <KineticLine size={44} color={C.ink} align="left" tokens={words("before deciding to reach out.", 40, 5)} />
      </div>
    </White>
  );
};

/* ================================================================== */
/* 23. Funnel stat chips strip                                           */
/* ================================================================== */
const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      background: "#111",
      color: "#fff",
      fontFamily,
      fontSize: 66,
      fontWeight: 400,
      letterSpacing: "-0.03em",
      padding: "14px 26px",
      borderRadius: 14,
      whiteSpace: "nowrap",
      border: "3px solid #fff",
      boxShadow: "0 0 0 2px #111",
    }}
  >
    {children}
  </div>
);
const Step: React.FC<{ pct: string }> = ({ pct }) => (
  <div style={{ position: "relative", width: 120, height: 140, margin: "0 -6px", zIndex: 2 }}>
    <div style={{ position: "absolute", inset: 0, background: C.green, borderRadius: 18, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 22 }}>
      <IconArrowRight size={44} color="#111" />
    </div>
    <div
      style={{
        position: "absolute",
        left: 8,
        right: 8,
        bottom: -18,
        background: "#fff",
        border: `5px solid ${C.green}`,
        borderRadius: 16,
        fontFamily,
        fontSize: 34,
        fontWeight: 500,
        textAlign: "center",
        padding: "4px 0",
        color: "#111",
      }}
    >
      {pct}
    </div>
  </div>
);

const Num: React.FC<{ to: number; start: number; suffix?: string; fmt?: (n: number) => string }> = ({ to, start, suffix = "", fmt }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame - start, [0, 18], [to * 0.55, to], { ...clamp, easing: Easing.out(Easing.quad) });
  return <>{(fmt ? fmt(v) : Math.round(v).toString()) + suffix}</>;
};

export const SceneChips: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const x = useK([[0, 500], [dur - 8, -2240], [dur, -2280]], Easing.inOut(Easing.quad));
  return (
    <White>
      <Center>
        <div style={{ display: "flex", alignItems: "center", transform: `scale(1.25) translateX(${x}px)`, width: 4200, justifyContent: "flex-start", marginLeft: 4200 - 1920 }}>
          <Chip>
            <Num to={2.7} start={0} fmt={(n) => n.toFixed(1)} suffix="K Clicks" />
          </Chip>
          <Step pct="6.5%" />
          <Chip>
            <Num to={177} start={8} /> Leads
          </Chip>
          <Step pct="12%" />
          <Chip>
            <Num to={28} start={18} /> Calls
          </Chip>
          <Step pct="41%" />
          <Chip>
            <Num to={16} start={28} /> Customers
          </Chip>
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginLeft: 70, opacity: interpolate(frame, [dur - 22, dur - 14], [0, 1], clamp) }}>
            <Dot size={70} />
            <span style={{ fontFamily, fontSize: 70, fontWeight: 500, letterSpacing: "-0.04em", color: C.ink }}>Pulse</span>
          </div>
        </div>
      </Center>
    </White>
  );
};

/* ================================================================== */
/* 24. "Own a content [agency?]"                                        */
/* ================================================================== */
export const SceneAgency: React.FC<{ dur: number }> = ({ dur }) => (
  <SceneLine
    dur={dur}
    size={48}
    tokens={[
      { text: "Own", at: 0 },
      { text: "a", at: 10 },
      { text: "content", at: 13 },
      { pill: <TypingPillInline text="agency?" start={20} />, at: 18 },
    ]}
  />
);
const TypingPillInline: React.FC<{ text: string; start: number }> = ({ text, start }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - start) / 1.5)));
  return <span style={{ whiteSpace: "pre" }}>{text.slice(0, n) || " "}</span>;
};

/* ================================================================== */
/* 25. New workspace flow                                               */
/* ================================================================== */
export const SceneWorkspace: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // phases (local frames)
  const openModal = 22;
  const clickCreate = 58;
  const newDash = 66;
  const type = (txt: string, start: number) => txt.slice(0, Math.max(0, Math.min(txt.length, Math.floor((frame - start) / 1.2))));
  const modalPop = spring({ frame: frame - openModal, fps, config: { damping: 15 } });
  const cur = useCursorPath([
    { f: 0, x: 700, y: 720 },
    { f: 16, x: 560, y: 590 },
    { f: openModal + 4, x: 560, y: 590 },
    { f: clickCreate - 6, x: 1190, y: 735 },
    { f: clickCreate + 6, x: 1190, y: 735 },
    { f: dur, x: 1240, y: 660 },
  ]);
  const press1 = interpolate(frame, [openModal - 2, openModal, openModal + 3], [0, 1, 0], clamp);
  const press2 = interpolate(frame, [clickCreate - 2, clickCreate, clickCreate + 3], [0, 1, 0], clamp);
  const zoom = useK([[0, 1.45], [openModal, 1.15], [newDash, 1.0], [dur, 0.95]], ease);
  const sweep = interpolate(frame, [newDash, newDash + 22], [0, 1], clamp);
  const isNew = frame >= newDash;
  return (
    <White>
      <Center>
        <div style={{ transform: `scale(${zoom})`, position: "relative" }}>
          <AppWindow
            active="overview"
            height={880}
            workspace={isNew ? "Social media organic ..." : "Creator Funnel"}
            workspaceLabel={isNew ? "ADAM CLIENT" : "MY WORKSPACE"}
            title={isNew ? "Social media organic campaign - Q3" : "Creator Funnel"}
          >
            <OverviewPage
              stats={isNew ? { revenue: "$104,644.55", customers: "163", calls: "183", leads: "545", days: "<1" } : STATS_A}
              chart={isNew ? interpolate(frame, [newDash, dur], [0.2, 1], clamp) : 1}
              seed={isNew ? "new" : "a"}
            />
          </AppWindow>
          {frame < openModal + 2 ? (
            <div style={{ position: "absolute", left: 14, top: 100 }}>
              <WorkspaceDropdown hover={frame > 14} />
            </div>
          ) : null}
          {frame >= openModal && !isNew ? (
            <>
              <AbsoluteFill style={{ background: "rgba(0,0,0,0.12)", borderRadius: 14 }} />
              <div style={{ position: "absolute", left: 480, top: 170, opacity: modalPop, transform: `scale(${0.94 + 0.06 * modalPop})` }}>
                <WorkspaceModal name={type("Adam Client", openModal + 6)} funnel={type("Social media organic campaign - Q3", openModal + 18)} press={press2} />
              </div>
            </>
          ) : null}
          {sweep > 0 && sweep < 1 ? (
            <AbsoluteFill
              style={{
                borderRadius: 14,
                background: `linear-gradient(90deg, rgba(255,255,255,0) ${sweep * 120 - 40}%, rgba(34,216,106,0.35) ${sweep * 120 - 15}%, rgba(255,255,255,0) ${sweep * 120 + 10}%)`,
              }}
            />
          ) : null}
        </div>
      </Center>
      <Cursor x={cur.x} y={cur.y} size={44} press={Math.max(press1, press2)} />
    </White>
  );
};

/* ================================================================== */
/* 26. "And yours too." + notifications                                 */
/* ================================================================== */
export const SceneYoursToo: React.FC<{ dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: frame - 2, fps, config: { damping: 14 } });
  const b = spring({ frame: frame - 8, fps, config: { damping: 14 } });
  const drift = interpolate(frame, [0, 36], [0, -40], clamp);
  return (
    <White>
      <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, transform: `translateX(${drift}px)` }}>
        <div style={{ position: "absolute", left: 980, top: 400 }}>
          <KineticLine size={60} color={C.ink} tokens={words("And yours too.", 0, 4)} align="left" style={{ transform: "translateX(-100%)" }} />
        </div>
        <div style={{ position: "absolute", left: 1060, top: 250, display: "flex", flexDirection: "column", gap: 18, transform: "scale(1.35)", transformOrigin: "0 0" }}>
          <div style={{ opacity: a * 0.55, transform: `translateY(${(1 - a) * 40}px) scale(0.94)` }}>
            <Notification width={500} icon={<NotifIcon bg="linear-gradient(180deg,#5AB0FF,#1E73E8)"><IconMail size={22} color="#fff" /></NotifIcon>} title="Email" body="Mike: Deal done" />
          </div>
          <div style={{ opacity: b, transform: `translateY(${(1 - b) * 40}px)` }}>
            <Notification
              width={520}
              icon={
                <NotifIcon bg="#111">
                  <div style={{ width: 24, height: 18, borderRadius: 3, background: "linear-gradient(180deg,#F5B52E 0 33%,#3CC06A 33% 66%,#E8483E 66%)" }} />
                </NotifIcon>
              }
              title="Wallet Payment received"
              body="You have received $60,000 from Trex..."
            />
          </div>
        </div>
      </div>
    </White>
  );
};

/* ================================================================== */
/* 27. Dark rings + light streak                                        */
/* ================================================================== */
export const SceneDarkPulse: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const streak = interpolate(frame, [dur * 0.45, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const dot = interpolate(frame, [0, 8], [0.6, 1], { ...clamp, easing: ease });
  return (
    <Black>
      <div style={{ opacity: 1 - streak }}>
        <Rings t={frame / 26} base={1100} />
      </div>
      <Center>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <div
            style={{
              position: "absolute",
              right: 90,
              width: 900 * streak,
              height: 260,
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(34,216,106,0.9) 85%, #fff 100%)`,
              filter: "blur(6px)",
              opacity: streak,
            }}
          />
          <Dot size={(260 - 120 * streak) * dot} />
        </div>
      </Center>
    </Black>
  );
};

/* ================================================================== */
/* 28. Logo lockup with tagline                                          */
/* ================================================================== */
export const SceneLockup: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [0, 12], [0, 1], { ...clamp, easing: ease });
  const tag = interpolate(frame, [4, 16], [0, 1], { ...clamp, easing: ease });
  const out = interpolate(frame, [dur - 6, dur], [1, 0], clamp);
  return (
    <Black>
      <Center style={{ opacity: out }}>
        <div style={{ display: "flex", alignItems: "center", gap: 26, transform: `translateX(${(1 - reveal) * 120}px)` }}>
          <Dot size={92} />
          <span style={{ fontFamily, fontSize: 100, fontWeight: 500, letterSpacing: "-0.045em", color: "#fff" }}>Pulse</span>
          <div style={{ position: "relative", marginLeft: 10, height: 130, display: "flex", alignItems: "center", overflow: "visible" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 8, background: "#C8F7D9", boxShadow: `0 0 30px ${C.greenBright}` }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: -30,
                bottom: -30,
                width: 320 * tag,
                background: `linear-gradient(90deg, rgba(34,216,106,0.95), rgba(21,196,90,0.35) 60%, rgba(0,0,0,0))`,
                filter: "blur(18px)",
              }}
            />
            <div style={{ position: "relative", paddingLeft: 32, fontFamily, fontSize: 30, lineHeight: 1.15, color: "#fff", opacity: tag, letterSpacing: "-0.02em" }}>
              Intelligent tracking for
              <br />
              content funnels.
            </div>
          </div>
        </div>
      </Center>
    </Black>
  );
};

/* ================================================================== */
/* 29. CTA                                                               */
/* ================================================================== */
export const SceneCTA: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [dur - 22, dur - 4], [1, 0], clamp);
  return (
    <Black>
      <Center style={{ opacity: fade }}>
        <KineticLine
          size={50}
          color="#fff"
          weight={600}
          tokens={[
            { text: "Start", at: 0 },
            { text: "your", at: 6 },
            { pill: "Free trial.", at: 12 },
            { text: "today.", at: 20 },
          ]}
        />
      </Center>
    </Black>
  );
};

