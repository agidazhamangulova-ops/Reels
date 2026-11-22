import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, P, fontFamily, monoFamily } from "../pulse/theme";
import { LineChart, revenueSeries, Tag } from "../pulse/ui";
import { IconBars, IconCheckCircle, IconChevrons, IconGear, IconGrid, IconHome, IconSources, IconUser, IconX, InstaMark } from "../pulse/icons";

/* ------------------------------------------------------------------ */
/* Backgrounds (Plumo navy / Plumo light)                              */
/* ------------------------------------------------------------------ */

export const NavyBg: React.FC<{ children?: React.ReactNode; glow?: number }> = ({ children, glow = 1 }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 40) * 4;
  return (
    <AbsoluteFill style={{ background: "#02030C" }}>
      <AbsoluteFill
        style={{
          opacity: glow,
          background: `radial-gradient(ellipse 85% 55% at ${50 + drift}% 58%, #1E33B8 0%, #101C78 28%, #070B33 58%, #02030C 85%)`,
        }}
      />
      <AbsoluteFill style={{ opacity: glow * 0.5, background: "radial-gradient(ellipse 50% 25% at 70% 95%, #3A1F8F 0%, rgba(0,0,0,0) 70%)" }} />
      {children}
    </AbsoluteFill>
  );
};

export const LightBg: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const d = Math.sin(frame / 35) * 30;
  return (
    <AbsoluteFill style={{ background: "#F4F6FF" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle 420px at ${300 + d}px 700px, rgba(120,140,255,0.28), rgba(255,255,255,0) 70%), radial-gradient(circle 380px at ${820 - d}px 1500px, rgba(120,140,255,0.22), rgba(255,255,255,0) 70%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

export const BlueBg: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 70% at 50% 50%, #4562FF 0%, ${P.blue} 45%, #2236D8 100%)` }}>{children}</AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */

/** The Plumo mark: a circle with an offset "pupil". */
export const PlumoMark: React.FC<{ size: number; variant?: "light" | "dark"; style?: React.CSSProperties }> = ({
  size,
  variant = "light",
  style,
}) => {
  const outer = variant === "light" ? "#FFFFFF" : "#0B0B14";
  const inner = variant === "light" ? P.blue : "#FFFFFF";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: outer, position: "relative", flexShrink: 0, boxShadow: variant === "light" ? `0 0 ${size * 0.35}px rgba(120,150,255,0.45)` : undefined, ...style }}>
      <div
        style={{
          position: "absolute",
          width: size * 0.42,
          height: size * 0.42,
          borderRadius: "50%",
          background: inner,
          left: size * 0.44,
          top: size * 0.14,
        }}
      />
    </div>
  );
};

export const BrandChip: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 18px 8px 10px",
      borderRadius: 999,
      border: dark ? "2px solid rgba(255,255,255,0.75)" : "2px solid #0B0B14",
      background: dark ? "rgba(255,255,255,0.06)" : "#fff",
      fontFamily,
      fontSize: 26,
      fontWeight: 600,
      color: dark ? "#fff" : "#0B0B14",
    }}
  >
    <PlumoMark size={26} variant={dark ? "light" : "dark"} />
    plumo.ai
  </div>
);

/* ------------------------------------------------------------------ */
/* Channel marks (generic glyphs)                                       */
/* ------------------------------------------------------------------ */

export const WhatsAppMark: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 2.5a9.5 9.5 0 00-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1012 2.5z" fill="#25D366" />
    <path d="M8.6 7.6c.3-.6.6-.6.9-.6h.6c.2 0 .5.1.6.4l.9 2.1c.1.2 0 .5-.1.7l-.6.7c.6 1.2 1.6 2.2 2.9 2.9l.7-.7c.2-.2.5-.2.7-.1l2 .9c.3.1.4.4.4.6 0 1-.6 1.9-1.7 2.1-1.2.2-3.4-.4-5.4-2.4S8 10.9 8.2 9.7c.1-.9.2-1.5.4-2.1z" fill="#fff" />
  </svg>
);
export const TelegramMark: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill="#2AABEE" />
    <path d="M5.5 11.6l11.3-4.4c.5-.2 1 .1.8.9l-1.9 9c-.1.6-.5.8-1 .5l-2.9-2.1-1.4 1.3c-.2.2-.3.3-.6.3l.2-3 5.4-4.9c.2-.2 0-.3-.3-.1l-6.7 4.2-2.9-.9c-.6-.2-.6-.6.1-.8z" fill="#fff" />
  </svg>
);
export const PhoneMark: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill="#111" />
    <path d="M8.4 6.5l1.8.3.9 2.4-1.2.9a6.6 6.6 0 003.3 3.3l.9-1.2 2.4.9.3 1.8a1.2 1.2 0 01-1.2 1.2A9.9 9.9 0 017.2 7.7a1.2 1.2 0 011.2-1.2z" fill="#fff" />
  </svg>
);
export const ChannelMark: React.FC<{ name: string; size?: number }> = ({ name, size = 22 }) =>
  name === "WhatsApp" ? <WhatsAppMark size={size} /> : name === "Instagram" ? <InstaMark size={size} /> : name === "Telegram" ? <TelegramMark size={size} /> : <PhoneMark size={size} />;

/* ------------------------------------------------------------------ */
/* Chat                                                                */
/* ------------------------------------------------------------------ */

export type Msg = { from: "client" | "plumo"; text: string; at: number };

const Avatar: React.FC<{ letter: string; size?: number; bg?: string }> = ({ letter, size = 44, bg = P.blue }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.45, flexShrink: 0 }}>
    {letter}
  </div>
);

export const ChatWindow: React.FC<{
  msgs: Msg[];
  typingAt?: [number, number];
  width?: number;
  height?: number;
  footer?: boolean;
}> = ({ msgs, typingAt, width = 760, height = 900, footer = true }) => {
  const frame = useCurrentFrame();
  const typing = typingAt && frame >= typingAt[0] && frame < typingAt[1];
  return (
    <div style={{ width, height, background: "#fff", borderRadius: 34, boxShadow: "0 40px 90px rgba(20,30,120,0.22)", padding: 30, fontFamily, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 18, borderBottom: "1px solid #EEF0F6" }}>
        <Avatar letter="А" />
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: P.ink }}>Айдай</div>
          <div style={{ fontSize: 20, color: C.muted }}>WhatsApp · онлайн</div>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, paddingTop: 22 }}>
        {msgs.map((m, i) => {
          const p = interpolate(frame - m.at, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          if (frame < m.at) return null;
          const mine = m.from === "client";
          return (
            <div
              key={i}
              style={{
                alignSelf: mine ? "flex-end" : "flex-start",
                maxWidth: "78%",
                background: mine ? P.blue : "#EEF0F5",
                color: mine ? "#fff" : P.ink,
                fontSize: 26,
                fontWeight: 600,
                lineHeight: 1.25,
                padding: "16px 20px",
                borderRadius: 20,
                opacity: p,
                transform: `translateY(${(1 - p) * 20}px) scale(${0.95 + 0.05 * p})`,
                transformOrigin: mine ? "right bottom" : "left bottom",
              }}
            >
              {m.text}
            </div>
          );
        })}
        {typing ? (
          <div style={{ alignSelf: "flex-start", background: "#EEF0F5", padding: "18px 22px", borderRadius: 20, display: "flex", gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: "#555", opacity: 0.35 + 0.65 * Math.max(0, Math.sin((frame - i * 4) / 4)) }} />
            ))}
          </div>
        ) : null}
      </div>
      {footer ? <div style={{ fontSize: 17, fontWeight: 700, color: P.blue, letterSpacing: "0.04em" }}>PLUMO · ОТВЕТ ЗА 2 СЕК</div> : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Заявка card                                                          */
/* ------------------------------------------------------------------ */

export const RequestCard: React.FC<{ start?: number; width?: number; hot?: boolean; rows?: [string, string][] }> = ({
  start = 0,
  width = 760,
  hot = true,
  rows = [
    ["Нужно", "шоколадный торт"],
    ["Гостей", "8 человек"],
    ["Когда", "завтра, 9:00"],
    ["Язык", "кыргызский"],
    ["Шаг", "подтвердить заказ"],
  ],
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width, background: "#fff", borderRadius: 30, boxShadow: "0 40px 90px rgba(20,30,120,0.22)", padding: 30, fontFamily }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
        <Avatar letter="А" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: P.ink }}>Айдай</div>
          <div style={{ fontSize: 20, color: C.muted }}>WhatsApp · 03:07</div>
        </div>
        {hot ? (
          <span style={{ background: P.blue, color: "#fff", fontSize: 19, fontWeight: 700, padding: "6px 14px", borderRadius: 999, opacity: interpolate(frame - start, [rows.length * 5 + 4, rows.length * 5 + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            горячий
          </span>
        ) : null}
      </div>
      {rows.map(([k, v], i) => {
        const p = interpolate(frame - start - i * 5, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 16, padding: "13px 0", borderTop: "1px solid #EEF0F6", opacity: 0.15 + 0.85 * p }}>
            <IconCheckCircle size={30} color={p > 0.5 ? P.blue : "#C9CEE6"} />
            <span style={{ width: 120, fontSize: 23, color: C.muted }}>{k}</span>
            <span style={{ fontSize: 25, fontWeight: 700, color: P.ink }}>{v}</span>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* App window                                                           */
/* ------------------------------------------------------------------ */

export type PNav = "overview" | "dialogs" | "requests" | "channels" | "clients" | "analytics";

const PNAV: { key: PNav; label: string; Icon: React.FC<{ size?: number; color?: string }> }[] = [
  { key: "overview", label: "Обзор", Icon: IconHome },
  { key: "dialogs", label: "Диалоги", Icon: IconGrid },
  { key: "requests", label: "Заявки", Icon: IconCheckCircle },
  { key: "channels", label: "Каналы", Icon: IconSources },
  { key: "clients", label: "Клиенты", Icon: IconUser },
  { key: "analytics", label: "Аналитика", Icon: IconBars },
];

export const PSidebar: React.FC<{ active: PNav; business?: string; label?: string }> = ({ active, business = "Кондитерская «Айгуль»", label = "МОЙ БИЗНЕС" }) => (
  <div style={{ width: 250, padding: "16px 14px", borderRight: "1px solid #ECEEF5", display: "flex", flexDirection: "column", gap: 4, fontSize: 16, color: P.ink, flexShrink: 0, fontFamily }}>
    <div style={{ border: "1px solid #ECEEF5", borderRadius: 12, padding: "9px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <div>
        <div style={{ fontSize: 10.5, color: C.muted, display: "flex", alignItems: "center", gap: 5 }}>
          <PlumoMark size={11} variant="dark" /> {label}
        </div>
        <div style={{ fontWeight: 600, fontSize: 14, marginTop: 3 }}>{business}</div>
      </div>
      <IconChevrons size={12} color={C.muted} />
    </div>
    <div style={{ fontSize: 12.5, color: C.muted, padding: "0 9px", marginBottom: 2 }}>Приложение</div>
    {PNAV.map(({ key, label: l, Icon }) => {
      const on = key === active;
      return (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 9, background: on ? P.blueSoft : "transparent", color: on ? P.blue : P.ink, fontWeight: on ? 600 : 400 }}>
          <Icon size={17} color={on ? P.blue : "#444"} />
          {l}
        </div>
      );
    })}
    <div style={{ flex: 1 }} />
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", fontSize: 14 }}>
      <IconGear size={15} color="#444" /> Настройки
    </div>
  </div>
);

export const PTopBar: React.FC<{ title?: string }> = ({ title = "Все каналы" }) => (
  <div style={{ height: 56, borderBottom: "1px solid #ECEEF5", display: "flex", alignItems: "center", gap: 12, padding: "0 20px", fontSize: 15, color: P.ink, flexShrink: 0, fontFamily }}>
    <span style={{ fontWeight: 600 }}>{title}</span>
    <div style={{ flex: 1 }} />
    <div style={{ display: "flex", border: "1px solid #ECEEF5", borderRadius: 8, overflow: "hidden", fontSize: 12.5 }}>
      <span style={{ background: P.blue, color: "#fff", padding: "5px 10px", fontWeight: 600 }}>Сегодня</span>
      <span style={{ padding: "5px 10px", color: C.muted }}>30 дней</span>
    </div>
    <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg, ${P.blueBright}, ${P.blue})` }} />
  </div>
);

export const PAppWindow: React.FC<{
  active: PNav;
  width?: number;
  height?: number;
  title?: string;
  business?: string;
  label?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ active, width = 1000, height = 1200, title, business, label, children, style }) => (
  <div
    style={{
      width,
      height,
      background: "#fff",
      borderRadius: 22,
      border: "1px solid #E6E9F5",
      boxShadow: "0 40px 100px rgba(20,30,120,0.16)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      fontFamily,
      ...style,
    }}
  >
    <div style={{ height: 30, display: "flex", gap: 7, alignItems: "center", padding: "0 16px", flexShrink: 0 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#E2E4EC" }} />
      ))}
    </div>
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      <PSidebar active={active} business={business} label={label} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <PTopBar title={title} />
        <div style={{ flex: 1, padding: "24px 26px", overflow: "hidden", position: "relative" }}>{children}</div>
      </div>
    </div>
  </div>
);

export const PTitle: React.FC<{ title: string; sub: string; right?: React.ReactNode }> = ({ title, sub, right }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
    <div>
      <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.03em", color: P.ink }}>{title}</div>
      <div style={{ fontSize: 15, color: C.muted, marginTop: 3 }}>{sub}</div>
    </div>
    {right}
  </div>
);

/* ------------------------------------------------------------------ */
/* Pages                                                                */
/* ------------------------------------------------------------------ */

export type PStats = { revenue: string; requests: string; dialogs: string; reply: string };

export const PStatsCard: React.FC<{ stats: PStats }> = ({ stats }) => (
  <div
    style={{
      borderRadius: 16,
      background: "linear-gradient(110deg, #1B2DB0 0%, #10196E 35%, #0A0E3A 70%, #120A35 100%)",
      padding: "22px 24px",
      display: "grid",
      gridTemplateColumns: "1.9fr 0.9fr 1fr 1fr",
      gap: 14,
      color: "#fff",
      fontFamily,
    }}
  >
    {[
      [stats.revenue, "Выручка из заявок"],
      [stats.requests, "Заявок"],
      [stats.dialogs, "Диалогов"],
      [stats.reply, "Время ответа"],
    ].map(([v, l], i) => (
      <div key={i}>
        <div style={{ fontSize: i === 0 ? 31 : 28, fontWeight: 500, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>{v}</div>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", marginTop: 3 }}>{l}</div>
      </div>
    ))}
  </div>
);

export const PChartCard: React.FC<{ progress: number; seed?: string; height?: number }> = ({ progress, seed = "p", height = 300 }) => (
  <div style={{ border: "1px solid #ECEEF5", borderRadius: 16, padding: "18px 20px", marginTop: 18, height }}>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 17, fontWeight: 600, color: P.ink }}>Сообщения по часам</div>
        <div style={{ fontSize: 13, color: C.muted }}>Plumo отвечает днём и ночью</div>
      </div>
      <div style={{ display: "flex", gap: 14, fontSize: 13 }}>
        <span style={{ color: P.ink, borderBottom: `2px solid ${P.blue}`, paddingBottom: 4 }}>Сообщения</span>
        <span style={{ color: C.muted }}>Заявки</span>
      </div>
    </div>
    <div style={{ marginTop: 18 }}>
      <LineChart width={640} height={height - 120} data={revenueSeries(seed, 72)} progress={progress} color={P.blue} fill strokeWidth={2.2} />
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginTop: 6 }}>
      {["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "23:59"].map((d) => (
        <span key={d}>{d}</span>
      ))}
    </div>
  </div>
);

export const TOP = [
  { what: "Торт на заказ", ch: "WhatsApp", count: "112 заявок", sum: "548 000 сом", bar: 0.9 },
  { what: "Капкейки, наборы", ch: "Instagram", count: "74 заявки", sum: "286 400 сом", bar: 0.6 },
  { what: "Доставка по Бишкеку", ch: "Telegram", count: "51 заявка", sum: "193 800 сом", bar: 0.42 },
  { what: "Свадебный торт", ch: "Звонки", count: "18 заявок", sum: "162 000 сом", bar: 0.3 },
];

export const TopList: React.FC = () => (
  <div style={{ border: "1px solid #ECEEF5", borderRadius: 16, padding: "18px 20px", marginTop: 18 }}>
    <div style={{ fontSize: 17, fontWeight: 600, color: P.ink }}>Что спрашивают чаще всего</div>
    <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>Plumo сам разбирает каждый диалог</div>
    {TOP.map((r, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", fontSize: 15 }}>
        <ChannelMark name={r.ch} size={24} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: P.ink }}>{r.what}</div>
          <div style={{ height: 6, borderRadius: 3, background: P.blueSoft, marginTop: 6, width: "92%" }}>
            <div style={{ height: 6, borderRadius: 3, background: P.blue, width: `${r.bar * 100}%` }} />
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700, color: P.ink }}>{r.sum}</div>
          <div style={{ fontSize: 12, color: C.muted }}>{r.count}</div>
        </div>
      </div>
    ))}
  </div>
);

export const POverview: React.FC<{ stats: PStats; chart: number; seed?: string }> = ({ stats, chart, seed }) => (
  <>
    <PTitle title="Обзор" sub="Что Plumo сделал за вас" />
    <PStatsCard stats={stats} />
    <PChartCard progress={chart} seed={seed} />
    <TopList />
  </>
);

export const DIALOGS = [
  { name: "Айдай", ch: "WhatsApp", want: "Шоколадный торт на 8 человек", time: "03:07", status: "Заявка" },
  { name: "Эрмек", ch: "Instagram", want: "Баасы канча? Капкейки 12 шт", time: "02:41", status: "Заявка" },
  { name: "Нурлан", ch: "Telegram", want: "Голосовое · доставка в Джал", time: "01:58", status: "В диалоге" },
  { name: "Асель", ch: "WhatsApp", want: "Свадебный торт, 3 яруса", time: "00:22", status: "Заявка" },
  { name: "Бекзат", ch: "Звонки", want: "Можно забрать сегодня?", time: "23:45", status: "Ответил" },
  { name: "Жылдыз", ch: "Instagram", want: "Есть без сахара?", time: "23:10", status: "Ответил" },
];

const statusTag = (s: string) =>
  s === "Заявка" ? <Tag color={P.blue} bg={P.blueSoft}>Заявка</Tag> : s === "В диалоге" ? <Tag color="#B7791F" bg="#FFF4DE">В диалоге</Tag> : <Tag color={C.muted} bg="#F2F3F7">Ответил</Tag>;

export const DialogsTable: React.FC<{ highlight?: number; hp?: number; hover?: number }> = ({ highlight = -1, hp = 0, hover = -1 }) => (
  <div style={{ border: "1px solid #ECEEF5", borderRadius: 14, fontFamily }}>
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 2.4fr 0.7fr 0.9fr", fontSize: 13.5, padding: "12px 16px", borderBottom: "1px solid #ECEEF5", fontWeight: 600, color: P.ink }}>
      <span>Клиент</span>
      <span>Что хотел</span>
      <span>Время</span>
      <span>Статус</span>
    </div>
    {DIALOGS.map((d, i) => {
      const on = i === highlight ? hp : 0;
      return (
        <div
          key={d.name}
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 2.4fr 0.7fr 0.9fr",
            alignItems: "center",
            fontSize: 14.5,
            padding: "14px 16px",
            borderBottom: "1px solid #ECEEF5",
            background: i === hover ? "#F5F6FB" : "#fff",
            position: "relative",
            zIndex: on ? 2 : 1,
            transform: `scale(${1 + 0.06 * on})`,
            borderRadius: 12 * on,
            boxShadow: on ? `0 0 ${44 * on}px rgba(70,95,255,${0.5 * on}), 0 0 0 ${2 * on}px rgba(70,95,255,${0.6 * on})` : undefined,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 600, color: P.ink }}>
            <ChannelMark name={d.ch} size={20} /> {d.name}
          </span>
          <span style={{ color: "#333" }}>{d.want}</span>
          <span style={{ fontFamily: monoFamily, color: C.muted, fontSize: 13 }}>{d.time}</span>
          <span>{statusTag(d.status)}</span>
        </div>
      );
    })}
  </div>
);

export const PDialogsPage: React.FC<{ highlight?: number; hp?: number; hover?: number }> = (p) => (
  <>
    <PTitle title="Диалоги" sub="Кто написал и что хотел купить" />
    <div style={{ display: "flex", gap: 22, fontSize: 14, color: C.muted, marginBottom: 14 }}>
      <span style={{ color: P.ink, borderBottom: `2px solid ${P.blue}`, paddingBottom: 4 }}>Все 1 847</span>
      <span>Заявки 312</span>
      <span>Ночью 486</span>
      <span>Голосовые 129</span>
    </div>
    <DialogsTable {...p} />
  </>
);

export type ChannelCardData = { name: string; amount: string; share: string; stats: string[]; shape: number[]; color: string };

export const CHANNELS: ChannelCardData[] = [
  { name: "WhatsApp", amount: "612 400 сом", share: "48% выручки", stats: ["842 Сообщ.", "148 Заявок", "96 Продаж"], shape: [0.3, 0.42, 0.38, 0.5, 0.56, 0.52, 0.64, 0.7, 0.66, 0.78, 0.74, 0.86, 0.82, 0.9], color: "#25B35C" },
  { name: "Instagram", amount: "398 100 сом", share: "31% выручки", stats: ["604 Сообщ.", "97 Заявок", "58 Продаж"], shape: [0.5, 0.4, 0.46, 0.38, 0.52, 0.48, 0.6, 0.55, 0.62, 0.58, 0.66, 0.6, 0.7, 0.68], color: "#D15BB8" },
  { name: "Telegram", amount: "193 800 сом", share: "15% выручки", stats: ["311 Сообщ.", "51 Заявка", "29 Продаж"], shape: [0.2, 0.26, 0.22, 0.3, 0.28, 0.34, 0.31, 0.38, 0.36, 0.42, 0.4, 0.44, 0.46, 0.5], color: "#2AABEE" },
  { name: "Звонки", amount: "80 200 сом", share: "6% выручки", stats: ["90 Звонков", "16 Заявок", "9 Продаж"], shape: [0.15, 0.2, 0.18, 0.16, 0.22, 0.2, 0.24, 0.21, 0.26, 0.24, 0.27, 0.25, 0.28, 0.3], color: "#555" },
];

export const ChannelCard: React.FC<{ d: ChannelCardData; width?: number; draw?: number }> = ({ d, width = 440, draw = 1 }) => (
  <div style={{ width, border: "1px solid #ECEEF5", borderRadius: 16, padding: "18px 20px", background: "#fff", fontFamily }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 16, fontWeight: 600, color: P.ink }}>
        <ChannelMark name={d.name} size={22} /> {d.name}
      </div>
      <span style={{ fontSize: 12, color: C.muted, background: "#F3F4F8", padding: "3px 9px", borderRadius: 6 }}>{d.share}</span>
    </div>
    <div style={{ fontSize: 30, letterSpacing: "-0.03em", marginTop: 8, color: P.ink, fontWeight: 500 }}>{d.amount}</div>
    <div style={{ marginTop: 10 }}>
      <LineChart width={width - 40} height={70} data={d.shape} progress={draw} color={d.color} fill strokeWidth={2} />
    </div>
    <div style={{ display: "flex", gap: 10, fontSize: 13, color: P.ink, marginTop: 12, alignItems: "center" }}>
      {d.stats.map((s, i) => (
        <React.Fragment key={s}>
          <span>
            <b>{s.split(" ")[0]}</b> <span style={{ color: C.muted }}>{s.split(" ").slice(1).join(" ")}</span>
          </span>
          {i < d.stats.length - 1 ? <span style={{ color: C.muted, fontSize: 11 }}>→</span> : null}
        </React.Fragment>
      ))}
    </div>
  </div>
);

export const PChannelsPage: React.FC<{ draw: number }> = ({ draw }) => (
  <>
    <PTitle title="Каналы" sub="Откуда приходят клиенты" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {CHANNELS.map((d) => (
        <ChannelCard key={d.name} d={d} width={330} draw={draw} />
      ))}
    </div>
  </>
);

export const PRequestsPage: React.FC<{ hover?: number }> = ({ hover = -1 }) => (
  <>
    <PTitle title="Заявки" sub="Готовые заявки — менеджеру осталось подтвердить" right={<span style={{ background: P.blue, color: "#fff", fontSize: 13, padding: "7px 12px", borderRadius: 8, fontWeight: 600 }}>Экспорт</span>} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 18 }}>
      {[
        ["Новых заявок", "37"],
        ["Ночью (18:00–9:00)", "21"],
        ["Средний чек", "4 860 сом"],
      ].map(([l, v]) => (
        <div key={l} style={{ border: "1px solid #ECEEF5", borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ fontSize: 12, color: C.muted }}>{l}</div>
          <div style={{ fontSize: 26, marginTop: 6, color: P.ink, fontWeight: 500 }}>{v}</div>
        </div>
      ))}
    </div>
    <DialogsTable hover={hover} />
  </>
);

/* ------------------------------------------------------------------ */
/* Business switcher + modal                                            */
/* ------------------------------------------------------------------ */

export const BusinessDropdown: React.FC<{ hover?: boolean }> = ({ hover }) => (
  <div style={{ width: 260, background: "#fff", border: "1px solid #ECEEF5", borderRadius: 12, boxShadow: "0 14px 36px rgba(20,30,120,0.14)", padding: 10, fontSize: 14, fontFamily }}>
    <div style={{ fontSize: 10.5, color: C.muted, padding: "4px 8px" }}>МОЙ БИЗНЕС</div>
    <div style={{ background: P.blueSoft, color: P.blue, padding: "7px 8px", borderRadius: 7, display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
      Кондитерская «Айгуль» <span>✓</span>
    </div>
    <div style={{ fontSize: 10.5, color: C.muted, padding: "10px 8px 4px" }}>ФИЛИАЛЫ</div>
    <div style={{ padding: "6px 8px" }}>Айгуль · Ош</div>
    <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 4px 2px", borderTop: "1px solid #ECEEF5", marginTop: 6 }}>
      <span style={{ background: hover ? "#1F33CC" : P.blue, color: "#fff", fontSize: 12, padding: "5px 10px", borderRadius: 6, fontWeight: 600 }}>+ Новый бизнес</span>
    </div>
  </div>
);

export const BusinessModal: React.FC<{ name: string; channel: string; press?: number }> = ({ name, channel, press = 0 }) => (
  <div style={{ width: 560, background: "#fff", borderRadius: 18, border: "1px solid #ECEEF5", boxShadow: "0 40px 90px rgba(20,30,120,0.25)", padding: 26, fontFamily }}>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ fontSize: 21, fontWeight: 700, color: P.ink }}>Подключить новый бизнес</div>
      <IconX size={14} color="#888" />
    </div>
    <div style={{ fontSize: 14, color: C.muted, marginTop: 6, lineHeight: 1.4 }}>Plumo начнёт отвечать клиентам этого бизнеса через пару минут.</div>
    <div style={{ fontSize: 13, color: C.muted, marginTop: 18 }}>Название</div>
    <div style={{ border: "1px solid #E3E6F0", borderRadius: 9, padding: "10px 12px", fontSize: 16, marginTop: 5, minHeight: 20 }}>{name}</div>
    <div style={{ fontSize: 13, color: C.muted, marginTop: 12 }}>Первый канал</div>
    <div style={{ border: "1px solid #E3E6F0", borderRadius: 9, padding: "10px 12px", fontSize: 16, marginTop: 5, minHeight: 20 }}>{channel}</div>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
      <span style={{ border: "1px solid #E3E6F0", borderRadius: 9, padding: "9px 16px", fontSize: 15 }}>Отмена</span>
      <span style={{ background: P.blue, color: "#fff", borderRadius: 9, padding: "9px 16px", fontSize: 15, fontWeight: 600, transform: `scale(${1 - press * 0.06})` }}>Подключить</span>
    </div>
  </div>
);
