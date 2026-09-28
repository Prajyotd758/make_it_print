import type { ReactElement, ReactNode } from "react";

const I = (children: ReactNode, size = 20): ReactElement => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const GridIcon = () => I(<><rect x="4" y="4" width="6.500" height="6.500" rx="1.500" /><rect x="13.500" y="4" width="6.500" height="6.500" rx="1.500" /><rect x="4" y="13.500" width="6.500" height="6.500" rx="1.500" /><rect x="13.500" y="13.500" width="6.500" height="6.500" rx="1.500" /></>);
export const ChevronIcon = ({ up = false }: { up?: boolean }) => I(<path d={up ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />, 16);
export const CartIcon = () => I(<><path d="M3 4h2.500l2.200 10.200a1 1 0 001 .8h8.600a1 1 0 001-.8L20 8H6.400" /><circle cx="9.500" cy="19" r="1.200" /><circle cx="17" cy="19" r="1.200" /></>, 17);
export const SortStarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l3.100 6.300 6.900 1-5 4.900 1.200 6.900L12 17.800 5.800 21.100 7 14.200 2 9.300l6.900-1z" />
  </svg>
);
export const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20.500s-7.500-4.600-9.200-9.400C1.700 7.900 3.600 4.800 6.800 4.800c2 0 3.500 1.100 5.200 3.100 1.700-2 3.200-3.100 5.200-3.100 3.200 0 5.100 3.100 4 6.300-1.700 4.800-9.200 9.400-9.200 9.400z" />
  </svg>
);

export const CATEGORY_ICONS: Record<string, ReactElement> = {
  "home-decor": I(<path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z" />),
  "desk-organizers": I(<><rect x="3" y="4" width="18" height="12" rx="1.500" /><path d="M8 20h8M12 16v4" /></>),
  "toys-games": I(<><rect x="2" y="7" width="20" height="11" rx="5" /><path d="M7 10.500v4M5 12.500h4" /><circle cx="15.500" cy="11.500" r=".8" /><circle cx="18" cy="13.500" r=".8" /></>),
  miniatures: I(<path d="M12 3l8 4.500v9L12 21l-8-4.500v-9L12 3zM12 12l8-4.500M12 12v9M12 12L4 7.500" />),
  cosplay: I(<><path d="M4 6c4 1.500 12 1.500 16 0v6c0 4-3.500 7-8 7s-8-3-8-7V6z" /><path d="M8 11c.8.6 1.800.6 2.500 0M13.500 11c.8.6 1.800.6 2.500 0M9 15c1.800 1.400 4.200 1.400 6 0" /></>),
  "gifts-keychains": I(<><rect x="3" y="9" width="18" height="4" rx="1" /><path d="M5 13v7h14v-7M12 9v11M12 9S10.500 4 8 4a2 2 0 000 5M12 9s1.500-5 4-5a2 2 0 010 5" /></>),
  planters: I(<path d="M5 19C5 10 11 5 20 4c0 9-5 15-13 15M5 19l7-7" />),
  "phone-gadgets": I(<><rect x="7" y="2.500" width="10" height="19" rx="2" /><path d="M11 18.500h2" /></>),
  lighting: I(<path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.500 10.900c.6.5 1 1.200 1 2.100h5c0-.9.4-1.600 1-2.100A6 6 0 0012 3z" />),
  functional: I(<path d="M14 7a4 4 0 105 5l-9 9a2 2 0 01-3-3l9-9" />),
  jewelry: I(<path d="M6 4h12l3 5-9 11L3 9l3-5zM3 9h18M9 4l3 5 3-5M12 20L9 9M12 20l3-11" />),
  kitchen: I(<path d="M7 3v7a2 2 0 002 2v9M11 3v7a2 2 0 01-2 2M9 3v6M17 3c-2 2-2.500 6-1 9h1v9" />),
  automotive: I(<path d="M5 16v-5l2-5h10l2 5v5M3 16h18v3H3zM7 13h.01M17 13h.01" />),
  pets: I(<><circle cx="7" cy="10" r="1.600" /><circle cx="10.500" cy="6.500" r="1.600" /><circle cx="14" cy="6.500" r="1.600" /><circle cx="17.500" cy="10" r="1.600" /><path d="M12 12c-3 0-5 2.500-4 5 .8 2 2.500 1.700 4 1.700s3.200.3 4-1.700c1-2.500-1-5-4-5z" /></>),
  festive: I(<path d="M12 3l5 6h-3l4 5h-4l3 4H7l3-4H6l4-5H7l5-6zM12 18v3" />),
};
