import React from "react";
import { interpolate, random, useCurrentFrame, Easing } from "remotion";
import { C, fontFamily, monoFamily } from "./theme";
import {
  CalMark,
  FacebookMark,
  IconBars,
  IconCalendar,
  IconCard,
  IconCheckCircle,
  IconChevron,
  IconChevrons,
  IconClock,
  IconContent,
  IconDollar,
  IconDownload,
  IconEye,
  IconFilter,
  IconGear,
  IconGrid,
  IconHome,
  IconMoon,
  IconPanel,
  IconPlusCircle,
  IconSources,
  IconUser,
  IconX,
  InstaMark,
  LinkedInMark,
  XMark,
  YouTubeMark,
} from "./icons";

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */

export const Dot: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle at 35% 30%, ${C.greenBright}, ${C.green} 60%, #0FA74B)`,
      flexShrink: 0,
      ...style,
    }}
  />
);

/* ------------------------------------------------------------------ */
/* App chrome                                                          */
/* ------------------------------------------------------------------ */

export type NavKey = "overview" | "funnel" | "content" | "sources" | "contacts" | "traffic";

const NAV: { key: NavKey; label: string; Icon: React.FC<{ size?: number; color?: string }> }[] = [
  { key: "overview", label: "Overview", Icon: IconHome },
  { key: "funnel", label: "Funnel Builder", Icon: IconGrid },
  { key: "content", label: "Content", Icon: IconContent },
  { key: "sources", label: "Sources", Icon: IconSources },
  { key: "contacts", label: "Contacts", Icon: IconUser },
  { key: "traffic", label: "Traffic", Icon: IconBars },
];

export const Sidebar: React.FC<{
  active: NavKey;
  workspace?: string;
  workspaceLabel?: string;
  scale?: number;
}> = ({ active, workspace = "Creator Funnel", workspaceLabel = "MY WORKSPACE", scale = 1 }) => (
  <div
    style={{
      width: 230 * scale,
      padding: `${14 * scale}px ${12 * scale}px`,
      borderRight: `1px solid ${C.line}`,
      display: "flex",
      flexDirection: "column",
      gap: 4 * scale,
      fontSize: 14 * scale,
      color: C.text,
      flexShrink: 0,
    }}
  >
    <div
      style={{
        border: `1px solid ${C.line}`,
        borderRadius: 10 * scale,
        padding: `${8 * scale}px ${10 * scale}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14 * scale,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div>
        <div style={{ fontSize: 9.5 * scale, color: C.muted, letterSpacing: "0.02em", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ color: C.green }}>▦</span> {workspaceLabel}
        </div>
        <div style={{ fontWeight: 600, fontSize: 13 * scale, marginTop: 2 }}>{workspace}</div>
      </div>
      <IconChevrons size={12 * scale} color={C.muted} />
    </div>
    <div style={{ fontSize: 11.5 * scale, color: C.muted, padding: `0 ${8 * scale}px`, marginBottom: 2 }}>
      Application
    </div>
    {NAV.map(({ key, label, Icon }) => {
      const on = key === active;
      return (
        <div
          key={key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9 * scale,
            padding: `${6 * scale}px ${8 * scale}px`,
            borderRadius: 7 * scale,
            background: on ? "#E9F9EF" : "transparent",
            color: on ? C.green : C.text,
            fontWeight: on ? 500 : 400,
          }}
        >
          <Icon size={15 * scale} color={on ? C.green : "#444"} />
          {label}
        </div>
      );
    })}
    <div style={{ flex: 1 }} />
    <div style={{ display: "flex", alignItems: "center", gap: 9 * scale, padding: `${5 * scale}px ${8 * scale}px`, fontSize: 12.5 * scale }}>
      <IconGear size={14 * scale} color="#444" /> Settings
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 9 * scale, padding: `${5 * scale}px ${8 * scale}px`, fontSize: 12.5 * scale }}>
      <IconCard size={14 * scale} color="#444" /> Billing
    </div>
  </div>
);

export const TopBar: React.FC<{ title?: string }> = ({ title = "Creator Funnel" }) => (
  <div
    style={{
      height: 50,
      borderBottom: `1px solid ${C.line}`,
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "0 18px",
      fontSize: 13,
      color: C.text,
      flexShrink: 0,
    }}
  >
    <IconPanel size={15} color="#555" />
    <span style={{ fontWeight: 500 }}>{title}</span>
    <div style={{ flex: 1 }} />
    <div style={{ display: "flex", border: `1px solid ${C.line}`, borderRadius: 7, overflow: "hidden", fontSize: 11 }}>
      <span style={{ background: C.green, color: "#fff", padding: "4px 9px", fontWeight: 500 }}>Last touch</span>
      <span style={{ padding: "4px 9px", color: C.muted }}>First touch</span>
    </div>
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 7, padding: "4px 9px", fontSize: 11, display: "flex", gap: 5, alignItems: "center" }}>
      90 days <IconChevron size={10} color="#555" />
    </div>
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 7, padding: "4px 9px", fontSize: 11, display: "flex", gap: 6, alignItems: "center" }}>
      <IconCalendar size={12} color="#555" /> Jun 27, 2026 - Sep 25, 2026
    </div>
    <IconMoon size={14} color="#333" />
    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#7C6CF2,#4A39D8)" }} />
  </div>
);

export const AppWindow: React.FC<{
  active: NavKey;
  width?: number;
  height?: number;
  children: React.ReactNode;
  workspace?: string;
  workspaceLabel?: string;
  title?: string;
  dots?: boolean;
  style?: React.CSSProperties;
}> = ({ active, width = 1400, height = 880, children, workspace, workspaceLabel, title, dots = true, style }) => (
  <div
    style={{
      width,
      height,
      background: "#fff",
      borderRadius: 14,
      border: `1px solid ${C.line}`,
      boxShadow: "0 30px 80px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      fontFamily,
      ...style,
    }}
  >
    {dots ? (
      <div style={{ height: 26, display: "flex", gap: 6, alignItems: "center", padding: "0 14px", flexShrink: 0 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: "#E2E2E2" }} />
        ))}
      </div>
    ) : null}
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      <Sidebar active={active} workspace={workspace} workspaceLabel={workspaceLabel} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar title={title} />
        <div style={{ flex: 1, padding: "22px 26px", overflow: "hidden", position: "relative" }}>{children}</div>
      </div>
    </div>
  </div>
);

export const PageTitle: React.FC<{ title: string; sub: string; right?: React.ReactNode }> = ({ title, sub, right }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
    <div>
      <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.03em", color: C.ink }}>{title}</div>
      <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{sub}</div>
    </div>
    {right}
  </div>
);

/* ------------------------------------------------------------------ */
/* Overview                                                            */
/* ------------------------------------------------------------------ */

export type Stats = { revenue: string; customers: string; calls: string; leads: string; days: string };

export const StatsCard: React.FC<{ stats: Stats; height?: number }> = ({ stats, height = 96 }) => (
  <div
    style={{
      height,
      borderRadius: 12,
      background: "linear-gradient(100deg, #0E3B23 0%, #0B1A14 30%, #0C0C16 65%, #14122A 100%)",
      display: "flex",
      alignItems: "center",
      padding: "0 26px",
      gap: 46,
      color: "#fff",
      fontFamily,
    }}
  >
    {[
      [stats.revenue, "Revenue from your content", 36],
      [stats.customers, "Customers", 30],
      [stats.calls, "Calls booked", 30],
      [stats.leads, "Leads", 30],
      [stats.days, "Median days to convert", 30],
    ].map(([v, l, fs], i) => (
      <div key={i} style={{ textAlign: "center" }}>
        <div style={{ fontSize: fs as number, fontWeight: 400, letterSpacing: "-0.03em" }}>{v}</div>
        <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{l}</div>
      </div>
    ))}
  </div>
);

/** Spiky revenue series like the product chart. */
export const revenueSeries = (seed: string, n = 90) => {
  const pts: number[] = [];
  for (let i = 0; i < n; i++) {
    const base = 0.06 + (i / n) * 0.25;
    const spike = random(`${seed}-s-${i}`) > 0.82 ? random(`${seed}-h-${i}`) * 0.7 : 0;
    pts.push(Math.min(1, base * random(`${seed}-b-${i}`) + spike + 0.02));
  }
  return pts;
};

export const LineChart: React.FC<{
  width: number;
  height: number;
  data: number[];
  progress: number; // 0..1 draw
  color?: string;
  fill?: boolean;
  strokeWidth?: number;
}> = ({ width, height, data, progress, color = "#3BC77A", fill = false, strokeWidth = 1.6 }) => {
  const n = Math.max(2, Math.floor(data.length * progress));
  const pts = data.slice(0, n).map((v, i) => [(i / (data.length - 1)) * width, height - v * height * 0.95]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {fill ? (
        <path d={`${d} L${last[0]},${height} L0,${height} Z`} fill={color} opacity={0.12} />
      ) : null}
      <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  );
};

const DATES = ["Jun 27", "Jul 3", "Jul 7", "Jul 11", "Jul 15", "Jul 19", "Jul 23", "Jul 27", "Jul 31", "Aug 4", "Aug 8", "Aug 12", "Aug 17", "Aug 22", "Aug 27", "Sep 1", "Sep 5", "Sep 9", "Sep 13", "Sep 24"];

export const RevenueCard: React.FC<{ progress: number; seed?: string; height?: number }> = ({
  progress,
  seed = "rev",
  height = 300,
}) => (
  <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: "16px 18px", marginTop: 16, height }}>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>Revenue over time</div>
        <div style={{ fontSize: 11.5, color: C.muted }}>Daily attributed revenue, net of refunds</div>
      </div>
      <div style={{ display: "flex", gap: 14, fontSize: 11.5 }}>
        <span style={{ color: C.ink, borderBottom: `2px solid ${C.green}`, paddingBottom: 4 }}>Revenue</span>
        <span style={{ color: C.muted }}>Leads</span>
      </div>
    </div>
    <div style={{ marginTop: 16 }}>
      <LineChart width={1050} height={height - 110} data={revenueSeries(seed)} progress={progress} />
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted, marginTop: 6 }}>
      {DATES.map((d) => (
        <span key={d}>{d}</span>
      ))}
    </div>
  </div>
);

export const OverviewPage: React.FC<{ stats: Stats; chart: number; seed?: string }> = ({ stats, chart, seed }) => (
  <>
    <PageTitle title="Overview" sub="What your content earned in this period" />
    <StatsCard stats={stats} />
    <RevenueCard progress={chart} seed={seed} />
    <MadeYouMoney />
  </>
);

/* ------------------------------------------------------------------ */
/* "What made you money" + Content table                               */
/* ------------------------------------------------------------------ */

export const CONTENT = [
  { title: "$0 to $20k/mo: My Complete Business Breakdown", rev: "$10,199.00", pct: "34% of revenue", rpm: "$2,153.05", views: "4,737", clicks: "585", leads: "40", meta: "40 leads · 13 calls · 5 customers", bar: 0.9 },
  { title: "The Complete Client Acquisition System (2026)", rev: "$8,200.00", pct: "27% of revenue", rpm: "$5,774.65", views: "1,420", clicks: "296", leads: "25", meta: "25 leads · 9 calls · 4 customers", bar: 0.72 },
  { title: "The 4 Emails That Close High-Ticket Clients", rev: "$4,500.00", pct: "15% of revenue", rpm: "$1,677.85", views: "2,682", clicks: "260", leads: "18", meta: "18 leads · 6 calls · 3 customers", bar: 0.42 },
  { title: "How I Land $10k Clients With One Video Funnel", rev: "$2,299.00", pct: "8% of revenue", rpm: "$3,092.83", views: "614", clicks: "114", leads: "7", meta: "10 leads · 4 calls · 2 customers", bar: 0.24 },
  { title: "Client Onboarding Walkthrough (Behind the Scenes)", rev: "$1,899.00", pct: "6% of revenue", rpm: "$1,100.00", views: "1,722", clicks: "77", leads: "6", meta: "7 leads · 3 calls · 2 customers", bar: 0.2 },
];

export const Thumb: React.FC<{ i: number; w?: number; h?: number }> = ({ i, w = 44, h = 28 }) => {
  const hues = [28, 200, 140, 35, 220];
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 4,
        flexShrink: 0,
        background: `linear-gradient(135deg, hsl(${hues[i % 5]},45%,55%), hsl(${hues[i % 5] + 30},35%,22%))`,
      }}
    />
  );
};

export const MadeYouMoney: React.FC = () => (
  <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: "16px 18px", marginTop: 16 }}>
    <div style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>What made you money</div>
    <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 10 }}>4 of your 15 tracked content pieces drove 80% of revenue.</div>
    {CONTENT.map((c, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "7px 0", fontSize: 12 }}>
        <span style={{ width: 14, color: C.muted }}>{i + 1}</span>
        <Thumb i={i} />
        <div style={{ flex: 1 }}>
          <div style={{ color: C.ink, fontWeight: 500 }}>{c.title}</div>
          <div style={{ height: 4, borderRadius: 2, background: "#EEF6F1", marginTop: 5, width: 520 }}>
            <div style={{ height: 4, borderRadius: 2, background: C.green, width: `${c.bar * 100}%` }} />
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 600, color: C.ink }}>{c.rev}</div>
          <div style={{ fontSize: 10, color: C.muted }}>{c.meta}</div>
        </div>
      </div>
    ))}
    <div style={{ fontSize: 11, color: C.green, marginTop: 6 }}>Open the full content scorecard →</div>
    <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
      <div style={{ flex: 1, background: "#EEFAF2", border: "1px solid #CDEFD9", borderRadius: 10, padding: "10px 12px" }}>
        <div style={{ fontSize: 10, color: C.green }}>Hidden gem</div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink }}>The Complete Client Acquisition System (2026)</div>
        <div style={{ fontSize: 10.5, color: C.muted }}>27% of your revenue from just 1.4K views. Make more like this.</div>
      </div>
      <div style={{ flex: 1, background: "#FFF8EC", border: "1px solid #F5E2BC", borderRadius: 10, padding: "10px 12px" }}>
        <div style={{ fontSize: 10, color: "#C88A1A" }}>Views without money</div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink }}>My Exact Cold Outreach Script (Free Template)</div>
        <div style={{ fontSize: 10.5, color: C.muted }}>7K views but only 2% of revenue. Popular isn&apos;t the same as profitable.</div>
      </div>
    </div>
  </div>
);

export const Tag: React.FC<{ children: React.ReactNode; color?: string; bg?: string }> = ({
  children,
  color = C.green,
  bg = "#E6F8EC",
}) => (
  <span style={{ fontSize: 9.5, color, background: bg, padding: "2px 6px", borderRadius: 5, fontWeight: 500, whiteSpace: "nowrap" }}>
    {children}
  </span>
);

export const SourceTag: React.FC<{ name?: string }> = ({ name = "YouTube" }) => (
  <Tag color={name === "YouTube" ? "#E0322B" : "#C13584"} bg={name === "YouTube" ? "#FDECEC" : "#FBEAF5"}>
    {name}
  </Tag>
);

export const ContentTable: React.FC<{ highlight?: number; highlightProgress?: number }> = ({
  highlight = -1,
  highlightProgress = 0,
}) => (
  <div style={{ fontFamily }}>
    <div style={{ fontSize: 11.5, color: C.muted, textAlign: "center", marginBottom: 12 }}>
      <b style={{ color: C.ink }}>4</b> of your <b style={{ color: C.ink }}>17</b> tracked content pieces drove 80% of revenue in this period.
    </div>
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 7, padding: "6px 10px", width: 180, fontSize: 11, color: C.faint, marginBottom: 12 }}>
      Filter by title...
    </div>
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, overflow: "visible" }}>
      <div style={{ display: "grid", gridTemplateColumns: "3.2fr 1fr 1.1fr 1fr 0.8fr 0.7fr 0.6fr", fontSize: 11.5, color: C.text, padding: "9px 14px", borderBottom: `1px solid ${C.line}`, fontWeight: 500 }}>
        {["Content", "Source", "Revenue", "RPM", "Views", "Clicks", "Leads"].map((h) => (
          <span key={h}>{h} <span style={{ color: C.faint }}>⇅</span></span>
        ))}
      </div>
      {CONTENT.slice(0, 5).map((c, i) => {
        const on = i === highlight;
        const hp = on ? highlightProgress : 0;
        return (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "3.2fr 1fr 1.1fr 1fr 0.8fr 0.7fr 0.6fr",
              alignItems: "center",
              fontSize: 12,
              padding: "10px 14px",
              borderBottom: `1px solid ${C.line}`,
              background: "#fff",
              position: "relative",
              zIndex: on ? 2 : 1,
              transform: `scale(${1 + 0.06 * hp})`,
              boxShadow: hp > 0 ? `0 0 ${40 * hp}px rgba(34,216,106,${0.55 * hp}), 0 0 0 ${2 * hp}px rgba(34,216,106,${0.5 * hp})` : undefined,
              borderRadius: 10 * hp,
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Thumb i={i} w={58} h={36} />
              <div>
                <div style={{ fontWeight: 500, color: C.ink, lineHeight: 1.2 }}>{c.title}</div>
                <div style={{ marginTop: 3, display: "flex", gap: 4 }}>
                  <Tag>Top earner</Tag>
                  {i === 1 ? <Tag color="#5A8F2A" bg="#EEF7E3">Hidden gem</Tag> : null}
                </div>
              </div>
            </div>
            <span style={{ color: C.muted }}>YouTube</span>
            <div>
              <div style={{ color: C.green, fontFamily: monoFamily, fontWeight: 500 }}>{c.rev}</div>
              <div style={{ fontSize: 9.5, color: C.muted }}>{c.pct}</div>
            </div>
            <span style={{ fontFamily: monoFamily }}>{c.rpm}</span>
            <span style={{ fontFamily: monoFamily }}>{c.views}</span>
            <span style={{ fontFamily: monoFamily }}>{c.clicks}</span>
            <span style={{ fontFamily: monoFamily }}>{c.leads}</span>
          </div>
        );
      })}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Sources                                                             */
/* ------------------------------------------------------------------ */

export type SourceCardData = {
  name: string;
  mark: React.ReactNode;
  amount: string;
  share: string;
  color: string;
  stats: string[];
  shape: number[];
};

const decline = [0.35, 0.4, 0.36, 0.5, 0.48, 0.62, 0.55, 0.6, 0.66, 0.58, 0.6, 0.05, 0.03, 0.03, 0.02, 0.02, 0.02, 0.02];
const wavy = [0.4, 0.5, 0.45, 0.55, 0.5, 0.6, 0.52, 0.48, 0.55, 0.35, 0.2, 0.25, 0.18, 0.22, 0.15, 0.18, 0.14, 0.12];

export const SOURCES: SourceCardData[] = [
  { name: "YouTube", mark: <YouTubeMark size={13} />, amount: "$27,097.00", share: "91% of revenue", color: "#E66A6A", stats: ["2.7K Clicks", "177 Leads", "39 Calls", "16 Customers"], shape: decline },
  { name: "LinkedIn", mark: <LinkedInMark size={13} />, amount: "$1,600.00", share: "5% of revenue", color: "#6C9BE0", stats: ["78 Clicks", "6 Leads", "1 Calls", "1 Customers"], shape: wavy },
  { name: "Instagram", mark: <InstaMark size={13} />, amount: "$1,200.00", share: "4% of revenue", color: "#D57BC4", stats: ["196 Clicks", "13 Leads", "2 Calls", "1 Customers"], shape: wavy.map((v, i) => v * (i % 3 ? 0.9 : 1.1)) },
  { name: "X", mark: <XMark size={12} />, amount: "—", share: "", color: "#9A9A9A", stats: ["174 Clicks", "0 Leads", "0 Calls", "0 Customers"], shape: wavy.map((v) => v * 0.6) },
  { name: "Facebook", mark: <FacebookMark size={13} />, amount: "—", share: "", color: "#6C9BE0", stats: ["0 Clicks", "0 Leads", "0 Calls", "0 Customers"], shape: wavy.map(() => 0.02) },
];

export const SourceCard: React.FC<{ d: SourceCardData; width?: number; draw?: number }> = ({ d, width = 420, draw = 1 }) => (
  <div style={{ width, border: `1px solid ${C.line}`, borderRadius: 12, padding: "14px 16px", background: "#fff", fontFamily }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 500 }}>
        {d.mark} {d.name}
      </div>
      {d.share ? <span style={{ fontSize: 10, color: C.muted, background: "#F5F5F5", padding: "2px 7px", borderRadius: 5 }}>{d.share}</span> : null}
    </div>
    <div style={{ fontSize: 24, letterSpacing: "-0.03em", marginTop: 6, color: C.ink }}>{d.amount}</div>
    <div style={{ marginTop: 8 }}>
      <LineChart width={width - 32} height={56} data={d.shape} progress={draw} color={d.color} fill strokeWidth={1.4} />
    </div>
    <div style={{ display: "flex", gap: 14, fontSize: 10.5, color: C.ink, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
      {d.stats.map((s, i) => (
        <React.Fragment key={s}>
          <span>
            <b style={{ fontWeight: 600 }}>{s.split(" ")[0]}</b> <span style={{ color: C.muted }}>{s.split(" ").slice(1).join(" ")}</span>
          </span>
          {i < 3 ? <span style={{ fontSize: 8, color: C.muted }}>→</span> : null}
        </React.Fragment>
      ))}
    </div>
  </div>
);

export const SourcesPage: React.FC<{ draw: number }> = ({ draw }) => (
  <>
    <PageTitle title="Sources" sub="How each channel feeds your funnel" />
    <div style={{ display: "flex", gap: 18, fontSize: 11.5, color: C.muted, marginBottom: 16 }}>
      <span style={{ color: C.ink, borderBottom: `2px solid ${C.green}`, paddingBottom: 4 }}>All sources</span>
      {["YouTube", "LinkedIn", "Instagram", "X", "Facebook", "Direct"].map((s) => (
        <span key={s}>{s}</span>
      ))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {SOURCES.slice(0, 4).map((d) => (
        <SourceCard key={d.name} d={d} width={520} draw={draw} />
      ))}
    </div>
  </>
);

/* ------------------------------------------------------------------ */
/* Contacts                                                            */
/* ------------------------------------------------------------------ */

export const PEOPLE = [
  { name: "James Novak", phone: "N/A", email: "james.novak81@proton.me", type: "Form" },
  { name: "Ines Brien", phone: "+1 (555) 873-4088", email: "ines.brien251@hotmail.com", type: "Call booked", done: true },
  { name: "Rachel Simmons", phone: "+1 (512) 555-0148", email: "rachel.simmons.consulting@gmail.com", type: "Purchase", done: true },
  { name: "Sofia Eriksen", phone: "N/A", email: "sofia.eriksen82@hey.com", type: "Form" },
  { name: "Alba Kim", phone: "+1 (555) 926-8866", email: "alba.kim145@hey.com", type: "Form" },
  { name: "Felix Foster", phone: "N/A", email: "felix.foster56@gmail.com", type: "Form" },
  { name: "Zara Patel", phone: "N/A", email: "zara.patel124@hey.com", type: "Form" },
  { name: "Theo Rodriguez", phone: "+1 (555) 222-3168", email: "theo.rodriguez62@hotmail.com", type: "Form" },
];

export const ContactsStats: React.FC = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
    {[
      ["Total Contacts", "209", <IconUser key="u" size={13} color="#6C7CF0" />],
      ["Avg Conversion Time", "8 days", <IconClock key="c" size={13} color="#9B6CF0" />],
      ["Revenue Won", "$29,897", <IconDollar key="d" size={13} color={C.green} />],
      ["Most Valuable Channel", "YouTube", <span key="y" style={{ color: "#F0A030", fontSize: 12 }}>⤴</span>],
    ].map(([l, v, ic], i) => (
      <div key={i} style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, color: C.muted }}>{l}</div>
          <div style={{ fontSize: 20, letterSpacing: "-0.03em", marginTop: 6, color: C.ink }}>{v}</div>
        </div>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: "#F4F4F8", display: "flex", alignItems: "center", justifyContent: "center" }}>{ic}</div>
      </div>
    ))}
  </div>
);

export const ContactsTable: React.FC<{ hoverRow?: number }> = ({ hoverRow = -1 }) => (
  <div style={{ fontFamily }}>
    <div style={{ display: "flex", gap: 22, fontSize: 11.5, color: C.muted, marginBottom: 12 }}>
      <span style={{ color: C.ink, borderBottom: `2px solid ${C.green}`, paddingBottom: 4 }}>All <span style={{ color: C.muted }}>209</span></span>
      <span>Leads 191</span>
      <span>Calls booked 42</span>
      <span>Customers 18</span>
    </div>
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 7, padding: "6px 10px", width: 180, fontSize: 11, color: C.faint, marginBottom: 12 }}>
      Filter by name...
    </div>
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "30px 1.3fr 1.3fr 2fr 0.8fr 0.8fr", fontSize: 11.5, padding: "9px 12px", borderBottom: `1px solid ${C.line}`, fontWeight: 500 }}>
        <span />
        <span>Name ⇅</span>
        <span>Phone Number ⇅</span>
        <span>Email ⇅</span>
        <span style={{ display: "flex", gap: 4, alignItems: "center" }}><IconFilter size={11} /> Source</span>
        <span style={{ display: "flex", gap: 4, alignItems: "center" }}><IconFilter size={11} /> Type</span>
      </div>
      {PEOPLE.map((p, i) => (
        <div
          key={p.name}
          style={{
            display: "grid",
            gridTemplateColumns: "30px 1.3fr 1.3fr 2fr 0.8fr 0.8fr",
            alignItems: "center",
            fontSize: 11.5,
            padding: "9px 12px",
            borderBottom: `1px solid ${C.line}`,
            background: i === hoverRow ? "#F6F6F6" : "#fff",
          }}
        >
          {p.done ? <IconCheckCircle size={14} color={C.green} /> : <IconPlusCircle size={14} color="#BBB" />}
          <span style={{ color: C.ink }}>{p.name}</span>
          <span style={{ color: C.muted, fontFamily: monoFamily, fontSize: 10.5 }}>{p.phone}</span>
          <span style={{ color: C.muted, fontFamily: monoFamily, fontSize: 10.5 }}>{p.email}</span>
          <span><SourceTag /></span>
          <span>
            {p.type === "Form" ? (
              <Tag color={C.muted} bg="#F2F2F2">Form</Tag>
            ) : p.type === "Purchase" ? (
              <Tag color="#2E9E57" bg="#E6F8EC">Purchase</Tag>
            ) : (
              <Tag color="#9B4DD8" bg="#F3E9FC">Call booked</Tag>
            )}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const ContactsPage: React.FC<{ hoverRow?: number }> = ({ hoverRow }) => (
  <>
    <PageTitle
      title="Contacts"
      sub=""
      right={
        <span style={{ background: C.green, color: "#fff", fontSize: 11, padding: "5px 10px", borderRadius: 6, display: "flex", gap: 5, alignItems: "center" }}>
          <IconDownload size={11} color="#fff" /> Download CSV
        </span>
      }
    />
    <ContactsStats />
    <ContactsTable hoverRow={hoverRow} />
  </>
);

/* ------------------------------------------------------------------ */
/* Journey (Rachel Simmons)                                            */
/* ------------------------------------------------------------------ */

const JOURNEY = [
  { t: "Came from Instagram", src: "Instagram", d: "Reel: 3 signs your funnel is leaking", ago: "3mo ago" },
  { t: "Page visit", src: "Instagram", d: "Session 2 · Reel: 3 signs your funnel is leaking", ago: "3mo ago" },
  { t: "Watched on YouTube", src: "YouTube", d: "$0 to $20k/mo: My Complete Business Breakdown", ago: "2mo ago" },
  { t: "Page visit", src: "YouTube", d: "Session 3 · $0 to $20k/mo: My Complete Business Breakdown", ago: "2mo ago" },
  { t: "Booked a meeting", src: "YouTube", d: "Calendly · demo_yt7", ago: "2mo ago" },
  { t: "Payment received $1,500.00", src: "YouTube", d: "Stripe · demo_yt7", ago: "2mo ago" },
  { t: "Converted $1,500.00", src: "YouTube", d: "demo_yt7", ago: "2mo ago", win: true },
];

export const JourneyPanel: React.FC<{ scroll?: number; width?: number }> = ({ scroll = 0, width = 520 }) => (
  <div
    style={{
      width,
      background: "#fff",
      borderRadius: 12,
      border: `1px solid ${C.line}`,
      boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
      padding: 16,
      fontFamily,
      overflow: "hidden",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E3F7EA", color: C.green, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>RS</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>Rachel Simmons</div>
        <div style={{ fontSize: 10.5, color: C.muted }}>rachel.simmons.consulting@gmail.com</div>
      </div>
      <SourceTag />
      <IconX size={11} color="#888" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 14 }}>
      {[
        ["TOUCHPOINTS", "5"],
        ["FIRST TOUCH", "3mo ago"],
        ["TIME TO CONVERT", "30d"],
      ].map(([l, v]) => (
        <div key={l} style={{ background: "#F7F7F7", borderRadius: 8, padding: "8px 10px" }}>
          <div style={{ fontSize: 8.5, color: C.muted, letterSpacing: "0.04em" }}>{l}</div>
          <div style={{ fontSize: 15, fontWeight: 500, color: C.ink, marginTop: 2 }}>{v}</div>
        </div>
      ))}
    </div>
    <div style={{ height: 300, overflow: "hidden", marginTop: 12 }}>
      <div style={{ transform: `translateY(${-scroll}px)` }}>
        {JOURNEY.map((j, i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < JOURNEY.length - 1 ? `1px dashed ${C.line}` : undefined }}>
            <div style={{ width: 18, display: "flex", justifyContent: "center", paddingTop: 2 }}>
              {j.win ? <IconCheckCircle size={15} color={C.green} /> : <IconEye size={13} color="#777" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, fontWeight: 500, color: j.win ? C.green : C.ink }}>{j.t}</div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 3 }}>
                <SourceTag name={j.src} />
                <span style={{ fontSize: 9.5, color: C.muted }}>{j.d}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: C.ink }}>{j.ago}</div>
              <div style={{ fontSize: 8.5, color: C.muted }}>Jul 8, 12:01 PM</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ fontSize: 9.5, color: C.muted, borderTop: `1px solid ${C.line}`, paddingTop: 8 }}>◷ 2 visits · 2 conversion events</div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Funnel builder                                                      */
/* ------------------------------------------------------------------ */

export const NodeBox: React.FC<{ x: number; y: number; children: React.ReactNode; size?: number }> = ({ x, y, children, size = 46 }) => (
  <div
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      background: "#fff",
      borderRadius: 11,
      border: `1px solid ${C.line}`,
      boxShadow: "0 4px 14px rgba(0,0,0,0.07)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

export const FunnelCanvas: React.FC<{ draw: number; width?: number; height?: number }> = ({ draw, width = 1100, height = 640 }) => {
  const hub = { x: 470, y: 300 };
  const srcs = [
    { x: 260, y: 140, m: <YouTubeMark size={22} /> },
    { x: 240, y: 230, m: <XMark size={20} /> },
    { x: 250, y: 330, m: <InstaMark size={22} /> },
    { x: 230, y: 430, m: <MetaMarkSmall /> },
  ];
  const chain = [
    { x: 640, y: 290, m: <IconStripe /> },
    { x: 840, y: 280, m: <CalMark size={24} /> },
  ];
  const len = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y) * 1.2;
  const curve = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    `M${a.x + 24},${a.y} C${(a.x + b.x) / 2 + 20},${a.y} ${(a.x + b.x) / 2 - 10},${b.y} ${b.x - 22},${b.y}`;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        backgroundImage: "radial-gradient(#D9D9D9 1.2px, transparent 1.2px)",
        backgroundSize: "22px 22px",
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {srcs.map((s, i) => {
          const L = len(s, hub);
          return <path key={i} d={curve(s, hub)} fill="none" stroke="#9A9A9A" strokeWidth={1.3} strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />;
        })}
        {[hub, ...chain].slice(0, -1).map((a, i) => {
          const b = chain[i];
          const L = len(a, b);
          return <path key={`c${i}`} d={`M${a.x + 24},${a.y} L${b.x - 24},${b.y}`} stroke="#9A9A9A" strokeWidth={1.3} strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />;
        })}
        {[...srcs, hub, ...chain].map((p, i) => (
          <React.Fragment key={`d${i}`}>
            <circle cx={p.x + 26} cy={p.y} r={3} fill="#fff" stroke="#999" />
            <circle cx={p.x - 26} cy={p.y} r={3} fill="#fff" stroke="#999" />
          </React.Fragment>
        ))}
      </svg>
      {srcs.map((s, i) => (
        <NodeBox key={i} x={s.x} y={s.y}>
          {s.m}
        </NodeBox>
      ))}
      <NodeBox x={hub.x} y={hub.y}>
        <IconGlobeSmall />
      </NodeBox>
      {chain.map((s, i) => (
        <NodeBox key={i} x={s.x} y={s.y}>
          {s.m}
        </NodeBox>
      ))}
    </div>
  );
};

const MetaMarkSmall = () => (
  <svg width={26} height={16} viewBox="0 0 40 24">
    <path d="M4 16c0-6 3-11 6.5-11 3 0 5 3 9.5 10.5C24.5 23 26.5 21 28.5 21c3 0 5-3 5-7 0-5-2.5-9-5.5-9-3.5 0-6 4-8 7.5C17.5 17 15 21 11 21c-4 0-7-1.5-7-5z" fill="none" stroke="#0866FF" strokeWidth="3.4" />
  </svg>
);
const IconStripe = () => (
  <svg width={22} height={16} viewBox="0 0 22 16">
    <rect x="0" y="2" width="7" height="12" rx="2.5" fill="#111" />
    <rect x="9" y="2" width="13" height="12" rx="3" fill="#111" />
  </svg>
);
const IconGlobeSmall = () => (
  <svg width={22} height={22} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" fill="#111" />
    <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" stroke="#fff" strokeWidth={1.4} fill="none" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Workspace dropdown + modal                                          */
/* ------------------------------------------------------------------ */

export const WorkspaceDropdown: React.FC<{ hover?: boolean }> = ({ hover }) => (
  <div style={{ width: 220, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 10, boxShadow: "0 12px 30px rgba(0,0,0,0.1)", padding: 8, fontSize: 12, fontFamily }}>
    <div style={{ fontSize: 9, color: C.muted, padding: "4px 6px" }}>▦ MY WORKSPACE</div>
    <div style={{ background: "#E9F9EF", color: C.green, padding: "5px 6px", borderRadius: 6, display: "flex", justifyContent: "space-between" }}>
      Creator Funnel <span>✓</span>
    </div>
    <div style={{ fontSize: 9, color: C.muted, padding: "8px 6px 4px" }}>▦ NORTHSTAR FITNESS (CLIENT)</div>
    <div style={{ padding: "5px 6px" }}>Northstar YT Funnel</div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 6px 2px", borderTop: `1px solid ${C.line}`, marginTop: 6 }}>
      <span>+ New funnel</span>
      <span style={{ background: hover ? "#333" : "#555", color: "#fff", fontSize: 10, padding: "3px 7px", borderRadius: 5 }}>+ New workspace</span>
    </div>
  </div>
);

export const WorkspaceModal: React.FC<{ name: string; funnel: string; press?: number }> = ({ name, funnel, press = 0 }) => (
  <div style={{ width: 440, background: "#fff", borderRadius: 12, border: `1px solid ${C.line}`, boxShadow: "0 30px 70px rgba(0,0,0,0.18)", padding: 20, fontFamily }}>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>Create a new workspace</div>
      <IconX size={11} color="#888" />
    </div>
    <div style={{ fontSize: 11, color: C.muted, marginTop: 4, lineHeight: 1.4 }}>
      Workspaces group funnels for separate clients or brands. Name it and add its first funnel to get started.
    </div>
    <div style={{ fontSize: 10.5, color: C.muted, marginTop: 14 }}>Workspace Name</div>
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 7, padding: "7px 10px", fontSize: 12, marginTop: 4, minHeight: 16 }}>{name}</div>
    <div style={{ fontSize: 10.5, color: C.muted, marginTop: 10 }}>First Funnel Name</div>
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 7, padding: "7px 10px", fontSize: 12, marginTop: 4, minHeight: 16 }}>{funnel}</div>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
      <span style={{ border: `1px solid ${C.line}`, borderRadius: 7, padding: "6px 12px", fontSize: 11.5 }}>Cancel</span>
      <span style={{ background: C.green, color: "#fff", borderRadius: 7, padding: "6px 12px", fontSize: 11.5, fontWeight: 500, transform: `scale(${1 - press * 0.06})` }}>
        Create Workspace
      </span>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Notifications + cursor                                              */
/* ------------------------------------------------------------------ */

export const Notification: React.FC<{
  icon: React.ReactNode;
  title: string;
  body: string;
  dark?: boolean;
  width?: number;
  style?: React.CSSProperties;
}> = ({ icon, title, body, dark, width = 340, style }) => (
  <div
    style={{
      width,
      display: "flex",
      gap: 12,
      alignItems: "center",
      padding: "12px 14px",
      borderRadius: 14,
      background: dark ? "rgba(22,22,22,0.92)" : "rgba(255,255,255,0.92)",
      border: dark ? "1px solid rgba(255,255,255,0.08)" : `1px solid ${C.line}`,
      boxShadow: "0 18px 40px rgba(0,0,0,0.14)",
      fontFamily,
      ...style,
    }}
  >
    {icon}
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: dark ? "#fff" : C.ink }}>{title}</div>
      <div style={{ fontSize: 12.5, color: dark ? "rgba(255,255,255,0.55)" : "#333", marginTop: 1 }}>{body}</div>
    </div>
    <span style={{ fontSize: 11, color: dark ? "rgba(255,255,255,0.35)" : C.faint, alignSelf: "flex-start" }}>now</span>
  </div>
);

export const NotifIcon: React.FC<{ children: React.ReactNode; bg?: string; size?: number }> = ({ children, bg = C.green, size = 40 }) => (
  <div style={{ width: size, height: size, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{children}</div>
);

export const Cursor: React.FC<{ x: number; y: number; size?: number; press?: number }> = ({ x, y, size = 34, press = 0 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ position: "absolute", left: x, top: y, transform: `scale(${1 - press * 0.15})`, transformOrigin: "0 0", filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))", zIndex: 50 }}
  >
    <path d="M4 2l15 9-7 1.6L8.5 20z" fill="#111" stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

/** Interpolate a cursor along keyframes [{f, x, y}] with easing. */
export const useCursorPath = (keys: { f: number; x: number; y: number }[]) => {
  const frame = useCurrentFrame();
  const fs = keys.map((k) => k.f);
  const opts = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: Easing.inOut(Easing.cubic) };
  return {
    x: interpolate(frame, fs, keys.map((k) => k.x), opts),
    y: interpolate(frame, fs, keys.map((k) => k.y), opts),
  };
};
