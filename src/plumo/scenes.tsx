import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, P, fontFamily } from "../pulse/theme";
import { CountPill, KineticLine, Token, Typewriter, TypingPill } from "../pulse/text";
import { Cursor, NodeBox, Notification, NotifIcon, useCursorPath } from "../pulse/ui";
import { IconArrowRight, IconMail } from "../pulse/icons";
import {
  BlueBg,
  BusinessDropdown,
  BusinessModal,
  CHANNELS,
  ChannelCard,
  ChannelMark,
  ChatWindow,
  LightBg,
  NavyBg,
  PAppWindow,
  PChannelsPage,
  PDialogsPage,
  POverview,
  PRequestsPage,
  PSidebar,
  PStatsCard,
  PTitle,
  PlumoMark,
  RequestCard,
} from "./ui";

const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** The shared Notification is desktop-sized; zoom it for the vertical frame. */
const ZNotif: React.FC<React.ComponentProps<typeof Notification> & { zoom?: number }> = ({ zoom = 2.1, width = 900, ...rest }) => (
  <div style={{ zoom }}>
    <Notification width={width / zoom} {...rest} />
  </div>
);
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const useK = (keys: [number, number][], e = Easing.inOut(Easing.cubic)) => {
  const frame = useCurrentFrame();
  return interpolate(frame, keys.map((k) => k[0]), keys.map((k) => k[1]), { ...clamp, easing: e });
};

const Center: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", ...style }}>{children}</AbsoluteFill>
);

const words = (text: string, start: number, step: number, color?: string): Token[] =>
  text.split(" ").map((w, i) => ({ text: w, at: start + i * step, color }));

const pill = (content: React.ReactNode, at: number): Token => ({ pill: content, at, color: P.blue, textColor: "#fff" });

/** Stacked lines of kinetic type, each line its own KineticLine. */
const Lines: React.FC<{
  lines: Token[][];
  size: number;
  color?: string;
  weight?: number;
  align?: "center" | "left";
  gap?: number;
}> = ({ lines, size, color = "#fff", weight = 600, align = "center", gap = 0 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", gap, lineHeight: 1.1 }}>
    {lines.map((l, i) => (
      <KineticLine key={i} tokens={l} size={size} color={color} weight={weight} align={align} />
    ))}
  </div>
);

/** Giant headline (Plumo-style): blurred letters landing one by one. */
const BigWord: React.FC<{ text: string; size?: number; start?: number; gradient?: boolean; dark?: boolean }> = ({
  text,
  size = 230,
  start = 0,
  gradient = true,
  dark = true,
}) => {
  const frame = useCurrentFrame();
  const grad = dark ? "linear-gradient(180deg,#FFFFFF 30%,#9DAEFF 100%)" : `linear-gradient(180deg,${P.blue} 20%,#0B1260 100%)`;
  return (
    <div style={{ fontFamily, fontWeight: 800, fontSize: size, letterSpacing: "-0.06em", lineHeight: 1.05, whiteSpace: "nowrap", display: "flex" }}>
      {text.split("").map((ch, i) => {
        const o = interpolate(frame - start - i * 2, [0, 8], [0, 1], clamp);
        return (
          <span key={i} style={{ display: "inline-block", opacity: o, filter: `blur(${(1 - o) * 14}px)`, transform: `scale(${1.25 - 0.25 * o})` }}>
            <span
              style={{
                display: "inline-block",
                background: gradient ? grad : undefined,
                WebkitBackgroundClip: gradient ? "text" : undefined,
                backgroundClip: gradient ? "text" : undefined,
                color: gradient ? "transparent" : dark ? "#fff" : P.ink,
                whiteSpace: "pre",
              }}
            >
              {ch}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/* ================================================================== */
/* 1. Hook: "Ночью пришло [12] заявок"                                  */
/* ================================================================== */
export const PHook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [dur - 8, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const textOut = interpolate(frame, [dur - 10, dur - 2], [1, 0], clamp);
  return (
    <NavyBg glow={0.55}>
      <Center>
        <div style={{ opacity: textOut, transform: `scale(${1 + grow * 0.15})` }}>
          <Lines
            size={78}
            lines={[
              [
                { text: "Ночью", at: 0 },
                { text: "пришло", at: 9 },
              ],
              [pill(<CountPill from={0} to={12} start={15} dur={18} />, 15), { text: "сообщений", at: 38 }],
            ]}
          />
        </div>
      </Center>
      <Center>
        <div
          style={{
            width: interpolate(grow, [0, 1], [60, 1100]),
            height: interpolate(grow, [0, 1], [60, 1500]),
            borderRadius: interpolate(grow, [0, 1], [14, 80]),
            background: `linear-gradient(180deg, ${P.blue}, #0A1060)`,
            opacity: grow > 0 ? 1 : 0,
          }}
        />
      </Center>
    </NavyBg>
  );
};

/* ================================================================== */
/* 2. The man at night (blue-graded) + incoming messages               */
/* ================================================================== */
const Incoming: React.FC<{ at: number; x: number; y: number; name: string; text: string; letter: string; w?: number; dark?: boolean; tilt?: number }> = ({
  at,
  x,
  y,
  name,
  text,
  letter,
  w = 520,
  dark,
  tilt = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - at, fps, config: { damping: 14 } });
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: sp, transform: `translateY(${(1 - sp) * 40}px) scale(${0.85 + 0.15 * sp}) rotate(${tilt}deg)` }}>
      <ZNotif
        width={w}
        dark={dark}
        icon={
          <NotifIcon bg={P.blue} size={40}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, fontFamily }}>{letter}</span>
          </NotifIcon>
        }
        title={name}
        body={text}
        
      />
    </div>
  );
};

export const PNightMan: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: ease });
  const zoom = interpolate(frame, [0, dur], [1.08, 1.0], clamp);
  return (
    <NavyBg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 520,
          height: 1060,
          overflow: "hidden",
          clipPath: `inset(${(1 - open) * 45}% ${(1 - open) * 30}% round ${60 - open * 20}px)`,
        }}
      >
        <OffthreadVideo
          src={staticFile("plumo/man-blue.mp4")}
          muted
          style={{ position: "absolute", left: -120, top: 0, width: 1320, height: 1066, transform: `scale(${zoom})`, transformOrigin: "50% 40%" }}
        />
        <AbsoluteFill style={{ background: "linear-gradient(180deg,#02030C 0%,rgba(2,3,12,0) 22%,rgba(2,3,12,0) 70%,#02030C 100%)" }} />
      </div>
      <div style={{ position: "absolute", top: 210, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily, fontSize: 30, fontWeight: 700, color: "#fff", border: "2px solid rgba(160,180,255,0.8)", borderRadius: 999, padding: "6px 22px", opacity: open }}>
          ночь, Бишкек
        </div>
        <BigWord text="03:07" size={250} start={2} />
      </div>
      <Incoming at={6} x={40} y={900} name="Айдай" letter="А" text="Можно заказать торт на утро?" w={600} />
      <Incoming at={14} x={420} y={1180} name="Эрмек" letter="Э" text="Баасы канча?" w={520} dark tilt={-2} />
      <Incoming at={22} x={70} y={1420} name="Нурлан" letter="Н" text="Голосовое · 0:47" w={480} />
    </NavyBg>
  );
};

/* ================================================================== */
/* 3. "Но кто им ответит [в 3 ночи?]"                                    */
/* ================================================================== */
export const PQuestion: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const circle = interpolate(frame, [0, 7], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const exit = interpolate(frame, [dur - 4, dur], [1, 0], clamp);
  return (
    <NavyBg glow={0.5}>
      {circle > 0 ? (
        <Center>
          <div style={{ width: 400 * circle + 20, height: 400 * circle + 20, borderRadius: "50%", background: P.blue, opacity: Math.min(1, circle * 3) }} />
        </Center>
      ) : null}
      <Center style={{ opacity: exit }}>
        {frame >= 6 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <Typewriter text="Но кто им ответит" start={8} cps={1.7} size={80} accent={P.blueBright} afterAt={9999} />
            {frame >= 40 ? (
              <div style={{ fontFamily, fontSize: 80, fontWeight: 600, letterSpacing: "-0.035em" }}>
                <TypingPill text="в 3 ночи?" start={40} cps={1.6} bg={P.blue} />
              </div>
            ) : null}
          </div>
        ) : null}
      </Center>
    </NavyBg>
  );
};

/* ================================================================== */
/* 4. Manager is offline, messages pile up                              */
/* ================================================================== */
export const POffline: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = Math.min(9, 2 + Math.floor(frame / 9));
  const badge = spring({ frame: frame % 9, fps, config: { damping: 9 } });
  const out = interpolate(frame, [dur - 6, dur], [1, 0], clamp);
  const msgs = [
    ["Айдай", "Ау, вы тут?", "03:21"],
    ["Эрмек", "Жооп бериңизчи", "03:34"],
    ["Айдай", "Ладно, поищу ещё…", "03:52"],
  ];
  return (
    <NavyBg>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: out }}>
        <BigWord text="ТИШИНА" size={200} start={0} />
      </div>
      <div style={{ position: "absolute", top: 640, left: 110, right: 110, opacity: out, display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ background: "rgba(20,22,40,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 26, padding: "24px 28px", fontFamily, color: "#fff" }}>
          <div style={{ fontSize: 30, fontWeight: 700 }}>👤 Менеджер</div>
          <div style={{ fontSize: 34, marginTop: 6, color: "rgba(255,255,255,0.75)" }}>Не в сети с 18:00</div>
        </div>
        {msgs.map(([n, t, tm], i) => {
          const p = interpolate(frame - 8 - i * 12, [0, 8], [0, 1], clamp);
          return (
            <div key={i} style={{ position: "relative", opacity: p, transform: `translateY(${(1 - p) * 30}px)`, background: "#fff", borderRadius: 26, padding: "22px 28px", fontFamily }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: P.ink }}>{n}</span>
                <span style={{ fontSize: 22, color: C.muted }}>{tm}</span>
              </div>
              <div style={{ fontSize: 30, color: "#333", marginTop: 4 }}>{t}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", right: -30, top: 150, width: 92, height: 92, borderRadius: "50%", background: P.blue, color: "#fff", fontFamily, fontWeight: 800, fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.7 + 0.3 * badge})`, boxShadow: "0 0 40px rgba(80,110,255,0.7)" }}>
          {count}
        </div>
        <div style={{ alignSelf: "center", marginTop: 10, fontFamily, fontSize: 30, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.12)", padding: "8px 24px", borderRadius: 999 }}>не прочитано</div>
      </div>
    </NavyBg>
  );
};

/* ================================================================== */
/* 5. "Знакомься"                                                       */
/* ================================================================== */
export const PMeet: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, dur], [1.3, 1.0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const blur = interpolate(frame, [0, 10], [24, 2], clamp);
  return (
    <AbsoluteFill style={{ background: "#02030C" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 45% at ${30 + frame}% 85%, rgba(70,95,255,0.85) 0%, rgba(20,35,140,0.5) 40%, #02030C 75%)` }} />
      <Center>
        <div
          style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 190,
            letterSpacing: "-0.06em",
            transform: `scale(${scale})`,
            filter: `blur(${blur}px)`,
            background: `linear-gradient(90deg, ${P.blueBright} 0%, #2C3FA8 55%, #C8D2FF 100%)`,
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          {"Знакомься".split("").map((ch, i) => (
            <span key={i} style={{ opacity: interpolate(frame, [i * 1.5, i * 1.5 + 6], [0, 1], clamp) }}>
              {ch}
            </span>
          ))}
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 6. Logo reveal                                                       */
/* ================================================================== */
const Rings: React.FC<{ t: number; base?: number; color?: string }> = ({ t, base = 1100, color = "70,95,255" }) => (
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
              background: `radial-gradient(circle, rgba(0,0,0,0) 45%, rgba(${color},${0.6 * (1 - s)}) 62%, rgba(0,0,0,0) 72%)`,
            }}
          />
        </Center>
      );
    })}
  </>
);

export const PLogo: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rings = interpolate(frame, [0, 4, 14, 20], [0, 1, 1, 0], clamp);
  const pop = spring({ frame, fps, config: { damping: 12 } });
  const size = interpolate(frame, [0, 14], [320, 190], { ...clamp, easing: ease });
  const word = interpolate(frame, [12, 24], [0, 1], { ...clamp, easing: ease });
  const tag = interpolate(frame, [24, 34], [0, 1], { ...clamp, easing: ease });
  return (
    <NavyBg glow={0.6}>
      <div style={{ opacity: rings }}>
        <Rings t={frame / 30} />
      </div>
      <Center>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <PlumoMark size={size * (0.6 + 0.4 * pop)} />
          <div style={{ fontFamily, fontSize: 150, fontWeight: 500, letterSpacing: "-0.05em", color: "#fff", display: "flex", height: 170 * word, overflow: "visible" }}>
            {"plumo".split("").map((ch, i) => {
              const o = interpolate(frame, [14 + i * 2, 20 + i * 2], [0, 1], clamp);
              return (
                <span key={i} style={{ opacity: o, filter: `blur(${(1 - o) * 10}px)` }}>
                  {ch}
                </span>
              );
            })}
          </div>
          <div style={{ fontFamily, fontSize: 40, fontWeight: 600, color: "rgba(255,255,255,0.85)", opacity: tag, transform: `translateY(${(1 - tag) * 16}px)` }}>
            ИИ-менеджер, который не спит
          </div>
        </div>
      </Center>
      <AbsoluteFill style={{ background: "#F4F6FF", opacity: interpolate(frame, [dur - 3, dur], [0, 1], clamp) }} />
    </NavyBg>
  );
};

/* ================================================================== */
/* 7. "Он [отвечает за 2 сек]" + live chat                              */
/* ================================================================== */
export const PReplies: React.FC<{ dur: number }> = () => {
  const frame = useCurrentFrame();
  const y = useK([[0, 620], [12, 520]], ease);
  const sec = interpolate(frame, [6, 26], [0, 2], clamp);
  return (
    <LightBg>
      <div style={{ position: "absolute", top: 200, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <KineticLine size={64} color={P.ink} weight={700} tokens={words("Plumo ответил за", 0, 3)} />
        <div style={{ fontFamily, fontWeight: 800, fontSize: 170, letterSpacing: "-0.05em", color: P.blue, lineHeight: 1 }}>
          {sec.toFixed(1)}
          <span style={{ fontSize: 80 }}> сек</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 160, top: y }}>
        <ChatWindow
          width={760}
          height={860}
          typingAt={[8, 22]}
          msgs={[
            { from: "client", text: "Сколько стоит торт на 8 человек?", at: 2 },
            { from: "plumo", text: "Здравствуйте! Шоколадный — 3 200 сом. На какую дату нужен?", at: 22 },
          ]}
        />
      </div>
    </LightBg>
  );
};

/* ================================================================== */
/* 8. "на кыргызском / и русском." — continue chat                      */
/* ================================================================== */
export const PLanguages: React.FC<{ dur: number }> = () => {
  return (
    <LightBg>
      <div style={{ position: "absolute", top: 200, left: 0, right: 0 }}>
        <Lines
          size={84}
          weight={700}
          color={P.ink}
          lines={[
            words("на кыргызском", 0, 4),
            words("и русском.", 8, 4, P.blue),
          ]}
        />
      </div>
      <div style={{ position: "absolute", left: 160, top: 520 }}>
        <ChatWindow
          width={760}
          height={1000}
          typingAt={[12, 22]}
          msgs={[
            { from: "client", text: "Сколько стоит торт на 8 человек?", at: -100 },
            { from: "plumo", text: "Здравствуйте! Шоколадный — 3 200 сом. На какую дату нужен?", at: -100 },
            { from: "client", text: "🎤 Голосовое · Эртең саат 9га", at: 4 },
            { from: "plumo", text: "Макул! Эртең саат 9:00гө жазып койдум ✓", at: 22 },
          ]}
        />
      </div>
    </LightBg>
  );
};

/* ================================================================== */
/* 9. "От первого сообщения … до заявки." channel cards scroll           */
/* ================================================================== */
export const PFirstMessage: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const y = useK([[0, 330], [dur, -1050]], Easing.inOut(Easing.quad));
  const draw = interpolate(frame, [0, 24], [0.3, 1], clamp);
  return (
    <LightBg>
      <div style={{ position: "absolute", left: 170, top: 0, transform: `translateY(${y}px)`, display: "flex", flexDirection: "column", gap: 28 }}>
        {CHANNELS.map((d) => (
          <div key={d.name} style={{ transform: "scale(1.65)", transformOrigin: "0 0", height: 470 }}>
            <ChannelCard d={d} width={450} draw={draw} />
          </div>
        ))}
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#F4F6FF 0%,#F4F6FF 15%,rgba(244,246,255,0) 26%,rgba(244,246,255,0) 72%,#F4F6FF 84%)" }} />
      <div style={{ position: "absolute", top: 170, left: 0, right: 0 }}>
        <KineticLine size={64} color={P.ink} weight={600} tokens={words("От первого сообщения", 2, 4)} />
      </div>
      <div style={{ position: "absolute", bottom: 220, left: 0, right: 0 }}>
        <KineticLine size={64} color={P.blue} weight={700} tokens={words("до готовой заявки.", 28, 4)} />
      </div>
    </LightBg>
  );
};

/* ================================================================== */
/* Generic line scene                                                   */
/* ================================================================== */
export const PLine: React.FC<{
  dur: number;
  lines: Token[][];
  dark?: boolean;
  size?: number;
  weight?: number;
  exitBlur?: boolean;
}> = ({ dur, lines, dark, size = 84, weight = 700, exitBlur }) => {
  const frame = useCurrentFrame();
  const out = exitBlur ? interpolate(frame, [dur - 6, dur], [0, 1], clamp) : 0;
  const Bg = dark ? NavyBg : LightBg;
  return (
    <Bg>
      <Center style={{ opacity: 1 - out, filter: `blur(${out * 10}px)` }}>
        <Lines size={size} weight={weight} color={dark ? "#fff" : P.ink} lines={lines} />
      </Center>
    </Bg>
  );
};

export const PlumoInline: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2em", fontWeight: 600, fontSize: "1.2em", color: dark ? "#fff" : P.ink }}>
    <PlumoMark size={78} variant={dark ? "light" : "dark"} />
    plumo
  </span>
);

/* ================================================================== */
/* 11. Channels → Plumo → manager graph (perspective)                   */
/* ================================================================== */
export const PGraph: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [4, 30], [0, 1], { ...clamp, easing: ease });
  const rotX = useK([[0, 26], [dur, 14]], Easing.out(Easing.quad));
  const scale = useK([[0, 1.25], [dur, 1.0]], Easing.out(Easing.quad));
  const cur = useCursorPath([
    { f: 0, x: 760, y: 1300 },
    { f: 24, x: 600, y: 990 },
    { f: dur, x: 640, y: 1040 },
  ]);
  const W = 900;
  const H = 1100;
  const hub = { x: 450, y: 560 };
  const srcs = [
    { x: 160, y: 200, n: "WhatsApp" },
    { x: 380, y: 160, n: "Instagram" },
    { x: 560, y: 190, n: "Telegram" },
    { x: 760, y: 230, n: "Звонки" },
  ];
  const outs = [
    { x: 260, y: 920, label: "Заявка" },
    { x: 640, y: 920, label: "Менеджер" },
  ];
  const L = 700;
  const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => `M${a.x},${a.y + 40} C${a.x},${(a.y + b.y) / 2} ${b.x},${(a.y + b.y) / 2} ${b.x},${b.y - 60}`;
  return (
    <LightBg>
      <div style={{ position: "absolute", top: 180, left: 0, right: 0 }}>
        <KineticLine size={58} color={P.ink} weight={700} tokens={words("Все каналы — в одном месте", 0, 3)} />
      </div>
      <AbsoluteFill style={{ perspective: 2000 }}>
        <Center>
          <div style={{ transform: `rotateX(${rotX}deg) scale(${scale})`, transformStyle: "preserve-3d", marginTop: 160 }}>
            <div
              style={{
                position: "relative",
                width: W,
                height: H,
                background: "#fff",
                borderRadius: 30,
                border: "1px solid #E6E9F5",
                boxShadow: "0 40px 100px rgba(20,30,120,0.14)",
                backgroundImage: "radial-gradient(#D5D9EA 1.6px, transparent 1.6px)",
                backgroundSize: "30px 30px",
              }}
            >
              <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
                {[...srcs.map((s) => curve(s, hub)), ...outs.map((o) => curve({ x: hub.x, y: hub.y + 40 }, { x: o.x, y: o.y }))].map((d, i) => (
                  <path key={i} d={d} fill="none" stroke="#8C93B5" strokeWidth={2.4} strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />
                ))}
              </svg>
              {srcs.map((s) => (
                <NodeBox key={s.n} x={s.x} y={s.y} size={96}>
                  <ChannelMark name={s.n} size={52} />
                </NodeBox>
              ))}
              <div style={{ position: "absolute", left: hub.x - 80, top: hub.y - 80, width: 160, height: 160, borderRadius: 40, background: P.ink, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 50px rgba(50,80,255,0.35)" }}>
                <PlumoMark size={96} />
              </div>
              {outs.map((o, i) => (
                <div key={o.label} style={{ position: "absolute", left: o.x - 140, top: o.y - 50, width: 280, height: 100, borderRadius: 22, background: i === 0 ? P.blue : "#fff", color: i === 0 ? "#fff" : P.ink, border: "1px solid #E6E9F5", fontFamily, fontSize: 34, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", opacity: interpolate(frame, [20 + i * 4, 28 + i * 4], [0, 1], clamp) }}>
                  {o.label}
                </div>
              ))}
            </div>
          </div>
        </Center>
      </AbsoluteFill>
      <Cursor x={cur.x} y={cur.y} size={64} />
    </LightBg>
  );
};

/* ================================================================== */
/* Dashboard scenes                                                      */
/* ================================================================== */
const STATS = { revenue: "1 284 500 сом", requests: "312", dialogs: "1 847", reply: "2 сек" };

/** Window helper: renders the app at a given scale with its top-left at (x, y). */
const At: React.FC<{ x: number; y: number; scale: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, scale, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `scale(${scale})`, transformOrigin: "0 0", ...style }}>{children}</div>
);

export const PReady: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const y = useK([[0, 700], [12, 470]], ease);
  return (
    <LightBg>
      <div style={{ position: "absolute", top: 210, left: 0, right: 0 }}>
        <Lines size={80} color={P.ink} lines={[words("Plumo уже", 0, 4), words("работает.", 8, 4, P.blue)]} />
      </div>
      <At x={40} y={y} scale={1.0}>
        <PAppWindow active="overview" width={1000} height={1400}>
          <POverview stats={STATS} chart={interpolate(frame, [0, dur], [0.3, 1], clamp)} seed="r" />
        </PAppWindow>
      </At>
    </LightBg>
  );
};

/** Close-up of the sidebar with a cursor clicking a nav item; two lines of text below. */
export const PSidebarClick: React.FC<{
  dur: number;
  target: "dialogs" | "channels";
  lineA: string;
  lineB: string;
  title: string;
  sub: string;
}> = ({ dur, target, lineA, lineB, title, sub }) => {
  const frame = useCurrentFrame();
  const targetY = target === "dialogs" ? 610 : 770;
  const cur = useCursorPath([
    { f: 0, x: 760, y: 1000 },
    { f: Math.round(dur * 0.55), x: 330, y: targetY },
    { f: dur, x: 340, y: targetY + 8 },
  ]);
  const clickF = Math.round(dur * 0.6);
  const clicked = frame >= clickF;
  const press = interpolate(frame, [clickF - 2, clickF, clickF + 3], [0, 1, 0], clamp);
  const scale = useK([[0, 2.05], [dur, 1.9]], Easing.linear);
  return (
    <LightBg>
      <At x={40} y={300} scale={scale}>
        <div style={{ display: "flex", background: "#fff", border: "1px solid #E6E9F5", borderRadius: 18, overflow: "hidden", height: 420, boxShadow: "0 30px 80px rgba(20,30,120,0.12)" }}>
          <PSidebar active={clicked ? target : "overview"} />
          <div style={{ width: 360, padding: "22px 22px" }}>
            <PTitle title={clicked ? title : "Обзор"} sub={clicked ? sub : "Что Plumo сделал за вас"} />
            <PStatsCard stats={STATS} />
          </div>
        </div>
      </At>
      <Cursor x={cur.x} y={cur.y} size={64} press={press} />
      <div style={{ position: "absolute", top: 1260, left: 0, right: 0 }}>
        <Lines size={84} color={P.ink} lines={[words(lineA, 0, 3), words(lineB, 9, 3, P.blue)]} />
      </div>
    </LightBg>
  );
};

export const PWhatWanted: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const hp = interpolate(frame, [8, 18], [0, 1], { ...clamp, easing: ease });
  const scale = useK([[0, 1.3], [dur, 1.38]], Easing.linear);
  return (
    <LightBg>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0 }}>
        <Lines size={78} color={P.ink} lines={[words("и что он хотел", 0, 3), words("купить.", 10, 3, P.blue)]} />
      </div>
      <At x={-180} y={560} scale={scale}>
        <PAppWindow active="dialogs" width={1000} height={900}>
          <PDialogsPage highlight={0} hp={hp} />
        </PAppWindow>
      </At>
    </LightBg>
  );
};

export const PChannelsMost: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const x = useK([[0, -200], [dur, -260]], Easing.linear);
  const draw = interpolate(frame, [0, 24], [0, 1], clamp);
  return (
    <LightBg>
      <At x={x} y={500} scale={1.35}>
        <PAppWindow active="channels" width={1000} height={900}>
          <PChannelsPage draw={draw} />
        </PAppWindow>
      </At>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0 }}>
        <Lines size={84} color={P.ink} lines={[words("приносит больше", 2, 4), words("всего денег.", 10, 4, P.blue)]} />
      </div>
    </LightBg>
  );
};

export const PRequests: React.FC<{ dur: number }> = ({ dur }) => {
  const y = useK([[0, 650], [12, 520], [dur, 510]], ease);
  return (
    <LightBg>
      <div style={{ position: "absolute", top: 220, left: 0, right: 0 }}>
        <Lines size={84} color={P.ink} lines={[[pill("Получай", 0)], words("готовые заявки.", 6, 4)]} />
      </div>
      <At x={40} y={y} scale={1.0}>
        <PAppWindow active="requests" width={1000} height={1300}>
          <PRequestsPage />
        </PAppWindow>
      </At>
    </LightBg>
  );
};

export const PNewRequest: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 4, fps, config: { damping: 13 } });
  const g = interpolate(frame, [0, dur], [0.4, 1], clamp);
  return (
    <LightBg>
      <At x={40} y={510} scale={1.0} style={{ filter: "blur(4px)", opacity: 0.55 }}>
        <PAppWindow active="requests" width={1000} height={1300}>
          <PRequestsPage />
        </PAppWindow>
      </At>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(244,246,255,0) 35%, rgba(244,246,255,0.6) 55%, rgba(70,95,255,${0.6 * g}) 85%, rgba(51,82,255,${0.95 * g}) 100%)` }} />
      <Center>
        <div style={{ transform: `translateY(${(1 - pop) * 80}px) scale(${0.9 + 0.1 * pop})`, opacity: pop }}>
          <ZNotif
            width={900}
            icon={<PlumoMark size={42} variant="dark" />}
            title="Новая заявка · горячий клиент"
            body="Айдай: шоколадный торт, завтра 9:00"
            
          />
        </div>
      </Center>
    </LightBg>
  );
};

export const POpenRequest: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clickF = 24;
  const cur = useCursorPath([
    { f: 0, x: 700, y: 1500 },
    { f: 20, x: 300, y: 1150 },
    { f: dur, x: 320, y: 1160 },
  ]);
  const panel = spring({ frame: frame - clickF, fps, config: { damping: 16 } });
  const press = interpolate(frame, [clickF - 2, clickF, clickF + 3], [0, 1, 0], clamp);
  const scale = useK([[0, 1.5], [dur, 1.6]], Easing.linear);
  return (
    <LightBg>
      <At x={-300} y={140} scale={scale}>
        <PAppWindow active="requests" width={1000} height={1300}>
          <PRequestsPage hover={frame > 14 ? 0 : -1} />
        </PAppWindow>
      </At>
      {frame >= clickF ? (
        <div style={{ position: "absolute", left: 120, top: 520, opacity: panel, transform: `translateY(${(1 - panel) * 60}px)` }}>
          <RequestCard start={clickF + 6} width={840} />
        </div>
      ) : null}
      <Cursor x={cur.x} y={cur.y} size={64} press={press} />
    </LightBg>
  );
};

export const PEveryDetail: React.FC<{ dur: number }> = () => {
  const frame = useCurrentFrame();
  const g = interpolate(frame, [0, 30], [0, 1], clamp);
  const y = useK([[0, 400], [14, 0]], ease);
  return (
    <BlueBg>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,255,255,${0.12 * g}), rgba(0,0,0,0) 70%)` }} />
      <div style={{ position: "absolute", top: 200, left: 0, right: 0 }}>
        <Lines
          size={70}
          color="#fff"
          lines={[
            [{ text: "Менеджер", at: 0 }, { text: "получает", at: 5 }],
            [
              { text: "готовую", at: 12, color: "#C9D3FF" },
              { text: "заявку", at: 16, color: "#C9D3FF" },
            ],
            words("ещё до звонка.", 30, 5),
          ]}
        />
      </div>
      <div style={{ position: "absolute", left: 120, top: 700 + y }}>
        <RequestCard start={-40} width={840} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 300,
          top: 1560,
          fontFamily,
          fontSize: 44,
          fontWeight: 800,
          color: "#fff",
          border: "4px solid #fff",
          borderRadius: 16,
          padding: "8px 26px",
          transform: `rotate(-6deg) scale(${interpolate(frame, [40, 48], [1.6, 1], clamp)})`,
          opacity: interpolate(frame, [40, 46], [0, 1], clamp),
        }}
      >
        ГОРЯЧИЙ КЛИЕНТ
      </div>
    </BlueBg>
  );
};

/* ================================================================== */
/* 23. Funnel stat chips (vertical stack)                               */
/* ================================================================== */
const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: "#0B0B14", color: "#fff", fontFamily, fontSize: 84, fontWeight: 500, letterSpacing: "-0.03em", padding: "16px 40px", borderRadius: 22, whiteSpace: "nowrap", border: "4px solid #fff", boxShadow: "0 0 0 3px #0B0B14" }}>
    {children}
  </div>
);
const Step: React.FC<{ pct: string }> = ({ pct }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, margin: "-8px 0", zIndex: 2 }}>
    <div style={{ width: 96, height: 110, background: P.blue, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <IconArrowRight size={56} color="#fff" style={{ transform: "rotate(90deg)" }} />
    </div>
    <div style={{ background: "#fff", border: `6px solid ${P.blue}`, borderRadius: 18, fontFamily, fontSize: 48, fontWeight: 700, padding: "4px 18px", color: P.ink }}>{pct}</div>
  </div>
);
const Num: React.FC<{ to: number; start: number }> = ({ to, start }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame - start, [0, 16], [Math.round(to * 0.5), to], { ...clamp, easing: Easing.out(Easing.quad) });
  return <>{Math.round(v).toLocaleString("ru-RU")}</>;
};

export const PChips: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const y = useK([[0, 700], [dur - 10, -1060], [dur, -1100]], Easing.inOut(Easing.quad));
  return (
    <LightBg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${y}px)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Chip>
          <Num to={1847} start={0} /> сообщений
        </Chip>
        <Step pct="100% ответов" />
        <Chip>
          <Num to={312} start={10} /> заявок
        </Chip>
        <Step pct="62%" />
        <Chip>
          <Num to={194} start={20} /> продажи
        </Chip>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 120, opacity: interpolate(frame, [dur - 22, dur - 12], [0, 1], clamp) }}>
          <PlumoMark size={120} variant="dark" />
          <span style={{ fontFamily, fontSize: 130, fontWeight: 500, letterSpacing: "-0.05em", color: P.ink }}>plumo</span>
        </div>
      </div>
    </LightBg>
  );
};

/* ================================================================== */
/* 24. "Несколько [филиалов?]"                                          */
/* ================================================================== */
const TypingInline: React.FC<{ text: string; start: number }> = ({ text, start }) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - start) / 1.5)));
  return <span style={{ whiteSpace: "pre" }}>{text.slice(0, n) || " "}</span>;
};
export const PBranches: React.FC<{ dur: number }> = ({ dur }) => (
  <PLine
    dur={dur}
    size={90}
    lines={[
      [{ text: "У", at: 0 }, { text: "тебя", at: 6 }, { text: "несколько", at: 10 }],
      [pill(<TypingInline text="филиалов?" start={20} />, 18)],
    ]}
  />
);

/* ================================================================== */
/* 25. Add a new business                                               */
/* ================================================================== */
export const PNewBusiness: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const openModal = 22;
  const click = 58;
  const after = 66;
  const type = (t: string, st: number) => t.slice(0, Math.max(0, Math.min(t.length, Math.floor((frame - st) / 1.2))));
  const pop = spring({ frame: frame - openModal, fps, config: { damping: 15 } });
  const cur = useCursorPath([
    { f: 0, x: 700, y: 1000 },
    { f: 16, x: 520, y: 790 },
    { f: openModal + 4, x: 520, y: 790 },
    { f: click - 6, x: 830, y: 1265 },
    { f: click + 6, x: 830, y: 1265 },
    { f: dur, x: 860, y: 1150 },
  ]);
  const p1 = interpolate(frame, [openModal - 2, openModal, openModal + 3], [0, 1, 0], clamp);
  const p2 = interpolate(frame, [click - 2, click, click + 3], [0, 1, 0], clamp);
  const zoom = useK([[0, 1.15], [openModal, 1.05], [after, 1.0]], ease);
  const isNew = frame >= after;
  const sweep = interpolate(frame, [after, after + 22], [0, 1], clamp);
  return (
    <LightBg>
      <Center>
        <div style={{ transform: `scale(${zoom})`, position: "relative" }}>
          <PAppWindow
            active="overview"
            width={1000}
            height={1400}
            business={isNew ? "Кафе «Ала-Тоо»" : "Кондитерская «Айгуль»"}
            title={isNew ? "Кафе «Ала-Тоо» · WhatsApp" : "Все каналы"}
          >
            <POverview
              stats={isNew ? { revenue: "2 940 800 сом", requests: "684", dialogs: "4 210", reply: "2 сек" } : STATS}
              chart={isNew ? interpolate(frame, [after, dur], [0.2, 1], clamp) : 1}
              seed={isNew ? "n" : "r"}
            />
          </PAppWindow>
          {frame < openModal + 2 ? (
            <div style={{ position: "absolute", left: 16, top: 110 }}>
              <BusinessDropdown hover={frame > 14} />
            </div>
          ) : null}
          {frame >= openModal && !isNew ? (
            <>
              <AbsoluteFill style={{ background: "rgba(10,15,61,0.18)", borderRadius: 22 }} />
              <div style={{ position: "absolute", left: 220, top: 420, opacity: pop, transform: `scale(${0.94 + 0.06 * pop})` }}>
                <BusinessModal name={type("Кафе «Ала-Тоо»", openModal + 6)} channel={type("WhatsApp +996 555 …", openModal + 20)} press={p2} />
              </div>
            </>
          ) : null}
          {sweep > 0 && sweep < 1 ? (
            <AbsoluteFill style={{ borderRadius: 22, background: `linear-gradient(180deg, rgba(255,255,255,0) ${sweep * 120 - 40}%, rgba(70,95,255,0.3) ${sweep * 120 - 15}%, rgba(255,255,255,0) ${sweep * 120 + 10}%)` }} />
          ) : null}
        </div>
      </Center>
      <Cursor x={cur.x} y={cur.y} size={64} press={Math.max(p1, p2)} />
    </LightBg>
  );
};

/* ================================================================== */
/* 26. "И у тебя тоже." + notifications                                 */
/* ================================================================== */
export const PYoursToo: React.FC<{ dur: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: frame - 2, fps, config: { damping: 14 } });
  const b = spring({ frame: frame - 8, fps, config: { damping: 14 } });
  return (
    <LightBg>
      <div style={{ position: "absolute", top: 560, left: 0, right: 0 }}>
        <Lines size={96} color={P.ink} lines={[words("И у тебя", 0, 4), words("тоже.", 8, 4, P.blue)]} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 900, display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ opacity: a * 0.6, transform: `translateY(${(1 - a) * 50}px) scale(0.94)` }}>
          <ZNotif
            width={900}
            icon={
              <NotifIcon bg="linear-gradient(180deg,#5AB0FF,#1E73E8)" size={40}>
                <IconMail size={20} color="#fff" />
              </NotifIcon>
            }
            title="WhatsApp · Айдай"
            body="Торт супер, спасибо! 🎂"
            
          />
        </div>
        <div style={{ opacity: b, transform: `translateY(${(1 - b) * 50}px)` }}>
          <ZNotif
            width={900}
            icon={
              <NotifIcon bg={P.blue} size={40}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, fontFamily }}>с</span>
              </NotifIcon>
            }
            title="Оплата получена"
            body="+3 200 сом · заказ от Plumo"
            
          />
        </div>
      </div>
    </LightBg>
  );
};

/* ================================================================== */
/* 27. Dark rings + light streak                                        */
/* ================================================================== */
export const PDarkPulse: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const streak = interpolate(frame, [dur * 0.45, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const dot = interpolate(frame, [0, 8], [0.6, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ background: "#02030C" }}>
      <div style={{ opacity: 1 - streak }}>
        <Rings t={frame / 26} base={1300} />
      </div>
      <Center>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", bottom: 120, width: 280, height: 900 * streak, background: "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(80,110,255,0.9) 85%, #fff 100%)", filter: "blur(8px)", opacity: streak, transform: "rotate(180deg)", transformOrigin: "50% 0" }} />
          <PlumoMark size={(300 - 120 * streak) * dot} />
        </div>
      </Center>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 28. Lockup                                                           */
/* ================================================================== */
export const PLockup: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [0, 12], [0, 1], { ...clamp, easing: ease });
  const tag = interpolate(frame, [4, 16], [0, 1], { ...clamp, easing: ease });
  const out = interpolate(frame, [dur - 6, dur], [1, 0], clamp);
  return (
    <NavyBg glow={0.7}>
      <Center style={{ opacity: out }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, transform: `translateY(${(1 - reveal) * 80}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <PlumoMark size={150} />
            <span style={{ fontFamily, fontSize: 170, fontWeight: 500, letterSpacing: "-0.05em", color: "#fff" }}>plumo</span>
          </div>
          <div style={{ position: "relative", padding: "18px 40px" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 6, background: "#D6DEFF", boxShadow: `0 0 30px ${P.blueBright}` }} />
            <div style={{ position: "absolute", left: "10%", right: "10%", top: 0, height: 140 * tag, background: "linear-gradient(180deg, rgba(80,110,255,0.95), rgba(51,82,255,0.3) 60%, rgba(0,0,0,0))", filter: "blur(20px)" }} />
            <div style={{ position: "relative", fontFamily, fontSize: 50, lineHeight: 1.2, color: "#fff", opacity: tag, textAlign: "center", fontWeight: 500 }}>
              ИИ-менеджер,
              <br />
              который не спит.
            </div>
          </div>
        </div>
      </Center>
    </NavyBg>
  );
};

/* ================================================================== */
/* 29. CTA                                                               */
/* ================================================================== */
export const PCTA: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [dur - 18, dur - 2], [1, 0], clamp);
  const sub = interpolate(frame, [26, 36], [0, 1], clamp);
  return (
    <NavyBg>
      <Center style={{ opacity: fade }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <KineticLine size={84} color="#fff" weight={800} tokens={[{ text: "пиши", at: 0 }]} />
          <BigWord text="«ДЕМО»" size={210} start={6} />
          <KineticLine size={64} color="#fff" weight={600} tokens={[pill("в комментариях", 18)]} />
          <div style={{ marginTop: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: sub }}>
            <PlumoMark size={110} />
            <div style={{ fontFamily, fontSize: 52, color: "#fff", fontWeight: 500 }}>plumo.ai</div>
            <div style={{ fontFamily, fontSize: 32, color: "#AFC0FF", fontWeight: 600 }}>всего 5 900 сом в месяц</div>
          </div>
        </div>
      </Center>
    </NavyBg>
  );
};
