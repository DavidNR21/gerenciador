type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function IconOverview({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
    </svg>
  );
}

export function IconImage({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="8.6" cy="9.4" r="1.6" />
      <path d="M3.5 17l4.8-4.4a2 2 0 012.7 0L20.5 20" />
    </svg>
  );
}

export function IconVideo({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="5" width="14" height="14" rx="2.5" />
      <path d="M16.5 10.2l4-2.4a.7.7 0 011 .6v7.2a.7.7 0 01-1 .6l-4-2.4z" />
    </svg>
  );
}

export function IconDatabase({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <ellipse cx="12" cy="5.8" rx="7.6" ry="2.9" />
      <path d="M4.4 5.8v12.4c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9V5.8" />
      <path d="M4.4 12c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9" />
    </svg>
  );
}

export function IconNote({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 3.5h9.5L19 8v12.5H5z" />
      <path d="M14.2 3.6V8H18.8" />
      <path d="M8.4 12.6h7.2M8.4 16.4h4.8" />
    </svg>
  );
}

export function IconUsers({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="9.4" cy="8.2" r="3.6" />
      <path d="M3 20.2c.6-3.4 3.2-5.4 6.4-5.4s5.8 2 6.4 5.4" />
      <path d="M16.4 5.1a3.6 3.6 0 010 6.6M18 15.2c2 .7 3.4 2.5 3.8 5" />
    </svg>
  );
}

export function IconSearch({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="M15.8 15.8L21 21" />
    </svg>
  );
}

export function IconUpload({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 15.5V4.2M7.8 8.4L12 4.2l4.2 4.2" />
      <path d="M4 15v3.4A2.1 2.1 0 006.1 20.5h11.8A2.1 2.1 0 0020 18.4V15" />
    </svg>
  );
}

export function IconLogout({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M14.5 4.5H18a1.9 1.9 0 011.9 1.9v11.2A1.9 1.9 0 0118 19.5h-3.5" />
      <path d="M10 16l4-4-4-4M14 12H3.6" />
    </svg>
  );
}

export function IconFolder({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 7.5A1.9 1.9 0 014.9 5.6h4.3l2 2.4h7.9A1.9 1.9 0 0121 9.9v8.2a1.9 1.9 0 01-1.9 1.9H4.9A1.9 1.9 0 013 18.1z" />
    </svg>
  );
}

export function IconFolderPlus({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 7.5A1.9 1.9 0 014.9 5.6h4.3l2 2.4h7.9A1.9 1.9 0 0121 9.9v8.2a1.9 1.9 0 01-1.9 1.9H4.9A1.9 1.9 0 013 18.1z" />
      <path d="M12 11.6v5.2M9.4 14.2h5.2" />
    </svg>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconPencil({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 20.1l4.4-1 9.4-9.4a2.2 2.2 0 000-3.1l-.4-.4a2.2 2.2 0 00-3.1 0L4.9 15.6z" />
      <path d="M13.6 7.3l3.1 3.1" />
    </svg>
  );
}

export function IconTrash({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4.5 6.6h15M9.6 6.6V4.8A1.3 1.3 0 0110.9 3.5h2.2a1.3 1.3 0 011.3 1.3v1.8" />
      <path d="M6.3 6.6l.9 12.2a1.7 1.7 0 001.7 1.6h6.2a1.7 1.7 0 001.7-1.6l.9-12.2" />
      <path d="M10.3 10.4v6M13.7 10.4v6" />
    </svg>
  );
}

export function IconDownload({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 4.2v11.3M7.8 11.3L12 15.5l4.2-4.2" />
      <path d="M4 15v3.4A2.1 2.1 0 006.1 20.5h11.8A2.1 2.1 0 0020 18.4V15" />
    </svg>
  );
}

export function IconClose({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
    </svg>
  );
}

export function IconLeft({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M14.5 5.5L8 12l6.5 6.5" />
    </svg>
  );
}

export function IconRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9.5 5.5L16 12l-6.5 6.5" />
    </svg>
  );
}

export function IconStar({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.8l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
    </svg>
  );
}

export function IconLink({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M10.4 13.6a3.7 3.7 0 005.5 0l2.6-2.6a3.7 3.7 0 00-5.2-5.2l-1.5 1.5" />
      <path d="M13.6 10.4a3.7 3.7 0 00-5.5 0l-2.6 2.6a3.7 3.7 0 005.2 5.2l1.5-1.5" />
    </svg>
  );
}

export function Logo({ className }: IconProps) {
  return (
    <svg viewBox="0 0 46 46" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8f74ff" />
          <stop offset="1" stopColor="#5b34d6" />
        </linearGradient>
      </defs>
      <rect width="46" height="46" rx="13" fill="url(#logoGrad)" />
      <rect x="0.5" y="0.5" width="45" height="45" rx="12.5" fill="none" stroke="#b9a4ff" strokeOpacity="0.35" />
      <path d="M23 12l9.5 5.5v11L23 34l-9.5-5.5v-11L23 12z" fill="none" stroke="#fff" strokeOpacity="0.92" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M23 23l9.5-5.5M23 23v11M23 23l-9.5-5.5" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
