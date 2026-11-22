import React from "react";

type P = { size?: number; color?: string; style?: React.CSSProperties };

const svg = (size: number, children: React.ReactNode, style?: React.CSSProperties, vb = 24) => (
  <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} fill="none" style={style}>
    {children}
  </svg>
);
const stroke = (color: string) => ({
  stroke: color,
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconHome: React.FC<P> = ({ size = 16, color = "currentColor", style }) =>
  svg(size, <path d="M4 11l8-7 8 7v8a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1z" {...stroke(color)} />, style);
export const IconGrid: React.FC<P> = ({ size = 16, color = "currentColor", style }) =>
  svg(
    size,
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1" {...stroke(color)} />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" {...stroke(color)} />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" {...stroke(color)} />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" {...stroke(color)} />
    </>,
    style,
  );
export const IconContent: React.FC<P> = ({ size = 16, color = "currentColor", style }) =>
  svg(
    size,
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" {...stroke(color)} />
      <path d="M4 10h16M9 5v5" {...stroke(color)} />
    </>,
    style,
  );
export const IconSources: React.FC<P> = ({ size = 16, color = "currentColor", style }) =>
  svg(
    size,
    <>
      <circle cx="12" cy="12" r="2" {...stroke(color)} />
      <path d="M7.5 7.5a6.4 6.4 0 000 9M16.5 7.5a6.4 6.4 0 010 9M4.6 4.6a10.5 10.5 0 000 14.8M19.4 4.6a10.5 10.5 0 010 14.8" {...stroke(color)} />
    </>,
    style,
  );
export const IconUser: React.FC<P> = ({ size = 16, color = "currentColor", style }) =>
  svg(
    size,
    <>
      <circle cx="12" cy="8" r="3.5" {...stroke(color)} />
      <path d="M5 20c1-4 4-6 7-6s6 2 7 6" {...stroke(color)} />
    </>,
    style,
  );
export const IconBars: React.FC<P> = ({ size = 16, color = "currentColor", style }) =>
  svg(size, <path d="M5 20V10M10 20V5M15 20v-7M20 20H4" {...stroke(color)} />, style);
export const IconGear: React.FC<P> = ({ size = 16, color = "currentColor", style }) =>
  svg(
    size,
    <>
      <circle cx="12" cy="12" r="3" {...stroke(color)} />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" {...stroke(color)} />
    </>,
    style,
  );
export const IconCard: React.FC<P> = ({ size = 16, color = "currentColor", style }) =>
  svg(
    size,
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" {...stroke(color)} />
      <path d="M3 10h18" {...stroke(color)} />
    </>,
    style,
  );
export const IconPanel: React.FC<P> = ({ size = 16, color = "currentColor", style }) =>
  svg(
    size,
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" {...stroke(color)} />
      <path d="M9 5v14" {...stroke(color)} />
    </>,
    style,
  );
export const IconCalendar: React.FC<P> = ({ size = 16, color = "currentColor", style }) =>
  svg(
    size,
    <>
      <rect x="4" y="6" width="16" height="14" rx="2" {...stroke(color)} />
      <path d="M4 10h16M9 3v4M15 3v4" {...stroke(color)} />
    </>,
    style,
  );
export const IconMoon: React.FC<P> = ({ size = 16, color = "currentColor", style }) =>
  svg(size, <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" {...stroke(color)} />, style);
export const IconChevrons: React.FC<P> = ({ size = 12, color = "currentColor", style }) =>
  svg(size, <path d="M8 9l4-4 4 4M8 15l4 4 4-4" {...stroke(color)} />, style);
export const IconChevron: React.FC<P> = ({ size = 12, color = "currentColor", style }) =>
  svg(size, <path d="M7 10l5 5 5-5" {...stroke(color)} />, style);
export const IconFilter: React.FC<P> = ({ size = 14, color = "currentColor", style }) =>
  svg(size, <path d="M4 5h16l-6 8v6l-4-2v-4z" {...stroke(color)} />, style);
export const IconArrowRight: React.FC<P> = ({ size = 16, color = "currentColor", style }) =>
  svg(size, <path d="M5 12h14M13 6l6 6-6 6" {...stroke(color)} style={{ strokeWidth: 2.6 }} />, style);
export const IconCheckCircle: React.FC<P> = ({ size = 16, color = "currentColor", style }) =>
  svg(
    size,
    <>
      <circle cx="12" cy="12" r="8.5" {...stroke(color)} />
      <path d="M8.5 12.2l2.4 2.3 4.6-4.8" {...stroke(color)} />
    </>,
    style,
  );
export const IconPlusCircle: React.FC<P> = ({ size = 16, color = "currentColor", style }) =>
  svg(
    size,
    <>
      <circle cx="12" cy="12" r="8.5" {...stroke(color)} />
      <path d="M12 8.5v7M8.5 12h7" {...stroke(color)} />
    </>,
    style,
  );
export const IconEye: React.FC<P> = ({ size = 14, color = "currentColor", style }) =>
  svg(
    size,
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" {...stroke(color)} />
      <circle cx="12" cy="12" r="2.8" {...stroke(color)} />
    </>,
    style,
  );
export const IconMail: React.FC<P> = ({ size = 16, color = "currentColor", style }) =>
  svg(
    size,
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" {...stroke(color)} />
      <path d="M3.5 7l8.5 6 8.5-6" {...stroke(color)} />
    </>,
    style,
  );
export const IconPhone: React.FC<P> = ({ size = 16, color = "currentColor", style }) =>
  svg(
    size,
    <path
      d="M6.5 3.5l3 .5 1.5 4-2 1.5a11 11 0 005.5 5.5l1.5-2 4 1.5.5 3a2 2 0 01-2 2A16.5 16.5 0 014.5 5.5a2 2 0 012-2z"
      fill={color}
    />,
    style,
  );
export const IconDoc: React.FC<P> = ({ size = 16, color = "currentColor", style }) =>
  svg(
    size,
    <>
      <path d="M7 3h7l4 4v14H7z" fill={color} />
      <path d="M14 3v4h4" stroke="#fff" strokeWidth={1.4} />
    </>,
    style,
  );
export const IconDownload: React.FC<P> = ({ size = 14, color = "currentColor", style }) =>
  svg(size, <path d="M12 4v11M7 10l5 5 5-5M5 20h14" {...stroke(color)} />, style);
export const IconDollar: React.FC<P> = ({ size = 14, color = "currentColor", style }) =>
  svg(size, <path d="M12 3v18M16.5 7.5C16 6 14.3 5 12 5 9.5 5 7.5 6.3 7.5 8.3c0 4.7 9 2.6 9 7.4 0 2-2 3.3-4.5 3.3-2.6 0-4.4-1.1-4.8-2.8" {...stroke(color)} />, style);
export const IconClock: React.FC<P> = ({ size = 14, color = "currentColor", style }) =>
  svg(
    size,
    <>
      <circle cx="12" cy="12" r="8.5" {...stroke(color)} />
      <path d="M12 7.5V12l3 2" {...stroke(color)} />
    </>,
    style,
  );
export const IconX: React.FC<P> = ({ size = 12, color = "currentColor", style }) =>
  svg(size, <path d="M6 6l12 12M18 6L6 18" {...stroke(color)} />, style);
export const IconGlobe: React.FC<P> = ({ size = 18, color = "currentColor", style }) =>
  svg(
    size,
    <>
      <circle cx="12" cy="12" r="9" fill={color} />
      <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" stroke="#fff" strokeWidth={1.4} />
    </>,
    style,
  );

/* ---------- brand-style marks (generic glyphs, drawn locally) ---------- */
export const YouTubeMark: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size * 0.72} viewBox="0 0 28 20">
    <rect width="28" height="20" rx="5" fill="#FF0000" />
    <path d="M11 6l7 4-7 4z" fill="#fff" />
  </svg>
);
export const XMark: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M4 3h4.8l11.2 18h-4.8z" fill="#111" />
    <path d="M19.2 3L5 21h2.2L21.4 3z" fill="#111" />
  </svg>
);
export const InstaMark: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <defs>
      <linearGradient id="ig" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#FEC053" />
        <stop offset="0.5" stopColor="#F2203E" />
        <stop offset="1" stopColor="#5258CF" />
      </linearGradient>
    </defs>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="url(#ig)" strokeWidth="2.4" />
    <circle cx="12" cy="12" r="4.3" fill="none" stroke="url(#ig)" strokeWidth="2.4" />
    <circle cx="17.3" cy="6.7" r="1.3" fill="#C13584" />
  </svg>
);
export const MetaMark: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 40 24">
    <path
      d="M4 16c0-6 3-11 6.5-11 3 0 5 3 9.5 10.5C24.5 23 26.5 21 28.5 21c3 0 5-3 5-7 0-5-2.5-9-5.5-9-3.5 0-6 4-8 7.5C17.5 17 15 21 11 21c-4 0-7-1.5-7-5z"
      fill="none"
      stroke="#0866FF"
      strokeWidth="3.4"
    />
  </svg>
);
export const LinkedInMark: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <rect width="24" height="24" rx="4" fill="#2F7BD9" />
    <path d="M7 10v7M7 7v.1M11 17v-7M11 13c0-2 1.2-3 2.8-3S17 11 17 13v4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
export const FacebookMark: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill="#1877F2" />
    <path d="M13.2 20v-6.5h2.2l.4-2.6h-2.6V9.4c0-.8.3-1.3 1.4-1.3h1.3V5.8c-.3 0-1-.1-2-.1-2 0-3.3 1.2-3.3 3.4v1.8H8.4v2.6h2.2V20z" fill="#fff" />
  </svg>
);
export const StripeLikeMark: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <rect width="24" height="24" rx="6" fill="#111" />
    <rect x="5" y="8" width="6" height="8" rx="2" fill="#fff" />
    <rect x="13" y="8" width="6" height="8" rx="2" fill="#fff" />
  </svg>
);
export const CalMark: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill="#1A8CFF" />
    <circle cx="12" cy="12" r="7" fill="none" stroke="#fff" strokeWidth="2.4" />
    <circle cx="12" cy="12" r="3" fill="#fff" />
  </svg>
);
