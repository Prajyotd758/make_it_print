import type { ReactNode } from "react";

const Svg = ({ children, size = 20 }: { children: ReactNode; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const CartIcon = () => (
  <Svg size={34}>
    <path d="M3 4h2.5l2.2 10.2a1 1 0 001 .8h8.6a1 1 0 001-.8L20 8H6.4" />
    <circle cx="9.5" cy="19" r="1.2" />
    <circle cx="17" cy="19" r="1.2" />
  </Svg>
);
export const TagIcon = () => (
  <Svg>
    <path d="M3 12.5V4h8.5L21 13.5 13.5 21 3 12.5z" />
    <circle cx="7.5" cy="8.5" r="1.2" />
  </Svg>
);
export const TrashIcon = () => (
  <Svg size={16}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
  </Svg>
);
export const ClipboardIcon = () => (
  <Svg size={30}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4h6v3H9zM8.5 11h7M8.5 15h7" />
  </Svg>
);
export const TruckIcon = ({ size = 40 }: { size?: number }) => (
  <Svg size={size}>
    <path d="M2 6h11v10H2zM13 9h4.5L21 12.5V16h-8" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </Svg>
);
export const LockIcon = () => (
  <Svg size={18}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 018 0v3" />
  </Svg>
);
export const ArrowIcon = () => (
  <Svg size={16}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </Svg>
);
export const BackIcon = () => (
  <Svg size={16}>
    <path d="M20 12H4M10 6l-6 6 6 6" />
  </Svg>
);
export const ShieldIcon = () => (
  <Svg size={24}>
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </Svg>
);
export const HeartIcon = () => (
  <Svg size={24}>
    <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.9 3.6 4.8 6.8 4.8c2 0 3.5 1.1 5.2 3.1 1.7-2 3.2-3.1 5.2-3.1 3.2 0 5.1 3.1 4 6.3-1.700 4.800-9.200 9.400-9.200 9.400z" />
  </Svg>
);